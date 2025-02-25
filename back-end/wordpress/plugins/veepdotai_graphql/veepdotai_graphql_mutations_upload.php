<?php

namespace Veepdotai\Graphql\Mutations\Upload;

/**
 * @package Veepdotai\Graphql\Mutations\Upload
 * @version 0.0.1
 * Registers custom graphql operations
 * 
 */

function register() {
    register_upload();
}

function log( $msg ) {
	\Veepdotai_Util::log( 'debug', 'GraphQL Mutations\Upload: ' . $msg );
}

function register_upload() {
    register_graphql_mutation( 'upload', [

            'description' => __( 'Upload blob to WP repository', 'your-textdomain' ),
            'inputFields' => [
                'file' => [
//                    'type' => ['non_null' => 'Upload'],
                    'type' => 'Upload',
//                    'type' => 'String',
                ],
            ],

            'outputFields' => [
                'text' => [
                    'type'    => 'String',
//                    'resolve' => function ($payload) {
//                        return $payload['text'];
//                    },
                ],
            ],

            'mutateAndGetPayload' => function( $input, $context, $info ) {
                if (!function_exists('wp_handle_sideload')) {
                    require_once(ABSPATH . 'wp-admin/includes/file.php');
                }

                wp_handle_sideload($input['file'], [
                    'test_form' => false,
                    'test_type' => false,
                ]);

                $data = [
//                    'text' => 'Uploaded file was "' . $input['file']
                    'text' => 'Uploaded file was "' . $input['file']['name'] . '" (' . $input['file']['type'] . ').',
                ];
                $result = [
                    'text' => json_encode( $data ),
                ];
                log("result: " . print_r( $result, true ) );
                return $result;
            }
        ]
    );
}