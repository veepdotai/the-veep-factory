<?php

namespace Veepdotai\Graphql\Mutations;

require_once "veepdotai_graphql_mutations_admin.php";
require_once "veepdotai_graphql_mutations_data.php";
require_once "veepdotai_graphql_mutations_metadata.php";
require_once "veepdotai_graphql_mutations_schedule.php";
require_once "veepdotai_graphql_mutations_test.php";
require_once "veepdotai_graphql_mutations_usage.php";
require_once "veepdotai_graphql_mutations_upload.php";

add_action( 'init', function() {
    \Veepdotai\Graphql\Mutations\Admin\register();
    \Veepdotai\Graphql\Mutations\Data\register();
    \Veepdotai\Graphql\Mutations\Metadata\register();
    \Veepdotai\Graphql\Mutations\Schedule\register();
    \Veepdotai\Graphql\Mutations\Test\register();
    \Veepdotai\Graphql\Mutations\Usage\register();
    \Veepdotai\Graphql\Mutations\Upload\register();
});

/**
 * @package Veepdotai\Graphql
 * @version 0.0.1
 * Registers custom graphql operations
 * 
 */

function register() {
	register_remove_parent_operation();
	register_get_usage_data();

	register_save_data();
	register_list_data();

	register_save_metadata();
	register_list_metadata();
}

function log( $msg ) {
	\Veepdotai_Util::log( 'debug', 'GraphQL Mutations: ' . $msg );
}

/**
  * From provided parentId, removes Vcontent parent and its direct children
  */
function register_remove_parent_operation() {
	register_graphql_mutation( 'deleteVcontentParentAndDirectChildren', [

		'description' => __( 'Removes Vcontent parent and its direct children', 'your-textdomain' ),
		'inputFields'         => [
			'parentId' => [
				'type' => 'String',
				'description' => __( 'Vcontent parent Id', 'your-textdomain' ),
			]
		],
	
		# outputFields expects an array of fields that can be asked for in response to the mutation
		# the resolve function is optional, but can be useful if the mutateAndPayload doesn't return an array
		# with the same key(s) as the outputFields
		'outputFields'        => [
			'ids' => [
				'type' => 'String',
				'description' => __( 'Removed vcontent ids', 'your-textdomain' ),
				'resolve' => function( $payload, $args, $context, $info ) {
							   return isset( $payload['ids'] ) ? implode( ',', $payload[ 'ids' ]) : null;
				}
			]
		],
	
		'mutateAndGetPayload' => function( $input, $context, $info ) {
			$ids = [];
			if ( ! empty( $input['parentId'] ) ) {
				$parent_id = absint( $input['parentId'] );
				$user_id = wp_get_current_user()->ID;
				$ids = remove_vcontent_parent_and_children( $user_id, $parent_id );
			}
			return [
				'ids' => $ids,
			];
		}
	] );
}

function remove_vcontent_parent_and_children( $user_id, $parent_id ) {
	$args = array( 
		'post_type' => 'vcontent',
		'post_status' => 'draft',
		'post_parent' => $parent_id,
		'author' => $user_id
	);
	
	$posts = get_posts( $args );

	$ids = [];
	if ( is_array( $posts ) && count( $posts ) > 0) {
	
		log("debug", "Posts count to remove: {${count($posts)}}. Start removing them." );
		foreach( $posts as $post ) {
			try {
				log( 'debug', 'Removes post with following id: ' . $post->ID );
				wp_delete_post($post->ID, false);	
				array_push( $ids, $post->ID );
			} catch (e) {
				log( 'debug', 'Post with the following id has not been removed: ' . $post->ID);
			}
		}

		try {
			log("debug", "Removes parent with following id: {$parent_id}");
			wp_delete_post($parent_id, false);	
			array_push( $ids, $parent_id );
		} catch (e) {
			log( 'debug', 'Parent post with the following id has not been removed: ' . $parent_id);
		}
		
	}

	return $ids;
}

/**
  * From provided parentId, removes Vcontent parent and its direct children
  *   mutation MyMutation {
  *     getUsageData(input: {}) {
  *       clientMutationId
  *       usage_data
  *     }
  *   }
  *
  */
function register_get_usage_data() {
	register_graphql_mutation( 'getUsageData', [

		'description' => __( 'Gets usage data from the monitoring tool', 'your-textdomain' ),
		'inputFields'         => [],
	
		# outputFields expects an array of fields that can be asked for in response to the mutation
		# the resolve function is optional, but can be useful if the mutateAndPayload doesn't return an array
		# with the same key(s) as the outputFields
		'outputFields'        => [
			'usage_data' => [
				'type' => 'String',
				'description' => __( 'Usage data in csv format as a string', 'your-textdomain' ),
/*
				'resolve' => function( $payload, $args, $context, $info ) {
							   return isset( $payload['ids'] ) ? implode( ',', $payload[ 'ids' ]) : null;
				}
*/
			]
		],
	
		'mutateAndGetPayload' => function( $input, $context, $info ) {
			$usage_data = "";
			$user_id = wp_get_current_user()->ID;
			$data = get_usage_data( $user_id );

			return [
				'usage_data' => $data,
			];
		}
	] );
}

function get_usage_data( $user_id ) {

	$INFLUX_ORG_ID = INFLUX_ORG_ID;
	$INFLUX_TOKEN = INFLUX_TOKEN;
	$USAGE_SERVER = USAGE_SERVER;
	$USAGE_BUCKET_NAME = USAGE_BUCKET_NAME;

	$USAGE_USER_ID = $user_id || USAGE_DEFAULT_USER_ID;

	$url = $USAGE_SERVER . "?orgID=$INFLUX_ORG_ID";
	//$fp = fopen("example_homepage.txt", "w");

	$headers = [
		"Authorization" => "Token $INFLUX_TOKEN",
		"Accept" => "application/csv",
		"Content-type" => "application/vnd.flux"
	];
	$headers = [
		"Authorization: Token $INFLUX_TOKEN",
		"Accept: application/csv",
		"Content-type: application/vnd.flux"
	];
	$post_fields = <<<_EOM_
from(bucket: "${USAGE_BUCKET_NAME}")
|> range(start: 2024-01-01T00:00:00Z, stop: 2024-07-31T00:00:00Z)
|> filter(fn: (r) => r["_measurement"] == "usage")
|> filter(fn: (r) => r["_field"] == "completion_tokens" or r["_field"] == "prompt_tokens" or r["_field"] == "total_tokens")
|> filter(fn: (r) => r["user_email"] == "$USAGE_USER_ID")
|> yield(name: "last")
_EOM_;

	$curl_info = [
		CURLOPT_URL            => $url,
		CURLOPT_RETURNTRANSFER => true,
//		CURLOPT_ENCODING       => '',
		CURLOPT_MAXREDIRS      => 10,
		CURLOPT_FOLLOWLOCATION => true,
		CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
		CURLOPT_POST  			=> 1,
		CURLOPT_POSTFIELDS     => $post_fields,
		CURLOPT_HTTPHEADER     => $headers,
	];

	//log( "get_usage_data - curl_info: " . print_r( $curl_info, true) );

	$curl = curl_init();
	curl_setopt_array($curl, $curl_info);
	$response = curl_exec($curl);

	log( "get_usage_data - errno_response: " . print_r( curl_errno( $curl ), true) );
	if( curl_errno( $curl ) ) {
		//$info = curl_getinfo( $curl );
		return curl_error( $curl );
	}

	if ( str_starts_with( $response, "," ) ) {
		$response = preg_replace("/^,/", "", $response);
		$response = preg_replace("/\n,/", "\n", $response);
		$response = preg_replace("/(\r\n)*$/", "", $response);
	}

	//log( "getUsageData - response: " . print_r( $response, true) );	
	curl_close($curl);

	return $response;
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

/**
 * 
 */
function schedule_posts() {
	register_graphql_mutation( 'schedulePosts', [

		'description' => __( 'Schedules posts', 'your-textdomain' ),

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
			log( "$fn: metadata: result: $result" );

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
