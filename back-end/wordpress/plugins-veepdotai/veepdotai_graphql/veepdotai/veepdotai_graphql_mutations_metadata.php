<?php

namespace Veepdotai\Graphql\Mutations\Metadata;

/**
 * @package Veepdotai\Graphql\Mutations\Metadata
 * @version 0.0.1
 * Registers custom graphql operations
 * 
 */

function register() {
	register_save_metadata();
	register_list_metadata();
}

function log( $msg ) {
	\Veepdotai_Util::log( 'debug', 'GraphQL Mutations\Metadata: ' . $msg );
}

/**
 * Save title, metadata and tvfMetadata (tvfMetadata name with value) object
 */
function register_save_metadata() {
	register_graphql_mutation( 'saveMetadata', [

		'description' => __( 'Saves data (name => value)', 'your-textdomain' ),
		'inputFields'         => [
			'contentId' => [
				'type' => 'String',
				'description' => __( 'Object content id', 'your-textdomain' ),
			],
			'title' => [
				'type' => 'String',
				'description' => __( 'Object title', 'your-textdomain' ),
			],
			'metadata' => [
				'type' => 'String',
				'description' => __( 'Object metadata', 'your-textdomain' ),
			],
			'name' => [
				'type' => 'String',
				'description' => __( 'Metadata name to update', 'your-textdomain' ),
			],
			'value' => [
				'type' => 'String',
				'description' => __( 'Metadata value of the provided metadata name to update', 'your-textdomain' ),
			],

		],
	
		'outputFields'        => [
			'result' => [
				'type' => 'String',
				'description' => __( 'Result operation as a json object', 'your-textdomain' ),
			]
		],
	
		'mutateAndGetPayload' => function( $input, $context, $info ) {
			$fn = "saveMetadata";
			$pn = "veepdotai-";
	
			$content_id = sanitize_text_field( $input['contentId'] );
			$title = sanitize_text_field( $input['title'] );
			$metadata = sanitize_text_field( $input['metadata'] );
			$name = sanitize_text_field( $input['name'] );
			$value = sanitize_text_field( $input['value'] );
	
			$user = wp_get_current_user();
			log( "$fn: user: " . print_r( $user, true) . "." );

			$meta_input = [];

			// For example
			// * updateMetadata("tvfUp", "12")
			// * updateMetadata("tvfDown", "4")
			// * updateMetadata("tvfStatus", "draft")
			if ( $name ) $meta_input[$name] = $value;
			if ( $metadata ) $meta_input["tvfMetadata"] = $metadata;
			log( __METHOD__ . ": meta_input: " . print_r( $meta_input, true ) );

			$post_array = [ "ID" => $content_id ];
			if ( $title ) 		$post_array["post_title"] = $title;
			if ( $meta_input ) 	$post_array["meta_input"] = $meta_input;
			log( __METHOD__ . ": post_array: " . print_r( $post_array, true ) );

			$result = wp_update_post( $post_array );
	
			log( "$fn: wp_update_post: content_id: result: $result" );

			$data = [];
			if ( $result ) {
				log( "$fn: result: $result" );
				$data = [
					"user_id" => $user->user_login,
					"content_id" => $result,
					"result" => true,
				];
			} else {
				$data = [
					"user_id" => $user->user_login,
					"content_id" => $result,
					"result" => false,
				];
			}
	
			return [
				'result' => json_encode( $data ),
			];
		}
	] );
}

/**
 * Gets tvfMetadata 
 */
function register_list_metadata() {
	register_graphql_mutation( 'listMetadata', [

		'description' => __( 'Gets data (cid, metadata) => value)', 'your-textdomain' ),

		'inputFields'         => [
			'contentId' => [
				'type' => 'String',
				'description' => __( 'Object contentId', 'your-textdomain' ),
			],
			'metadata' => [
				'type' => 'String',
				'description' => __( 'Object metadata', 'your-textdomain' ),
			],

		],
	
		'outputFields'        => [
			'result' => [
				'type' => 'String',
				'description' => __( 'Result operation as a json object', 'your-textdomain' ),
			]
		],
	
		'mutateAndGetPayload' => function( $input, $context, $info ) {
			$fn = "listMetadata";
			$pn = "veepdotai-";
			$prompt_prefix = "ai-prompt-";
	
			$contentId = sanitize_text_field( $input['contentId'] );
			$metadata = sanitize_text_field( $input['metadata'] );

			$user = wp_get_current_user();
			log( "$fn: user: " . print_r( $user, true) . "." );
	
			$result = get_post_meta( $contentId, "tvfMetadata", true );
			log( "$fn: tvfMetadata: result: $result" );

			$data = [];
			if ( $result ) {
				log( "$fn: result: true" );
				$data = [
					"user_id" => $user->user_login,
					"result" => $result,
				];
			} else {
				$data = [
					"user_id" => $user->user_login,
					"result" => false,
				];
			}
	
			return [
				'result' => json_encode( $data ),
			];
		}
	] );
}
