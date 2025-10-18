<?php
/**
 * @package Veepdotai
 * @version 0.0.1
 */
/*
Plugin Name: veepdotai_login_to_headless_wp
Plugin URI: http://wordpress.org/plugins/veepdotai_to_headless_wp/
Description: Connects user to WP through Google then redirects the user with JWT to 
the react app so he's authenticated too.
Author: JC Kermagoret
Version: 0.0.1
Author URI: http://www.veep.ai
*/

use SimpleJWTLogin\Helpers\Jwt\JwtKeyFactory;
use SimpleJWTLogin\Libraries\JWT\JWT;
use SimpleJWTLogin\Modules\SimpleJWTLoginSettings;
use SimpleJWTLogin\Modules\WordPressData;
use SimpleJWTLogin\Modules\Settings\AuthenticationSettings;
use SimpleJWTLogin\ErrorCodes;

use RtCamp\GoogleLogin\Utils\Helper;

define('VEEPDOTAI_PROFILE_PICTURE', 'picture');
define('J1', 86400);
define('J7', 86400*7);
define('J30', 86400*30);

add_action( 'rtcamp.google_user_logged_in', ['Veepdotai_Login', 'veepdotai_transfer_auth'], 10, 2 );
add_action( 'rtcamp.google_user_created', ['Veepdotai_Login', 'veepdotai_transfer_auth_after_creation'], 10, 2 );
add_filter( 'rtcamp.google_register_user', ['Veepdotai_Login', 'veepdotai_maybe_create_username'], 20, 1 );
add_action( 'wp_login', ['Veepdotai_Login', 'veepdotai_login_redirect'] );
add_filter( 'rtcamp.google_default_redirect', ['Veepdotai_Login', 'veepdotai_add_redirect'] );

Class Veepdotai_Login {
	public static function log( $level, $msg ) {
		$root = "Veepdotai_Login";
		Veepdotai_Util::log( $level, $root . ' | ' . $msg);
	}

	// It is called AFTER the user has been created so it is too late!!!
	// So I had to update the original file :-( Utils/Authenticator.php->maybe_create_username)
	public static function veepdotai_maybe_create_username( $user ) {
		$fn = "veepdotai_maybe_create_username";
		self::log("debug", "$fn: User provided: " . print_r( $user, true ));

		if ( property_exists( $user, 'login' ) || ! property_exists( $user, 'email' )) {
			self::log("debug", "$fn: User already created: " . print_r( $user, true ));
			return $user;
		}
	
		if ( property_exists( $user, 'email') ) {
			$email       = $user->email;
		//	$user_login  = sanitize_user( current( explode( '@', $email ) ), true );
			$user_login  = sanitize_email( $email , true );
			if ( class_exists('RtCamp\GoogleLogin\Utils\Helper') ) {
				$user_login  = Helper::unique_username( $user_login );
			}
			$user->login = $user_login;

			//self::log("debug", "$fn: User: " . print_r( $user, true ) );
			
			return $user;
		} else {
			// No mail has been found despite of google auth. Strange, there is a pb.
			return $user;
		}

	}
	
	public static function veepdotai_transfer_auth_after_creation( $user_id, $user_wp) {
		$fn = "veepdotai_transfer_auth_after_creation";
		global $veepdotai_jwt;
	
		// User has just been created and id is not yet provided.
		// id is provided in $user_id
		$veepdotai_jwt = self::veepdotai_create_jwt_token( $user_wp, null, $user_id );
		//self::log( "debug", "$fn: UserWP has been created. JWT=$veepdotai_jwt\n" . print_r($user_wp, true));
	}
	
	public static function veepdotai_transfer_auth( $user_wp, $user) {
		$fn = "veepdotai_transfer_auth";
		global $veepdotai_jwt;
	
		$veepdotai_jwt = self::veepdotai_create_jwt_token( $user_wp, $user, null );
		//self::log( "debug",  "$fn: User exists. JWT=$veepdotai_jwt" );
		//self::log( "debug",  "$fn: UserWP: " . print_r($user_wp, true));
	}
	
	public static function veepdotai_create_jwt_token_from_user_infos( $user_email, $user_id, $user_login, $user_picture = null, $duration = J1 ) {
		$payload = [
			"iat"      => time(),
			"iss"      => site_url(),
			"exp"		=> time() + $duration,
			"data" => [
				"user" => [
					AuthenticationSettings::JWT_PAYLOAD_PARAM_EMAIL    => $user_email,
					AuthenticationSettings::JWT_PAYLOAD_PARAM_ID       => $user_id,
					AuthenticationSettings::JWT_PAYLOAD_PARAM_USERNAME => $user_login,
					VEEPDOTAI_PROFILE_PICTURE => $user_picture,
				]
			]
		];
	
		$simpleJwtSettings = (new SimpleJWTLoginSettings( new WordPressData() ) );
		$JWT = JWT::encode(
			$payload,
			$simpleJwtSettings->getGeneralSettings()->getDecryptionKey(),
		);

		return $JWT;
	}

	public static function veepdotai_create_jwt_token( $user_wp, $user, $user_id_after_creation = null, $duration = J1) {
		$fn = "veepdotai_create_jwt_token";
		//self::log( "debug", "$fn: UserWP: " . print_r( $user_wp, true) );
		//self::log( "debug", "$fn: User: " . print_r( $user, true) );

		if ( ! $user_id_after_creation ) {
			// User was already existing
			$user_id = $user_wp->ID;
		} else {
			// User has just been created
			$user_id = $user_id_after_creation;
		}

		$JWT = self::veepdotai_create_jwt_token_from_user_infos(
			$user_wp->user_email,
			$user_id,
			$user_wp->user_login,
			$user?->picture,
			$duration
		);

		return $JWT;
	}

	public static function veepdotai_decode_jwt($jwt) {

		$result = true;
		try {
			$simpleJwtSettings = (new SimpleJWTLoginSettings( new WordPressData() ) );
			$result = JWT::decode(
				$jwt,
				$simpleJwtSettings->getGeneralSettings()->getDecryptionKey(),
			);
		} catch (Exception $e) {
			return false;
		}
		return true;
	}

	public static function veepdotai_add_redirect(): string {
		//$redirect_to = "https://www.veep.ai";
		$redirect_to = "http://localhost";
		self::log( "debug", "debugging add_redirect(raw): $redirect_to" );
		self::log( "debug", "debugging request_uri: " . print_r( $_SERVER['REQUEST_URI'], true ) );
		self::log( "debug", "debugging add_redirect(end)." );

		return $redirect_to;
	}

	public static function veepdotai_login_redirect(): void {
		$fn = "veepdotai_login_redirect";
		self::log( "debug", "$fn: entering..." );
		self::log( "debug", "debugging _GET: " . print_r( $_GET, true ));

		global $veepdotai_jwt;
	
		if ( class_exists('RtCamp\GoogleLogin\Utils\Helper') ) {
			$state = Helper::filter_input( INPUT_GET, 'state', FILTER_SANITIZE_FULL_SPECIAL_CHARS );
			self::log( "debug", "debugging state(raw): " . print_r( $state, true ));
		}
	
//		if ( ! $state || ! $this->authenticated ) {
		if ( ! $state ) {
			return;
			self::log( "debug", "$fn: No state parameter..." );
			wp_safe_redirect( home_url() . "/wp-admin/" );
			exit;
		}
	
		$state = base64_decode( $state );
		self::log( "debug", "debugging state(base64): " . print_r( $state, true ));
	
		$state = $state ? json_decode( $state ) : null;
	
	//		if ( ( $state instanceof stdClass ) && ! empty( $state->provider ) && 'google' === $state->provider && ! empty( $state->redirect_to ) ) {
		if ( ( $state instanceof stdClass ) && ! empty( $state->provider ) && 'google' === $state->provider ) {
			//redirect_to may be empty...
			//but finally, everybody is redirected to home_url()/app/
			$redirect_to = $state->redirect_to;
			self::log( "debug", "redirect_to: " . $redirect_to );

			$redirect_to = home_url() . "/v/app/";
			$redirect_to = (strpos( $redirect_to, '?' ) === false
								? $redirect_to . "?"
								: $redirect_to . "&")
							. "JWT=" . $veepdotai_jwt;
			if ( strpos( $redirect_to, 'localhost' ) !== false ) {
				self::log( "debug", "$fn: localhost: redirect_to: " . $redirect_to);
				$redirect_to = preg_replace("#(http.?)://([^/]*)/(.*)#", "$1://$2:3000/r?JWT=" . $veepdotai_jwt, $redirect_to);
				self::log( "debug", "$fn: localhost: new redirect_to: " . $redirect_to);
			} else {
				self::log( "debug", "$fn: host: redirect_to: " . $redirect_to);
				$redirect_to = preg_replace("#(http.?)://([^/]*)/(.*)#", "$1://$2/v/app/r?JWT=" . $veepdotai_jwt, $redirect_to);				
				self::log( "debug", "$fn: host: new redirect_to: " . $redirect_to);
			}
			
			if ( isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], "scope" ) !== -1 ) {
				self::log( "debug", "$fn: OAuth redirect_to: " . $redirect_to);
				wp_safe_redirect( $redirect_to );
				exit;
			} else {
				self::log( "debug", "$fn: No OAuth. Redirecting to " . $redirect_to);
				$new_redirect_to = home_url() . "/wp-admin/";
				self::log( "debug", "$fn: No OAuth. Redirecting to " . $new_redirect_to);
				wp_safe_redirect( $new_redirect_to );
				exit;
			}
	
		} else {
			self::log( "debug", "$fn: No OAuth? No redirect provided.");
			self::log( "debug", "$fn: Env: "  . print_r( $_SERVER, true));
			self::log( "debug", "$fn: state = request_uri ?" . $_SERVER['REQUEST_URI']);
			wp_redirect( home_url() . "/wp-admin/" );
			exit;
		}
	}

}	
