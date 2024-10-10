<?php

class Veepdotai_Catalog_REST_Controller extends WP_REST_Controller {

    public static function log( $level, $msg, $data = null, $msg_type = 3, $file = "/tmp/wordpress.log" ) {
		$root = "Veepdotai_Catalog_REST_Controller";
		//Veepdotai_Util::log( $level, $root . ' | ' . $msg);
        error_log(
            "$level: $root: Catalog: " . $msg
                . ($data ? print_r($data, true) : ''),
            $msg_type,
            $file
        );
	}

    // Here initialize our namespace and resource name.
    public function __construct() {
        $this->namespace     = 'veepdotai_rest/v1';
        $this->resource_name = 'catalog';
    }

    // Register our routes.
    public function register_routes() {
        register_rest_route( $this->namespace, '/' . $this->resource_name . '/(?P<catalog_type>.*)', array(
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
        global $wpdb;
        $fn = "get_item";

        $default_user = Veepdotai_Util::get_option( "default-username" ) ?? "demo";
        
        $user = wp_get_current_user()->user_login;
        error_log("Default-user: " . $default_user . " / " . $user . "\n", 3, "/tmp/error.log");
        self::log("debug", "$fn: user: " . $user);

        if ( ! $user ) {
            return rest_ensure_response(
                new WP_Error("error", "user doesn't exist")
            );
        } else {
            $catalog_type = sanitize_text_field( $request['catalog_type'] );
    
            self::log("debug", "$fn: catalog_type: ", $catalog_type );

            if ( ! in_array( $catalog_type, [ "public", "personal" ] ) ) {
                return rest_ensure_response(
                    new WP_Error("error", "catalog_type must be [public|personal]"
                ) );
            }

            if ( "public" == $catalog_type && $user === $default_user ) {
                $results = [];
            } else {
                if ( "public" == $catalog_type ) {
                    $selected_user = $default_user;
                } else if ( "personal" == $catalog_type ) {
                    $selected_user = $user;
                } else {
                    $selected_user = null;
                }

                if ( ! $selected_user ) {
                    // There is a problem.
                    // Work in degrade mode: no public veeplets. Warn the admin.
                    // @TODO Fix no public veeplets error.
                    $selected_user = $user;
                }
                
                $my_option_name = $selected_user . '-veepdotai-ai-prompt-veeplet';
                $vars = [
                    $wpdb->esc_like( $my_option_name ) . '%'
                ];
                $sql = $wpdb->prepare(
                    "SELECT option_name, option_value "
                    . "FROM $wpdb->options "
                    . "WHERE option_name LIKE %s;",
                    $vars
                );
                $results = $wpdb->get_results( $sql );

                self::log("debug", "$fn: sql: ", $sql);
            }
            
            self::log("debug", "$fn: results: ", $results);
        
            return rest_ensure_response( [
                "catalog" => [
                    "type" => $catalog_type,
                    "veeplets" => $results
                ]
            ] );
        }
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
function veepdotai_rest_catalog_register_my_routes() {
    $controller = new Veepdotai_Catalog_REST_Controller();
    $controller->register_routes();
}

add_action( 'rest_api_init', 'veepdotai_rest_catalog_register_my_routes' );
