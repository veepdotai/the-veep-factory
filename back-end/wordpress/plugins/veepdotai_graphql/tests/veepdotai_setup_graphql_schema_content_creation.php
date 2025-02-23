<?php

namespace schema_content_creation;

/*add_action( 'init', function() {
	register_veepdotai_enumType();
});*/

function register_schema() {
	register_types();
}

function register_types() {
	register_Icontent();
	register_Vcontent();
	register_AIResponse();
	register_TranscribedContent();
	register_GeneratedContent();
	register_MergedContent();
}

function register_Icontent() {
	register_graphql_interface_type( 'Icontent', [
		'description' => __( 'Basic Veep Interface', 'your-textdomain' ),
		'interfaces' => [ 'NodeWithContentEditor', 'ContentNode', 'NodeWithExcerpt', 'NodeWithRevisions'],
		'fields' => [
			'source' => [
				'type' => 'String',
				'description' => __( 'Source of the content', 'your-textdomain' ),
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "source", true );
					return ! empty( $value ) ? $value : '';
				}
			],
			'favorite' => [
				'type' => 'Boolean',
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "favorite", true );
					return ! empty( $value ) ? $value : '';
				}
			],
		],
		'resolveType' => function( $node ) {
			// use the post_type to determine what GraphQL Type should be returned. Default to Cake
			return get_post_type_object( $node->post_type )->graphql_single_name ?: 'Icontent';
		}
	]);
}

function register_Vcontent() {
	register_post_type( 'Vcontent', [
		'show_ui' => true,
		'labels'  => [
			'menu_name' => __( 'Veep Content', 'your-textdomain' ),
		],
		'hierarchical' => true,
		'show_in_graphql' => true,
		'graphql_single_name' => 'vcontent',
		'graphql_plural_name' => 'vcontents',
		'public' => false,
		'publicly_queryable' => false,
		'graphql_interfaces' => ['Icontent'],
		'resolveType' => function( $node ) {
			// use the post_type to determine what GraphQL Type should be returned. Default to Cake
			return get_post_type_object( $node->post_type )->graphql_single_name ?: 'Vcontent';
		}
	]);
}

function register_GeneratedContent() {
	register_post_type( 'Gcontent', [
		'show_ui' => true,
		'labels'  => [
			'menu_name' => __( 'Veep Generated Content', 'your-textdomain' ), # The label for the WP Admin. Doesn't affect the WPGraphQL Schema.
		],
		'hierarchical' => true,
		'show_in_graphql' => true,
		'graphql_single_name' => 'gcontent',
		'graphql_plural_name' => 'gcontents',
		'public' => false,
		'publicly_queryable' => false,
		'graphql_interfaces' => ["Icontent", "Vcontent"],
		'resolveType' => function( $node ) {
			return get_post_type_object( $node->post_type )->graphql_single_name ?: 'Gcontent';
		}
	]);
};

function register_MergedContent() {
	register_post_type( 'Mcontent', [
		'show_ui' => true,
		'labels'  => [
			'menu_name' => __( 'Veep Merged Content', 'your-textdomain' ), # The label for the WP Admin. Doesn't affect the WPGraphQL Schema.
		],
		'hierarchical' => true,
		'show_in_graphql' => true,
		'graphql_single_name' => 'mcontent',
		'graphql_plural_name' => 'mcontents',
		'public' => false,
		'publicly_queryable' => false,
		'graphql_interfaces' => ["Icontent", "Vcontent"],
		'resolveType' => function( $node ) {
			return get_post_type_object( $node->post_type )->graphql_single_name ?: 'Mcontent';
		}
	]);
};

function register_TranscribedContent() {
	register_post_type( 'Tcontent', [
		'show_ui' => true,
		'labels'  => [
			'menu_name' => __( 'Veep Transcribed Content', 'your-textdomain' ), # The label for the WP Admin. Doesn't affect the WPGraphQL Schema.
		],
		'hierarchical' => true,
		'show_in_graphql' => true,
		'graphql_single_name' => 'tcontent',
		'graphql_plural_name' => 'tcontents',
		'public' => false,
		'publicly_queryable' => false,
		'graphql_interfaces' => ["Icontent", "Vcontent", "Airesponse"],
		'graphql_fields' => [
			'veepdotaiInputType' => [
				'type' => 'String',
				'description' => 'Input type',
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "veepdotaiInputType", true );
					return ! empty( $value ) ? $value : '';
				}
			],
            'veepdotaiTranscription' => [
				'type' => 'String',
				'description' => 'Transcription',
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "veepdotaiTranscription", true );
					return ! empty( $value ) ? $value : '';
				}
			],
            'veepdotaiResource' => [
				'type' => 'String',
				'description' => 'Resource',
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "veepdotaiResource", true );
					return ! empty( $value ) ? $value : '';
				}
			],
            'veepdotaiPrompt' => [
				'type' => 'String',
				'description' => 'Prompt',
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "veepdotaiPrompt", true );
					return ! empty( $value ) ? $value : '';
				}
			],
            'veepdotaiLastStepDone' => [
				'type' => 'String',
				'description' => 'Last step done',
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "veepdotaiLastStepDone", true );
					return ! empty( $value ) ? $value : '';
				}
			],
		],
		'resolveType' => function( $node ) {
			return get_post_type_object( $node->post_type )->graphql_single_name ?: 'Tcontent';
		}
	]);
};

function register_AIResponse() {
	register_post_type( 'Airesponse', [
		'show_ui' => true,
		'labels'  => [
			'menu_name' => __( 'Veep AI Response', 'your-textdomain' ), # The label for the WP Admin. Doesn't affect the WPGraphQL Schema.
		],
		'hierarchical' => true,
		'show_in_graphql' => true,
		'graphql_single_name' => 'airesponse',
		'graphql_plural_name' => 'airesponses',
		'public' => false,
		'publicly_queryable' => false,
		'graphql_interfaces' => [],
		'graphql_fields' => [
			'vid' => [
				'type' => 'String',
				'description' => 'AI response id',
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "id", true );
					return ! empty( $value ) ? $value : '';
				}
			],
			'vobject' => [
				'type' => 'String',
				'description' => 'JSON response from the AI',
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "object", true );
					return ! empty( $value ) ? $value : '';
				}
			],
			'vcreated' => [
				'type' => 'String',
				'description' => 'Input type',
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "created", true );
					return ! empty( $value ) ? $value : '';
				}
			],
			'vmodel' => [
				'type' => 'String',
				'description' => 'Input type',
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "model", true );
					return ! empty( $value ) ? $value : '';
				}
			],
		],
		'resolveType' => function( $node ) {
			return get_post_type_object( $node->post_type )->graphql_single_name ?: 'Airesponse';
		}
	]);
};
