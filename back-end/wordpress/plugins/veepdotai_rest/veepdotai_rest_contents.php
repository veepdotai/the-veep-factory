<?php

class Veepdotai_Contents_REST_Controller extends WP_REST_Controller {

    public static function log( $msg, $data = null, $msg_type = 3, $file = "/tmp/wordpress.log" ) {
		$root = "Veepdotai_Contents_REST_Controller";
        Veepdotai_Util::log( 'debug', "$root: Contents: " . $msg
                                . ($data ? print_r($data, true) : '')
//                                ,$msg_type,
//                                $file
                            );
	}

    // Here initialize our namespace and resource name.
    public function __construct() {
        $this->namespace     = 'veepdotai_rest/v1';
        $this->resource_name = 'contents';
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
        register_rest_route( $this->namespace, '/' . $this->resource_name . '/(?P<id>[\d]+)', array(
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
            //return new WP_Error( 'rest_forbidden', esc_html__( 'You cannot2 view the post resource.' ), array( 'status' => $this->authorization_status_code() ) );
        }
        return true;
    }

    /**
     * Grabs the five most recent posts and outputs them as a rest response.
     * https://kinsta.com/blog/wordpress-get_posts/
     * @param WP_REST_Request $request Current request.
     */
    public function get_items( $request ) {
        $args = array(
            'author' => get_current_user_id(),
            'numberposts' => 20,
            'post_status' => 'draft',
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
    public function post_item( $request ) {
        $user = wp_get_current_user();

        $id = sanitize_text_field( $request['id'] );
        //$content = sanitize_text_field( $request['content'] );
        $content = sanitize_textarea_field( $request['content'] );
        $attr_name = sanitize_text_field( $request['attrName'] );
        $custom = sanitize_text_field( $request['custom'] );
        $label_encoded = preg_replace("/labelEncoded:(.*)/", "$1", $custom );
        self::log( "label_encoded: ${label_encoded}" );

        if ( ! $attr_name ) {
            // update all the post.
            die("Not implemented.");
        } else if ( $attr_name == "post_content" ) {
            $post_array = array(
                "ID" => $id,
                "post_content" => $content,
            );
            $output = wp_update_post( $post_array );

            if ( $label_encoded == "transcription" ) {
                Veepdotai_Util::set_option( "ai-section-edcal0-${label_encoded}", $content );
            } else if ( $label_encoded ) {
                Veepdotai_Util::set_option( "ai-section-edcal1-phase${label_encoded}", $content );       
            }

        } else if ( $attr_name == "veepdotaiContent" ) {
            // Is it used anymore?            
            $post_array = array(
                "ID" => $id,
                "post_content" => $content,
                "meta_input" => [
                    $attr_name => $content
                ]
            );

            $output = wp_update_post( $post_array );

        } else {
            $output = update_post_meta( $id, $attr_name, $content);
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

    /**
     * Matches the post data to the schema we want.
     *
     * @param WP_Post $post The comment object whose response is being prepared.
     */
    public function prepare_item_for_response( $post, $request ) {
        $post_data = array();

        $post_meta = get_post_meta( $post->ID, '', false );

        error_log("Post: " . print_r( $post, true), 3, "/tmp/wp.log");
        error_log("Post meta: " . print_r( $post_meta, true), 3, "/tmp/wp.log");
        error_log("Post meta end.", 3, "/tmp/wp.log");
        $schema = $this->get_item_schema( $request );

        // We are also renaming the fields to more understandable names.
        if ( isset( $schema['properties']['id'] ) ) {
            $post_data['id'] = (int) $post->ID;
        }

        if ( isset( $schema['properties']['content'] ) ) {
            $post_data['content'] = apply_filters( 'the_content', $post->post_content, $post );
        }

        $post_data['title'] = $post->post_title;
        $post_data['date'] = $post->post_date;

        $post_data['short'] = $post_meta['veepdotai_metadata_linkedin']??[0];
        $post_data['keywords'] = $post_meta['veepdotai_meta_tag_keywords']??[0];
        $post_data['description'] = $post_meta['veepdotai_meta_tag_description']??[0];
        $post_data['long'] = $post_meta['veepdotai_metadata_content']??[0];
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
function veepdotai_rest_contents_register_my_routes() {
    $controller = new Veepdotai_Contents_REST_Controller();
    $controller->register_routes();
}

add_action( 'rest_api_init', 'veepdotai_rest_contents_register_my_routes' );
