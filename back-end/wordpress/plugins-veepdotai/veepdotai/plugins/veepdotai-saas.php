<?php

/**
 * The veepdotai saas plugin
 *
 * @link              https://www.veep.ai
 * @since             1.0.0
 * @package           Veepdotai
 *
 * @wordpress-plugin
 * Plugin Name:       Veepdotai_saas
 * Plugin URI:        https://www.veep.ai
 * Description:       Veepdotai is a project to create a complete autonomous virtual presence through voice and AI (ChatGPT).
 * Version:           1.1.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            Jean-Christophe Kermagoret
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       veepdotai
 * Domain Path:       /languages
 */

/*
veepdotai is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
any later version.

veepdotai is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with veepdotai. If not, see {URI to Plugin License}.
*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'VEEPDOTAI_SAAS_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-veepdotai-activator.php
 */

function veepdotai_cat_pages() {
	register_taxonomy_for_object_type('category', 'page');
}
add_action('init', 'veepdotai_cat_pages');


add_action('pre_get_posts', 'veepdotai_query_disable_post_media' );
function veepdotai_query_disable_post_media( $wp_query ) {
	global $current_user;

	if( is_admin() && !current_user_can('edit_others_vcontents') ) {
		$wp_query->set( 'author', $current_user->ID );
		add_filter('views_edit-post', 'veepdotai_show_post_counts');
		add_filter('views_upload', 'veepdotai_show_media_counts');
	}

}

function veepdotai_show_post_counts($views) {
	global $current_user, $wp_query;
	unset($views['mine']);
	$types = array(
	  array( 'status' =>  NULL ),
	  array( 'status' => 'publish' ),
	  array( 'status' => 'draft' ),
	  array( 'status' => 'pending' ),
	  array( 'status' => 'trash' )
	);
   
	foreach( $types as $type ) {
	  $query = array(
//		'author'   => $current_user->ID,
		'post_type'   => 'post',
		'post_status' => $type['status']
	  );
	 
	  $result = new WP_Query($query);
  
	  if( $type['status'] == NULL ):
	   
		$class = ($wp_query->query_vars['post_status'] == NULL) ? ' class="current"' : '';
		$views['all'] = sprintf('<a href="%s"'. $class .'>All <span class="count">(%d)</span></a>',
		  admin_url('edit.php?post_type=post'),
		  $result->found_posts);
  
	  elseif( $type['status'] == 'publish' ):
  
		$class = ($wp_query->query_vars['post_status'] == 'publish') ? ' class="current"' : '';
		$views['publish'] = sprintf('<a href="%s"'. $class .'>Published <span class="count">(%d)</span></a>',
		  admin_url('edit.php?post_status=publish&post_type=post'),
		  $result->found_posts);
  
	  elseif( $type['status'] == 'draft' ):
  
		 $class = ($wp_query->query_vars['post_status'] == 'draft') ? ' class="current"' : '';
		 $views['draft'] = sprintf('<a href="%s"'. $class .'>Draft'. ((sizeof($result->posts) > 1) ? "s" : "") .' <span class="count">(%d)</span></a>',
		   admin_url('edit.php?post_status=draft&post_type=post'),
		   $result->found_posts);
  
	  elseif( $type['status'] == 'pending' ):
  
		  $class = ($wp_query->query_vars['post_status'] == 'pending') ? ' class="current"' : '';
		  $views['pending'] = sprintf('<a href="%s"'. $class .'>Pending <span class="count">(%d)</span></a>',
			admin_url('edit.php?post_status=pending&post_type=post'),
			$result->found_posts);
  
	  elseif( $type['status'] == 'trash' ):
  
		  $class = ($wp_query->query_vars['post_status'] == 'trash') ? ' class="current"' : '';
		  $views['trash'] = sprintf('<a href="%s"'. $class .'>Trash <span class="count">(%d)</span></a>',
			admin_url('edit.php?post_status=trash&post_type=post'),
			$result->found_posts);
  
	  endif;
	}
   
	return $views;
  }

function veepdotai_show_media_counts($views) {
	global $wpdb, $current_user, $post_mime_types, $avail_post_mime_types;
	$views = array();
	$_num_posts = array();
	$count = $wpdb->get_results( "
  
	  SELECT post_mime_type, COUNT( * ) AS num_posts
	  FROM $wpdb->posts
	  WHERE post_type = 'attachment'
	  AND post_author = $current_user->ID
	  AND post_status != 'trash'
	  GROUP BY post_mime_type
  
   ", ARRAY_A );
  
   foreach( $count as $row )
	  $_num_posts[$row['post_mime_type']] = $row['num_posts'];
	  $_total_posts = array_sum($_num_posts);
	  $detached = isset( $_REQUEST['detached'] ) || isset( $_REQUEST['find_detached'] );
  
   if ( !isset( $total_orphans ) )
	  $total_orphans = $wpdb->get_var("
  
		  SELECT COUNT( * )
		  FROM $wpdb->posts
		  WHERE post_type = 'attachment'
		  AND post_author = $current_user->ID
		  AND post_status != 'trash'
		  AND post_parent < 1
  
	  ");
  
	$matches = wp_match_mime_types(array_keys($post_mime_types), array_keys($_num_posts));
   
	foreach ( $matches as $type => $reals )
  
	  foreach ( $reals as $real )
  
		$num_posts[$type] = ( isset( $num_posts[$type] ) ) ? $num_posts[$type] + $_num_posts[$real] : $_num_posts[$real];
		$class = ( empty($_GET['post_mime_type']) && !$detached && !isset($_GET['status']) ) ? ' class="current"' : '';
		$views['all'] = "<a href='upload.php'$class>" . sprintf( __('All <span class="count">(%s)</span>', 'veepdotai' ), number_format_i18n( $_total_posts )) . '</a>';
  
	 foreach ( $post_mime_types as $mime_type => $label ) {
  
	  $class = '';
	  if ( !wp_match_mime_types($mime_type, $avail_post_mime_types) )
		continue;
  
	  if ( !empty($_GET['post_mime_type']) && wp_match_mime_types($mime_type, $_GET['post_mime_type']) )
		$class = ' class="current"';
  
	  if ( !empty( $num_posts[$mime_type] ) )
		$views[$mime_type] = "<a href='upload.php?post_mime_type=$mime_type'$class>" . sprintf( translate_nooped_plural( $label[2], $num_posts[$mime_type] ), $num_posts[$mime_type] ) . '</a>';
  
	}
  
   $views['detached'] = '<a href="upload.php?detached=1"' . ( $detached ? ' class="current"' : '' ) . '>' . sprintf( __( 'Unattached <span class="count">(%s)</span>', 'veepdotai' ), $total_orphans ) . '</a>';
  
   return $views;
  }
  