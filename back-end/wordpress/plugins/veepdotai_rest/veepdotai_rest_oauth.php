<?php

require_once 'vendor/autoload.php';
use GuzzleHttp\Client;

define('BASE_URI_PROVIDER', 'https://www.linkedin.com');
define('CLIENT_ID', LINKEDIN_CLIENT_ID);
define('CLIENT_SECRET', LINKEDIN_CLIENT_SECRET);
define('CLIENT_REDIRECT_URI', LINKEDIN_CLIENT_REDIRECT_URI);
define('SCOPE', LINKEDIN_SCOPE);

class Veepdotai_OAuth_REST_Controller extends WP_REST_Controller {

    public static function log( $level, $msg ) {
		$root = "Veepdotai_OAuth_REST_Controller";
		Veepdotai_Util::log( $level, $root . ' | ' . $msg);
	}

    // Here initialize our namespace and resource name.
    public function __construct() {
        $this->namespace     = 'veepdotai_rest/v1';
        $this->resource_name = 'oauth';
    }

    // Register our routes.
    public function register_routes() {
        register_rest_route( $this->namespace, '/' . $this->resource_name . '/introspectToken', array(
            array(
                'methods'   => 'GET',
                'callback'  => array( $this, 'get_token_infos' ),
                'permission_callback' => array( $this, 'get_token_infos_permissions_check' ),
            ),
            'schema' => array( $this, 'get_token_infos_schema' ),
        ) );
        register_rest_route( $this->namespace, '/' . $this->resource_name . '/', array(
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
        $fn = "get_item";
        
        //$user = wp_get_current_user()->user_login;

        $code = sanitize_text_field( $request[ 'code' ] );
        $redirect_uri = LINKEDIN_CLIENT_REDIRECT_URI ? LINKEDIN_CLIENT_REDIRECT_URI : sanitize_url( $request[ 'redirectUri' ] );
        self::log( "debug", "get_item: redirect_uri: " . $redirect_uri);

        try {
            $client = new Client(['base_uri' => BASE_URI_PROVIDER]);
            $params = [
                "grant_type" => "authorization_code",
                "code" => $code,
                "redirect_uri" => $redirect_uri,
                "client_id" => CLIENT_ID,
                "client_secret" => CLIENT_SECRET,
            ];
            self::log( "debug", "params: " . print_r( $params, true));
            $response = $client->request('POST', '/oauth/v2/accessToken', [
                'form_params' => $params,
            ]);
            $data = json_decode($response->getBody()->getContents(), true);
            self::log( "debug", "data: " . print_r( $data, true));
            $access_token = $data[ 'access_token' ]; // store this token somewhere

            $social_networks_data = [
                "linkedin" => [
                    "access_token" => $access_token
                ]
            ];
            //$social_networks_data = '{"linkedin":{"access_token":"' . $access_token . '"}}';

            Veepdotai_Util::set_option( "ai-social-networks-data", json_encode( $social_networks_data) );
            return rest_ensure_response( $social_networks_data );

        } catch(Exception $e) {
            self::log( 'debug', $e->getMessage() );
            return rest_ensure_response( ["access_token" => "error"] );
        }
        
        return rest_ensure_response( ["access_token" => null] );
    }

    /**
     * Check permissions for the posts.
     *
     * @param WP_REST_Request $request Current request.
     */
    public function get_token_infos_permissions_check( $request ) {
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
    public function get_token_infos( $request ) {
        $fn = "get_token_infos";

        $access_token = sanitize_text_field( $request['access_token'] );
        try {
            $client = new Client(['base_uri' => 'https://www.linkedin.com']);
            $response = $client->request('POST', '/oauth/v2/introspectToken', [
                'form_params' => [
                    "token" => $access_token,
                    "client_id" => CLIENT_ID,
                    "client_secret" => CLIENT_SECRET,
                ],
            ]);
            $data = json_decode($response->getBody()->getContents(), true);
            self::log( "debug", "data: " . print_r( $data, true));
            return rest_ensure_response( $data );

       } catch(Exception $e) {
            self::log( 'debug', $e->getMessage() );
            return rest_ensure_response( ["access_token" => "error"] );
        }
        
        return rest_ensure_response( ["access_token" => null] );
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
function veepdotai_rest_oauth_register_my_routes() {
    $controller = new Veepdotai_OAuth_REST_Controller();
    $controller->register_routes();
}

add_action( 'rest_api_init', 'veepdotai_rest_oauth_register_my_routes' );
