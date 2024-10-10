<?php

namespace Veepdotai\Graphql\Mutations;

//require '../veepdotai/admin/class-veepdotai-util.php';

/**
 * @package Veepdotai\Graphql
 * @version 0.0.1
 * Registers custom graphql operations
 * 
 */

function register() {
	register_remove_parent_operation();
	register_get_usage_data();
}

function log( $msg ) {
	\Veepdotai_Util::log( 'debug', $msg );
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