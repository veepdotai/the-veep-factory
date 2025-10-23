<?php

class Veepdotai_WP_REST_Controller extends WP_REST_Controller {

    // Here initialize our namespace and resource name.
    public function __construct() {
        $this->namespace     = 'veepdotai_rest/v1';
        $this->resource_name = 'mywp';
    }

    // Register our routes.
    public function register_routes() {
        register_rest_route( $this->namespace, '/' . $this->resource_name . '/logout_url', array(
            array(
                'methods'   => 'GET',
                'callback'  => array( $this, 'get_logout_url' ),
                'permission_callback' => array( $this, 'get_item_permissions_check' ),
            ),
            'schema' => array( $this, 'get_item_schema' ),
        ) );
        register_rest_route( $this->namespace, '/' . $this->resource_name . '/(?P<option>.*)', array(
            array(
                'methods'   => 'GET',
                'callback'  => array( $this, 'get_item' ),
                'permission_callback' => array( $this, 'get_item_permissions_check' ),
            ),
            'schema' => array( $this, 'get_item_schema' ),
        ) );
    }

        /**
     * Gets post data of requested post id and outputs it as a rest response.
     *
     *  https://developer.wordpress.org/reference/functions/get_the_author_meta/
     * 
     * @param WP_REST_Request $request Current request.
     */
    public function get_logout_url( $request ) {
        $id = get_current_user_id();

        //error_log("Id: $id\n", 3, "/tmp/wordpress.log");
        $location = str_replace("&amp;", '&', wp_logout_url(site_url()));
        header("Location: " . $location);
        exit();
        wp_logout();
        if ( $id ) {
            $result = [
                "logout_url" => str_replace("&amp;", '&', wp_logout_url(site_url()))
//                "logout_result" => $res
            ];
        } else {
            $result = null;
        }

        //return rest_ensure_response( $this->flatten_array_preserve_keys($result) );
        return rest_ensure_response( $result );
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

    public function flatten_array_preserve_keys(array $array) {
        $recursiveArrayIterator = new RecursiveArrayIterator(
            $array,
            RecursiveArrayIterator::CHILD_ARRAYS_ONLY
        );
        $iterator = new RecursiveIteratorIterator($recursiveArrayIterator);
    
        return iterator_to_array($iterator);
    }
    
    /**
     * Gets post data of requested post id and outputs it as a rest response.
     *
     *  https://developer.wordpress.org/reference/functions/get_the_author_meta/
     * 
     * @param WP_REST_Request $request Current request.
     */
    public function get_item( $request ) {
        $id = get_current_user_id();

        if ( $id ) {

            $JWT = sanitize_text_field( $request['JWT'] );
            $infos_base64 = preg_replace("/.*\.([^\.]*)\..*/", "$1", $JWT );
            $user_JWT = json_decode( base64_decode( $infos_base64 ) );
            $avatar_url = $user_JWT->data->user->picture;
            
            $attrs = [
                "admin_color",
                "aim",
                "comment_shortcuts",
                "description",
                "display_name",
                "first_name",
                "ID",
                "jabber",
                "last_name",
                "nickname",
                "plugins_last_view",
                "plugins_per_page",
                "rich_editing",
                "syntax_highlighting",
                "user_activation_key",
                "user_description",
                "user_email",
                "user_firstname",
                "user_lastname",
                "user_level",
                "user_login",
                "user_nicename",
                "user_registered",
                "user_status",
                "user_url",
                "yim"
            ];
            
            $infos = [["ID" => $id]];
            foreach($attrs as $attr) {
                $value = get_the_author_meta( $attr, $id);
                array_push( $infos, [ $attr => $value ] );
            }
            
            array_push($infos, [ "veepdotai_avatar_url" => $avatar_url ]);

            // get role and cap user infos
            $user = wp_get_current_user();
//            $roles = $user->roles;
//            $caps = $user->roles;;
            // merge data from profile and user
            
            $result = $this->flatten_array_preserve_keys($infos);
            $result['roles'] = $user->roles;
            $result['caps'] = $user->caps;

        } else {
            $result = null;
        }

        //return rest_ensure_response( $this->flatten_array_preserve_keys($result) );
        return rest_ensure_response( $result );
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
function veepdotai_rest_wp_register_my_routes() {
    $controller = new Veepdotai_WP_REST_Controller();
    $controller->register_routes();
}

add_action( 'rest_api_init', 'veepdotai_rest_wp_register_my_routes' );
