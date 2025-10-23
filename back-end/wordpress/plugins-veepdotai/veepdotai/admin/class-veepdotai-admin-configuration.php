<?php

if ( ! defined( 'ABSPATH' ) ) exit;

class Veepdotai_Admin_Configuration {

    public static function sanitize_params( $_post = null)
    {
        if(! $_post) { $_post = $_POST; }

		$pn = VEEPDOTAI_PLUGIN_NAME;
        $post = array();
		if ( count( $_post ) > 0 ) {
			$post = array(
				$pn . '-openai-api-key' => sanitize_text_field( $_POST[ $pn . '-openai-api-key' ] ),
				$pn . '-mistral-api-key' => sanitize_text_field( $_POST[ $pn . '-mistral-api-key' ] ),
				$pn . '-pexels-api-key' => sanitize_text_field( $_POST[ $pn . '-pexels-api-key' ] ),
				$pn . '-unsplash-api-key' => sanitize_text_field( $_POST[ $pn . '-unsplash-api-key' ] ),
				$pn . '-default-username' => sanitize_text_field( $_POST[ $pn . '-default-username' ] ),

				$pn . '-ffmpeg' => sanitize_text_field( $_POST[ $pn . '-ffmpeg' ] ),

				$pn . '-ai-save' => '',
				$pn . '-ai-next' => '',
			);

			//var_dump( $this->post );
		} else {
			//var_dump( count( $_POST ) );
		}

		return $post;
	}

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $post;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		$this->post = self::sanitize_params();
	}

	/**
	 * Checks parameters are correct from a security point of view
	 *
	 * @since  1.0.0
	 */
	public function security_check( $parameters, $var_name ) {
		return true;
	}

	public function manage_action() {

		include 'partials/veepdotai-form-configuration-functions.php';

		$self = $this;
		$pn   = VEEPDOTAI_PLUGIN_NAME;
		$vp   = $this->post;

		if ( $this->security_check( $vp, $pn . '-veepdotai-configuration-site' ) ) {
			if ( isset( $vp[ $pn . '-ai-save' ] ) ) {
				$self->save_configuration();
			} elseif ( isset( $vp[ $pn . '-ai-next' ] ) ) {
				Veepdotai_Util::go_to_url( 'interview' );
			}
		}

		// generate the form
		// ob_start();
		include 'partials/main-admin-configuration.php';
		// $page_html = ob_get_contents();
		// ob_end_clean();
		// echo $page_html;	

	}

	/**
	 *
	 */
	public function save_configuration() {
		$pn = VEEPDOTAI_PLUGIN_NAME;
		$vp = $this->post;

		Veepdotai_Util::update_option( 'openai-api-key', $vp[ $pn . '-openai-api-key' ] );
		Veepdotai_Util::update_option( 'mistral-api-key', $vp[ $pn . '-mistral-api-key' ] );
		Veepdotai_Util::update_option( 'pexels-api-key', $vp[ $pn . '-pexels-api-key' ] );
		Veepdotai_Util::update_option( 'unsplash-api-key', $vp[ $pn . '-unsplash-api-key' ] );
		Veepdotai_Util::update_option( 'default-username', $vp[ $pn . '-default-username' ] );
		Veepdotai_Util::update_option( 'ffmpeg', $vp[ $pn . '-ffmpeg' ] );
	}

}
