<?php

namespace Veepdotai\Graphql\Mutations\Publish;

//require_once 'config.php';
require_once 'vendor/autoload.php';
use GuzzleHttp\Client;

/**
 * @package Veepdotai\Graphql\Mutations\Metadata
 * @version 0.0.1
 * Registers custom graphql operations
 * 
 */

function register() {
	register_publish_linkedin();
}

function log( $msg ) {
	\Veepdotai_Util::log( 'debug', 'GraphQL Mutations\Publish: ' . $msg );
}

/**
 * Pulish a post object
 */
function get_linkedin_id($access_token) {
	$fn = "getLinkedInId";
	try {
		$client = new Client(['base_uri' => 'https://api.linkedin.com']);
		$response = $client->request('GET', '/v2/me', [
			'headers' => [
				"Authorization" => "Bearer " . $access_token,
			],
		]);
		$data = json_decode($response->getBody()->getContents(), true);
		$linkedin_profile_id = $data['id']; // store this id somewhere

		log( "$fn: linkedin_profile: " . print_r( $data, true) . "." );
		log( "$fn: linkedin_profile_id: " . print_r( $linkedin_profile_id, true) . "." );

		return $linkedin_profile_id;
	} catch(Exception $e) {
		//  $e->getMessage()
		log( "$fn: Exception" . print_r( $e, true ));
	}
}

/**
 * https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/documents-api?view=li-lms-2025-02&tabs=curl
 */
function initialize_upload($access_token, $owner_id) {
	$fn = "initialize_upload";
	$LI_API_VERSION = '202501';

	$initializationUploadRequest = [
	    "initializeUploadRequest" => [
			//"owner" => "urn:li:organization:1234567",
			"owner" => "urn:li:person:$owner_id"
		]
	];
	$body_json = json_encode($initializationUploadRequest, true);
	log("$fn: body_json: " . print_r($body_json, true));

	try {
		$client = new Client(['base_uri' => 'https://api.linkedin.com']);
		$response = $client->request('POST', '/rest/documents?action=initializeUpload', [
			'headers' => [
				"Authorization" => "Bearer " . $access_token,
				"X-Restli-Protocol-Version" => "2.0.0",
				"LinkedIn-Version" => "$LI_API_VERSION"

			],
			"body" => $body_json
		]);
		log("$fn: response: " . print_r($response, true));
		
		if ($response->getStatusCode() == 200) {
			$data = json_decode( $response->getBody()->getContents(), true );
			//$data = $response->getBody()->getContents();
			log( "$fn: Success: " . print_r( $data, true ) );
			return $data;
		} else {
			//log("$fn: Error: " . $response->getLastBody()->errors[0]->message);
			log("$fn: Error: " . print_r( $response, true) );
			return null;
		}

	} catch(Exception $e) {
		log( "$fn: Exception:" . print_r( $e, true ) );
		echo $e->getMessage();
	}
}

function upload_document($access_token, $upload_url) {
	$fn = "upload_document";
	log( "$fn: upload_url: " . print_r( $upload_url, true) );

	$base_uri = preg_replace("#(https?://[^/]*)/.*#", "$1", $upload_url);
	$path = preg_replace("#https?://[^/]*(/.*)#", "$1", $upload_url);
	log( "$fn: base_uri: " . $base_uri );
	log( "$fn: path: " . $path );

	$wp_root_dir = "/workspaces/the-veep-factory/back-end/wordpress/htdocs/wp-content/uploads";
	$content = "/2025/05/file.pdf";
	$content_path = $wp_root_dir . $content;
	$filename = "myfilename";

	$filePayload = [
        'name'     => "myfile",
		'contents' => \GuzzleHttp\Psr7\stream_for(fopen($content_path, 'r')),
        'filename' => $filename,
    ];
	log( "$fn: filePayload: " . print_r( $filePayload, true) );

	try {
		//$client = new Client(['base_uri' => $base_uri]);
		//$response = $client->request('POST', $path, [
		$client = new Client();
		$response = $client->request('POST', $upload_url, [
			'headers' => [
				"Authorization" => "Bearer " . $access_token,
				//"Content-length" => ""
			],
			"debug" => true,
			//"body" => $filePayload
			"body" => \GuzzleHttp\Psr7\stream_for(fopen($content_path, 'r'))
		]);
		log("$fn: response: " . print_r($response, true));
		
		if ($response->getStatusCode() == 201) {
			$data = json_decode($response->getBody()->getContents(), true);
			log( "$fn: Success: " . print_r( $data, true ) );
			return $data;
		} else {
			//log("$fn: Error: " . $response->getLastBody()->errors[0]->message);
			log("$fn: Error: " . print_r( $response, true) );
			return null;
		}

	} catch(Exception $e) {
		log( "$fn: Exception:" . print_r( $e, true ) );
		echo $e->getMessage();
	}

}
/**
 * https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2025-02&tabs=curl#create-a-post
 */
function create_resource($access_token, $id, $content, $document = "", $lifecycleState = "DRAFT", $visibility = "PUBLIC") {
	$fn = "create_resource";

	$LI_POSTS_RESOURCE = '/posts';
	$LI_API_VERSION = '202501';


	$li_post = [
		"author" => "urn:li:person:$id",
		"visibility" => "$visibility",			// 
		"commentary" => "$content",
		"distribution" => [
			"feedDistribution" => "MAIN_FEED",
			"targetEntities" => [],
			"thirdPartyDistributionChannels" => []
		],
		"lifecycleState" => "$lifecycleState", 	// DRAFT|PUBLISHED
		"isReshareDisabledByAuthor" => false,
	];

	if ( $document !== "" ) {
		$li_post["media"] = [
			"title" => "this is my jck title",
			"id" => "$document"
		];
		log("$fn: an urn document has been provided: " . $document);
		log("$fn: it must have been added to the resource: " );

		$li_post = [
			"author" => "urn:li:person:$id",
			"visibility" => "$visibility",			// 
			"commentary" => "$content",
			"distribution" => [
				"feedDistribution" => "MAIN_FEED",
				"targetEntities" => [],
				"thirdPartyDistributionChannels" => []
			],
			"content" => [
				"media" => [
					"title" => "this is my jck title",
					"id" => "$document"
				],
			],
			"lifecycleState" => "$lifecycleState", 	// DRAFT|PUBLISHED
			"isReshareDisabledByAuthor" => false,
		];

	}

	log("$fn: li_post: " . print_r( $li_post, true ));
	return $li_post;
}


function create_post($access_token, $body) {
	$fn = "create_post";
	$body_json = json_encode($body, true);
	log("$fn: body_json: " . print_r($body_json, true));

	$LI_API_VERSION = '202501';

	try {
		$client = new Client(['base_uri' => 'https://api.linkedin.com']);
		$response = $client->request('POST', '/rest/posts', [
			'headers' => [
				"Authorization" => "Bearer $access_token",
				"Content-Type"  => "application/json",
				"X-Restli-Protocol-Version" => "2.0.0",
				"LinkedIn-Version" => "$LI_API_VERSION"
			],
			"debug" => true,
			"body" => $body_json
		]);
		log("$fn: response: " . print_r($response, true));

		if ($response->getStatusCode() == 201) {
			log("$fn: post has been created on LinkedIn successfully" );
			//$data = json_decode($response->getBody()->getContents(), true);
			$data = json_decode($response, true);
			log("$fn: data: " . print_r($data, true));
			return $data;
		} else {
			log("$fn: Error: " . print_r( $response, true ));
			//log("$fn: Error: " . $response->getLastBody()->errors[0]->message);
			return null;
		}
	} catch(Exception $e) {
		//echo $e->getMessage();
		log("$fn: exception: " . print_r($e, true));
	}


}

function register_publish_linkedin() {
	register_graphql_mutation( 'publishOnLinkedIn', [

		'description' => __( 'Publishes content on LinkedIn', 'your-textdomain' ),
		'inputFields'         => [
			'content' => [
				'type' => 'String',
				'description' => __( 'Object content id', 'your-textdomain' ),
			],
		],
	
		'outputFields'        => [
			'result' => [
				'type' => 'String',
				'description' => __( 'Result operation as a json object', 'your-textdomain' ),
			]
		],
	
		'mutateAndGetPayload' => function( $input, $context, $info ) {
			$access_token = "AQWGiJvdcW0bIHTaeq8pAgxPoEkFFOuGGkMgVmzVLQ38bVHY0_-HJp3vPpJl9fc2pspfxnHTIGe_RVgkxj5Jozre8P4g_ejI3BEdMohGsZ86SimINhfSDvBeL8UHfN-yEI4UJnn4ayMGePMgO3y_IDCOz3I6cvt2kmnCqH0JybtwrDxEzjT-5eMEVilIWY00mZDdnwwbMVAQtCb2qzKZ50CS86rX3Ph7Pk7VjB5-Bt2U1z9FrfuW5WVdBAcYEwQlwSBbI0S3QXjSQvgwv8XbHZ3dJIIxB8hDPKSWDuW1nukEP-_kW6vC5FQuZiC24l6h9IyGH6A4vRAIRBrGgZn12UzwiFNdAw";
			$id = "bMeVSCrIAh";

			$fn = "publishOnLinkedIn";
			$pn = "veepdotai-";
	
			$content = sanitize_text_field( $input['content'] );
	
			$user = wp_get_current_user();
			log( "$fn: user: " . print_r( $user, true) . "." );

			$meta_input = ["publicationStatus"];

			// For example
			// * publishContentOnLinkedIn("content", "12345") => this is a contentId => go and get the corresponding content to publish
			// * publishContentOnLinkedIn("content", "some text in markdown format") => this is content to publish

			/*
			$post_array = [ "ID" => $content_id ];
			if ( $title ) 		$post_array["post_title"] = $title;
			if ( $meta_input ) 	$post_array["meta_input"] = $meta_input;
			log( __METHOD__ . ": post_array: " . print_r( $post_array, true ) );

			$result = wp_update_post( $post_array );
			log( "$fn: wp_update_post: content_id: result: $result" );
			*/

			//createUgc()

			// Get memberid
			//$result = get_linkedin_id($access_token);
			
			// Create a single commentary
			//$resource = create_resource($access_token, $id, $content);
			//$result = create_post($access_token, $resource);

			// InitializeUploadRequest
			$result = initialize_upload($access_token, $id);
			log( "$fn: uploadUrl: " . print_r( $result, true ) );
			$upload_url = $result["value"]["uploadUrl"];
			log( "$fn: upload_url: " . $upload_url );
			$document = $result["value"]["document"];
			log( "$fn: document: " . $document );
			$result = upload_document($access_token, $upload_url);
			log( "$fn: upload_document() => result: " . $result );

			$resource = create_resource($access_token, $id, $content, $document);
			$result = create_post($access_token, $resource);

			$data = [];
			if ( $result ) {
				log( "$fn: result: $result" );
				$data = [
					"user_id" => $user->user_login,
					"content_id" => $result,
//					"uploadUrlExpiresAt" => $result->value->uploadUrlExpiresAt,
//					"uploadUrl" => json_decode($result)->value->uploadUrl,
//					"document" => json_decode($result)->value->document,
					"result" => true,
				];
			} else {
				$data = [
					"user_id" => $user->user_login,
					"content_id" => $result,
					"result" => false,
				];
			}
	
			return [
				"result" => json_encode( $data ),
			];
		}
	] );
}

/**
 * Gets tvfMetadata 
 */
function register_list_metadata() {
	register_graphql_mutation( 'listMetadata', [

		'description' => __( 'Gets data (cid, metadata) => value)', 'your-textdomain' ),

		'inputFields'         => [
			'contentId' => [
				'type' => 'String',
				'description' => __( 'Object contentId', 'your-textdomain' ),
			],
			'metadata' => [
				'type' => 'String',
				'description' => __( 'Object metadata', 'your-textdomain' ),
			],

		],
	
		'outputFields'        => [
			'result' => [
				'type' => 'String',
				'description' => __( 'Result operation as a json object', 'your-textdomain' ),
			]
		],
	
		'mutateAndGetPayload' => function( $input, $context, $info ) {
			$fn = "listMetadata";
			$pn = "veepdotai-";
			$prompt_prefix = "ai-prompt-";
	
			$contentId = sanitize_text_field( $input['contentId'] );
			$metadata = sanitize_text_field( $input['metadata'] );

			$user = wp_get_current_user();
			log( "$fn: user: " . print_r( $user, true) . "." );
	
			$result = get_post_meta( $contentId, "tvfMetadata", true );
			log( "$fn: tvfMetadata: result: $result" );

			$data = [];
			if ( $result ) {
				log( "$fn: result: true" );
				$data = [
					"user_id" => $user->user_login,
					"result" => $result,
				];
			} else {
				$data = [
					"user_id" => $user->user_login,
					"result" => false,
				];
			}
	
			return [
				'result' => json_encode( $data ),
			];
		}
	] );
}
