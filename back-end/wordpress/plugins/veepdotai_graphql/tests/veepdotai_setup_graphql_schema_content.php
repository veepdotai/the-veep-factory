<?php

namespace schema_content;

function register_schema() {
	register_IEnumerationValues();
	register_IEnumeration();
	
	register_DomainContentType();
	register_DomainContentTypeValue();

	register_dctBridgeVal();

	register_dct2BridgeValConn();
	register_dctBridge2ValConn();
//	register_val2BridgeDctConn();
//	register_valBridge2DctConn();
}

function register_IEnumeration() {
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
			/*
			'keys' => [
				'type' => 'IEnumerationValues',
				'description' => 'List of translated key values',
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "keys", true );
					return ! empty( $value ) ? $value : '';
				}
			]
			*/
		],
		'resolveType' => function( $node ) {
			// use the post_type to determine what GraphQL Type should be returned. Default to Cake
			return get_post_type_object( $node->post_type )->graphql_single_name ?: 'domainContentType';
		}
	]);

}

function register_IEnumerationValues() {
	register_graphql_interface_type( 'IEnumerationValues', [
		'description' => __( 'Some enumeration values', 'your-textdomain' ),
		'interfaces' => ['Node', 'DatabaseIdentifier'],
		'fields' => [
			'key' => [
				'type' => 'String',
				'description' => 'Enumeration key value. It is the reference value whatever the language is.',
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "key", true );
					return ! empty( $value ) ? $value : '';
				}
			],
			'short' => [
				'type' => 'String',
				'description' => 'Enumeration short value.',
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "short", true );
					return ! empty( $value ) ? $value : '';
				}
			],
			'long' => [
				'type' => 'String',
				'description' => 'Enumeration long value.',
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "long", true );
					return ! empty( $value ) ? $value : '';
				}
			],
		],
		'resolveType' => function( $node ) {
			// use the post_type to determine what GraphQL Type should be returned. Default to Cake
			return get_post_type_object( $node->post_type )->graphql_single_name ?: 'domainContentTypeVal';
		}
	]);
}

/**
 * How to model a many to many table in q graphql world
 * A ---- * B * ---- C
 */
function register_DomainContentType() {
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
		'supports' => ['title', 'custom-fields'],
		'graphql_interfaces' => ['IEnumeration'],
		'graphql_exclude_interfaces' => ['UniformResourceIdentifiable', 'ContentNode', 'NodeWithTemplate', 'NodeWithTitle','NodeWithContentEditor'],
		'graphql_fields' => [],
		'graphql_exclude_fields' => ['password', 'hasPassword']
	] );
}

function register_DomainContentTypeValue() {
	register_post_type( 'domainContentTypeVal', [
		'show_ui' => true,
		'labels'  => [
			'menu_name' => __( 'Domain Content Type Values', 'your-textdomain' ),
		],
		'show_in_graphql' => true,
		'graphql_single_name' => 'domainContentTypeVal',
		'graphql_plural_name' => 'domainContentTypeVals',
		'public' => false,
		'publicly_queryable' => false,
		'supports' => ['title', 'custom-fields'],
		'graphql_interfaces' => ['IEnumerationValues'],
		'graphql_exclude_interfaces' => ['UniformResourceIdentifiable', 'ContentNode', 'NodeWithTemplate', 'NodeWithTitle','NodeWithContentEditor'],
		'graphql_fields' => [],
		'graphql_exclude_fields' => ['password', 'hasPassword']
	] );
}

function myff( $obj ) {
	$value = get_post_meta( $obj->ID, "id1", true );
	return ! empty( $value ) ? $value : '';
}

function register_dctBridgeVal() {
	register_post_type( 'dctBridgeVal', [
		'show_ui' => true,
		'labels'  => [
			'menu_name' => __( 'Fait le lien entre les énumérations et les valeurs.', 'your-textdomain' ),
		],
		'show_in_graphql' => true,
		'graphql_single_name' => 'dctBridgeVal',
		'graphql_plural_name' => 'dctBridgeVals',
		'public' => false,
		'publicly_queryable' => false,
		'supports' => ['custom-fields'],
		//'graphql_interfaces' => ['IEnumerationValues'],
		'graphql_exclude_interfaces' => [
			'UniformResourceIdentifiable', 'ContentNode', 'NodeWithTemplate', 'NodeWithTitle','NodeWithContentEditor'
		],
		'graphql_fields' => [
			'id1' => [
				'type' => 'String',
				'description' => 'Left tuple.',
				'resolve' => function( $obj ) {
					return myff( $obj );
				}
			],
			'id2' => [
				'type' => 'String',
				'description' => 'Right tuple.',
				'resolve' => function( $obj ) {
					$value = get_post_meta( $obj->ID, "id2", true );
					return ! empty( $value ) ? $value : '';
				}
			],
		],
		'graphql_exclude_fields' => ['password', 'hasPassword']
	] );
}

/**
 * From left to right
 */
function register_dct2BridgeValConn() {
	$config = [
		'fromType' => 'domainContentType',
		'toType' => 'dctBridgeVal',
		'fromFieldName' => 'keys',
		'connectionTypeName' => 'dct2BridgeValConn',
		'resolve' => function( $id, $args, $context, $info ) {
			$resolver = new \WPGraphQL\Data\Connection\PostObjectConnectionResolver(
				$id, $args, $context, $info, 'dctBridgeVal'
			);
			$resolver->set_query_arg( 'meta_query', [[
				'key'     => 'id1',
				'value'   => $id->ID,
			]] );
			$connection = $resolver->get_connection();
      		return $connection;
		},
		'resolveNode' => function( $id, $args, $context, $info ) {
			return \WPGraphQL\Data\DataSource::resolve_post_object( $id, $context );
		}
	];
	register_graphql_connection( $config );	
}

function log( $msg ) {
	error_log( print_r( $msg, true ) , 3, "/tmp/graphql.log");
}

function register_dctBridge2ValConn() {
	$config = [
		'fromType' => 'dctBridgeVal',
		'toType' => 'domainContentTypeVal',
		'fromFieldName' => 'values',
		'connectionTypeName' => 'dctBridge2ValConn',
		'resolve' => function( $id, $args, $context, $info ) {
			$resolver = new \WPGraphQL\Data\Connection\PostObjectConnectionResolver(
				$id, $args, $context, $info, 'domainContentTypeVal'
			);
			$filter = get_post_meta( $id->ID, "id2", true );
			$resolver->set_query_arg( 'p', $filter);
			$connection = $resolver->get_connection();
      		return $connection;
		},
		'resolveNode' => function( $id, $args, $context, $info ) {
			return \WPGraphQL\Data\DataSource::resolve_post_object( $id, $context );
		}
	];
	register_graphql_connection( $config );
}

/**
 * From right to left
 */
function register_val2BridgeDctConn() {
	$config = [
		'fromType' => 'domainContentType',
		'toType' => 'dctBridgeVal',
		'fromFieldName' => 'keys',
		'connectionTypeName' => 'val2BridgeDctConn',
		'resolve' => function( $id, $args, $context, $info ) {
			return \WPGraphQL\Data\DataSource::resolve_post_objects_connection(
				$id, $args, $context, $info, 'dctBridgeVal'
			);
		},
		'resolveNode' => function( $id, $args, $context, $info ) {
			return \WPGraphQL\Data\DataSource::resolve_post_object( $id, $context );
		}
	];
	register_graphql_connection( $config );
}

function register_valBridge2DctConn() {
	$config = [
		'fromType' => 'domainContentTypeVal',
		'toType' => 'dctBridgeVal',
		'fromFieldName' => 'keys',
		'connectionTypeName' => 'valBridge2DctConn',
		'resolve' => function( $id, $args, $context, $info ) {
			return \WPGraphQL\Data\DataSource::resolve_post_objects_connection(
				$id, $args, $context, $info, 'dctBridgeVal'
			);
		},
		'resolveNode' => function( $id, $args, $context, $info ) {
			return \WPGraphQL\Data\DataSource::resolve_post_object( $id, $context );
		}
	];
	register_graphql_connection( $config );
}
