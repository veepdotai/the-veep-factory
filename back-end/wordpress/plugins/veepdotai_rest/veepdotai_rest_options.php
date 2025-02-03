<?php

class Veepdotai_Options_REST_Controller extends WP_REST_Controller {

    public static function log( $level, $msg ) {
		$root = "Veepdotai_Options_REST_Controller";
		Veepdotai_Util::log( $level, $root . ' | ' . $msg);
        //Veepdotai_Util::error_log( $level . " | " . $root . ' | ' . $msg);
	}

    // Here initialize our namespace and resource name.
    public function __construct() {
        $this->namespace     = 'veepdotai_rest/v1';
        $this->resource_name = 'options';
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

        register_rest_route( $this->namespace, '/' . $this->resource_name . '/(?P<option>.*)', array(
            array(
                'methods'   => 'POST',
                'callback'  => array( $this, 'post_item' ),
                'permission_callback' => array( $this, 'post_item_permissions_check' ),
            ),
            'schema' => array( $this, 'post_item_schema' ),
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
        $fn = "get_item";

        $user = wp_get_current_user()->user_login;
        self::log( "debug", "/options/get_item: $user." );

        // /veepdotai_rest/v1/options/ai-section-edcal0-transcription
        $option_name = sanitize_text_field( $request['option'] );
        $option_prefix = sanitize_text_field( $request['prefix'] );

        if ( ( $option_prefix && "" != $option_prefix ) 
                || preg_match( "/^prefix/", $option_name ) ) {

            $lines = explode( ',', $option_name );
            if ($option_prefix && "" != $option_prefix) {
                $prefix = $option_prefix;
                $option_names = $lines;
            } else if ( preg_match( "/^prefix/", $option_name ) ) {                
                $prefix = preg_replace("/^prefix:(.*)/", "$1", $lines[0]);
                $option_names = array_slice( $lines, 1 );
            }
            
            $results = [];
            for( $i = 0; $i < count( $option_names ); $i++) {
                $option_name = $prefix . $option_names[ $i ];
                $option_value = Veepdotai_Util::get_option( $option_name );
                array_push( $results, [ "name" => $option_name, "value" => $option_value ] );
            }
    
            $result = $results;
        } else {
            $option_name_id = $option_name . "-id";
            $result = [
                $option_name => Veepdotai_Util::get_option( $option_name ),
                $option_name_id => Veepdotai_Util::get_option( $option_name_id )
            ];
        }

        return rest_ensure_response( $result );
    }

     /**
     * 
     * $_POST[ 'option' ] = the name of the option
     * $_POST[ 'value' ] = the value of the option
     */
    public function post_item( $request ) {
        $fn = "post_item";
        $pn = "veepdotai-";
        $prompt_prefix = "ai-prompt-";

        $param_name = sanitize_text_field( $request['option'] );
        $option_value = sanitize_text_field( $request['value'] );
        $oldName = sanitize_text_field( $request['oldName'] );
        $old_name = $pn . $prompt_prefix . $oldName;         

        self::log( "debug", "$fn: old_name: " . $old_name );

        $user = wp_get_current_user();
        self::log( "debug", "$fn: user: " . print_r( $user, true) . "." );

        $option_name = $pn . $param_name;
        self::log( "debug", "$fn: Setting option: $option_name = $option_value." );

        $result = Veepdotai_Util::set_option( $option_name, $option_value );
        self::log( "debug", "$fn: set_option: result: $result" );
        if ( $result ) {
            $data = [
                "user_id" => $user->user_login,
                "result" => true,
            ];
        } else {
            $data = [
                "user_id" => $user->user_login,
                "result" => false,
            ];
        }

        if ( $old_name ) {
            self::log( "debug", "calling V::delete_option: old_name: " . $old_name );
            Veepdotai_Util::delete_option( $old_name );
        }

        return rest_ensure_response( $data );
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
function veepdotai_rest_options_register_my_routes() {
    $controller = new Veepdotai_Options_REST_Controller();
    $controller->register_routes();
}

add_action( 'rest_api_init', 'veepdotai_rest_options_register_my_routes' );
