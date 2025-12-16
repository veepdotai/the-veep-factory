<?php

namespace Veepdotai\Graphql\Mutations\Configuration;

//use Veepdotai_Util;

/**
 * @package Veepdotai\Graphql\Mutations\Configuration
 * @version 0.0.1
 * Registers custom graphql operations
 * 
 */

function register() {
	register_create_configuration();
	register_list_configuration();
	register_delete_configuration();
}

function log( $msg ) {
	\Veepdotai_Util::log( 'debug', 'GraphQL Mutations\Configuration: ' . $msg );
}

function register_create_configuration() {

	/**
	 * createConfiguration create options from the provided parameters
	 * 
	 * 
	 */
	register_graphql_mutation( 'createConfiguration', [

		'description' => __( 'Configuration create mutation', 'your-textdomain' ),
		'inputFields'         => [
			'type' => [
				'type' => 'String',
				'description' => __( 'Object type', 'your-textdomain' ),
			],
			'id' => [
				'type' => 'String',
				'description' => __( 'Object id', 'your-textdomain' ),
			],
			'name' => [
				'type' => 'String',
				'description' => __( 'Object name', 'your-textdomain' ),
			],
			'value' => [
				'type' => 'String',
				'description' => __( 'Object value', 'your-textdomain' ),
			],
			'status' => [
				'type' => 'String',
				'description' => __( 'Object status', 'your-textdomain' ),
			],
		],
	
		'outputFields'        => [
			'result' => [
				'type' => 'String',
				'description' => __( 'Configuration object', 'your-textdomain' ),
			]
		],
	
		'mutateAndGetPayload' => function( $input, $context, $info ) {
			$prefix = "createConfiguration";

			$data = [
				"type" => \Veepdotai_Util::check_and_get( $input, "type" ),
				"id" => \Veepdotai_Util::check_and_get( $input, "id" ),
				"name" => \Veepdotai_Util::check_and_get( $input, "name" ),
				"value" => \Veepdotai_Util::check_and_get( $input, "value" ),
				"status" => \Veepdotai_Util::check_and_get( $input, "status" )
			];

			log( $prefix . ': data: ' . print_r( $data, true ) );
			//Veepdotai_Util::set_option( 'veepdotai-' . $data["type"] . '-' . $data["id"], $data["value"] );
			$result = [
				'status' => 'success',
				'msg' => __( 'Configuration created successfully', 'your-textdomain' ),
				//'items' => json_encode( $data ),
				'items' => $data,
			];

			log( $prefix . ": result: " . print_r( $result, true ) );
			return [ 'result' => json_encode( $result ) ]; 
		}
	] );
}

/**
 * List information about the person provided as personId
 */
function register_list_configuration() {

	register_graphql_mutation( 'listConfiguration', [

		'description' => __( 'List Configuration mutation', 'your-textdomain' ),
		'inputFields'         => [
			'type' => [
				'type' => 'String',
				'description' => __( 'Object type', 'your-textdomain' ),
			],
			'id' => [
				'type' => 'String',
				'description' => __( 'Object id', 'your-textdomain' ),
			],
			'name' => [
				'type' => 'String',
				'description' => __( 'Object name', 'your-textdomain' ),
			],
			'personId' => [
				'type' => 'String',
				'description' => __( 'Person id', 'your-textdomain' ),
			],
			'status' => [
				'type' => 'String',
				'description' => __( 'Object status', 'your-textdomain' ),
			],
		],
	
		'outputFields'        => [
			'result' => [
				'type' => 'String',
				'description' => __( 'Configuration objects array', 'your-textdomain' ),
			]
		],
	
		'mutateAndGetPayload' => function( $input, $context, $info ) {
			$prefix = "listConfiguration";

			$data = [
				/*"type" => isset( $input["type"] ) ? sanitize_text_field( $input["type"] ) : null,*/
				"type" => \Veepdotai_Util::check_and_get( $input, "type" ),
				"id" => \Veepdotai_Util::check_and_get( $input, "id" ),
				"name" => \Veepdotai_Util::check_and_get( $input, "name" ),
				"person_id" => \Veepdotai_Util::check_and_get( $input, "personId" ),
				"status" => \Veepdotai_Util::check_and_get( $input, "status" )
			];

			log( $prefix . ': data: ' . print_r( $data, true ) );
			//Veepdotai_Util::set_option( 'veepdotai-' . $data["type"] . '-' . $data["id"], $data["value"] );

	        global $wpdb;

			/**
			 * Be careful: we do that because these informations are public by default but
			 * it may be necessary to make them more confidential
			 */
			$person_id = $data["person_id"];
			$user_login = $person_id != "" ? $person_id : wp_get_current_user()->user_login;

			$type = $data['type'];
			$id = $data['id'];
			$my_option_name = "{$user_login}-veepdotai-form-{$type}";
			if ( $id && "" !== $id ) {
				$my_option_name = $my_option_name . "-{$id}";
				$vars = [
					$wpdb->esc_like( $my_option_name )
				];
			} else {
				$vars = [
					$wpdb->esc_like( $my_option_name ) . '%'
				];
			}
			log( $prefix . ": my_option_name: " . $my_option_name );

			$sql = $wpdb->prepare(
				"SELECT option_name, option_value "
				. "FROM $wpdb->options "
				. "WHERE option_name LIKE %s;",
				$vars
			);
			$options = $wpdb->get_results( $sql );
			log( $prefix . ": options: " . print_r( $options, true ) );

			$convertFn = function( $item ) {
				$prefix = "listConfiguration::convertFn";
				$name = $item->option_name;
				preg_match( '/-([a-zA-Z0-9]*)(-?([a-zA-Z0-9]*))?$/', $name, $matches );
				if ( $matches && count( $matches ) >= 2 ) {
					$object_id = null;
					if (count( $matches ) === 4 ) {
						$object_id = $matches[3];
					}
					$result = [
						'type' => $matches[1],
						'objectId' => $object_id,
						'value' => $item->option_value,
					];
					log( $prefix . ": convertFn: result: " . print_r( $result, true ) );
					return $result;
				} else {
					log( $prefix . ": convertFn: no match based on options and regex:: " . print_r( $name, true ) );
					return [];
				}
			};
			$resultsFn = array_map( $convertFn, $options );
			log( $prefix . ": resultsFn: " . print_r( $resultsFn, true ) );
			$result = [
				'status' => 'success',
				'msg' => __( 'Configuration selected successfully', 'your-textdomain' ),
				'original' => $options,
				'items' => $resultsFn,
			];

			log( $prefix . ": final result: " . print_r( $result, true ) );
			return [ 'result' => json_encode ( $result ) ]; 
		}
	] );
}

function register_delete_configuration() {

	register_graphql_mutation( 'deleteConfiguration', [

		'description' => __( 'Delete Configuration mutation', 'your-textdomain' ),
		'inputFields'         => [
			'type' => [
				'type' => 'String',
				'description' => __( 'Type name', 'your-textdomain' ),
			],
			'id' => [
				'type' => 'String',
				'description' => __( 'Object id', 'your-textdomain' ),
			],
		],
	
		'outputFields'        => [
			'result' => [
				'type' => 'String',
				'description' => __( 'Boolean', 'your-textdomain' ),
			]
		],
	
		'mutateAndGetPayload' => function( $input, $context, $info ) {
			$prefix = "deleteConfiguration";

			$data = [
				"type" => \Veepdotai_Util::check_and_get( $input, "type" ),
				"id" => \Veepdotai_Util::check_and_get( $input, "id" ),
			];

			log( $prefix . ': data: ' . print_r( $data, true ) );
			$ret = [
				"result" => \Veepdotai_Util::delete_option( 'veepdotai-form-' . $data["type"] . '-' . $data["id"] )
			];

			$result = [
				'status' => 'success',
				'msg' => __( 'Configuration deleted successfully', 'your-textdomain' ),
				'items' => $ret,
			];

			log("result: " . print_r( $result, true ) );
			return [ 'result' => json_encode( $result ) ]; 
		}
	] );

}

