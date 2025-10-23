<?php

if ( ! defined( 'ABSPATH' ) ) exit;

require_once  VEEPDOTAI_PLUGIN_DIR . '/admin/class-veepdotai-util.php';

/**
 * Fired during plugin deactivation
 *
 * @link       https://www.veep.ai
 * @since      1.0.0
 *
 * @package    Veepdotai
 * @subpackage Veepdotai/includes
 */

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 * @package    Veepdotai
 * @subpackage Veepdotai/includes
 * @author     Jean-Christophe Kermagoret <jck@veep.ai>
 */
class Veepdotai_Deactivator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function deactivate() {
		Veepdotai_Util::log('debug', 'Deactivating Veepdotai plugin.');
	}

}
