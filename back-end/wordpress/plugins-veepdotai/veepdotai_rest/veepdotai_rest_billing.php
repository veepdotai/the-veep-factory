<?php

class Veepdotai_Billing_REST_Controller extends WP_REST_Controller {

    // Here initialize our namespace and resource name.
    public function __construct() {
        $this->namespace     = 'veepdotai_rest/v1';
        $this->resource_name = 'billing';
    }

    // Register our routes.
    public function register_routes() {
        register_rest_route( $this->namespace, '/' . $this->resource_name . '/credits', array(
            array(
                'methods'   => 'GET',
                'callback'  => array( $this, 'get_item' ),
                'permission_callback' => array( $this, 'get_item_permissions_check' ),
            ),
            'schema' => array( $this, 'get_item_schema' ),
        ) );
    }

    /**
     * Check permissions for the posts.
     *
     * @param WP_REST_Request $request Current request.
     */
    public function get_item_permissions_check( $request ) {
        return true;

        if ( ! current_user_can( 'read' ) ) {
            return new WP_Error( 'rest_forbidden', esc_html__( 'You cannot view the post resource.' ), array( 'status' => $this->authorization_status_code() ) );
        }
        return true;
    }

    /**
     * Gets post data of requested post id and outputs it as a rest response.
     *
     * @param WP_REST_Request $request Current request.
     */
    public function get_item( $request ) {
        //$user = wp_get_current_user()->user_login;
        // /veepdotai_rest/v1/billing/ai-section-edstrat0-strategy
        //error_log( "/billing/get_item: $user\n", 3, "/tmp/wordpress.log");
        $user = Veepdotai_Util::get_user_login();
        if ( ! $user ) {
            return rest_ensure_response( [ "credits" => -1 ] );
        }

        $credits = Veepdotai_Bill::get_credits( $user );

        Veepdotai_Util::log( 'debug', "User $user has: $credits");

        return rest_ensure_response( [ "credits" => $credits ] );
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
function veepdotai_rest_billing_register_my_routes() {
    $controller = new Veepdotai_Billing_REST_Controller();
    $controller->register_routes();
}

add_action( 'rest_api_init', 'veepdotai_rest_billing_register_my_routes' );
