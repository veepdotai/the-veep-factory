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

function register_upload() {
    register_graphql_mutation(
        'upload', [
            'description' => __( 'Upload blob to WP repository', 'your-textdomain' ),
            'inputFields' => [
                'file' => [
                    'type' => ['non_null' => 'Upload'],
                ],
            ],
            'outputFields' => [
                'text' => [
                    'type'    => 'String',
                    'resolve' => function ($payload) {
                        return $payload['text'];
                    },
                ],
            ],
            'mutateAndGetPayload' => function ($input) {
                if (!function_exists('wp_handle_sideload')) {
                    require_once(ABSPATH . 'wp-admin/includes/file.php');
                }

                wp_handle_sideload($input['file'], [
                    'test_form' => false,
                    'test_type' => false,
                ]);

                return [
                    'text' => 'Uploaded file was "' . $input['file']['name'] . '" (' . $input['file']['type'] . ').',
                ];
            }
        ]
    );
}