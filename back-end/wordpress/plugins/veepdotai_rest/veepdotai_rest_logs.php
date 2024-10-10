<?php

class Veepdotai_Logs_REST_Controller extends WP_REST_Controller {

    // Here initialize our namespace and resource name.
    public function __construct() {
        $this->namespace     = 'veepdotai_rest/v1';
        $this->resource_name = 'logs';
    }

    // Register our routes.
    public function register_routes() {
        register_rest_route( $this->namespace, '/' . $this->resource_name . '/get-logs', array(
            // Notice how we are registering multiple endpoints the 'schema' equates to an OPTIONS request.
            array(
                'methods'   => 'GET',
                'callback'  => array( $this, 'get_logs' ),
                'permission_callback' => array( $this, 'get_logs_permissions_check' ),
            ),
            'schema' => array( $this, 'get_logs_schema' ),
        ) );
    }

    /**
     * 
     */
    public function get_logs( $request ) {
        $user = wp_get_current_user()->user_login;
        $audio_pid = sanitize_text_field( $request[ 'audio_pid' ] );
        $generation_pid = sanitize_text_field( $request[ 'generation_pid' ] );

        if ( $audio_pid ) {
            $user_data = Veepdotai_Util::get_user_run_directory() . "/$audio_pid.data";
            //$data = file( $user_log_file, FILE_IGNORE_NEW_LINES );
            $data = file_get_contents( $user_data, FILE_IGNORE_NEW_LINES );
            //return rest_ensure_response( explode( "\n", $data) );

            $data_only_pid = array_map(
                fn($line) => ! preg_match( "/" . $audio_pid ."-/", $line) ? $line : ''
            , explode( "\n", $data) );
            return rest_ensure_response( $data_only_pid );

        } else if ( $generation_pid ) {
            $files = [];
            $user_dir = Veepdotai_Util::get_storage_directory();
            foreach (glob("$user_dir/*$generation_pid-*") as $filename) {
                $filename = preg_replace( "#(.*)\/wp-content\/#", "/wp-content/", $filename);
                array_push( $files, $filename);
            }

            return rest_ensure_response( $files );
        }

    }

    /**
     * Check permissions for the posts.
     *
     * @param WP_REST_Request $request Current request.
     */
    public function get_logs_permissions_check( $request ) {
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
function veepdotai_rest_logs_register_my_routes() {
    $controller = new Veepdotai_Logs_REST_Controller();
    $controller->register_routes();
}

add_action( 'rest_api_init', 'veepdotai_rest_logs_register_my_routes' );
