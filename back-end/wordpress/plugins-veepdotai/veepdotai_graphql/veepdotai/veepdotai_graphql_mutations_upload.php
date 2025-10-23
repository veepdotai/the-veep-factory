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
				'status' => [
					'type' => 'String',
					'resolve' => function ($payload) {
						return $payload['status'];
					}
				]
            ],

            'mutateAndGetPayload' => function( $input, $context, $info ) {
                //\Veepdotai\Graphql\Mutations\Upload\log("mutateAndGetPayload: input:");

                if (!function_exists('wp_handle_sideload')) {
                    require_once(ABSPATH . 'wp-admin/includes/file.php');
                }

                $uploaded = wp_handle_sideload($input['file'], [
                    'test_form' => false,
                    'test_type' => false,
                ]);

				if (isset($file_return['error']) || isset($file_return['upload_error_handler'])) {
					throw new \GraphQL\Error\UserError("The file could not be uploaded.");
				}
				
				$filename = $uploaded['file'];
                $mime_type = $uploaded['type'] ? $uploaded['type'] : sanitize_mime_type( $input['file']['type'] );

				$attachment = [
					'guid' => $uploaded['url'], 
					'post_mime_type' => $mime_type,
					'post_title' => preg_replace('/\.[^.]+$/', '', basename($filename)),
					'post_content' => '',
					'post_status' => 'inherit'
				];

				$attachment_id = wp_insert_attachment($attachment, $filename);

				require_once(ABSPATH . 'wp-admin/includes/image.php');
				$attachment_metadata = wp_generate_attachment_metadata($attachment_id, $filename);
				wp_update_attachment_metadata($attachment_id, $attachment_metadata);

                $data = [
                    'uploaded' => $uploaded, 
                    'attachment' => $attachment,
                    'metadata' => $attachment_metadata,
                ];
                $result = [
                    'status' => json_encode( $data ),
                ];
                //log("result: " . print_r( $result, true ) );
                return $result;
            }
        ]
    );
}