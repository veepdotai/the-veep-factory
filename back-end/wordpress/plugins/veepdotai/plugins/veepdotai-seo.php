<?php

/**
 * The veepdotai seo plugin
 *
 * Adds meta fields to enter, store then use basic and fundamental seo informations.
 *
 * @link              https://www.veep.ai
 * @since             1.0.0
 * @package           Veepdotai
 *
 * @wordpress-plugin
 * Plugin Name:       Veepdotai_seo
 * Plugin URI:        https://www.veep.ai
 * Description:       Veepdotai is a project to create a complete autonomous virtual presence through voice and AI (ChatGPT).
 * Version:           1.0.0
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
define( 'VEEPDOTAI_SEO_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-veepdotai-activator.php
 */

function veepdotai_meta_tags_meta_boxes() {
	add_meta_box( 'veepdotai_meta_tags_meta_boxes', 'Référencement naturel', 'veepdotai_meta_tags_meta_boxes_callback', array( 'post', 'page' ), 'side' );
}
add_action( 'add_meta_boxes', 'veepdotai_meta_tags_meta_boxes' );

function veepdotai_meta_tags_meta_boxes_callback( $post ) {
	$veepdotai_meta_tag_title       = get_post_meta( $post->ID, 'veepdotai_meta_tag_title', true );
	$veepdotai_meta_tag_description = get_post_meta( $post->ID, 'veepdotai_meta_tag_description', true );
	$veepdotai_meta_tag_main_query  = get_post_meta( $post->ID, 'veepdotai_meta_tag_main_query', true );
	$veepdotai_meta_tag_keywords    = get_post_meta( $post->ID, 'veepdotai_meta_tag_keywords', true );
	?>

<fieldset>
	<label for="veepdotai-meta-tag-title">Balise "title"</label></th>
	<input id="veepdotai-meta-tag-title" class="regular-text" type="text" name="veepdotai_meta_tag_title" placeholder="Entrez votre balise title" value="<?php esc_attr( $veepdotai_meta_tag_title ); ?>" />
</fieldset>

<fieldset>
	<label for="veepdotai-meta-tag-description">Balise "description"</label>
	<textarea id="veepdotai-meta-tag-description" class="large-text" rows="6" type="text" name="veepdotai_meta_tag_description" placeholder="Entrez votre balise description"><?php esc_textarea( $veepdotai_meta_tag_description ); ?></textarea>
</fieldset>

<fieldset>
	<label for="veepdotai-meta-tag-description">Balise "main_query"</label></th>
	<input id="veepdotai-meta-tag-description" class="large-text" rows="6" type="text" name="veepdotai_meta_tag_description" placeholder="Entrez la requête principale de cette page" value="<?php esc_attr( $veepdotai_meta_tag_main_query ); ?>" />
</fieldset>

<fieldset>
	<label for="veepdotai-meta-tag-description">Balise "keywords"</label>
	<input id="veepdotai-meta-tag-keywords" class="large-text" rows="6" type="text" name="veepdotai_meta_tag_description" placeholder="Entrez les mots-clés de cette page" value="<?php esc_attr( $veepdotai_meta_tag_keywords ); ?>" />
</fieldset>

	<?php
}

function veepdotai_meta_tags_save_postdata( $post_id ) {

	if ( isset( $_POST['veepdotai_meta_tag_title'] ) ) {
		update_post_meta(
			$post_id,
			'veepdotai_meta_tag_title',
			sanitize_text_field( $_POST['veepdotai_meta_tag_title'] )
		);
	}

	if ( isset( $_POST['veepdotai_meta_tag_description'] ) ) {
		update_post_meta(
			$post_id,
			'veepdotai_meta_tag_description',
			sanitize_textarea_field( $_POST['veepdotai_meta_tag_description'] )
		);
	}

	if ( isset( $_POST['veepdotai_meta_tag_main_query'] ) ) {
		update_post_meta(
			$post_id,
			'veepdotai_meta_tag_main_query',
			sanitize_text_field( $_POST['veepdotai_meta_tag_main_query'] )
		);
	}

	if ( isset( $_POST['veepdotai_meta_tag_keywords'] ) ) {
		update_post_meta(
			$post_id,
			'veepdotai_meta_tag_keywords',
			sanitize_text_field( $_POST['veepdotai_meta_tag_keywords'] )
		);
	}
}
add_action( 'save_post', 'veepdotai_meta_tags_save_postdata' );

function veepdotai_wp_title_filter() {
	if ( is_singular() ) {
		$post       = get_queried_object();
		$post_title = get_post_meta( $post->ID, 'veepdotai_meta_tag_title', true );
		return $post_title;
	}
}
add_filter( 'wp_title', 'veepdotai_wp_title_filter', 20, 2 );

function veepdotai_meta_description_action() {
	if ( is_singular() ) {
		$post                  = get_queried_object();
		$post_meta_description = get_post_meta( $post->ID, 'veepdotai_meta_tag_description', true );
		echo '<meta name="description" content="' . esc_attr( $post_meta_description ) . '">';
	}
}
add_action( 'wp_head', 'veepdotai_meta_description_action', 1 );
