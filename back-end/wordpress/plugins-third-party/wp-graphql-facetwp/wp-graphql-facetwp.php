<?php
/**
 * Plugin Name: WPGraphQL for FacetWP
 * Plugin URI: https://github.com/AxeWP/wp-graphql-facetwp
 * Description: Adds FacetWP support to WPGraphQL
 * Author: hsimah, justlevine
 * Author URI: http://www.hsimah.com
 * Version: 0.5.2
 * Text Domain: wpgraphql-facetwp
 * Requires at least: 5.4.1
 * Tested up to: 6.8.1
 * Requires PHP: 7.4
 * Requires Plugins: wp-graphql
 * WPGraphQL requires at least: 1.6.0
 * WPGraphQL tested up to: 2.3.0
 * FacetWP requires at least: 4.0
 * License: GPL-3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 *
 * @package WPGraphQL\FacetWP
 * @author  hsimah
 * @license GPL-3
 */

namespace WPGraphQL\FacetWP;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// If the codeception remote coverage file exists, require it.
// This file should only exist locally or when CI bootstraps the environment for testing.
if ( file_exists( __DIR__ . '/c3.php' ) ) {
	require_once __DIR__ . '/c3.php';
}

// Load the autoloader.
require_once __DIR__ . '/src/Autoloader.php';
if ( ! \WPGraphQL\FacetWP\Autoloader::autoload() ) {
	return;
}

	/**
	 * Define plugin constants.
	 */
function constants(): void {
		// Plugin version.
	if ( ! defined( 'WPGRAPHQL_FACETWP_VERSION' ) ) {
		define( 'WPGRAPHQL_FACETWP_VERSION', '0.5.2' );
	}

	// Plugin Folder Path.
	if ( ! defined( 'WPGRAPHQL_FACETWP_PLUGIN_DIR' ) ) {
		define( 'WPGRAPHQL_FACETWP_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
	}

	// Plugin Folder URL.
	if ( ! defined( 'WPGRAPHQL_FACETWP_PLUGIN_URL' ) ) {
		define( 'WPGRAPHQL_FACETWP_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
	}

	// Plugin Root File.
	if ( ! defined( 'WPGRAPHQL_FACETWP_PLUGIN_FILE' ) ) {
		define( 'WPGRAPHQL_FACETWP_PLUGIN_FILE', __FILE__ );
	}

	// Whether to autoload the files or not.
	if ( ! defined( 'WPGRAPHQL_FACETWP_AUTOLOAD' ) ) {
		define( 'WPGRAPHQL_FACETWP_AUTOLOAD', true );
	}
}

	/**
	 * Checks if all the the required plugins are installed and activated.
	 *
	 * @return array<string,string> The list of missing dependencies.
	 */
function dependencies_not_ready(): array {
	$wpgraphql_version = '1.6.0';
	$facetwp_version   = '4.0';

	$deps = [];

	if ( ! class_exists( 'WPGraphQL' ) || ( defined( 'WPGRAPHQL_VERSION' ) && version_compare( WPGRAPHQL_VERSION, $wpgraphql_version, '<' ) ) ) {
		$deps['WPGraphQL'] = $wpgraphql_version;
	}

	if ( ! class_exists( 'FacetWP' ) || ( defined( 'FACETWP_VERSION' ) && version_compare( FACETWP_VERSION, $facetwp_version, '<' ) ) ) {
		$deps['FacetWP'] = $facetwp_version;
	}

	return $deps;
}

	/**
	 * Initializes the plugin.
	 */
function init(): void {
	constants();

	$not_ready = dependencies_not_ready();

	if ( empty( $not_ready ) && defined( 'WPGRAPHQL_FACETWP_PLUGIN_DIR' ) ) {
		require_once WPGRAPHQL_FACETWP_PLUGIN_DIR . 'src/Main.php';
		\WPGraphQL\FacetWP\Main::instance();

		return;
	}

	/**
	 * For users with lower capabilities, don't show the notice.
	 *
	 * @todo Are we sure we don't want to tell all users with backend access that the plugin isn't working?
	 */
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	foreach ( $not_ready as $dep => $version ) {
		add_action(
			'admin_notices',
			static function () use ( $dep, $version ) {
				?>
					<div class="error notice">
						<p>
						<?php
							printf(
								/* translators: dependency not ready error message */
								esc_html__( '%1$s (v%2$s) must be active for WPGraphQL Plugin Name to work.', 'wpgraphql-facetwp' ),
								esc_attr( $dep ),
								esc_attr( $version )
							);
						?>
						</p>
					</div>

					<?php
			}
		);
	}
}

add_action( 'facetwp_init', 'WPGraphQL\FacetWP\init' );
