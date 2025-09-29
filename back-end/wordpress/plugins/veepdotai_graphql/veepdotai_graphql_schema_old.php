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
	register_schema_current();
	register_schema_deprecated();
}

function register_schema_current() {
	register_IContent();
	register_VContent();
	register_SystemMetadataFields('Vcontent');
	register_MetadataFields('Vcontent');
	register_Taxonomies();
}


function register_schema_deprecated() {
	$prefix = "veepdotai";

	//register_veepdotaiFields('Post');
	register_DeprecatedMetadataFields('Vcontent');
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
			'tvfSource' => [
				'type' => 'String',
				'description' => __( 'Source of the content', 'your-textdomain' ),
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "source", true );
					return ! empty( $value ) ? $value : '';
				}
			],
			'tvfFavorite' => [
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

function register_Taxonomies() {
	register_taxonomy( 'doc_tag', 'Vcontents', [
		'labels'  => [
		  'menu_name' => __( 'Document Tags', 'your-textdomain' ), //@see https://developer.wordpress.org/themes/functionality/internationalization/
		],
		'show_in_graphql' => true,
		'hierarchical' => true,
		'graphql_single_name' => 'documentTag',
		'graphql_plural_name' => 'documentTags',
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
		'exclude_from_search' => false,
		'taxonomies'  => [ 'category', 'post_tag' ],
		'resolveType' => function( $node ) {
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

function register_SystemMetadataFields( $baseType ) {
	$prefix = "veepdotai";

	/**
	 * The below properties are kind system properties
	 */
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
	register_graphql_field( $baseType, 'veepdotaiLabelEncoded', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiLabelEncoded", true );
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

function register_DeprecatedMetadataFields($baseType) {

	/**
	 * Deprecated properties. They are going to be replaced by tvf prefix instead of veepdotai
	 */
	register_graphql_field( $baseType, 'veepdotaiDomain', [ 'type' => 'String',
	'resolve' => function( $post ) {
		$value = get_post_meta( $post->ID, "veepdotaiDomain", true );
		return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'veepdotaiSubDomain', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiSubDomain", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'veepdotaiCategory', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiCategory", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'veepdotaiSubCategory', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiSubCategory", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'veepdotaiArtefactType', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiArtefactType", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'veepdotaiMetadata', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiMetadata", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
}

function register_MetadataFields($baseType) {

	/**
	 * tvfProperties
	 */
	register_graphql_field( $baseType, 'tvfSubtitle', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfSubtitle", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);

	register_graphql_field( $baseType, 'tvfDomain', [ 'type' => 'String',
	'resolve' => function( $post ) {
		$value = get_post_meta( $post->ID, "tvfDomain", true );
		return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'tvfSubDomain', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfSubDomain", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'tvfCategory', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfCategory", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'tvfSubCategory', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfSubCategory", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'tvfArtefactType', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfArtefactType", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'tvfMetadata', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfMetadata", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

	register_graphql_field( $baseType, 'tvfUp', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfUp", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'tvfDown', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfDown", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'tvfPubDate', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfPubDate", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'tvfStatus', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfStatus", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'tvfTemplate', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfTemplate", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( $baseType, 'tvfGeneratedAttachment', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "tvfGeneratedAttachment", true );
			return ! empty( $value ) ? $value : '';
		}
	]);

}

