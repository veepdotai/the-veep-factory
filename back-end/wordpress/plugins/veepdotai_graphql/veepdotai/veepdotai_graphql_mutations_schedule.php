<?php

namespace Veepdotai\Graphql\Mutations\Schedule;

/**
 * @package Veepdotai\Graphql\Mutations\Schedule
 * @version 0.0.1
 * Registers custom graphql operations
 * 
 */

function register() {
	register_schedule_posts();
}

function log( $msg ) {
	\Veepdotai_Util::log( 'debug', 'GraphQL Mutations\Schedule: ' . $msg );
}

/**
 * 
 */
function register_schedule_posts() {
	register_graphql_mutation(
		'schedulePosts', [
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
		]
	);
}
