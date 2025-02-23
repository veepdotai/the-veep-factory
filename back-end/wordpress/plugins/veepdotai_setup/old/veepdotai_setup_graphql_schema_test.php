<?php
define( "MAXITEMS_TO_REGISTER_IN_GRAPHQL", 50 ); // 100?

//add_action( 'graphql_register_types', function() {
add_action( 'init', function() {
	//register_veepdotai_old_schema();
	register_veepdotai_enumType();
	//register_veepdotai_content_creation();
	//register_veepdotai_content_creation_enum();
});

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

//add_action( 'graphql_register_types', 'register_my_custom_graphql_connection', 99);
function register_my_custom_graphql_connection() {
	$config = [
	  'fromType' => 'RootQuery',
	  'toType' => 'Content',
	  'fromFieldName' => 'test',
	  'connectionTypeName' => 'PostsFromThisWeekConnection',
	  'resolve' => function( $id, $args, $context, $info ) {
		return \WPGraphQL\Data\DataSource::resolve_post_objects_connection( $id, $args, $context, $info, 'content' );
	  },
	  'resolveNode' => function( $id, $args, $context, $info ) {
		return \WPGraphQL\Data\DataSource::resolve_post_object( $id, $context );
	  }
	];
	register_graphql_connection( $config );
};

function register_veepdotai_enumType() {

	register_graphql_interface_type( 'IEnumeration', [
		'description' => __( 'An enumeration', 'your-textdomain' ),
		'interfaces' => ['Node', 'DatabaseIdentifier', 'NodeWithTitle'],
		'fields' => [
			'name' => [
				'type' => 'String',
				'description' => 'Invariable name for the enumeration, whatever the language/locale is.',
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "name", true );
					return ! empty( $value ) ? $value : '';
				}
			],
			'description' => [
				'type' => 'String',
				'description' => 'Enumeration detailed description.',
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "description", true );
					return ! empty( $value ) ? $value : '';
				}
			],
		],
		'resolveType' => function( $node ) {
			// use the post_type to determine what GraphQL Type should be returned. Default to Cake
			return get_post_type_object( $node->post_type )->graphql_single_name ?: 'Cake';
		}
	]);

	register_post_type( 'domainContentType', [
		'show_ui' => true,
		'labels'  => [
			'menu_name' => __( 'Domain Content Type Enum', 'your-textdomain' ),
		],
		'show_in_graphql' => true,
		'graphql_single_name' => 'domainContentType',
		'graphql_plural_name' => 'domainContentTypes',
		'public' => false,
		'publicly_queryable' => false,
		'graphql_interfaces' => ['IEnumeration'],
		'graphql_exclude_interfaces' => ['UniformResourceIdentifiable', 'ContentNode', 'NodeWithTemplate', 'NodeWithTitle','NodeWithContentEditor'],
		'graphql_fields' => [],
		'graphql_exclude_fields' => ['password', 'hasPassword']
	] );
}

function register_veepdotai_content_creation_enum() {
	register_graphql_enum_type( 'DomainContentTypeEnum', [
		'description' => __( 'List of Domain Content Types', 'your-textdomain' ),
		'values' => [
			'PITCH' => ['value' => 'pitch'],
			'PAINS' => ['value' => 'pains'],
			'BENEFITS' => ['value' => 'benefits'],
			'PRODUCT_SOLUTION' => ['value' => 'productSolution'],
			'COMPETITIVE_ADVANTAGE' => ['value' => 'competitiveAdvantage'],
			'USE_CASE' => ['value' => 'usecase'],
			'CASE_STUDY' => ['value' => 'casestudy'],
			'WHITE_PAPER' => ['value' => 'whitepaper'],
			'INTERVIEW' => ['value' => 'interview'],
			'FEEDBACK' => ['value' => 'feedback'],
		]
	]);

	register_graphql_field( 'RootQuery', 'currentDomainContentType', [
		'type' => 'DomainContentTypeEnum',
		'description' => __( 'Get the Domain Content Type', 'your-textdomain' ),
		'resolve' => function() {
			return 'benefits';
		},
	]);
}

function register_veepdotai_content_creation() {

	/*
		register_graphql_type( 'Ivcontent', [
		'graphql_kind' => 'interface',
		'graphql_interfaces' => [ 'NodeWithContentEditor', 'ContentNode', 'NodeWithExcerpt', 'NodeWithRevisions'],
		'graphql_fields' => [
			'source' => [
				'type' => 'String',
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
			return get_post_type_object( $node->post_type )->graphql_single_name ?: 'Cake';
		}
	]);
	*/

	register_graphql_interface_type( 'Ivcontent', [
		'description' => __( 'A veep content', 'your-textdomain' ),
		'interfaces' => [ 'NodeWithContentEditor', 'ContentNode', 'NodeWithExcerpt', 'NodeWithRevisions'],
		'fields' => [
			'source' => [
				'type' => 'String',
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
			return get_post_type_object( $node->post_type )->graphql_single_name ?: 'Cake';
		}
	]);

	register_post_type( 'Vcontent', [
		//'graphql_kind' => 'interface',
		'show_ui' => true, # whether you want the post_type to show in the WP Admin UI. Doesn't affect WPGraphQL Schema.
		'labels'  => [
			//@see https://developer.wordpress.org/themes/functionality/internationalization/
			'menu_name' => __( 'Veep Content', 'your-textdomain' ), # The label for the WP Admin. Doesn't affect the WPGraphQL Schema.
		],
		'hierarchical' => true, # set to false if you don't want parent/child relationships for the entries
		'show_in_graphql' => true, # Set to false if you want to exclude this type from the GraphQL Schema
		'graphql_single_name' => 'vcontent', 
		'graphql_plural_name' => 'vcontents', # If set to the same name as graphql_single_name, the field name will default to `all${graphql_single_name}`, i.e. `allDocument`.
		'public' => false, # set to false if entries of the post_type should not have public URIs per entry
		'publicly_queryable' => false, # Set to false if entries should only be queryable in WPGraphQL by authenticated requests
		'graphql_interfaces' => ['Ivcontent'],
		//'graphql_exclude_interfaces' => ["NodeWithTemplate"],
		'graphql_fields' => [
		],
		//'graphql_fields' => [""]
		//'graphql_exclude_fields' => [""]
	] );
/*	register_graphql_field( 'vcontent', 'content2', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
*/
	register_post_type( 'generatedContent', [
		'show_ui' => true,
		'labels'  => [
			'menu_name' => __( 'Veep Generated Content', 'your-textdomain' ), # The label for the WP Admin. Doesn't affect the WPGraphQL Schema.
		],
		'hierarchical' => true, # set to false if you don't want parent/child relationships for the entries
		'show_in_graphql' => true, # Set to false if you want to exclude this type from the GraphQL Schema
		'graphql_single_name' => 'generatedContent', 
		'graphql_plural_name' => 'generatedContents', # If set to the same name as graphql_single_name, the field name will default to `all${graphql_single_name}`, i.e. `allDocument`.
		'public' => false, # set to false if entries of the post_type should not have public URIs per entry
		'publicly_queryable' => false, # Set to false if entries should only be queryable in WPGraphQL by authenticated requests
		'graphql_interfaces' => ["Vcontent"],
		//'graphql_exclude_interfaces' => ["ContentNode", "NodeWithFeaturedImage", "NodeWithTemplate", "NodeWithContentEditor", "NodeWithTitle"],
		//'graphql_fields' => ["ContentNode", "NodeWithAuthor", "NodeWithFeaturedImage"],
	]);
};

function register_veepdotai_old_schema() {
	$prefix = "veepdotai";

	register_graphql_field( 'Content', 'veepdotaiContent', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiContent", true );
		 	return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Content', 'veepdotaiDetails', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiDetails", true );
		 	return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Content', 'veepdotaiParent', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiParent", true );
		 	return ! empty( $value ) ? $value : '';
	   }
	]);

	register_graphql_field( 'Post', 'veepdotaiTranscription', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiTranscription", true );
		 	return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPrompt', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPrompt", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiLastStepDone', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiLastStepDone", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiInputType', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiInputType", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);

	// 0 -> 10

	register_graphql_field( 'Post', 'veepdotaiPhase0Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase0Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase0Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase0Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase0Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase0Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase1Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase1Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase1Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase1Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase1Meta', [ 'type' => 'String',
	'resolve' => function( $post ) {
		 $value = get_post_meta( $post->ID, "veepdotaiPhase1Meta", true );
		 return ! empty( $value ) ? $value : '';
	}
 	]);
	register_graphql_field( 'Post', 'veepdotaiPhase2Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase2Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase2Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase2Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase2Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase2Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase3Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase3Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase3Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase3Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase3Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase3Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase4Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase4Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase4Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase4Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase4Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase4Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase5Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase5Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase5Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase5Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase5Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase5Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase6Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase6Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase6Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase6Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase6Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase6Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase7Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase7Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase7Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase7Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase7Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase7Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase8Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase8Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase8Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase8Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase8Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase8Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase9Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase9Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase9Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase9Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase9Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase9Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase10Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase10Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase10Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase10Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase10Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase10Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);

	// 11 -> 20
	register_graphql_field( 'Post', 'veepdotaiPhase11Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase11Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase11Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase11Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase11Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase11Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase12Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase12Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase12Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase12Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase12Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase12Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase13Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase13Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase13Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase13Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase13Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase13Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase14Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase14Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase14Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase14Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase14Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase14Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase15Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase15Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase15Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase15Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase15Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase15Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase16Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase16Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase16Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase16Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase16Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase16Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase17Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase17Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase17Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase17Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase17Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase17Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase18Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase18Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase18Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase18Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase18Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase18Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase19Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase19Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase19Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase19Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase19Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase19Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase20Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase20Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase20Details', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase20Details", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase20Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase20Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);

	// 21 -> 30
	register_graphql_field( 'Post', 'veepdotaiPhase21Content', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase21Content", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase21Details', [ 'type' => 'String',
	'resolve' => function( $post ) {
		 $value = get_post_meta( $post->ID, "veepdotaiPhase21Details", true );
		 return ! empty( $value ) ? $value : '';
	}
	]);	
	register_graphql_field( 'Post', 'veepdotaiPhase21Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase21Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase22Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase22Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase22Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase22Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase22Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase22Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase23Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase23Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase23Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase23Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase23Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase23Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase24Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase24Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase24Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase24Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase24Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase24Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase25Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase25Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase25Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase25Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase25Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase25Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase26Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase26Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase26Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase26Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase26Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase26Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase27Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase27Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase27Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase27Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase27Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase27Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase28Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase28Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase28Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase28Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase28Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase28Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase29Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase29Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase29Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase29Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase29Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase29Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase30Content', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase30Content", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase30Details', [ 'type' => 'String',
		'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase30Details", true );
			return ! empty( $value ) ? $value : '';
		}
	]);
	register_graphql_field( 'Post', 'veepdotaiPhase30Meta', [ 'type' => 'String',
	   'resolve' => function( $post ) {
			$value = get_post_meta( $post->ID, "veepdotaiPhase30Meta", true );
			return ! empty( $value ) ? $value : '';
	   }
	]);
}

add_action( 'graphql_register_types', 'register_my_connection', 99 );
function register_my_connection() {
  $config = [
    'fromType' => 'RootQuery',
    'toType' => 'Post',
    'fromFieldName' => 'postsFromThisWeek',
    'connectionTypeName' => 'PostsFromThisWeekConnection',
    'resolve' => function( $id, $args, $context, $info ) {
		$resolver   = new \WPGraphQL\Data\Connection\PostObjectConnectionResolver( $id, $args, $context, $info, 'post' );
		$resolver->set_query_arg( 'date_query', [
			'after' => '2 years ago',
			'before' => '1 year ago',
		] );
		$connection = $resolver->get_connection();
		return $connection;
	    //return \WPGraphQL\Data\DataSource::resolve_post_objects_connection( $id, $args, $context, $info, 'post' );
    },
    'resolveNode' => function( $id, $args, $context, $info ) {
		/*
		$resolver   = new \WPGraphQL\Data\Connection\PostObjectConnectionResolver( $id, $args, $context, $info, 'post' );
		$resolver->set_query_arg( 'date_query', [
			'after' => '2 years ago',
			'before' => '1 year ago',
		] );
		$connection = $resolver->get_connection();
		return $connection;
		//return \WPGraphQL\Data\DataSource::resolve_post_object( $id, $context );
		*/
    }
  ];
  register_graphql_connection( $config );
};
