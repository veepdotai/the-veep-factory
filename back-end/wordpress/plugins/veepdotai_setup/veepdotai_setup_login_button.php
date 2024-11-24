<?php
/**
 * @package Veepdotai
 * @version 0.0.1
 */

require_once plugin_dir_path(__DIR__) . 'veepdotai/includes/class-veepdotai.php';

add_action( 'template_redirect', 'redirect_to_app_on_404' );
function redirect_to_app_on_404() {
    if( is_user_logged_in() && is_404() ) {

		$user_wp = wp_get_current_user();
		$url = Veepdotai::get_jwt_link( $user_wp );
	
		// User is redirected on the app
		if ( strpos( home_url(), "localhost") !== false ) {
			$url = str_replace("80", "3000", home_url());
		} else if ( strpos( home_url(), "gitpod") !== false ) {
			$url = str_replace("8001", "3000", home_url());
		}

		//$url = "https://www.google.com";
		wp_redirect( $url );
		exit;
    } else if (is_404()) {
		wp_redirect( home_url() );
		exit;
	}
}

add_action( 'login_form', 'login_button', 10, 1 );
function login_button() {
	if ( isset( $custom_btn_text ) && $custom_btn_text ) {
		$button_text = esc_html( $custom_btn_text );
	} else {
		$button_text = ( ! empty( $button_text ) ) ? $button_text : __( 'Log in with Google', 'login-with-google' );
	}
	
	if ( empty( $login_url ) ) {
		return;
	}
	
	$button_url = $login_url;
	
	if ( is_user_logged_in() ) {
		$button_text = __( 'Log out', 'login-with-google' );
		$button_url   = wp_logout_url( get_permalink() );
	}
	
	$user_wp = wp_get_current_user();
	$jwt = veepdotai_create_jwt_token( $user_wp, null );
	if ( strpos( home_url(), "localhost") !== false ) {
		$url = home_url() . ":3000/?JWT=" . $jwt;
	} else {
		$url = home_url() . "/v/app/?JWT=" . $jwt;
	}
	
	?>
	<div class="wp_google_login">
		<div class="wp_google_login__button-container">
			<?php
				global $veepdotai_jwt;
				if (is_user_logged_in()) {
			?>
				<a class="wp_google_login__button" href="<?php echo "$url";?>">
					<span class="wp_google_login__google-icon"></span>
					Se connecter
				</a>
			<?php } ?>
			<a class="wp_google_login__button"
				<?php
				printf( ' href="%s"', esc_url( $button_url ) );
				?>
			>
				<span class="wp_google_login__google-icon"></span>
				<?php echo esc_html( $button_text ) . "Hello"; ?>
			</a>
		</div>
	</div>
	<?php
}

/**
 * Plugin Name: Veepdotai Force Logout Redirect
 * Description: A simple plugin that forces logout then redirects without nonce verification
 */

/**
 * Bypass logout confirmation on nonce verification failure
 */
add_action( 'check_admin_referer', 'logout_without_confirmation', 10, 2);
function logout_without_confirmation($action, $result) {
	if ( ! $result && $action == "log-out" ) {
		$redirect_to = isset($_REQUEST['redirect_to']) ? $_REQUEST['redirect_to'] : site_url();
        $location = str_replace("&amp;", "&", wp_logout_url($redirect_to));
		wp_safe_redirect($location); 
		exit(); 
    }
}
