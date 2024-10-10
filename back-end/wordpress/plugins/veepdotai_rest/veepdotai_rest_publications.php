<?php

add_action( 'my_veepdotai', 'Generation_Process::process_content', 1, 3 );

class Veepdotai_Publications_REST_Controller extends WP_REST_Controller {

    // Here initialize our namespace and resource name.
    public function __construct() {
        $this->namespace     = 'veepdotai_rest/v1';
        $this->resource_name = 'publications';
    }

    public static function log( $level, $msg ) {
		$root = "Veepdotai_Publications_REST_Controller";
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
            return new WP_Error( 'rest_forbidden', esc_html__( 'You cannot view the publication resource.' ), array( 'status' => $this->authorization_status_code() ) );
        }
        return true;
    }

    /**
     */
    public function get_items( $request ) {
        $args = array(
            'post_per_page' => 5,
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
     */
    public function post_item( $request ) {
        self::log( 'debug', "action: " . $request['action']);

        $user = wp_get_current_user();

        try {
            $result = do_action( 'the_content', $post->post_content, $post );
        } catch (Throwable $e) {
            self::log( 'debug', "An error has been raised: " . $e);
            return new WP_Error(
                'rest_forbidden',
                esc_html__( 'An error has been raised while processing the request.' ),
                [
                    'status' => $this->execution_status_code(),
                    'error' => $e,
                    'user_id' => $user->ID,
                ]
            );
        };

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
            return new WP_Error( 'rest_forbidden', esc_html__( 'You cannot view the publication resource.' ), array( 'status' => $this->authorization_status_code() ) );
        }
        return true;
    }

    /**
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

    // Sets up the proper HTTP status code for authorization.
    public function authorization_status_code() {
        if ( is_user_logged_in() ) return 403; else return 401;
    }
    public function execution_status_code() {
        if ( is_user_logged_in() ) return 403; else return 401;
        return 500;
    }
}

// Function to register our new routes from the controller.
function veepdotai_rest_publications_register_my_routes() {
    $controller = new Veepdotai_Publications_REST_Controller();
    $controller->register_routes();
}

add_action( 'rest_api_init', 'veepdotai_rest_publications_register_my_routes' );
