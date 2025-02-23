<?php

namespace Veepdotai\Graphql\Mutations\Data;

/**
 * @package Veepdotai\Graphql\Data
 * @version 0.0.1
 * Registers custom graphql operations
 * 
 */

function register() {
	register_save_data();
	register_list_data();
}

function log( $msg ) {
	\Veepdotai_Util::log( 'debug', 'GraphQL Mutations: ' . $msg );
}

/**
 * Save provided option name with new value. If the option old name is provided, it is deleted.
 */
function register_save_data() {
	register_graphql_mutation( 'saveData', [

		'description' => __( 'Saves data (name => value)', 'your-textdomain' ),
		'inputFields'         => [
			'option' => [
				'type' => 'String',
				'description' => __( 'Object name', 'your-textdomain' ),
			],
			'value' => [
				'type' => 'String',
				'description' => __( 'Object value', 'your-textdomain' ),
			],
			'oldName' => [
				'type' => 'String',
				'description' => __( 'Object old name', 'your-textdomain' ),
			],

		],
	
		'outputFields'        => [
			'result' => [
				'type' => 'String',
				'description' => __( 'Result operation as a json object', 'your-textdomain' ),
			]
		],
	
		'mutateAndGetPayload' => function( $input, $context, $info ) {
			$fn = "saveData";
			$pn = "veepdotai-";
			$prompt_prefix = "ai-prompt-";
	
			$param_name = sanitize_text_field( $input['option'] );
			$option_value = sanitize_text_field( $input['value'] );
			$oldName = sanitize_text_field( $input['oldName'] );
			$old_name = $pn . $prompt_prefix . $oldName;         

			log( "$fn: old_name: " . $old_name );
	
			$user = wp_get_current_user();
			log( "$fn: user: " . print_r( $user, true) . "." );
	
			$option_name = $pn . $param_name;
			log( "$fn: Setting option: $option_name = $option_value." );

			$result = \Veepdotai_Util::set_option( $option_name, $option_value );
			log( "$fn: set_option: result: $result" );

			$data = [];
			if ( $result ) {
				log( "$fn: result: true" );
				$data = [
					"user_id" => $user->user_login,
					"result" => true,
				];
			} else {
				$data = [
					"user_id" => $user->user_login,
					"result" => false,
				];
			}
	
			if ( $old_name ) {
				log( "debug", "calling V::delete_option: old_name: " . $old_name );
				\Veepdotai_Util::delete_option( $old_name );
			}

			return [
				'result' => json_encode( $data ),
			];
		}
	] );
}

/**
 * Gets provided option value
 */
function register_list_data() {
	register_graphql_mutation( 'listData', [

		'description' => __( 'Gets data (name => value)', 'your-textdomain' ),
		'inputFields'         => [
			'option' => [
				'type' => 'String',
				'description' => __( 'Object name', 'your-textdomain' ),
			],

		],
	
		'outputFields'        => [
			'result' => [
				'type' => 'String',
				'description' => __( 'Result operation as a json object', 'your-textdomain' ),
			]
		],
	
		'mutateAndGetPayload' => function( $input, $context, $info ) {
			$fn = "listData";
			$pn = "veepdotai-";
			$prompt_prefix = "ai-prompt-";
	
			$param_name = sanitize_text_field( $input['option'] );
			$user = wp_get_current_user();
			log( "$fn: user: " . print_r( $user, true) . "." );
	
			$option_name = $pn . $param_name;
			log( "$fn: Getting option: $option_name." );

			$result = \Veepdotai_Util::get_option( $option_name );
			log( "$fn: get_option: result: $result" );

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
