<?php

if ( ! defined( 'ABSPATH' ) ) exit;

require_once 'class-veepdotai-util.php';

class Veepdotai_Admin_Settings {

	public static function get_perms( $final_perms_array, $perms ) {
		$r = '';
		for ( $i = 0; $i < count( $perms ); $i++ ) {
				$perm = $perms[ $i ];
			if ( preg_match( '/^final/', $perm ) ) {
					$r .= ',' . self::get_perms( $final_perms_array, $final_perms_array[ $perm ] );
			} else {
					$r .= ',' . $perm;
			}
		}
		return $r;
	}

	public static function create_roles_and_caps() {
		Veepdotai_Util::log( 'debug', 'Configuring roles and caps 3.' );

		$default_perms = array(
			'page_perms'             => array(
				'delete_pages'           => true,
				'delete_published_pages' => true,
				'edit_pages'             => true,
				'edit_published_pages'   => true,
				'publish_pages'          => true,
			),
			'post_perms'             => array(
				'delete_posts'           => true,
				'delete_published_posts' => true,
				'edit_posts'             => true,
				'edit_published_posts'   => true,
				'publish_posts'          => true,
			),
			'user_perms'             => array(
				'read'                      => true,
				'veepdotai'                 => true,
				'veepdotai_edcal'           => true,
				'veepdotai_about'           => true,
				'veepdotai_getting_started' => true,
			),
			'advanced_user_perms'    => array(
				'veepdotai_interview' => true,
			),
			'content_marketer_perms' => array(
				'veepdotai_prompt'  => true,
				'veepdotai_edstrat' => true,
				'veepdotai_site'    => true,
			),
			'web_designer_perms'     => array(
				'veepdotai_template' => true,
			),
			'admin_perms'            => array(
				'veepdotai_configure' => true,
				'veepdotai_settings'  => true,
				'veepdotai_admin'     => true,
			),
		);

		// Inherited perms
		$final_perms_array = array(
			'final_user_perms'             => array(
				'user_perms',
				'post_perms',
			),
			'final_advanced_user_perms'    => array(
				'final_user_perms',
				'advanced_user_perms',
			),
			'final_content_marketer_perms' => array(
				'final_advanced_user_perms',
				'page_perms',
				'content_marketer_perms',
			),
			'final_web_designer_perms'     => array(
				'final_content_marketer_perms',
				'web_designer_perms',
			),
			'final_web_marketer_perms'     => array(
				'final_content_marketer_perms',
				'final_web_designer_perms',
			),
			'final_admin_perms'            => array(
				'final_web_marketer_perms',
				'admin_perms',
			),
		);

		$roles = array(
			'user'             => 'Veepdotai User Role',
			'advanced_user'    => 'Veepdotai Advanced User Role',
			'content_marketer' => 'Veepdotai Content Marketer Role',
			'web_designer'     => 'Veepdotai Web Designer Role',
			'web_marketer'     => 'Veepdotai Web Marketer Role',
			'admin'            => 'Veepdotai Admin Role',
		);

		$role_prefix = 'veepdotai_role_';
		foreach ( $roles as $role => $libelle ) {
			Veepdotai_Util::log( 'debug', $libelle );
			$final_role = 'final_' . $role . '_perms';
			$perms      = self::get_perms( $final_perms_array, $final_perms_array[ $final_role ] );
			$perms      = preg_replace( '/^,+/', '', $perms );
			$perms      = preg_replace( '/,+/', ',', $perms );

			$r = array();
			foreach ( explode( ',', $perms ) as $perm ) {
					$r[ $perm ] = true;
			}

			$perms = array();
			foreach ( $r as $perm => $enabled ) {
				$perms = array_merge( $perms, $default_perms[ $perm ] );
			}

			$inherited_role = $role_prefix . $role;
			Veepdotai_Util::log( 'debug', "-->$inherited_role" );
			Veepdotai_Util::log( 'debug', "-->$libelle" );
			Veepdotai_Util::log( 'debug', json_encode( $perms ) );
			add_role(
				$inherited_role,
				$libelle,
				$perms
			);
		}

		// We give super power to the admin user
		// All other users will have the default role given during member creation
		$user = get_user_by( 'ID', 1 );
		if ( $user && 'admin' == $user->user_login ) {
			$username = $user->user_login;

			Veepdotai_Util::log( 'debug', 'Setting roles for: ' . $username . '.' );

			Veepdotai_Util::log( 'debug', 'Setting veep admin role for: ' . $username . '.' );
			$user->add_role( 'veepdotai_role_admin' );

			Veepdotai_Util::log( 'debug', 'Setting veep user role for: ' . $username . '.' );
			$user->add_role( 'veepdotai_role_user' );

			Veepdotai_Util::log( 'debug', 'Setting veep site role for: ' . $username . '.' );
			$user->add_role( 'veepdotai_role_site' );

			Veepdotai_Util::log( 'debug', 'Setting veep blog role for: ' . $username . '.' );
			$user->add_role( 'veepdotai_role_blog' );
		}
	}

	public static function initialize_categories() {
		$site_cat = category_exists( 'site' );
		if ( ! $site_cat ) {
			$cat_defaults = array(
				'cat_ID'               => 0,
				'taxonomy'             => 'category',
				'cat_name'             => 'site',
				'category_description' => 'Web site',
				'category_nicename'    => 'Site',
				'category_parent'      => '0',
			);
			$site_cat     = wp_insert_category( $cat_defaults );
		}

		$blog_cat = category_exists( 'blog' );
		if ( ! $blog_cat ) {
			$cat_defaults = array(
				'cat_ID'               => 0,
				'taxonomy'             => 'category',
				'cat_name'             => 'blog',
				'category_description' => 'Blog articles',
				'category_nicename'    => 'Blog',
				'category_parent'      => '0',
			);
			$blog_cat     = wp_insert_category( $cat_defaults );
		}

		$faq_cat = category_exists( 'faq' );
		if ( ! $faq_cat ) {
			$cat_defaults = array(
				'cat_ID'               => 0,
				'taxonomy'             => 'category',
				'cat_name'             => 'faq',
				'category_description' => 'Frequently Asked Questions',
				'category_nicename'    => 'FAQ',
				'category_parent'      => $site_cat,
			);
			$faq_cat      = wp_insert_category( $cat_defaults );
		}

		$reviews_cat = category_exists( 'reviews' );
		if ( ! $reviews_cat ) {
			$cat_defaults = array(
				'cat_ID'               => 0,
				'taxonomy'             => 'category',
				'cat_name'             => 'reviews',
				'category_description' => 'Customer reviews',
				'category_nicename'    => 'Customers reviews',
				'category_parent'      => $blog_cat,
			);
			$reviews_cat  = wp_insert_category( $cat_defaults );
		}

		$customers_cat = category_exists( 'customers' );
		if ( ! $customers_cat ) {
			$cat_defaults  = array(
				'cat_ID'               => 0,
				'taxonomy'             => 'category',
				'cat_name'             => 'stories',
				'category_description' => 'Customers stories',
				'category_nicename'    => 'Customers stories',
				'category_parent'      => $blog_cat,
			);
			$customers_cat = wp_insert_category( $cat_defaults );
		}
	}

	public static function reset_roles() {
		$prefix = 'veepdotai_role';
		$roles  = array(
			'user'             => 'Veepdotai User Role',
			'advanced_user'    => 'Veepdotai Advanced User Role',
			'content_marketer' => 'Veepdotai Content Marketer Role',
			'web_designer'     => 'Veepdotai Web Designer Role',
			'web_marketer'     => 'Veepdotai Web Marketer Role',
			'admin'            => 'Veepdotai Admin Role',
		);

		foreach ( $roles as $role => $libelle ) {
			echo( esc_html( "Removing role: ${prefix}_${role}\n" ) );
			wp_roles()->remove_role( $prefix . '_' . $role );
		}
	}

	public static function set_current_user( $username ) {
		$user    = get_user_by( 'login', $username );
		$user_id = $user->ID;
		wp_set_current_user( $user_id );

		return;
	}

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
	}

	public function manage_action() {
		$pn = VEEPDOTAI_PLUGIN_NAME;

		include 'partials/veepdotai-form-functions.php';

		if ( isset( $_POST[ $pn . '-ai-settings-reset-roles' ] ) ) {
			self::reset_roles();
		} elseif ( isset( $_POST[ $pn . '-ai-settings-create-roles' ] ) ) {
			self::create_roles_and_caps();
		} elseif ( isset( $_POST[ $pn . '-ai-settings-set-current-user' ] ) ) {
			$username = sanitize_user( $_POST['username'] );
			Veepdotai_Util::log( 'debug', 'Username: ' . $username );
			self::set_current_user( $username );
		}

		// generate the form
		// ob_start();
		include 'partials/main-admin-settings.php';
		// $page_html = ob_get_contents();
		// ob_end_clean();
		// echo $page_html;
	}

}
