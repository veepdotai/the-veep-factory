<?php

namespace Veepdotai\Graphql\Mutations\Test;

/**
 * @package Veepdotai\Graphql\Mutations\Test
 * @version 0.0.1
 * Registers custom graphql operations
 * 
 */

function register() {
	register_test();
}

function log( $msg ) {
	\Veepdotai_Util::log( 'debug', 'GraphQL Mutations\Test: ' . $msg );
}

function register_test() {
	register_graphql_mutation( 'test', [

		'description' => __( 'Test mutation', 'your-textdomain' ),
		'inputFields'         => [
			'file' => [
				'type' => 'String',
				'description' => __( 'Object name', 'your-textdomain' ),
			],
		],
	
		'outputFields'        => [
			'text' => [
				'type' => 'String',
				'description' => __( 'Result operation as a json object', 'your-textdomain' ),
			]
		],
	
		'mutateAndGetPayload' => function( $input, $context, $info ) {
			$data = [
				"text" => $input["file"]
			];

			$result = [
				'text' => json_encode( $data ),
			];

			log("result: " . print_r( $result, true ) );
			return $result; 
		}
	] );
}

