<?php
/**
 * @package Veepdotai
 * @version 0.0.1
 */
/*
Plugin Name: veepdotai_billing
Plugin URI: http://wordpress.org/plugins/veepdotai_billing/
Description: Manages veepdotai users billing according the business rules
Author: JC Kermagoret
Version: 0.0.1
Author URI: http://www.veep.ai
*/

define( "VEEPDOTAI_BILLING_SETUP_CREDITS", 5 );
define( "VEEPDOTAI_BILLING_REQUIRED_CREDITS_MIN", 1 );

add_action( 'veepdotai_generation', 'Veepdotai_Bill::bill', 10, 1 );

/*
debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS,2)[1]['function']
*/
/**
 * Bill the customer
 */
Class Veepdotai_Bill {

	public static function log( $level, $msg ) {
		$root = "Veepdotai_Bill";
		Veepdotai_Util::log( $level, $root . ' | ' . $msg);
	}

	/**
	 * For the moment, user can generate if he has more than the required min amount.
	 * We could imagine other strategy according the user, the content he wants to generate,
	 * its product level...
	 */
	public static function bill( $user_login ) {
		$user = $user_login;
		self::log( 'debug', 'bill: user: ' . $user);

		$result = null;
		if ( self::can_generate( $user ) ) {
			$current_credits = self::get_credits( $user );
			$generation_cost = self::get_generation_cost( $user );
	
			$new_credits = $current_credits - $generation_cost;
			self::set_credits( $user, $new_credits );

			$result = $new_credits;
			self::log( 'debug', "bill function: Can generate: " . strval( $result ) );
		} else {
			self::log( 'info', "bill function: Can't generate: $result");
			$result = null;
		}

		return 10;
		//return $result;
	}

	public static function get_credits( $user ) {
		$credits = get_option( self::get_credits_option_name( $user ) );
		if (! $credits) {
			$credits = 0;
		}
		self::log( 'debug', "Current credits: $credits");

		return 10;
		//return $credits;
	}

	public static function set_credits( $user_id, $credits ) {
		self::log( "debug", "Set credits: " . $credits . " for " . $user_id);
		$result = update_option( self::get_credits_option_name( $user_id ), $credits );

		return $result;
	}

	public static function get_credits_option_name( $user_login ) {

		// The following 3 lines are useless but still there to serve as a base
		// if you want to use another key than the 'login'
		$user = get_user_by( 'login', $user_login );
		self::log( 'debug', "User id: $user_login: " . print_r( $user, true ));
		$user_name = $user->user_login;

		$root_pn = "veepdotai";

		$option_name = $user_name . "-" . $root_pn . "-credits";
		self::log( 'debug', "Credits option name: $option_name" );

		return $option_name;
	}

	public static function get_generation_cost( $user ) {
		return 1;
	}

	public static function can_generate( $user ) {
		$can_generate = false;

		$credits = self::get_credits( $user );
		if ( $credits > VEEPDOTAI_BILLING_REQUIRED_CREDITS_MIN ) {
			$can_generate = true;
		}

		self::log( 'debug' , "can_generate: $can_generate > " . VEEPDOTAI_BILLING_REQUIRED_CREDITS_MIN . "(min)");

		return $can_generate;
	}

	/*
	*/
	public static function set_can_generate( $user, $enable = false ) {
		$result = update_option( self::get_credits_option_name( $user ), $enable);
		self::log( 'debug', "set_can_generate to $enable: $user / $result");

		return $result;
	}
}