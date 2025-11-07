<?php

namespace Veepdotai\Graphql\Mutations\Data;

//use Veepdotai_Util;

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
	\Veepdotai_Util::log( 'debug', 'GraphQL Mutations: Data: ' . $msg );
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
			'cardinality' => [
				'type' => 'String',
				'description' => __( 'Object cardinality', 'your-textdomain' ),
			],
			'objectId' => [
				'type' => 'String',
				'description' => __( 'Object id', 'your-textdomain' ),
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
	
			$cardinality = \Veepdotai_Util::check_and_get( $input, "cardinality" );
			$param_name = \Veepdotai_Util::check_and_get( $input, "option" );
			$option_value = \Veepdotai_Util::check_and_get( $input, "value" );
			$object_id = \Veepdotai_Util::check_and_get( $input, "objectId", null );
			$oldName = \Veepdotai_Util::check_and_get( $input, "cardinality", null );
			$old_name = $pn . $prompt_prefix . $oldName;

			log( "$fn: old_name: " . $old_name );
	
			$user = wp_get_current_user()->ID;
			log( "$fn: user: " . print_r( $user, true) . "." );
	
			/**
			 * If cardinality is single then option nanme hasn't any suffixes like option-name
			 * If mcardinality isn't single, then option name has a suffix like option-name-1, option-name-2, etc.
			 */
			$suffix = $object_id;
			if (empty( $suffix ) && "single" !== $cardinality ) {
				// if no id is provided, we must create one from date in ms
				$suffix = \Veepdotai_Util::date_create(null)->format('YmdHisv');
			}
			log( "$fn: suffix: " . $suffix );

			$option_name = $pn . $param_name . "-" . $suffix;
			log( "$fn: Setting option: option_name: $option_name => option_value: $option_value." );

			$result = \Veepdotai_Util::set_option( $option_name, $option_value );
			log( "$fn: set_option: result: $result" );

			/* Manage cardinality */
			global $wpdb;

			//$my_option_name = "jckermagoret-veepdotai-form-Upload";
			//$my_option_name = "jckermagoret$user-veepdotai-form-Upload";
			$my_option_name = "$user-$option_name";
			log( "$fn: listing content after creation: my_option_name: $my_option_name" );

			$vars = [
				$wpdb->esc_like( $my_option_name ) . '%'
			];
			$sql = $wpdb->prepare("SELECT option_name, option_value FROM $wpdb->options WHERE option_name LIKE %s;", $vars);
			$options = $wpdb->get_results( $sql );
			log("options: " . print_r( $options, true ) );

			/*
			$convertFn = function( $item ) {
				$name = $item->option_name;
				preg_match( '/-([a-zA-Z]*)-([0-9]*)$/', $name, $matches );
				if ( $matches && count( $matches ) === 3 ) {
					return [
						'type' => $matches[1],
						'objectId' => $matches[2],
						'value' => $item->option_value,
					];
				}
			};
			$results = array_map( $convertFn, $options );
			log("results: " . print_r( $results, true ) );
			*/

			$result = [
				'status' => 'success',
				'msg' => __( 'Configuration selected successfully', 'your-textdomain' ),
				'items' => $options,
			];

			$data = [];
			if ( $result ) {
				log( "$fn: result: true" );
				$data = [
					"user_id" => $user,
					"result" => true,
				];
			} else {
				$data = [
					"user_id" => $user,
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
 * If cardinality is multiple and option-name returns no result then
 * it's maybe old system and we should try to get option-name-1, option-name-2, etc.
 * 
 * If we get no result, we return false else if we get 1 result we return it as a json object
 * If we get multiple results, we return them as a json object with keys as option names
 */
function register_list_data() {
	register_graphql_mutation( 'listData', [

		'description' => __( 'Gets data (name => value)', 'your-textdomain' ),
		'inputFields'         => [
			'option' => [
				'type' => 'String',
				'description' => __( 'Object name', 'your-textdomain' ),
			],
			'cardinality' => [
				'type' => 'String',
				'description' => __( 'Object cardinality', 'your-textdomain' ),
			],
			'objectId' => [
				'type' => 'String',
				'description' => __( 'Object id', 'your-textdomain' ),
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
	
			$param_name = \Veepdotai_Util::check_and_get( $input, "option" );
			$object_id = \Veepdotai_Util::check_and_get( $input, "objectId" );
			$cardinality = \Veepdotai_Util::check_and_get( $input, "cardinality" );

			$user = wp_get_current_user();
			log( "$fn: user: " . print_r( $user, true) . "." );
	
			$option_name = $pn . $param_name . ($object_id ? '-' . $object_id : '');
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
