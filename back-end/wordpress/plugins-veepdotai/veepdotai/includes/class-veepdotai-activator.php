<?php

if ( ! defined( 'ABSPATH' ) ) exit;

require_once  VEEPDOTAI_PLUGIN_DIR . '/admin/class-veepdotai-util.php';

/**
 * Fired during plugin activation
 *
 * @link       https://www.veep.ai
 * @since      1.0.0
 *
 * @package    Veepdotai
 * @subpackage Veepdotai/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Veepdotai
 * @subpackage Veepdotai/includes
 * @author     Jean-Christophe Kermagoret <jck@veep.ai>
 */
class Veepdotai_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		Veepdotai_Util::log('debug', 'Activating Veepdotai plugin.');

		Veepdotai_Util::log('debug', 'Prepare to configure roles and caps.');
		Veepdotai_Admin_Settings::create_roles_and_caps();
		Veepdotai_Admin_Settings::initialize_categories();
		//register_activation_hook( __FILE__, 'Veepdotai_Activator::create_roles_and_caps');
		//add_action('init', 'Veepdotai_Activator::create_roles_and_caps');
	}
}
