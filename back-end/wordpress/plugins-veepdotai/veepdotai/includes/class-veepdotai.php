<?php


if ( ! defined( 'ABSPATH' ) ) exit;

add_action("wp_dashboard_setup", "Veepdotai::dashboard_setup");

/**
 * Prevents logged user to access login screen except admin
 */

add_action( 'init2', 'blockusers_init' );
function blockusers_init() {
	$user_wp = wp_get_current_user();
	//error_log("user_wp: " . print_r($user_wp, null), 3, "/tmp/wp-init.log");
	$url = Veepdotai::get_jwt_link( $user_wp );
	//error_log("user_wp: " . print_r($url, null), 3, "/tmp/wp-init.log");
	//$url = "https://www.google.com";

    if ( $user_wp
			&& is_admin()
			&& ! current_user_can( 'administrator' )
			&& ! ( defined( 'DOING_AJAX' ) && DOING_AJAX ) ) {
        wp_redirect( $url );
        exit;
    }
}

add_filter( 'graphql_request_results', 'my_graphql_request_results', 10, 1);
function my_graphql_request_results( $response ) {
//function my_graphql_request_results( $response, $schema, $operation, $request, $variables ) {
	//error_log( "\n### filtering graphql_request_results", 3, "/tmp/filter_graphql.log" );
	if ( is_array( $response ) && isset( $response['extensions'] ) ) { 
			unset( $response['extensions'] );
	}

	if ( is_object( $response ) && isset( $response->extensions ) ) {
		unset( $response->extensions );
	}

	return $response;
}

add_filter('parse_query', 'my_parse_query' );
function my_parse_query( $wp_query ) {
	global $current_user;
	$wp_query->set( 'author', $current_user->ID );
	//$wp_query->set( 'author', 2 );
}

add_filter( "the_title", "my_the_title", 10, 2 );
function my_the_title( $post_title, $post_id ) {
	return $post_title;
}

add_filter( 'posts_results_off', 'my_posts_results_filter', 10, 1 );
//add_filter( 'the_posts', 'my_posts_results_filter', 10, 1 );
function my_posts_results_filter( $posts ) {
//	print_r($GLOBALS['wp_filter']);
	return [];
	$filtered_posts = array();
	//print_r( $posts );
	foreach ( $posts as $post ) {
		//print_r( $post->post_author );
		if ( 2 != $post->post_author ) {
			// safe to add non-selfie title post to array
			//$filtered_posts[] = $post;
		}
	}
	$posts = [] ;
	return null;
}

/**
 * https://wordpress.stackexchange.com/questions/1684/what-is-the-use-of-map-meta-cap-filter
 * https://justintadlock.com/archives/2010/07/10/meta-capabilities-for-custom-post-types
 * https://wordpress.stackexchange.com/questions/408329/custom-map-meta-cap-filter-does-not-return-do-not-allow
 */
add_filter( 'map_meta_cap_off', 'my_map_meta_cap', 10, 4 );
function my_map_meta_cap( $caps, $cap, $user_id, $args ) {

	//error_log( "\n*cap => {$cap} * args => : " . print_r( $args, true), 3, "/tmp/meta_cap.log" );
	error_log( "\n*cap => {$cap}", 3, "/tmp/meta_cap.log" );
	error_log( "\n### Log My Meta Cap Hook arguments: "
	. "\n=> caps: [" . implode(", ", $caps) . "]"
	. "=> cap: " . $cap . ", user_id: " . $user_id . ", args: " . implode(", ", $args),
	3,
	"/tmp/meta_cap.log" );
	return $caps;
	//return ["do_not_allow"];

	/* If editing, deleting, or reading a vcontent, get the post and post type object. */
	if ( in_array( $cap, ['edit_vcontents', 'edit_post', 'delete_post', 'read_post'] ) ) {
		error_log( "\n### Log My Meta Cap Hook arguments: "
		. "\n=> caps: [" . implode(", ", $caps) . "]"
		. "=> cap: " . $cap . ", user_id: " . $user_id . ", args: " . implode(", ", $args),
		3,
		"/tmp/meta_cap.log" );

		error_log( "\n* $ args[0]: " . $args[0], 3, "/tmp/meta_cap.log" );

		//if ( isset( $args[0] ) ) {
			$post = get_post( $args[0] );
			//$caps = array();	
		//}

		if ( $post ) {

			$post_type = get_post_type_object( "vcontent" );

			//error_log("\nLog Post Type: post_type: " . $post->post_type, 3, "/tmp/meta_cap.log" );
			//error_log("\nLog Post: post: " . print_r( $post, true ), 3, "/tmp/meta_cap.log" );
			//error_log("\nLog Post Type: post_type: " . print_r( $post_type, true ), 3, "/tmp/meta_cap.log" );

			/* Set an empty array for the caps. */

			if ( 'edit_vcontent' == $cap ) {
				error_log("\n=> Edit Vcontent: user_id: {$user_id}"
					. " / post_author: " . $post->post_author
					. " / post_title: " . $post->post_title,
					3, "/tmp/meta_cap.log"
				);
				//if ( $user_id !== $post->post_author ) {
				if ( $user_id === $post->post_author ) {
					error_log("\n==>same id: {$user_id}", 3, "/tmp/meta_cap.log" );
					$caps[] = $post_type->cap->edit_posts;
				} elseif  ( 85 == $post->post_author ) {
					error_log("\n==> others id (85): post_author = " . $post->post_author, 3, "/tmp/meta_cap.log" );
					//$caps[] = $post_type->cap->publish_posts;
					$caps[] = $post_type->cap->edit_others_posts;
				} else {
					$caps[] = 'do_not_allow';
				}

			} elseif ( 'delete_vcontent' == $cap ) {
				if ( $user_id == $post->post_author ) {
					$caps[] = $post_type->cap->delete_posts;
				} else {
					//$caps[] = $post_type->cap->delete_others_posts;
				}
			} elseif ( 'read_vcontent' == $cap ) {

				if ( 'private' != $post->post_status ) {
					$caps[] = 'read';
				} elseif ( $user_id == $post->post_author ) {
					$caps[] = 'read';
				} else {
					$caps[] = 'do_not_allow';

					//$caps[] = $post_type->cap->read_private_posts;
				}
				//$caps[] = '';

			} else {
				$caps[] = 'do_not_allow';
			}

			/* Return the capabilities required by the user. */
			error_log("\nLog End My Meta Cap: Caps: " . print_r( $caps, true ), 3, "/tmp/meta_cap.log" );
		}

		return $caps;
	} else {

		//error_log("\nLog No filtered cap: My Meta Cap: Caps: " . print_r( $caps, true ), 3, "/tmp/meta_cap.log" );
		//$caps[] = 'do_not_allow';

		return $caps;
	}
}

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://www.veep.ai
 * @since      1.0.0
 *
 * @package    Veepdotai
 * @subpackage Veepdotai/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Veepdotai
 * @subpackage Veepdotai/includes
 * @author     Jean-Christophe Kermagoret <jck@veep.ai>
 */
class Veepdotai {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Veepdotai_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	public static function get_app_url_with_jwt( $jwt ) {
		if ( strpos( home_url(), "localhost") !== false ) {
			//$url = home_url() . ":3000/r?JWT=" . $jwt;
			$url = "http://localhost:3000/r?JWT=" . $jwt;
		} else if ( strpos( home_url(), "ws-eu11") !== false ) {
			$url = str_replace("8001", "3000", home_url()) . "/r?JWT=" . $jwt;
		} else if ( strpos( home_url(), "github.dev") !== false ) {
			$url = str_replace("-80", "-3000", home_url()) . "/r?JWT=" . $jwt;
		} else {
			$url = home_url() . "/v/app/r?JWT=" . $jwt;
		}

		return $url;
	}

	public static function get_jwt_link( $user ) {		
		$jwt_is_ok = false;
		if ( isset($_COOKIE["JWT"]) && $_COOKIE["JWT"] ) {
			$jwt = $_COOKIE["JWT"];
			if (Veepdotai_Login::veepdotai_decode_jwt($jwt)) {
				$jwt_is_ok = true;
			}
		}
		
		if ( ! $jwt_is_ok ) {
			$jwt = Veepdotai_Login::veepdotai_create_jwt_token( $user, null );
			//setcookie("JWT", $jwt, time() + 60 * 15,  "/" );
		} 	
	
		$app_jwt = Veepdotai_Login::veepdotai_create_jwt_token( $user, null, null, J7);
		$url = self::get_app_url_with_jwt( $app_jwt );		

		return $url;
	}

	public static function provide_jwt_links() {
		$user_wp = wp_get_current_user();

		$url = self::get_jwt_link( $user_wp );
		$app_jwt = Veepdotai_Login::veepdotai_create_jwt_token( $user_wp, null, null, J7);

		echo "<ul>";
		echo "<li><a href='$url'>Lancer l'application</a></li>";
		echo "<li style='overflow-wrap: break-word;'>Token JWT applicatif, à des fins de démo uniquement, valable 7j : <input value='$app_jwt' /></li>";
		echo "</ul>";

	}

	public static function build_app() {
		$user_wp = wp_get_current_user();

		//$app_dir = "/workspaces/the-veep-factory/back-end/wordpress/htdocs/v";
		$app_dir = "/srv/data/web/vhosts/app.veep.ai/htdocs/v";
		$link_name = "current";
		
		if( $user_wp->ID == 1
			|| in_array( 'veepdotai_role_admin', (array) $user_wp->roles ) ) {
			?>
				<form method="POST">
					<input name="app_id" value="" placeholder="Enter app id"></input>
					<input type="submit"></input>
				</form>
			<?php
				$app_id = sanitize_text_field( $_POST[ "app_id" ] );
				if( $app_id ) {

					$app_src = $app_dir . "/" . $app_id;
					$app_target = $app_dir . "/" . $link_name;
 
					Veepdotai_Util::log( 'debug', 'Link: ' . $app_target . ' => ' . $app_src );

					if (file_exists($app_target)) {
						Veepdotai_Util::log( "debug", "We remove old target: {$app_target}" );
						unlink( $app_target );
					}
					Veepdotai_Util::log( "debug", "Let's create the new target: {$app_target}" );
					symlink( $app_src, $app_target );
				}
		}
	}

	public static function user_search_by_email() {
		$user_wp = wp_get_current_user();
		
		if( $user_wp->ID == 1
			|| in_array( 'veepdotai_role_admin', (array) $user_wp->roles ) ) {
			?>
				<form method="POST">
					<input name="wp_login" value="" placeholder="Enter user query"></input>
					<input type="submit"></input>
				</form>
			<?php
				$user_login = sanitize_text_field( $_POST[ "wp_login" ] );
				if( $user_login ) {
					echo "<p>ICI</p>";
					$users_query = new WP_User_Query( array(
						'search'         => '*' . esc_attr( $user_login ) . '*',
						'search_columns' => array(
							'user_login',
							'user_nicename',
							'user_email',
							'user_url',
						),
					) );
					$users = $users_query->get_results();
					echo "<p>" . print_r( $users, true) . "</p>";
					if ( $users && count( $users ) > 0 ) {
						foreach( $users as $user ) {
							if ($user && $user->ID != 1) {
								$switch_user_jwt = Veepdotai_Login::veepdotai_create_jwt_token_from_user_infos(
									$user->user_email,
									$user->ID,
									$user->user_login
								);
								$url = self::get_app_url_with_jwt( $switch_user_jwt );
								echo "<p>Se connecter en <a href='{$url}'>{$user->user_email} / {$user->user_login}.</a></p>";
							}
						}
					} else {
						echo "$user_login hasn't been found.";
					}
				}
		}
	}

	public static function migrate_v1_to_v2() {
		$user_wp = wp_get_current_user();

		if( $user_wp->ID == 1
				|| in_array( 'veepdotai_role_admin', (array) $user_wp->roles ) ) {
			echo "Lancer la migration v1 to v2 <a href='?wp_user_action=test'>Migrate !</a>";
			$user_action = sanitize_text_field( $_GET["wp_user_action"] );
			if( $user_action ) {
				//echo "bonjour";
				do_action('migrate_veep');
			}
		}
	}

	public static function dashboard_launcher() {
		Veepdotai::provide_jwt_links();
		Veepdotai::user_search_by_email();
		Veepdotai::migrate_v1_to_v2();
		Veepdotai::build_app();
	}
	
	public static function dashboard_setup() {	
		wp_add_dashboard_widget( "veepdotai_dashboard_widget", "Veepdotai Dashboard", "Veepdotai::dashboard_launcher", null, null, "normal", "high");
	}

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'VEEPDOTAI_VERSION' ) ) {
			$this->version = VEEPDOTAI_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'veepdotai';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Veepdotai_Loader. Orchestrates the hooks of the plugin.
	 * - Veepdotai_i18n. Defines internationalization functionality.
	 * - Veepdotai_Admin. Defines all hooks for the admin area.
	 * - Veepdotai_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {


//        require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/partials/veepdotai-shortcode.php';
		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-veepdotai-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-veepdotai-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-veepdotai-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-veepdotai-public.php';

		$this->loader = new Veepdotai_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Veepdotai_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Veepdotai_i18n();

		$this->loader->add_action( 'init', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Veepdotai_Admin( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

		$this->loader->add_action( 'admin_menu', $plugin_admin, 'main_admin_menu' );

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Veepdotai_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Veepdotai_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
