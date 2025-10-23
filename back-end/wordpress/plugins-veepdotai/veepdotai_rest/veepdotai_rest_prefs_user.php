<?php

class Veepdotai_UserPrefs_REST_Controller extends WP_REST_Controller {

    // Here initialize our namespace and resource name.
    public function __construct() {
        $this->namespace     = 'veepdotai_rest/v1';
        $this->resource_name = 'user_prefs';
    }

    // Register our routes.
    public function register_routes() {
        register_rest_route( $this->namespace, '/' . $this->resource_name . '/(?P<option>.*)', array(
            array(
                'methods'   => 'GET',
                'callback'  => array( $this, 'get_item' ),
                'permission_callback' => array( $this, 'get_item_permissions_check' ),
            ),
            'schema' => array( $this, 'get_item_schema' ),
        ) );
        register_rest_route( $this->namespace, '/' . $this->resource_name . '/post', array(
            // Notice how we are registering multiple endpoints the 'schema' equates to an OPTIONS request.
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
     * @param WP_REST_Request $request Current request.
     */
    public function get_item_permissions_check( $request ) {
        return true;

        if ( ! current_user_can( 'read' ) ) {
            return new WP_Error( 'rest_forbidden', esc_html__( 'You cannot view the post resource.' ), array( 'status' => $this->authorization_status_code() ) );
        }
        return true;
    }

    public function flatten_array_preserve_keys(array $array) {
        $recursiveArrayIterator = new RecursiveArrayIterator(
            $array,
            RecursiveArrayIterator::CHILD_ARRAYS_ONLY
        );
        $iterator = new RecursiveIteratorIterator($recursiveArrayIterator);
    
        return iterator_to_array($iterator);
    }
    
    /**
     * 
     * @param WP_REST_Request $request Current request.
     */
    public function get_item( $request ) {
        $id = get_current_user_id();

        if ( $id ) {
            $prefix = "veepdotai-user-prefs";
            $prefs = get_option( $prefix . "-options" );

            $result = $prefs;
        } else {
            $result = null;
        }
        $result = '{"publish_on_wordpress":false,"publishing_status_on_wordpress":"draft","back_logging_activated":false,"back_logging_options":"TRACE","change_tab_when_new_event_occurs":true,"front_logging_activated":true,"front_logging_options":true,"favorite_apps":[],"first_connection":true,"welcome_page_url":true,"documentation_page_url":true,"last_connection":"","front_page_display":true}';
        return rest_ensure_response( json_decode( $result ) );
        //return rest_ensure_response( $this->flatten_array_preserve_keys($result) );
    }

    /**
     * 
     */
    public function post_item( $request ) {
        $user = wp_get_current_user();
        $prefix = "veepdotai-user-prefs";

        $user_prefs = sanitize_text_field( $request['user-prefs'] );

        $user_back_attrs = [
            "publish_on_wordpress" => false,
            "publishing_status_on_wordpress" => "draft",
            "back_logging_activated" => false,
            "back_logging_options" => "TRACE"
        ];
        $user_front_attrs = [
            "change_tab_when_new_event_occurs" => true,
            "front_logging_activated" => true,
            "front_logging_options" => true,
            "favorite_apps" => [],
            "first_connection" => true,
            "welcome_page_url" => true,
            "documentation_page_url" => true,
            "last_connection" => "",
            "front_page_display" => true,
        ];

        $attrs = [ ...$user_back_attrs, ...$user_front_attrs ];
        
        $infos = [];
        foreach($attrs as $attr) {
            $value = get_option( $attr, $id);
            array_push( $infos, [ $attr => $value ] );
        }

        return rest_ensure_response( $output );
    }

    /**
     * Check permissions for the posts.
     *
     * @param WP_REST_Request $request Current request.
     */
    public function post_item_permissions_check( $request ) {
        if ( ! current_user_can( 'read' ) ) {
            return new WP_Error( 'rest_forbidden', esc_html__( 'You cannot view the post resource.' ), array( 'status' => $this->authorization_status_code() ) );
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
function veepdotai_rest_user_prefs_register_my_routes() {
    $controller = new Veepdotai_UserPrefs_REST_Controller();
    $controller->register_routes();
}

add_action( 'rest_api_init', 'veepdotai_rest_user_prefs_register_my_routes' );
