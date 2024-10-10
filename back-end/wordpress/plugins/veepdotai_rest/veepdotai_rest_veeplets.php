<?php

class Veepdotai_Veeplets_REST_Controller extends WP_REST_Controller {

    public static function log( $level, $msg ) {
		$root = "Veepdotai_Veeplets_REST_Controller";
		Veepdotai_Util::log( $level, $root . ' | ' . $msg);
        //Veepdotai_Util::error_log( $level . " | " . $root . ' | ' . $msg);
	}

    // Here initialize our namespace and resource name.
    public function __construct() {
        $this->namespace     = 'veepdotai_rest/v1';
        $this->resource_name = 'veeplets';
    }

    // Register our routes.
    public function register_routes() {
        register_rest_route( $this->namespace, '/' . $this->resource_name . '/(?P<veeplet>.*)', array(
            array(
                'methods'   => 'GET',
                'callback'  => array( $this, 'get_item' ),
                'permission_callback' => array( $this, 'get_item_permissions_check' ),
            ),
            'schema' => array( $this, 'get_item_schema' ),
        ) );

        register_rest_route( $this->namespace, '/' . $this->resource_name . '/(?P<veeplet>.*)', array(
            array(
                'methods'   => 'DELETE',
                'callback'  => array( $this, 'delete_item' ),
                'permission_callback' => array( $this, 'delete_item_permissions_check' ),
            ),
            'schema' => array( $this, 'delete_item_schema' ),
        ) );

        register_rest_route( $this->namespace, '/' . $this->resource_name . '/(?P<veeplet>.*)', array(
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
        self::log( "debug", "/veeplets/get_item: $user." );

        // /veepdotai_rest/v1/options/ai-section-edstrat0-strategy
        $veeplet_name = sanitize_text_field( $request['veeplet'] );

        $result = [ $veeplet_name => Veepdotai_Util::get_option( $veeplet_name ) ];

        return rest_ensure_response( $result );
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

     /**
     * 
     * $_POST[ 'option' ] = the name of the option
     * $_POST[ 'value' ] = the value of the option
     */
    public function post_item( $request ) {
        $fn = "post_item";
        $pn = "veepdotai-";
        $prompt_prefix = "ai-prompt-";

        $p_veepletname = sanitize_text_field( $request['veeplet'] );
        $action = sanitize_text_field( $request['action'] );

        $value = sanitize_text_field( $request['value'] );
        $oldName = sanitize_text_field( $request['oldName'] );

        if ( $action == "duplicate") {
            $root_string = Veepdotai_Util::get_option( $pn . $prompt_prefix . $p_veepletname );
            $root_string = preg_replace( "/#EOL#/", "\n", $root_string );

            $veeplet = apply_filters( 'veepdotai-process-prompt-toml2object', $root_string );
            $veeplet['metadata']['name'] .= "-copy";
            $veeplet['details']['presentation']['heading'] .= " (Copie)";
            $veeplet['owner']['creationDate'] = date_format(date_create(), 'Ymd-His');

            $root_string = apply_filters( 'veepdotai-process-prompt-object2toml', $veeplet );
            $value = preg_replace( "/\n/", "#EOL#", $root_string );

            $new_veeplet_name = $p_veepletname . "-copy";
            $result = Veepdotai_Util::set_option( $pn . $prompt_prefix . $new_veeplet_name, $value );

            return rest_ensure_response( [
                "name" => $new_veeplet_name,
                "action" => "duplicate",
                "status" => 200,
                "result" => true,
            ]);
        }

        $old_name = $pn . $prompt_prefix . $oldName;         

        self::log( "debug", "$fn: old_name: " . $old_name );

        $user = wp_get_current_user();
        self::log( "debug", "$fn: user: " . print_r( $user, true) . "." );

        $veeplet_name = $pn . $p_veepletname;
        self::log( "debug", "$fn: Setting option: $veeplet_name = $value." );

        if ( preg_match("/ai-prompt-veeplet/", $p_veepletname) ) {
            // We check we are processing a veeplet content

            $default_user = get_option( "admin-veepdotai-default-username" ) ?? 'demo';
            self::log( "debug", "post_item: default_user: " . $default_user );
            self::log( "debug", "post_item: current_user_login: " . $user->user_login );

            if ( $user->user_login != $default_user ) {
                self::log( "debug", "post_item: the current user is not the default/demo one" );

                // option must be saved as a personal one. The orgId must not be veepdotai.
                // The client takes care of this. If not, refuse to save data.
                $matches = [];
                $r = preg_match("/veepdotai-ai-prompt-veeplet\.([^\.])+/", $value, $matches );
                if ( $r ) {
                    $orgId = $matches[1];
                    if ( $orgId == "veepdotai") {
                        return rest_ensure_response(
                            new WP_Error("error", "You are not authorized to update veepdotai veeplets."
                        ) );
                    }
                }

                $old_value = Veepdotai_Util::get_option( $veeplet_name );
                $creation = false ;
                if ( ! $old_value ) {
                    // There was no option with such a name previously: it's a creation
                    $creation = true ;

                    // set default values
                } else {
                    // we get the old default values?
                }

                // Setting system data values the user can't change.
                $root_string = preg_replace( "/(#EOL#)/", "\n", $value );
                $veeplet = apply_filters( 'veepdotai-process-prompt-toml2object', $root_string );
                self::log( "debug", "post_item: veeplet: " . print_r( $veeplet, true) );
                self::log( "debug", "post_item: orgId: " . print_r( $veeplet['owner']['orgId'], true) );
                if ( $creation ) {
                    $veeplet['owner']['creationDate'] = date_format(date_create(), 'Ymd-His');
                } else {
                    $veeplet['owner']['modificationDate'] = date_format(date_create(), 'Ymd-His');
                }

                // Black on black is not really visible...
                if ( $veeplet['details']['ui']['headerColor'] == "#000000" 
                        && $veeplet['details']['ui']['headerBgColorFrom'] == "#000000" ) {
                    $veeplet['details']['ui']['headerColor'] = "#ffffff";
                    $veeplet['details']['ui']['headerBgColorFrom'] = "#000000";
                }

                if ( $veeplet['details']['ui']['bodyColor'] == "#000000" 
                        && $veeplet['details']['ui']['bodyBgColorFrom'] == "#000000" ) {
                    $veeplet['details']['ui']['bodyColor'] = "#000000";
                    $veeplet['details']['ui']['bodyBgColorFrom'] = "#ffffff";
                }

                $veeplet['owner']['authorId'] = $user->user_login;
                $veeplet['owner']['orgId'] = md5( $user->user_login );
                $veeplet['metadata']['publication']['scope'] = "personal";
                
                $veeplet['metadata']['version'] = "1.0.0";
                $veeplet['metadata']['schema'] = "1.0.0";

                // Serializing veeplet
                $root_string = apply_filters( 'veepdotai-process-prompt-object2toml', $veeplet );
                $value = preg_replace( "/\n/", "#EOL#", $root_string );
                
            } else {
                // It's the default user. He can do what he wants to configure the system.
            }

            $result = Veepdotai_Util::set_option( $veeplet_name, $value );
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
        } else {
            $data = null;
        }


        return rest_ensure_response( $data );
    }

    public function delete_item_permissions_check( $request ) {
        return true;
        if ( ! current_user_can( 'read' ) ) {
            return new WP_Error(
                'rest_forbidden', esc_html__( 'You cannot delete the provided resource.' ),
                array( 'status' => $this->authorization_status_code() )
            );
        }
        return true;
    }

    public function delete_item( $request ) {
        $fn = "delete_item";
        $pn = "veepdotai-";
        $prompt_prefix = "ai-prompt-";

        $p_veeplet_name = sanitize_text_field( $request['veeplet'] );
        //$name = $pn . $prompt_prefix . $p_veeplet_name;
        $name = $pn . $prompt_prefix . $p_veeplet_name;
        self::log( "debug", "$fn: name: " . $name );

        if ( preg_match("/ai-prompt-veeplet/", $name) ) {    
            self::log( "debug", "calling V::delete_option: name: " . $name );
            if ( Veepdotai_Util::delete_option( $name ) ) {
                $data = [
                    "status" => 200,
                    "veeplet" => $name,
                    "verb" => "DELETE",
                    "result" => true
                ];
            } else {
                $data = [
                    "status" => 401,
                    "veeplet" => $p_veeplet_name,
                    "verb" => "DELETE",
                    "result" => false
                ];
            }
        } else {
            return new WP_Error(
                'rest_forbidden', esc_html__( 'The provided resource ID has not been found.' ),
                array(
                    'status' => 404,
                    'ID' => $name
                )
            );
        }

        return rest_ensure_response( $data );
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
function veepdotai_rest_veeplets_register_my_routes() {
    $controller = new Veepdotai_Veeplets_REST_Controller();
    $controller->register_routes();
}

add_action( 'rest_api_init', 'veepdotai_rest_veeplets_register_my_routes' );
