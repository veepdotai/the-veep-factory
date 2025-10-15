<?php

namespace Veepdotai\Graphql\Mutations\Admin;

/**
 * @package Veepdotai\Graphql\Mutations\Admin
 * @version 0.0.1
 * Registers custom graphql operations to manage repository
 * 
 */

function register() {
	register_remove_parent_operation();
}

function log( $msg ) {
	\Veepdotai_Util::log( 'debug', 'GraphQL Mutations\Admin: ' . $msg );
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
