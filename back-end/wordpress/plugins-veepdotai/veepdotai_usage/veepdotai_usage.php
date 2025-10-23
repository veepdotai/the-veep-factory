<?php
/**
 * @package Veepdotai
 * @version 0.0.1
 */

namespace Veepdotai\Stats;

if (! defined('ABSPATH')) { exit; }

require 'vendor/autoload.php';

use Http\Client\Curl\Client as CurlClient;
use Http\Discovery\Psr17FactoryDiscovery;

/*
Plugin Name: veepdotai_stats
Plugin URI: http://wordpress.org/plugins/veepdotai_stats/
Description: Records veepdotai stats (usage...)
Author: JC Kermagoret
Version: 0.0.1
Author URI: http://www.veep.ai
*/
/**
 * Records usage stats
 */

add_action("write_generation_details", 'Veepdotai\Stats\Usage::write_generation_details', 10, 2);
add_action("write_transcription_details", 'Veepdotai\Stats\Usage::write_transcription_details', 10, 2);

Class Usage {

	public static function log( $msg ) {
		$root = "Veepdotai\Usage";
		\Veepdotai_Util::log( "debug", $root . ' | ' . $msg );
	}

	public static function init() {
		self::log( __METHOD__ . ": Initialization usage writing client" );

		$USAGE_ORG_ID = "f45de078ce989a93";
		$USAGE_TOKEN = "mZt8H6iCCSL-cPuXsELl4b2xKvRVSbNXIiXNmsIppO_lL4eJYzHGrOUv4Y75yCzLaGVt7_d5xr6GkbCfj6oJ2w==";
		$USAGE_SERVER = "https://m.veep.ai";
		$USAGE_BUCKET_NAME = "usage";
	
		$url = $USAGE_SERVER;

		$curlOptions = [
			CURLOPT_CONNECTTIMEOUT => 30, // The number of seconds to wait while trying to connect.
		];
		$curlClient = new CurlClient(
			Psr17FactoryDiscovery::findRequestFactory(),
			Psr17FactoryDiscovery::findStreamFactory(),
			$curlOptions
		);

		$client = new \InfluxDB2\Client([
			"url" => $USAGE_SERVER,
			"token" => $USAGE_TOKEN,
			"bucket" => $USAGE_BUCKET_NAME,
			"org" => $USAGE_ORG_ID,
			"httpClient" => $curlClient,
			"precision" => \InfluxDB2\Model\WritePrecision::NS
		]);

		$write_api = $client->createWriteApi();

		return $write_api;
	}

	/**
	 *
	 * {
	 * 	"id":"chatcmpl-9cBaZhtZ073jxMqF1t9kkiitHeohe",
	 * 	"object":"chat.completion",
	 * 	"created":1718888039,
	 * 	"model":"gpt-4-0125-preview",
	 * 	"choices":[
	 * 		{
	 * 			"index":0,
	 * 			"message": {
	 * 				"role": "assistant",
	 * 				"content":"ud83dude80 **Mise u00e0 jour importante du Pu00f4le Ressource Circonscription de DOURDAN ud83dude80**nnud83dudcc5 Le ... ! ud83dudcaann#u00c9ducation #Collaboration #Innovation #RASED #Pu00f4leRessource #u00c9ducationInclusive"
	 * 			},
	 * 			"logprobs": null,
	 * 			"finish_reason":"stop"
	 * 		}],
	 * 	"usage":{
	 * 		"prompt_tokens":2198,
	 * 		"completion_tokens":511,
	 * 		"total_tokens":2709
	 * 	},
	 * "system_fingerprint":null
	 * }
	 */
	public static function write_generation_details( $user_key, $content_id ) {
		self::log( __METHOD__ . ": Test write_generation_details_call: {$user_key}/{$content_id}." );

		try {

			$user = $user_key ? $user_key : wp_get_current_user()->user_email;
			$write_api = self::init();

			$post = get_post( $content_id );
			$meta = get_post_meta( $content_id );

			$details_string = $meta["veepdotaiDetails"][0];
			self::log( __METHOD__ . ": details_string: " . $details_string );

			$details = json_decode( $details_string );
			self::log( __METHOD__ . ": details: " . print_r( $details, true) );

			$content = 'usage,'
						// tags
						. 'model=' . ($details->model ? $details->model : 'none')
						. ',email=' . $user

						// fields and values 
						. ' '
						. 'prompt_tokens=' . $details->usage->prompt_tokens
						. ',completion_tokens=' . $details->usage->completion_tokens
						. ',total_tokens=' . $details->usage->total_tokens

						// timestamp
						. ' '
						. $details->created ;

			self::log("debug", "content: " . $content);

			$write_api->write( $content );
		} catch ( Exception $e ) {
			self::log( __METHOD__ .': exception: ' .  $e->getMessage() );
			// It's really annoying if we don't collect usage stats
			// because we can't prevent unallowed (and possibly unfair) usage
			// We try to send an email
			do_action( "veepdotai_notify", get_bloginfo('admin_email'), "Problem while writing generation stats. They are not collected!" );
		}

	}

	public static function write_transcription_details( $user_key, $content_id ) {
		self::log( __METHOD__ . ": Test write_transcription_details_call: {$user_key}/{$content_id}" );

		//$user = $user_key ? $user_key : \Veepdotai_Util::get_user_login();
		$user = $user_key ? $user_key : wp_get_current_user()->user_email;
		$write_api = self::init();

		$post = get_post( $content_id );
		$meta = get_post_meta( $content_id );

		self::log( __METHOD__ . ": details: " . print_r( $meta, true) );

		$inputType = $meta["veepdotaiInputType"][0];
		$content = 'usage,'
					// tags
					. 'model=' . ( $meta["veepdotaiInputType"][0] == "stream" ? 'whisper' : 'none' )
					. ',email=' . $user
					. ',input_type=' . $inputType
					. ' '
					// fields and values 
					. 'resource="' . ( in_array( $inputType, ["file", "stream", "url"] ) ? $meta["veepdotaiResource"][0] : 'string') . '"'
					. ',prompt_chars=' . strlen( $meta["veepdotaiTranscription"][0] )
					. ',prompt_tokens=' . str_word_count( $meta["veepdotaiTranscription"][0] )
					. ',parent_id=' . ( $post->parent_id ? $post->parent_id : 0 )
					. ',content_id=' . $post->ID
					. ' '

					// timestamp
					. strtotime( $post->post_date ) . "000000000";

		self::log( __METHOD__ . ": content: " . $content);

		try {
			$write_api->write( $content );
		} catch ( Exception $e ) {
			self::log( __METHOD__ .': exception: ' .  $e->getMessage() );
			// It's really annoying if we don't collect usage stats
			// because we can't prevent unallowed (and possibly unfair) usage
			// We try to send an email
			do_action( "veepdotai_notify", get_bloginfo('admin_email'), "Problem while writing transcription stats. They are not collected!" );
		}

	}

}