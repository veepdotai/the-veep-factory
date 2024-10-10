<?php

require_once 'vendor/autoload.php';
require_once 'veepdotai_rest_payment_secrets.php';

use \Stripe\Stripe;
use \Stripe\Checkout\Session;

class Veepdotai_Payment_REST_Controller extends WP_REST_Controller {

    public static function log( $level, $msg ) {
		$root = "Veepdotai_Payment_REST_Controller";
		//Veepdotai_Util::log( $level, $root . ' | ' . $msg);
        Veepdotai_Util::error_log( $level . " | " . $root . ' | ' . $msg);
	}

    // Here initialize our namespace and resource name.
    public function __construct() {
        $this->namespace     = 'veepdotai_rest/v1';
        $this->resource_name = 'payment';
    }

    // Register our routes.
    public function register_routes() {
        register_rest_route( $this->namespace, '/' . $this->resource_name . '/', array(
            array(
                'methods'   => 'POST',
                'callback'  => array( $this, 'post_item' ),
                'permission_callback' => array( $this, 'post_item_permissions_check' ),
            ),
            'schema' => array( $this, 'post_item_schema' ),
        ) );

    }

    /**
     * 
     * $_POST[ 'option' ] = the name of the option
     * $_POST[ 'value' ] = the value of the option
     */
    public function post_item( $request ) {
        global $stripeSecretKey;
        
        $fn = "post_item";
        $pn = "veepdotai-";
        $prompt_prefix = "ai-prompt-";

        $user = wp_get_current_user();
        self::log( "debug", "$fn: user: " . print_r( $user, true) . "." );
        self::log( "debug", "$fn: stripeSecretKey: " . $stripeSecretKey . "." );

        Stripe::setApiKey($stripeSecretKey);
        //header('Content-Type: application/json');

        $YOUR_DOMAIN = 'http://localhost';

        $checkout_session = Session::create([
            'line_items' => [[
                # Provide the exact Price ID (e.g. pr_1234) of the product you want to sell
                #'price' => 'price_1OZJAkEjIuTorr2nC7xGsTXQ',
                'price_data' => [
                    'unit_amount' => 4020,
                    'currency' => 'eur',
                    'product_data' => [
                      'name' => 'Test Product Name',
                      'description' => 'Test Description Name'
                    ],
                ],
                'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => $YOUR_DOMAIN . '?success=true',
                'cancel_url' => $YOUR_DOMAIN . '?canceled=true',
                'automatic_tax' => [
                    'enabled' => true,
                ],
            ]);
            
        self::log( "debug", "post_item: " . json_encode($checkout_session));
        //header("HTTP/1.1 303 See Other");
        //header("Location: " . $checkout_session->url);

        return rest_ensure_response( $checkout_session->url );
    }

    /**
     * Check permissions for the posts.
     *
     * @param WP_REST_Request $request Current request.
     */
    public function post_item_permissions_check( $request ) {
        if ( ! current_user_can( 'read' ) ) {
            return new WP_Error( 'rest_forbidden', esc_html__( 'You cannot create the post resource.' ), array( 'status' => $this->authorization_status_code() ) );
        }
        return true;
    }

    // Sets up the proper HTTP status code for authorization.
    public function authorization_status_code() {

        $status = 401;

        if ( is_user_logged_in() ) {
            $status = 403;
        }

        return $status;
    }
}

// Function to register our new routes from the controller.
function veepdotai_rest_payment_register_my_routes() {
    $controller = new Veepdotai_Payment_REST_Controller();
    $controller->register_routes();
}

add_action( 'rest_api_init', 'veepdotai_rest_payment_register_my_routes' );
