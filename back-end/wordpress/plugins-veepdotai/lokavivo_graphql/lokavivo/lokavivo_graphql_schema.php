<?php

namespace Lokavivo\Graphql\Schema;

//define( "MAXITEMS_TO_REGISTER_IN_GRAPHQL", 50 ); // 100?

add_action( 'init', function() {
	\Lokavivo\Graphql\Schema\register();
});

function log( $msg ) {
	\Veepdotai_Util::log( 'debug', 'Lokavivo GraphQL Schema: ' . $msg );
}

function register() {
	register_Lcontent();
	register_UserEventFields( "Lcontent" );
	register_GeoFields( "Lcontent" );
	register_Taxonomies();
}

function register_Lcontent() {
	$user_wp = wp_get_current_user();

	$parameters = [
		'map_meta_cap' => true,
		'labels' => [
			'menu_name' => __( 'Lokavivo Content', 'your-textdomain' ),
		],
		'hierarchical' => true,
		'public' => false,
		'publicly_queryable' => false,
		'show_in_rest' => true,
		'rest_base' => 'lcontents',
		'rest_controller_class' => 'WP_REST_Posts_Controller',
		'show_in_graphql' => true,
		'graphql_single_name' => 'lcontent',
		'graphql_plural_name' => 'lcontents',
		'supports' => array( "title", "editor", "author"), // NodeWithTitle, NodeWithContentEditor, NodeWithAuthor
		'graphql_interfaces' => ['Icontent'],
		'exclude_from_search' => false,
		'taxonomies'  => [ 'category', 'documentTag', 'post_tag' ],
		'resolveType' => function( $node ) {
			return get_post_type_object( $node->post_type )->graphql_single_name ?: 'Lcontent';
		}
	];
	if( $user_wp->ID == 1
			|| in_array( 'veepdotai_role_admin', (array) $user_wp->roles ) ) {
		$parameters[ 'show_ui' ] = true;
		$parameters[ 'capability_type' ] = 'lcontent';
		/*
		$parameters[ 'capabilities' ] = [
			'publish_posts' => 'publish_vcontents',
			'edit_posts' => 'edit_vcontents',
			'edit_others_posts' => 'edit_others_vcontents',
			'delete_posts' => 'delete_vcontents',
			'delete_others_posts' => 'delete_others_vcontents',
			'read_private_posts' => 'read_private_vcontents',
			'edit_post' => 'edit_vcontent',
			'delete_post' => 'delete_vcontent',
			'read_post' => 'read_vcontent',
		];
		*/

	} else {
		$parameters[ 'show_ui' ] = true;
		$parameters[ 'capability_type' ] = 'lcontent';
/*
		$parameters[ 'capabilities' ] = [
			'publish_posts' => 'publish_vcontents',
			'edit_posts' => 'edit_vcontents',
			'edit_others_posts' => 'edit_others_vcontents',
			'delete_posts' => 'delete_vcontents',
			'delete_others_posts' => 'delete_others_vcontents',
			'read_private_posts' => 'read_private_vcontents',
			'edit_post' => 'edit_vcontent',
			'delete_post' => 'delete_vcontent',
			'read_post' => 'read_vcontent',
		];
*/
	}

	register_post_type( 'lcontent', $parameters );
}

function register_Taxonomies() {
	register_taxonomy( 'doc_tag', 'lcontents', [
		'labels'  => [
		  'menu_name' => __( 'Document Tags', 'your-textdomain' ), //@see https://developer.wordpress.org/themes/functionality/internationalization/
		],
		'show_in_graphql' => true,
		'hierarchical' => true,
		'graphql_single_name' => 'documentTag',
		'graphql_plural_name' => 'documentTags',
	]);

}

function register_GeoFields($baseType) {
	register_graphql_field( $baseType, 'tvfLatitude', [ 'type' => 'String',
		'resolve' => function( $post, $args, $context, $info ) {
			$value = get_post_meta( $post->ID, "tvfLatitude", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'tvfLongitude', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfLongitude", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'tvfAltitude', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfAltitude", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
}

function register_UserEventFields($baseType) {

	register_graphql_field( $baseType, 'tvfLikes', [ 'type' => 'Integer',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfLikes", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'tvfClaps', [ 'type' => 'Integer',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfClaps", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'tvfUps', [ 'type' => 'Integer',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfUps", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'tvfDowns', [ 'type' => 'Integer',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfDowns", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'tvfSupports', [ 'type' => 'Integer',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfSupports", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'tvfTopIdeas', [ 'type' => 'Integer',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfTopIdeas", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'tvfFuns', [ 'type' => 'Integer',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfFuns", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'tvfComments', [ 'type' => 'Integer',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfComments", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'tvfRepublications', [ 'type' => 'Integer',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfRepublications", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'tvfShares', [ 'type' => 'Integer',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfShares", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

}

