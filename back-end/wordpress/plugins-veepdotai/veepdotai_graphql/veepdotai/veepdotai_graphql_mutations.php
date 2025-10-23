<?php

namespace Veepdotai\Graphql\Mutations;

require_once "veepdotai_graphql_mutations_admin.php";
require_once "veepdotai_graphql_mutations_data.php";
require_once "veepdotai_graphql_mutations_metadata.php";
//require_once "veepdotai_graphql_mutations_deprecated.php";
require_once "veepdotai_graphql_mutations_configuration.php";
require_once "veepdotai_graphql_mutations_schedule.php";
require_once "veepdotai_graphql_mutations_publish.php";
require_once "veepdotai_graphql_mutations_test.php";
require_once "veepdotai_graphql_mutations_usage.php";
require_once "veepdotai_graphql_mutations_upload.php";

add_action( 'init', function() {
    \Veepdotai\Graphql\Mutations\Admin\register();
    \Veepdotai\Graphql\Mutations\Data\register();
    \Veepdotai\Graphql\Mutations\Metadata\register();
    //\Veepdotai\Graphql\Mutations\Deprecated\register();
    \Veepdotai\Graphql\Mutations\Configuration\register();
    \Veepdotai\Graphql\Mutations\Schedule\register();
    \Veepdotai\Graphql\Mutations\Publish\register();
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
}

function log( $msg ) {
	\Veepdotai_Util::log( 'debug', 'GraphQL Mutations: ' . $msg );
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
