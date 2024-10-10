<?php

class Veepdotai_Posts_REST_Controller extends WP_REST_Controller {

    // Here initialize our namespace and resource name.
    public function __construct() {
        $this->namespace     = 'veepdotai_rest/v1';
        $this->resource_name = 'posts';
    }

    public static function log( $level, $msg ) {
		$root = "Veepdotai_Posts_REST_Controller";
		//Veepdotai_Util::log( $level, $root . ' | ' . $msg);
        Veepdotai_Util::error_log( $level . " | " . $root . ' | ' . $msg);
	}

    // Register our routes.
    public function register_routes() {
        register_rest_route( $this->namespace, '/' . $this->resource_name, array(
            array(
                'methods'   => 'GET',
                'callback'  => array( $this, 'get_items' ),
                'permission_callback' => array( $this, 'get_items_permissions_check' ),
            ),
            'schema' => array( $this, 'get_item_schema' ),
        ) );
        register_rest_route( $this->namespace, '/' . $this->resource_name . '/(?P<id>[\d]+)', array(
            // Notice how we are registering multiple endpoints the 'schema' equates to an OPTIONS request.
            array(
                'methods'   => 'GET',
                'callback'  => array( $this, 'get_item' ),
                'permission_callback' => array( $this, 'get_item_permissions_check' ),
            ),
            'schema' => array( $this, 'get_item_schema' ),
        ) );
        register_rest_route( $this->namespace, '/' . $this->resource_name . '/postn', array(
            // Notice how we are registering multiple endpoints the 'schema' equates to an OPTIONS request.
            array(
                'methods'   => 'POST',
                'callback'  => array( $this, 'postn_item' ),
                'permission_callback' => array( $this, 'postn_item_permissions_check' ),
            ),
            'schema' => array( $this, 'postn_item_schema' ),
        ) );
        register_rest_route( $this->namespace, '/' . $this->resource_name, array(
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
     * Check permissions for the posts.
     *
     * @param WP_REST_Request $request Current request.
     */
    public function get_items_permissions_check( $request ) {
        if ( ! current_user_can( 'read' ) ) {
            return new WP_Error( 'rest_forbidden', esc_html__( 'You cannot view the post resource.' ), array( 'status' => $this->authorization_status_code() ) );
        }
        return true;
    }

    /**
     * Grabs the five most recent posts and outputs them as a rest response.
     *
     * @param WP_REST_Request $request Current request.
     */
    public function get_items( $request ) {
        $args = array(
            'post_per_page' => 5,
            'post_type'     => 'vcontent', // vcontent|post
            'post_status'     => 'draft', // vcontent|post
        );
        $posts = get_posts( $args );

        $data = array();

        if ( empty( $posts ) ) {
            return rest_ensure_response( $data );
        }

        foreach ( $posts as $post ) {
            $response = $this->prepare_item_for_response( $post, $request );
            $data[] = $this->prepare_response_for_collection( $response );
        }

        // Return all of our comment response data.
        return rest_ensure_response( $data );
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
        $user = wp_get_current_user()->user_login;

        $id = (int) $request['id'];
        $post = get_post( $id );

        if ( empty( $post ) ) {
            return rest_ensure_response( array() );
        }

        $response = $this->prepare_item_for_response( $post, $request );

        // Return all of our post response data.
        return $response;
    }

    /**
     * 
     * $_POST[ 'veepdotai-content-id' ] = null
     * $_POST[ 'audio' ] = veep_id_vocal
     * $_FILES['veepdotai-ai-input-stream'] = file
     */
    public function postn_item( $request ) {
        $user = wp_get_current_user();
        $output = veepdotai_dsl();

        return rest_ensure_response( $output );
    }

    /**
     * Check permissions for the posts.
     *
     * @param WP_REST_Request $request Current request.
     */
    public function postn_item_permissions_check( $request ) {
        if ( ! current_user_can( 'read' ) ) {
            return new WP_Error( 'rest_forbidden', esc_html__( 'You cannot view the post resource.' ), array( 'status' => $this->authorization_status_code() ) );
        }
        return true;
    }

     /**
     * 
     * $_POST[ 'veepdotai-content-id' ] = null
     * $_POST[ 'audio' ] = veep_id_vocal
     * $_FILES['veepdotai-ai-input-stream'] = file
     */
    public function post_item( $request ) {
        Veepdotai_Util::log( 'debug', "veepdotai-ai-pid: " . $request['veepdotai-ai-pid']);
        Veepdotai_Util::log( 'debug', "veepdotai-ai-chain-id: " . $request['veepdotai-ai-chain-id']);

        Veepdotai_Util::log( 'debug', "veepdotai-ai-input-text: " . $request['veepdotai-ai-input-text']);
        Veepdotai_Util::log( 'debug', "veepdotai-ai-input-url: " . $request['veepdotai-ai-input-url']);
        
        Veepdotai_Util::log( 'debug', "veepdotai-ai-input-stream: " . $request['veepdotai-ai-input-stream']);
        Veepdotai_Util::log( 'debug', "veepdotai-ai-input-file: " . $request['veepdotai-ai-input-file']);

        //Veepdotai_Util::log( 'debug', "veepdotai-ai-input-file: " . $request['veepdotai-ai-input-file']);

        $user = wp_get_current_user();
        self::log( "debug", 'User: ' . print_r( $user, true));

        try {
            $content_id = Generation_Process::start_process();        
        } catch (Throwable $e) {
            Veepdotai_Util::log( 'debug', "An error has been raised: " . $e);   
        }

        /*
        $user_data = WP_User::get_data_by( 'login', 'jckermagoret' );
        $user = new WP_user( $user_data->ID );
        $user = wp_get_current_user();
        error_log( 'User: ' . print_r( $user, true), 3, '/tmp/wordpress.log');
        error_log( 'User\'s roles: ' . print_r( $user->roles, true), 3, '/tmp/wordpress.log');
*/
        //error_log( "Request: " . print_r( $request, true ), 3, "/tmp/wordpress.log");

        $data = [
            "user_id" => $user->ID,
            "content_id" => $content_id,
            "veepdotai-ai-chain-id" => $_POST[ "veepdotai-ai-chain-id" ],
            "veepdotai-ai-idea" => $_POST[ "veepdotai-ai-idea" ],
            "prompt" => $_POST[ "prompt" ],

            "veepdotai-ai-input-text" => $_POST[ "veepdotai-ai-input-text" ],
            "veepdotai-ai-input-url" => $_POST[ "veepdotai-ai-input-url" ],

            "veepdotai-ai-input-stream" => $_FILES[ "veepdotai-ai-input-stream" ][ "name" ],
            "veepdotai-ai-input-file" => $_FILES[ "veepdotai-ai-input-file" ][ "name" ],
        ];

        return rest_ensure_response( $data );
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

    /**
     * Matches the post data to the schema we want.
     *
     * @param WP_Post $post The comment object whose response is being prepared.
     */
    public function prepare_item_for_response( $post, $request ) {
        $post_data = array();

        $schema = $this->get_item_schema( $request );

        // We are also renaming the fields to more understandable names.
        if ( isset( $schema['properties']['id'] ) ) {
            $post_data['id'] = (int) $post->ID;
        }

        if ( isset( $schema['properties']['content'] ) ) {
            $post_data['content'] = apply_filters( 'the_content', $post->post_content, $post );
        }

        return rest_ensure_response( $post_data );
    }

    /**
     * Prepare a response for inserting into a collection of responses.
     *
     * This is copied from WP_REST_Controller class in the WP REST API v2 plugin.
     *
     * @param WP_REST_Response $response Response object.
     * @return array Response data, ready for insertion into collection data.
     */
    public function prepare_response_for_collection( $response ) {
        if ( ! ( $response instanceof WP_REST_Response ) ) {
            return $response;
        }

        $data = (array) $response->get_data();
        $server = rest_get_server();

        if ( method_exists( $server, 'get_compact_response_links' ) ) {
            $links = call_user_func( array( $server, 'get_compact_response_links' ), $response );
        } else {
            $links = call_user_func( array( $server, 'get_response_links' ), $response );
        }

        if ( ! empty( $links ) ) {
            $data['_links'] = $links;
        }

        return $data;
    }

    /**
     * Get our sample schema for a post.
     *
     * @return array The sample schema for a post
     */
    public function get_item_schema() {
        if ( $this->schema ) {
            // Since WordPress 5.3, the schema can be cached in the $schema property.
            return $this->schema;
        }

        $this->schema = array(
            // This tells the spec of JSON Schema we are using which is draft 4.
            '$schema'              => 'http://json-schema.org/draft-04/schema#',
            // The title property marks the identity of the resource.
            'title'                => 'post',
            'type'                 => 'object',
            // In JSON Schema you can specify object properties in the properties attribute.
            'properties'           => array(
                'id' => array(
                    'description'  => esc_html__( 'Unique identifier for the object.', 'my-textdomain' ),
                    'type'         => 'integer',
                    'context'      => array( 'view', 'edit', 'embed' ),
                    'readonly'     => true,
                ),
                'content' => array(
                    'description'  => esc_html__( 'The content for the object.', 'my-textdomain' ),
                    'type'         => 'string',
                ),
            ),
        );

        return $this->schema;
    }

        /**
     * Get our sample schema for a post.
     *
     * @return array The sample schema for a post
     */
    public function get_logs_schema() {
        if ( $this->schema ) {
            // Since WordPress 5.3, the schema can be cached in the $schema property.
            return $this->schema;
        }

        $this->schema = array(
            // This tells the spec of JSON Schema we are using which is draft 4.
            '$schema'              => 'http://json-schema.org/draft-04/schema#',
            // The title property marks the identity of the resource.
            'title'                => 'post',
            'type'                 => 'object',
            // In JSON Schema you can specify object properties in the properties attribute.
            'properties'           => array(
                'id' => array(
                    'description'  => esc_html__( 'Unique identifier for the object.', 'my-textdomain' ),
                    'type'         => 'integer',
                    'context'      => array( 'view', 'edit', 'embed' ),
                    'readonly'     => true,
                ),
                'content' => array(
                    'description'  => esc_html__( 'The content for the object.', 'my-textdomain' ),
                    'type'         => 'string',
                ),
            ),
        );

        return $this->schema;
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
function veepdotai_rest_posts_register_my_routes() {
    $controller = new Veepdotai_Posts_REST_Controller();
    $controller->register_routes();
}

add_action( 'rest_api_init', 'veepdotai_rest_posts_register_my_routes' );
