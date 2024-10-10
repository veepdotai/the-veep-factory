<?php

namespace schema_old;

//define( "MAXITEMS_TO_REGISTER_IN_GRAPHQL", 50 ); // 100?

//add_action( 'graphql_register_types', function() {
//add_action( 'init', function() {
//	register_veepdotai_old_schema();
//});

function veepdotai_graphql_register_types( $meta_attr_name, $desc, $meta_attr_default = "", $post_type = "Post", $meta_attr_type = "String" ) {
	register_graphql_field(
		$post_type,
		$meta_attr_name,
		[
			'type' => $meta_attr_type,
			'description' => $desc,
			'resolve' => function( $post ) {
				$meta_attr_value = get_post_meta( $post->ID, $meta_attr_name, true );
				return ! empty( $meta_attr_value ) ? $meta_attr_value : $meta_attr_default;
			}
		]
	);
}

function register_schema() {
	register_schema_old();
	register_schema_transition();
}

function register_schema_transition() {
	register_IContent();
	register_VContent();
	register_MetadataFields('Vcontent');
}

function register_Icontent() {
	register_graphql_interface_type( 'Icontent', [
		'description' => __( 'Basic Veep Interface', 'your-textdomain' ),
		'interfaces' => [
			'NodeWithAuthor',
			'NodeWithContentEditor',
			'ContentNode',
			'NodeWithExcerpt',
			'NodeWithRevisions'
		],
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
	$user_wp = wp_get_current_user();

	$parameters = [
		'map_meta_cap' => true,
		'labels' => [
			'menu_name' => __( 'Veep Content', 'your-textdomain' ),
		],
		'hierarchical' => true,
		'public' => false,
		'publicly_queryable' => false,
		'show_in_rest' => true,
		'rest_base' => 'vcontents',
		'rest_controller_class' => 'WP_REST_Posts_Controller',
		'show_in_graphql' => true,
		'graphql_single_name' => 'vcontent',
		'graphql_plural_name' => 'vcontents',
		'supports' => array( "title", "editor", "author"), // NodeWithTitle, NodeWithContentEditor, NodeWithAuthor
		'graphql_interfaces' => ['Icontent'],
		'taxonomies'  => [ 'category', 'post_tag' ],
		'resolveType' => function( $node ) {
			// use the post_type to determine what GraphQL Type should be returned. Default to Cake
			return get_post_type_object( $node->post_type )->graphql_single_name ?: 'Vcontent';
		}
	];
	if( $user_wp->ID == 1
			|| in_array( 'veepdotai_role_admin', (array) $user_wp->roles ) ) {
		$parameters[ 'show_ui' ] = true;
		$parameters[ 'capability_type' ] = 'vcontent';
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
		$parameters[ 'capability_type' ] = 'vcontent';
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

	register_post_type( 'vcontent', $parameters );
}

function register_MetadataFields( $baseType ) {
	$prefix = "veepdotai";

	register_graphql_field( $baseType, 'veepdotaiResource', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiResource", true );
		 	return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiContent', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiContent", true );
		 	return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiDetails', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiDetails", true );
		 	return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiParent', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiParent", true );
		 	return ! empty( $value ) ? $value : '';
	   }
	]);

	register_graphql_field( $baseType, 'veepdotaiTranscription', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiTranscription", true );
		 	return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPrompt', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPrompt", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiLastStepDone', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiLastStepDone", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiInputType', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiInputType", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
}

function register_schema_old() {
	$prefix = "veepdotai";

	register_veepdotaiFields('Post');
	register_MetadataFields('Post');
}

function register_veepdotaiFields($baseType) {
	// 0 -> 10
	register_graphql_field( $baseType, 'veepdotaiPhase0Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase0Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase0Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase0Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase0Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase0Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase1Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase1Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase1Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase1Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase1Meta', [ 'type' => 'String',
	'resolve' => function( $post ) {
		 $value = get_post_meta( $post->ID, "veepdotaiPhase1Meta", true );
		 return ! empty( $value ) ? $value : '';
	}
 	]);
	register_graphql_field( $baseType, 'veepdotaiPhase2Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase2Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase2Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase2Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase2Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase2Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase3Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase3Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase3Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase3Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase3Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase3Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase4Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase4Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase4Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase4Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase4Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase4Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase5Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase5Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase5Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase5Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase5Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase5Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase6Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase6Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase6Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase6Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase6Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase6Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase7Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase7Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase7Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase7Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase7Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase7Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase8Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase8Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase8Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase8Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase8Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase8Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase9Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase9Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase9Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase9Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase9Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase9Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase10Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase10Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase10Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase10Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase10Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase10Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);

	// 11 -> 20
	register_graphql_field( $baseType, 'veepdotaiPhase11Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase11Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase11Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase11Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase11Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase11Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase12Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase12Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase12Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase12Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase12Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase12Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase13Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase13Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase13Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase13Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase13Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase13Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase14Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase14Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase14Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase14Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase14Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase14Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase15Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase15Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase15Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase15Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase15Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase15Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase16Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase16Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase16Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase16Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase16Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase16Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase17Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase17Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase17Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase17Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase17Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase17Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase18Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase18Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase18Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase18Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase18Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase18Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase19Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase19Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase19Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase19Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase19Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase19Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase20Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase20Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase20Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase20Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase20Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase20Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);

	// 21 -> 30
	register_graphql_field( $baseType, 'veepdotaiPhase21Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase21Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase21Details', [ 'type' => 'String',
	'resolve' => function( $post ) {
		 $value = get_post_meta( $post->ID, "veepdotaiPhase21Details", true );
		 return ! empty( $value ) ? $value : '';
	}
	]);	
	register_graphql_field( $baseType, 'veepdotaiPhase21Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase21Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase22Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase22Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase22Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase22Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase22Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase22Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase23Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase23Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase23Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase23Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase23Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase23Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase24Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase24Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase24Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase24Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase24Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase24Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase25Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase25Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase25Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase25Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase25Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase25Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase26Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase26Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase26Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase26Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase26Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase26Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase27Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase27Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase27Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase27Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase27Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase27Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase28Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase28Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase28Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase28Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase28Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase28Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase29Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase29Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase29Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase29Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase29Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase29Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase30Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase30Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase30Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase30Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'veepdotaiPhase30Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase30Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
}
