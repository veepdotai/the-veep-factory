<?php

/**
 * The veepdotai metadata plugin
 *
 * Adds meta fields to enter, store then use basic and veepdotai metadata informations.
 *
 * @link              https://www.veep.ai
 * @since             1.0.0
 * @package           Veepdotai
 *
 * @wordpress-plugin
 * Plugin Name:       Veepdotai_metadata
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
define( 'VEEPDOTAI_METADATA_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-veepdotai-activator.php
 */

function veepdotai_metadata_meta_boxes() {
	add_meta_box( 'veepdotai_metadata_meta_boxes', 'Veepdotai Metadata', 'veepdotai_metadata_meta_boxes_callback', array( 'post', 'page' ), 'side' );
}
add_action( 'add_meta_boxes', 'veepdotai_metadata_meta_boxes' );

function veepdotai_metadata_meta_boxes_callback( $post ) {
	$veepdotai_metadata_transcription = get_post_meta( $post->ID, 'veepdotai_metadata_transcription', true );
	$veepdotai_metadata_prompt        = get_post_meta( $post->ID, 'veepdotai_metadata_prompt', true );
	$veepdotai_metadata_content       = get_post_meta( $post->ID, 'veepdotai_metadata_content', true );
	$veepdotai_metadata_linkedin      = get_post_meta( $post->ID, 'veepdotai_metadata_linkedin', true );

	?>

<fieldset>
	<label for="veepdotai-metadata-transcription">Transcription</label></th>
	<textarea id="veepdotai-metadata-transcription" class="large-text" rows="6" type="text" name="veepdotai_metadata_transcription" placeholder="Transcription"><?php esc_textarea( $veepdotai_metadata_transcription ); ?></textarea>
</fieldset>

<fieldset>
	<label for="veepdotai-metadata-prompt">Prompt</label></th>
	<textarea id="veepdotai-metadata-prompt" class="large-text" rows="6" type="text" name="veepdotai_metadata_prompt" placeholder="Prompt"><?php esc_textarea( $veepdotai_metadata_prompt ); ?></textarea>
</fieldset>

<fieldset>
	<label for="veepdotai-metadata-content">Content</label></th>
	<textarea id="veepdotai-metadata-content" class="large-text" rows="6" type="text" name="veepdotai_metadata_content" placeholder="Content"><?php esc_textarea( $veepdotai_metadata_content ); ?></textarea>
</fieldset>

<fieldset>
	<label for="veepdotai-metadata-linkedin">Linkedin</label></th>
	<textarea id="veepdotai-metadata-linkedin" class="large-text" rows="6" type="text" name="veepdotai_metadata_linkedin" placeholder="Linkedin"><?php esc_textarea( $veepdotai_metadata_linkedin ); ?></textarea>
</fieldset>

	<?php
}

function veepdotai_metadata_save_postdata( $post_id ) {
	$fields_suffix = array( 'transcription', 'prompt', 'content', 'linkedin' );
	$field_prefix  = 'veepdotai_metadata_';
	foreach ( $fields_suffix as $field_suffix ) {
		$field = $field_prefix . $field_suffix;
		if ( isset( $_POST[ $field ] ) ) {
			update_post_meta( $post_id, $field, sanitize_textarea_field( $_POST[ $field ] ) );
		}
	}
}
add_action( 'save_post', 'veepdotai_metadata_save_postdata' );

/*
function veepdotai_wp_title_filter(){
	if(is_singular()){
		$post = get_queried_object();
		$post_title = get_post_meta($post->ID, 'veepdotai_meta_tag_title', true);
		return $post_title;
	}
}
add_filter('wp_title', 'veepdotai_wp_title_filter', 20, 2);

function veepdotai_meta_description_action(){
	if(is_singular()){
		$post = get_queried_object();
		$post_meta_description = get_post_meta($post->ID, 'veepdotai_meta_tag_description', true);
		echo '<meta name="description" content="' . esc_attr( $post_meta_description ) . '">';
	}
}
add_action('wp_head', 'veepdotai_meta_description_action', 1);
*/
