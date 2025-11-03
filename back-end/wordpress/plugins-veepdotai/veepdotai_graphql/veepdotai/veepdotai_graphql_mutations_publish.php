<?php

namespace Veepdotai\Graphql\Mutations\Publish;

//require_once 'config.php';
require_once __DIR__ . '/../vendor/autoload.php';
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

function upload_document($access_token, $upload_url, $content_path) {
	$fn = "upload_document";
	log( "$fn: upload_url: " . print_r( $upload_url, true) );
	log( "$fn: content_path: " . print_r( $content_path, true) );

	try {
		$client = new Client();
		$response = $client->request('POST', $upload_url, [
			'headers' => [
				"Authorization" => "Bearer " . $access_token,
			],
			"debug" => true,
			"body" => \GuzzleHttp\Psr7\stream_for(fopen($content_path, 'r'))
		]);
		log("$fn: response: " . print_r( $response, true ));
		if ($response->getStatusCode() == 201) {
			//$data = json_decode($response->getBody()->getContents(), true);
			log( "$fn: Success: " . print_r( $response, true ) );
			return true;
		} else {
			log("$fn: Error: " . print_r( $response, true) );
			return null;
		}

	} catch(Exception $e) {
		log( "$fn: Exception:" . print_r( $e, true ) );
		echo "JCK: " . $e->getMessage();
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
			"title" => "My title",
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
					"title" => "My title",
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
			//$data = json_decode($response, true);
			$data = $response;
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
			'contentId' => [
				'type' => 'String',
				'description' => __( 'Main content id, that gets all the data related to this object, not only the generated carousel reference', 'your-textdomain' ),
			],
			'lifecycleState' => [
				'type' => 'String',
				'description' => __( 'Content lifecycleState [DRAFT|PUBLISHED]. If DRAFT, it appears in post window when you click on Start a new post ', 'your-textdomain' ),
			],
			'visibility' => [
				'type' => 'String',
				'description' => __( 'Content visibility [PUBLIC...]. Only default PUBLIC is supported for the moment', 'your-textdomain' ),
			],
		],
	
		'outputFields'        => [
			'result' => [
				'type' => 'String',
				'description' => __( 'Result operation as a json object', 'your-textdomain' ),
			]
		],
	
		/**
		 * 
		 */
		'mutateAndGetPayload' => function( $input, $context, $info ) {
			$fn = "publishOnLinkedIn";
			$pn = "veepdotai-";
	
			$contentId = sanitize_text_field( $input['contentId'] );
			$lifecycleState = sanitize_text_field( $input['lifecycleState'] );
			$lifecycleState = $lifecycleState == "" ? "DRAFT" : $lifecycleState;
			$visibility = sanitize_text_field( $input['visibility'] );
			$visibility = $visibility == "" ?  "PUBLIC" : $visibility;
			
			$post = get_post( $contentId );
			$meta = get_post_meta( $contentId );
			$generatedArtefact = $meta["tvfGeneratedAttachment"][0];
			$postContent = $post->post_content;

			$content = preg_replace("/(.*)---[^-]*---.*/mis", "$1", $postContent);

			$user = wp_get_current_user();
			$snd = \Veepdotai_Util::get_option("ai-social-networks-data");
			$json_snd = json_decode( $snd );
			$access_token = $json_snd->linkedin->access_token;
			$owner_id = $json_snd->linkedin->owner_id;

			if ( ! $owner_id) {
				$owner_id = get_linkedin_id($access_token);
				$json_snd->linkedin->owner_id = $owner_id;
				\Veepdotai_Util::set_option("ai-social-networks-data", json_encode($json_snd));
			}

			$meta_input = ["publicationStatus"];

			// For example
			// * publishContentOnLinkedIn("content", "12345") => this is a contentId => go and get the corresponding content to publish
			// * publishContentOnLinkedIn("content", "some text in markdown format") => this is content to publish

			// InitializeUploadRequest
			$result = initialize_upload($access_token, $owner_id);
			log( "$fn: uploadUrl: " . print_r( $result, true ) );

			$upload_url = $result["value"]["uploadUrl"];
			log( "$fn: upload_url: " . $upload_url );

			$document = $result["value"]["document"];
			log( "$fn: document: " . $document );

			$wp_root_dir = wp_upload_dir()['basedir'];
			$content_storage_path_in_uploads = $generatedArtefact;
			$content_path = $wp_root_dir . $content_storage_path_in_uploads;

			$result = upload_document($access_token, $upload_url, $content_path);

			$resource = create_resource($access_token, $owner_id, $content, $document, $lifecycleState, $visibility);
			$result = create_post($access_token, $resource);

			$data = [];
			if ( $result ) {
				log( "$fn: result: " . print_r( $result, true) );
				$data = [
					"user_id" => $user->user_login,
					"content_id" => $document,
					"result" => true,
				];
			} else {
				$data = [
					"user_id" => $user->user_login,
					"content_id" => null,
					"result" => false,
				];
			}
	
			log( "$fn: data: " . print_r( $data, true ));
			return [
				"result" => json_encode( $data ),
			];
		}
	] );
}

