<?php

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The admin-specific functionality of the plugin.
 *
 * @package    Veepdotai
 * @subpackage Veepdotai/admin
 * @author     Jean-Christophe Kermagoret <jck@veep.ai>
 */

class Veepdotai_Admin {
	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 */

	public function __construct() {
		$this->load_dependencies();
	}

	private function load_dependencies() {
		require_once plugin_dir_path( __FILE__ ) . './class-veepdotai-util.php';
		require_once plugin_dir_path( __FILE__ ) . './class-generation-process.php';

		require plugin_dir_path( __FILE__ ) . './class-veepdotai-admin-configuration.php';
//		require plugin_dir_path( __FILE__ ) . './class-veepdotai-admin-site.php';
//		require plugin_dir_path( __FILE__ ) . './class-veepdotai-admin-editorial-strategy.php';
//		require plugin_dir_path( __FILE__ ) . './class-veepdotai-admin-editorial-calendar.php';
		require plugin_dir_path( __FILE__ ) . './class-veepdotai-admin-settings.php';
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {
		wp_enqueue_style(
			VEEPDOTAI_PLUGIN_NAME . '-jquery-modal',
			plugin_dir_url( __FILE__ ) . 'css/jquery.modal.min.css',
			array(),
			VEEPDOTAI_PLUGIN_VERSION,
			'all'
		);

		wp_enqueue_style(
			VEEPDOTAI_PLUGIN_NAME,
			plugin_dir_url( __FILE__ ) . 'css/veepdotai-admin.css',
			array(),
			VEEPDOTAI_PLUGIN_VERSION,
			'all'
		);
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		wp_enqueue_script(
			VEEPDOTAI_PLUGIN_NAME . '-jquery-modal',
			plugin_dir_url( __FILE__ ) . 'js/jquery.modal.min.js',
			array( 'jquery' ),
			VEEPDOTAI_PLUGIN_VERSION,
			false
		);

		wp_enqueue_script(
			VEEPDOTAI_PLUGIN_NAME,
			plugin_dir_url( __FILE__ ) . 'js/veepdotai-admin.js',
			array( 'jquery' ),
			VEEPDOTAI_PLUGIN_VERSION,
			false
		);
		wp_enqueue_script(
			VEEPDOTAI_PLUGIN_NAME . '-ajax',
			plugin_dir_url( __FILE__ ) . 'js/app.js',
			array( 'jquery' ),
			VEEPDOTAI_PLUGIN_VERSION,
			true
		);
		wp_enqueue_script(
			VEEPDOTAI_PLUGIN_NAME . '-ajax2',
			plugin_dir_url( __FILE__ ) . 'js/ajax_callbacks.js',
			array(),
			VEEPDOTAI_PLUGIN_VERSION,
			true
		);
		wp_localize_script(
			VEEPDOTAI_PLUGIN_NAME . '-ajax',
			'MyAjax',
			array(
				'ajaxurl'  => admin_url( 'admin-ajax.php' ),
				'security' => wp_create_nonce( 'my-special-string' ),
			)
		);
		wp_enqueue_script(
			VEEPDOTAI_PLUGIN_NAME . '-voice-recorder',
			plugin_dir_url( __FILE__ ) . 'js/recorder.js',
			array(),
			VEEPDOTAI_PLUGIN_VERSION,
			true
		);

		wp_enqueue_script(
			VEEPDOTAI_PLUGIN_NAME . '-counter',
			plugin_dir_url( __FILE__ ) . 'js/counter.js',
			array(),
			VEEPDOTAI_PLUGIN_VERSION,
			true
		);
	}

	/**
	 * Add the main admin menus
	 *
	 * @since  1.0.0
	 */
	public function main_admin_menu() {
		add_menu_page(
			'Veepdotai Admin',
			'Veepdotai',
			'veepdotai',
			VEEPDOTAI_PLUGIN_MENU_PARENT,
			array( $this, 'main_admin_menu_callback' ),
			plugin_dir_url( __FILE__ ) . 'images/veep.ai-white-bg-icon.png'
		);

		add_submenu_page(
			VEEPDOTAI_PLUGIN_MENU_PARENT,
			__( 'Veepdotai', 'veepdotai' ),
			__( 'Configuration', 'veepdotai' ),
			'veepdotai_configure',
			VEEPDOTAI_PLUGIN_NAME . '-veepdotai-configuration-site',
			array( $this, 'main_admin_submenu_configuration_callback' )
		);

/*
		add_submenu_page(
			VEEPDOTAI_PLUGIN_MENU_PARENT,
			__( 'Veepdotai', 'veepdotai' ),
			__( 'Site', 'veepdotai' ),
			'veepdotai_site',
			VEEPDOTAI_PLUGIN_NAME . '-veepdotai-menu-site',
			array( $this, 'main_admin_submenu_site_callback' )
		);

		add_submenu_page(
			VEEPDOTAI_PLUGIN_MENU_PARENT,
			__( 'Veepdotai', 'veepdotai' ),
			__( 'Editorial Strategy', 'veepdotai' ),
			'veepdotai_edstrat',
			VEEPDOTAI_PLUGIN_NAME . '-veepdotai-menu-editorial-strategy',
			array( $this, 'main_admin_submenu_editorial_strategy_callback' )
		);

		add_submenu_page(
			VEEPDOTAI_PLUGIN_MENU_PARENT,
			__( 'Veepdotai', 'veepdotai' ),
			__( 'Editorial Calendar', 'veepdotai' ),
			'veepdotai_edcal',
			VEEPDOTAI_PLUGIN_NAME . '-veepdotai-menu-editorial-calendar',
			array( $this, 'main_admin_submenu_editorial_calendar_callback' )
		);

		add_submenu_page(
			VEEPDOTAI_PLUGIN_MENU_PARENT,
			__( 'Veepdotai', 'veepdotai' ),
			__( 'Settings', 'veepdotai' ),
			'veepdotai_settings',
			VEEPDOTAI_PLUGIN_NAME . '-veepdotai-menu-settings',
			array( $this, 'main_admin_submenu_settings_callback' )
		);
*/
		remove_submenu_page( VEEPDOTAI_PLUGIN_MENU_PARENT, VEEPDOTAI_PLUGIN_MENU_PARENT );
	}

	/**
	 * Checks parameters are correct from a security point of view
	 *
	 * @since  1.0.0
	 */
	public function security_check( $parameters, $var_name ) {
		return true;
	}

	public function main_admin_menu_callback() {
		include 'partials/main-admin-home.php';
	}

	/**
	 * Render the main admin menu and save data to the db
	 *
	 * @since  1.0.0
	 */
	public function main_admin_submenu_configuration_callback() {
		( new Veepdotai_Admin_Configuration() )->manage_action();
	}

	/**
	 * Render the main admin menu and save data to the db
	 *
	 * @since  1.0.0
	 */
	public function main_admin_submenu_menu_callback() {
		( new Veepdotai_Admin_Menu() )->manage_action();
	}

	/**
	 * Render the main admin site and save data to the db
	 *
	 * @since  1.0.0
	 */
	public function main_admin_submenu_site_callback() {
		//( new Veepdotai_Admin_Site() )->manage_action();
	}

	/**
	 * Render the main admin site and save data to the db
	 *
	 * @since  1.0.0
	 */
	public function main_admin_submenu_editorial_calendar_callback() {
		//( new Veepdotai_Admin_Editorial_Calendar() )->manage_action();
	}

	/**
	 * Render the main admin site and save data to the db
	 *
	 * @since  1.0.0
	 */
	public function main_admin_submenu_editorial_strategy_callback() {
		//( new Veepdotai_Admin_Editorial_Strategy() )->manage_action();
	}

	/**
	 * Render the main admin site and save data to the db
	 *
	 * @since  1.0.0
	 */
	public function main_admin_submenu_settings_callback() {
		( new Veepdotai_Admin_Settings() )->manage_action();
	}

}
