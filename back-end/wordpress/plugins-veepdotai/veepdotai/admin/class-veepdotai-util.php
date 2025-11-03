<?php

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Veepdotai
 * @subpackage Veepdotai/Util
 * @author     Jean-Christophe Kermagoret <jck@veep.ai>
 */

use League\CommonMark\GithubFlavoredMarkdownConverter;
use Orhanerday\OpenAi\OpenAi;
use \Delight\Str\Str;

class Veepdotai_Util {

	public static function filter_params( $post ) {
		return array_intersect_key(
			$post,
			array_flip( preg_grep( '/^' . VEEPDOTAI_PLUGIN_NAME . '/', array_keys( $post ) ) )
		);
	}

	public static function generate_audio( $url ) {
		$url_escaped = $url;
		self::log( 'debug', "Generates an audio component for $url_escaped" );

		$audio = '<!-- wp:audio -->'
					. '<figure class="wp-block-audio">'
						. '<audio controls src="' . $url_escaped . '"></audio>'
					. '</figure>'
				. '<!-- /wp:audio -->';

		return $audio;
	}

	public static function generate_paragraph( $text, $css_class_name = '' ) {
		$para_escaped = esc_html( $text );
		self::log( 'debug', "Generates a paragraph component for $para_escaped" );
		$css_class_name_escaped = esc_attr( $css_class_name );

		$paragraph = '<!-- wp:paragraph {"className":"' . $css_class_name_escaped . '","dynamicAttributes":{"toolsetDSVersion":"230000"}} -->'
					. '<p class="' . $css_class_name_escaped . '">' . $para_escaped . '</p>'
					. '<!-- /wp:paragraph -->';

		return $paragraph;
	}

	/**
	 * Creates WP equivalent of p as wp:paragraph
	 * 
	 * If params are null then returns only the starting tags, otherwise ALSO
	 * returns content and closing tags.
	 */
	public static function html2wp_p( $text = null, $css_class_name = '' ) {
		$css_class_name_escaped = esc_attr( $css_class_name );

		$paragraph = '<!-- wp:paragraph {"className":"' . $css_class_name_escaped . '","dynamicAttributes":{"toolsetDSVersion":"230000"}} -->'
		. '<p class="' . $css_class_name_escaped . '">';

		if (null != $text) {
			$para_escaped = esc_html( $text );
			self::log( 'debug', "Generates a paragraph component for $para_escaped" );

			$paragraph .= $para_escaped . '</p>'
						. '<!-- /wp:paragraph -->';
		}

		return $paragraph;
	}

	/**
	 * Creates WP equivalent of div as wp:group
	 * 
	 * If params are null then returns only the starting tags, otherwise ALSO
	 * returns content and closing tags.
	 */
	public static function html2wp_div( $text = null, $css_class_name = '', $id = '' ) {
		$css_class_name_escaped = esc_attr( $css_class_name );
		$id_escaped = esc_attr( $id );

		$content = '<!-- wp:group {"align":"wide","className":"' . $css_class_name_escaped . '","layout":{"type":"constrained"}} -->'
							. '<div class="wp-block-group alignwide ' . $css_class_name_escaped . '" id="' . $id_escaped . '">';
		
		$wp_group_end = '</div><!-- /wp:group -->';
		
		if (null != $text) {
			$content_escaped = esc_html( $text );
			self::log( 'debug', "Generates a group component for $content_escaped" );

			$content .= $content_escaped . $wp_group_end;
		}

		return $content;
	}

	public static function html2wp_div_end() {
		return '</div><!-- /wp:group -->';
	}

	/**
	 * Converts markdown in html and replaces <p> in WP equivalent (wp:paragraph)
	 */
	public static function get_random_id( $prefix = 'veepdotai-inline-') {
		return $prefix . bin2hex( random_bytes(4) );
	}

	public static function generate_html_from_markdown( $markdown, $TARGET = 'WP' ) {
		$output = ( new GithubFlavoredMarkdownConverter() )->convert( $markdown );

		$id = self::get_random_id("");
		if ( 'WP' == $TARGET ) {
			$wp_paragraph_start = '<!-- wp:paragraph {"className":"veep_para","dynamicAttributes":{"toolsetDSVersion":"230000"}} -->'
									. '<p data-veep-id="' . $id .'" class="veep_para">';
			$wp_paragraph_end = '</p><!-- /wp:paragraph -->';

			$output = preg_replace('#<p>#', $wp_paragraph_start, $output);
			$output = preg_replace('#</p>#', $wp_paragraph_end, $output);

			$wp_heading_start = '<!-- wp:heading {"textAlign":"left","className":"veep_title","dynamicAttributes":{"toolsetDSVersion":"230000"}} -->';
			$wp_heading_end = '<!-- /wp:heading -->';

			$wp_heading_class = 'class="wp-block-heading has-text-align-left veep_title"';

			$output = preg_replace('#<h(.)>#', "$wp_heading_start" . '<h$1 ' . "$wp_heading_class>", $output);
			$output = preg_replace('#</h(.)>#', '</h$1>' . "$wp_heading_end" , $output);

			$output = preg_replace('#<p>(<p[^>]*)#', '$1', $output);
			$output = preg_replace('#</p></p>#', '</p>', $output);
			$output = preg_replace('#<p[^>]*>(<h[^>]*)#', '$1', $output);
			$output = preg_replace('#(</h.>)</p>#', '$1', $output);

			//$output = preg_replace('#</p>[[:space:]]*<br>[[:space:]]*<p#s', '</p>\n<p', $output);
			$output = preg_replace('#<br>#', '', $output);

		}

		return $output;
	}

	/**
	 * Extracted data are saved into the options table before being returned to the user.
	 */
	public static function reset( $option, $i = 1) {
		Veepdotai_Util::set_option( "ai-section-edcal$i-$option", "");
	}

	public static function reset_options( $i =1 ) {

		$options = ["title", "description", "content", "linkedin", "themes", "hashtags", "keywords", "img-prompt"];
		array_map( 'self::reset', $options);
	}

	public static function get_options( $i = 1 ) {

		$newdata = [
			"title" => self::get_option( 'ai-section-edcal' . $i . '-title'),
			"description" => self::get_option( 'ai-section-edcal' . $i . '-description'),
			"content" => self::get_option( 'ai-section-edcal' . $i . '-content'),
			"linkedin" => self::get_option( 'ai-section-edcal' . $i . '-linkedin'),
			"themes" => self::get_option( 'ai-section-edcal' . $i . '-themes'),
			"hashtags" => self::get_option( 'ai-section-edcal' . $i . '-hashtags'),
			"keywords" => self::get_option( 'ai-section-edcal' . $i . '-keywords'),
			"image" => self::get_option( 'ai-section-edcal' . $i . '-image')
		];

		return $newdata;
	}

	public static function article_generation_save_extracted_data( $i, $data ) {

		if ( property_exists($data, 'title') ) { self::set_option( 'ai-section-edcal' . $i . '-title', $data->title ); }
		if ( property_exists($data, 'description') ) { self::set_option( 'ai-section-edcal' . $i . '-description', $data->description ); }
		if ( property_exists($data, 'content') ) { self::set_option( 'ai-section-edcal' . $i . '-content', $data->content ); }
		if ( property_exists($data, 'linkedin') ) { self::set_option( 'ai-section-edcal' . $i . '-linkedin', $data->linkedin ); }
		if ( property_exists($data, 'themes') ) { self::set_option( 'ai-section-edcal' . $i . '-themes', $data->themes ); }
		if ( property_exists($data, 'hashtags') ) { self::set_option( 'ai-section-edcal' . $i . '-hashtags', $data->hashtags ); }
		if ( property_exists($data, 'keywords') ) { self::set_option( 'ai-section-edcal' . $i . '-keywords', $data->keywords ); }
		if ( property_exists($data, 'image') ) { self::set_option( 'ai-section-edcal' . $i . '-img-prompt', $data->image ); }

		return $data;
	}

	public static function isJson( $string ) {
		json_decode( $string );
		return json_last_error() === JSON_ERROR_NONE;
	}

	/**
	 * Generic data extraction
	 * 
	 * @param data_text some simple text OR some json encoded string
	 * @param key a string that will be used as a key to store some simple text (not json encoded)
	 */
	public static function save_extracted_data( $_data_text, $key = null, $option_prefix = "ai-section-edcal1" ) {
		
		if ( $key )	{
			// data_text contains a simple string with, maybe, some prohibited cntrl chars
			// which would prevent json encoding
			if ( isJson( $data_text ) ) {
				// data_text contains a json encoded string
				$_data = $_data_text; 
				self::log( "debug", "Encoded JSON data: " . print_r($_data, true));

				$data = json_decode( $_data );
				self::log( "debug", "JSON decoded data: " . print_r($data, true));
			} else {
				$data_text = preg_replace( '/[[:cntrl:]]/s', "<EOL>", $_data_text);
				$data = (object) [ $key => $data_text];
			}
		} else {
			// Should never happen in the new implemented behaviour

			// data_text contains a json encoded string
			$_data = $_data_text; 
			self::log( "debug", "Encoded JSON data: " . print_r($_data, true));

			$data = json_decode( $_data );
			self::log( "debug", "JSON decoded data: " . print_r($data, true));
		}

		$keys = (array) $data;
		foreach ($keys as $key => $value) {
			if ( property_exists($data, $key) ) {
				//self::set_option( $option_prefix . '-' . $key, $value );
				self::set_option( $option_prefix . '-' . $key, preg_replace( "/<EOL>/s", "\n", $value ) );
			}
		}

		return $data;
	}

	public static function update_option( $param, $value, $target_username = null ) {
		return self::set_option( $param, $value, $target_username );
	}

	public static function convert_binary_data( $user, $user_param_name, $value ) {
		$alea = uniqid();
		$filename = self::get_storage_directory() . "/option-${alea}.data";
		$fp = fopen($filename, "wb");

		if (fwrite($fp, $value) === FALSE) {
			self::log( "debug", "Cannot write to file $filename." );
			exit;
		}
		
		self::log( "debug", "Binary data have been written to $filename." );
		fclose($fp);
		
		$format_input = "windows-1252";
		$format_output = "utf-8";
		$cmd = "iconv -c -f ${format_input} -t ${format_output} $filename > $filename.utf8";
		
		self::log( "debug", "Executing the following cmd: $cmd." );
		
		$output = null;
		$retval = null;

		$result = exec( $cmd, $output, $retval );
		self::log( "debug", __METHOD__ . ": exec: iconv conversion with status: result: $result.\n" );
		self::log( "debug", __METHOD__ . ": exec: returned with status: retval: $retval and output:\n" );
		self::log( "debug", __METHOD__ . ": exec: output Details: " . print_r( $output, true ) );

		self::log( "debug", __METHOD__ . ": result: $result.");
		/*
		if ( $retval == 127 ) {
			return null;
		}
		*/
		$value = file_get_contents( "$filename.utf8" );
		$res = update_option( $user_param_name, $value );
		unlink($filename);
		return $res;
	}

	public static function set_option( $param, $value, $target_username = null ) {
		$pn   = VEEPDOTAI_PLUGIN_NAME;
		$user = self::get_user_login();

		// if (preg_match("/^" . $user . '-' . $pn . "/", $param)) {
		if ( preg_match( '/^' . $pn . '/', $param ) ) {
				// The param starts with the $pn, so we don't add the $pn again
			$param_name = $param;
		} else {
			// We add it
			$param_name = $pn . '-' . $param;
		}

		if ( $target_username ) {
			$user = $target_username;
		}

		$user_param_name = $user . '-' . $param_name;
		self::log( 'debug', 'Setting option: ' . $user_param_name . ' = ' . $value );

		$res = update_option( $user_param_name, $value );
		self::log( 'debug', 'Setting option result: ' . $res . '.' );
		
		if ( preg_match( '/transcription/', $param ) ) {
			if ( ! get_option( $user_param_name ) ) {
				self::log( 'debug', "Setting option through binary serialization because transcription is empty and should not." );
				$res = self::convert_binary_data( $user, $user_param_name, $value );
				//$res = $value;
				self::log( 'debug', "Update option after binary conversion ? res = ${res}." );
			}
		}
		self::log( 'debug', "Option has been set: " . $res . "." );

		return $res;
	}

	/**
	 * @TODO This function must be refactored and test if $pn is present
	 * in the param name (because it is present everywhere...)
	 */
	public static function delete_option( $param, $target_username = null ) {
		$pn = VEEPDOTAI_PLUGIN_NAME;

		self::log( 'debug', 'delete_option: plugin name pn: ' . $pn );
		self::log( 'debug', 'delete_option: $param: ' . $param );

		$username = self::get_user_login();
		self::error_log( 'delete_option: username: ' . print_r( $username, true) . "\n" );

		//delete_option( $username . '-veepdotai-' . $param );		
		return delete_option( $username . '-' . $param );
	}

	public static function get_option( $param, $target_username = null ) {
		$pn                 = VEEPDOTAI_PLUGIN_NAME;
		$default_admin_user = 'admin';
		// Don't use self::get_option or it will enter in an endless loop
		$default_user       = get_option( "admin-veepdotai-default-username" ) ?? 'demo';

		self::log( 'debug', 'get_option: pn: ' . $pn );
		self::log( 'debug', 'get_option: param: ' . $param );

		$username = self::get_user_login();
		self::error_log( 'Username: ' . print_r( $username, true) . "\n" );

		$option     = get_option( $username . '-' . $pn . '-' . $param );
		self::log( 'debug', 'get_option: option: ' . $option );

		if ( $option ) {
			return $option;
		}

		$user_data = WP_User::get_data_by( 'login', $username );
		$user = new WP_User( $user_data->ID );

		// If keys are empty, we use admin keys
		if ( preg_match( '/^openai-api-key/', $param ) ) {
			self::log( 'debug', 'Option: admin-veepdotai-' . $param );
			return get_option( $default_admin_user . '-veepdotai-' . $param );
		} else if ( preg_match( '/^mistral-api-key/', $param ) ) {
			self::log( 'debug', 'Option: admin-veepdotai-' . $param );
			return get_option( $default_admin_user . '-veepdotai-' . $param );
		} elseif ( preg_match( '/^pexels-api-key/', $param ) ) {
			self::log( 'debug', 'Option: admin-veepdotai-' . $param );
			return get_option( $default_admin_user . '-veepdotai-' . $param );
		} elseif ( preg_match( '/^ffmpeg/', $param ) ) {
			self::log( 'debug', 'Option: admin-veepdotai-' . $param );
			return get_option( $default_admin_user . '-veepdotai-' . $param );
		} elseif ( preg_match( '/^default-user/', $param ) ) {
			self::log( 'debug', 'Option: admin-veepdotai-' . $param );
			return get_option( $default_admin_user . '-veepdotai-' . $param );
		} elseif ( preg_match( '/(img-)?!prompt/', $param ) ) {
			self::log( 'debug', 'Option: admin-veepdotai-' . $param );
			return get_option( $default_user . '-veepdotai-' . $param );
		} else {
			if ( in_array( 'veepdotai_role_user', (array) $user->roles ) ) {
				if ( preg_match( '/edstrat0-keywords/', $param )
					|| ( preg_match( '/edstrat0-strategy/', $param ) ) ) {
					return get_option( $default_user . '-veepdotai-' . $param );
				}
			}
			self::log( 'debug', 'User name: ' . $username );

			// if (preg_match("/^" . $user . '-' . $pn . "/", $param)) {
			if ( preg_match( '/^' . $pn . '/', $param ) ) {
				// The param starts with the $pn, so we don't add it
				$param_name = $param;
			} else {
				// We add it
				$param_name = $pn . '-' . $param;
			}

			$user_param_name = $username . '-' . $param_name;
			self::log( 'debug', 'Getting option: ' . $user_param_name );
			$option = get_option( $user_param_name );

			// A prompt is required to work correctly.
			if ( ! $option && preg_match( '/-prompt/', $param ) ) {
				self::log( 'debug', 'Option: admin-veepdotai-' . $param );
				return get_option( $default_user . '-veepdotai-' . $param );
			}
			return $option;
		}
	}

	/**
	 * Filters, converts and splits the audio file so it can be transcribed:
	 * - Converts the file in .wav
	 * - Splits the file in parts < 25 Mo
	 * - Parallelizes transcription
	 * 
	 * Returns all the concatenated transcriptions in one file
	 */

	public static function get_content_from_audio( $output, $pid ) {
		Veepdotai_Util::log( 'debug', 'Entering get_content_from_audio');

		// Process the file through the whisper API from ChatGPT
		$llm_ai_key = self::get_option( 'openai-api-key' );
		$llm_ai     = new OpenAi( "openai", $llm_ai_key );

		$c_file = curl_file_create( $output );

		$params = array(
			'model' => 'whisper-1',
			'file'  => $c_file,
			'prompt' => 'Add ponctuation and add new lines.'
		);

		Veepdotai_Util::log( 'debug', 'get_content_from_audio: Starting transcription.');
		$raw = $llm_ai->transcribe( $params );
		Veepdotai_Util::log( 'debug', 'get_content_from_audio: Transcribing finished.');

		// We should add error management... :-(
		self::store_data( $raw, 'question-transcription.json', $pid );

		$raw_obj = json_decode( $raw );
		Veepdotai_Util::log( 'debug', 'get_content_from_audio: raw_obj: ' . print_r( $raw_obj, true ));

		if ( isset ( $raw_obj->error ) ) {
			Veepdotai_Util::log( 'debug', 'get_content_from_audio: error:' .$raw_obj->error->message );
			$transcription = null;
		} else {
			$transcription = $raw_obj->text;
		}

		return $transcription;
	}

	/**
	 * Gets prompt based on option name. Returns default if none.
	 */
	/*
	public static function get_prompt( $option, $default_prompt ) {
		$specific_prompt = self::get_option( $option );
		if ( $specific_prompt ) {
			self::log( "Specific prompt: $specific_prompt");
			return $specific_prompt;
		} else {
			self::log( "No specific prompt: use default one: $default_prompt");
			return $default_prompt;
		}
	}
	*/
	
	/**
	 * Creates a chat or completion prompt, which allows ChatGPT 3.5 or 4, according the way the prompt is passed
	 * 
	 */
	public static function get_params_ai( $llm, $_params, $max_tokens = 2000 ) {
		if ( is_string( $_params ) ) {
			self::log( 'debug',  '# of chars: ' . strlen( $_params ) );
			self::log( 'debug', '# of words: ' . str_word_count( $_params ) );
			// $params is a prompt
			$params = array(
				'model'             => 'text-davinci-003',
				'prompt'        	=> $_params,
				'temperature'       => 0.7,
				'max_tokens'        => $max_tokens,
				'frequency_penalty' => 0,
				'presence_penalty'  => 0.6				
			);
		} else {
			// An object is provided. All the params must be provided for the moment
			$params = array(
				'temperature'       => $_params[ 'temperature' ] ?? 0.7,
				'max_tokens'        => $_params[ 'max_tokens' ] ?? $max_tokens,
				'frequency_penalty' => $_params[ 'frequency_penalty' ] ?? 0,
				'presence_penalty'  => $_params[ 'presence_penalty' ] ?? 0.6,				
				'top_p'  => $_params[ 'top_p' ] ?? 1,
			);

			if ( isset( $_params[ 'prompt' ] ) ) {
				$params[ 'prompt' ] = $_params[ 'prompt' ];
				$params[ 'model' ] = $_params[ 'model' ] ?? 'text-davinci-003';
			} else if ( isset( $_params[ 'messages' ] )
						&& is_string( $_params [ 'messages' ] ) ) {

				$params[ 'llm' ] = $_params[ 'llm' ];
				$params[ 'model' ] = $_params[ 'model' ];
				$params[ 'max_tokens' ] = $_params[ 'max_tokens' ];
				$params[ 'messages' ] = array(
					[
						'role' => 'system',
						'content' => $_params[ 'role' ]
					],
					[
						'role' => 'user',
						'content' => $_params[ 'messages' ]
					]
				);

				self::log( 'debug', 'AI params: ' . print_r( $params, true));

				if ( $llm != "openai" ) {
					unset($params['frequency_penalty']);
					unset($params['presence_penalty']);
				}
				unset($params['llm']);
			} else if ( isset( $_params[ 'messages' ] ) ) {
				// It's an object
				$params[ 'model' ] = $_params[ 'model' ] ?? 'gpt-3.5-turbo-16k';
				$params[ 'messages' ] = $_params[ 'messages' ];
			} else {
				// There is a big problem
				self::log( 'debug', 'Big problem: no prompt, no message. Can\'t work.');
			}
		}

		return $params;
	}

	public static function get_date() {
		return date_format( date_create(), 'Y-m-d\TH:i:s.u' );	
	}

	/**
	 * Get contents from AI by using completion ot chat completion API.
	 * 
	 * The choice is important because chat completion API gives the oppotunity to use the more advanced models like ChatGTP 3.5 or 4.
	 * 
	 */
	public static function get_content_from_ai( $llm, $_params, $key, $max_tokens = 2000 ) {

		$params = self::get_params_ai( $llm, $_params, $max_tokens = 2000 );

		$llm_ai = new OpenAi( $llm, $key );
		
		// Veepdotai_Util::log_direct("<p class='params'>" . $params . ".</p>");
		self::log( 'debug', 'Start (chat?) completion: ' . date_format( date_create(), 'Y-m-d\TH:i:s.u' ) . '\n' );	

		if ( isset( $params[ 'prompt' ] ) ) {
			self::log( 'debug', 'Normal prompt' );
			// returns a string
			$raw = $llm_ai->completion( $params );
		} else {
			self::log( 'debug', 'Chat prompt' );
			// returns a json object so we convert it into a string
			$raw_chat = $llm_ai->chat( $params );

			//$raw_js = json_decode( $raw_chat );
			// Data should be logged
			//$content = $raw_js->choices[0]->message->content;
			//$raw_js->choices[0]->text = $content;
			//$raw = json_encode( $raw_js );
			$raw = $raw_chat;
		}

		self::log( 'debug', 'End (chat?) completion: ' . date_format( date_create(), 'Y-m-d\TH:i:s.u' ) . '\n' );	

		return $raw;
	}

	/**
	 * Based on ginsen/img-finder which works with pexels and unsplash repositories
	 */
	public static function get_images( $prompt ) {
		$pexel_auth    = self::get_option( 'pexels-api-key' );
		$unsplash_auth = self::get_option( 'unsplash-api-key' );
		$settings      = array(
			'img-finder' => array(
				'repositories' => array(
					ImgFinder\Repository\PexelsRepository::class => array(
						'params' => array(
							'authorization' => $pexel_auth,
						),
					),
					ImgFinder\Repository\UnsplashRepository::class => array(
						'params' => array(
							'authorization' => $unsplash_auth,
						),
					),
				),
			),
		);

		$config = ImgFinder\Config::fromArray( $settings );
		$finder = new ImgFinder\ImgFinder( $config );

		// $request  = Request::set('nature', ['pexels', 'unsplash']);

		$request  = ImgFinder\Request::set( $prompt, array( 'pexels' ) );
		$response = $finder->search( $request );

		$images_urls = $response->toArray();
		// var_dump($images_urls);
		self::log( 'debug', 'Prompt image: ' . $prompt );
		self::log( 'debug', 'ImagesUrl: ' . count( $images_urls ) );

		return $images_urls;
	}

	public static function get_image( $prompt ) {
		$images = self::get_images( $prompt );
		if ( ! empty( $images ) ) {
			$image = $images[0];
		} else {
			$image = '';
		}

		return $image;
	}

	public static function get_chain( $chain ) {
        if ( is_array( $chain ) ) {
            return $chain;
        } else {
            return preg_split("/\s*,\s*/", $chain);
        }
	}

	public static function encode_prompt_id( $id ) {
		return preg_replace("/=/", "", base64_encode( $id ));
	}

	public static function decode_prompt_id( $id ) {
		return base64_decode( $id );
	}

	public static function get_storage_filename( $suffix ) {
		$date = date_create();
		return self::get_storage_directory( $date )
				. '/' . date_format( $date, 'Ymd\THis.u' ) . '-' . $suffix;
	}

	/**
	 * Creates user directories based on the 3 first letters of their username
	 * 
	 */
	public static function get_user_storage_directory() {
		$pn = VEEPDOTAI_PLUGIN_NAME;

		$user_login = self::get_user_login();
		$directory  = VEEPDOTAI_DATA_DIR . "/users"
						. "/". $user_login[0]
						. "/". $user_login[1]
						. "/". $user_login[2]
						. "/". $user_login[3]
						. "/" . $user_login;

		return self::init_directories( $directory );
	}

	public static function get_common_storage_directory() {
		return VEEPDOTAI_DATA_DIR;
	}

	public static function get_run_directory() {
		return self::init_directories( self::get_common_storage_directory() . "/var/run" );
	}

	public static function get_user_run_directory() {
		return self::init_directories( self::get_user_storage_directory() . "/var/run" );
	}

	public static function get_log_directory() {
		return self::init_directories( self::get_common_storage_directory() . "/var/log" );
	}

	public static function get_user_log_directory() {
		return self::init_directories( self::get_user_storage_directory() . "/var/log" );
	}

	public static function get_storage_directory( $_date = null ) {
		if ( $_date ) {
			$date = $_date;
		} else {
			$date = date_create();
		}

		$year       = date_format( $date, 'Y' );
		$month      = date_format( $date, 'm' );
		$day        = date_format( $date, 'd' );

		return self::get_user_storage_directory() . "/$year/$month/$day";
	}

	public static function get_data( $filename ) {

		$date_extracted = preg_match( '/(\d{4}\d{2}\d{2}T\d{2}\d{2}\d{2})/', $filename );
		if ( ! $date_extracted ) {
			$data = file_get_contents( self::get_storage_directory() . '/' . $filename );
		} else {
			$date = date_create( $date_extracted[1] );
			$data = file_get_contents( self::get_storage_directory( $date ) . '/' . $filename );
		}
		return $data;
	}

	/**
	 * NOT USED FOR THE MOMENT
	 * 
	 * For microsecodns supports.
	 * 
	 */
	public static function date_create( $date = null ) {
		$dateObj = DateTime::createFromFormat('0.u00 U', microtime());
		$dateObj->setTimeZone(new DateTimeZone('Europe/Paris'));

		return $dateObj;
	}

	/**
	 * Creates the complete path based on the provided date or current one if none is provided.
	 * 
	 * @param $_date must be in the date_create() format
	 * 
	 * @return String|bool The corresponding directory to the date if already exists or creation succeeds, null otherwise
	 */
	public static function create_directories( $_date = null) {
		$date = $_date;
		if ( ! $date ) {
			$date = date_create();
		}
		$directory = self::get_storage_directory( $date );

		/*
		if ( file_exists( $directory ) ) {
			return $directory;
		} else {
			$result = mkdir( $directory, 0777, true );	// Recursive creation
			self::log( 'debug', 'Did ' . $directory . ' directory creation succeed? ' . $result);
	
			if ( $result ) {
				return $directory;
			} else {
				return null;
			}	
		}
		*/
		return self::init_directories( $directory );
	}

	public static function init_directories( $directory ) {
		if ( file_exists( $directory ) ) {
			return $directory;
		} else {
			$result = mkdir( $directory, 0777, true );	// Recursive creation
			self::log( 'debug', 'Did ' . $directory . ' directory creation succeed? ' . $result);
	
			if ( $result ) {
				return $directory;
			} else {
				return null;
			}	
		}
	}

	/**
	 * The content is stored based on user login
	 */
	public static function store_data( $content, $filename, $pid ) {
		// Creates the provided directory
		// Calling create_directories doesn't work!!!
		// $directory = Veepdotai_Util::create_directories();
		$date      = date_create();
		$directory = self::create_directories( $date );
		//$pid = getmypid();
		$abs_filename = $directory
							. '/' . date_format( $date, 'Ymd\THis.u' ) . '-' . $pid . '-'
								. $filename;

		$r = file_put_contents( $abs_filename, $content );

		if ( !$r ) {
			return null;
		} else {
			return $abs_filename;
		}
	}

	/**
	 * Returns a js object
	 */
	public static function convert_to_valid_json( $text ) {
		$string_json = null;
		$results = null;
		if ( strpos( $text, ":::" ) >= 0 ) {
			self::log( 'debug', 'Processing through ::: fixer');
			$string_json1 = self::fix_pseudo_yaml( $text );
			$string_json = self::fix_pseudo_yaml2( $string_json1 );
			self::log( 'debug', 'After processing through ::: fixer' . $string_json);
			//self::error_log('After fixer: ' . $string_json);

			$results = json_decode( $string_json );

			foreach( $results as $key => &$value ) {
				$value = preg_replace( "/<EOL>/", "\n", $value );
			}

			unset( $value );

		} else {
			self::log( 'debug', 'Processing through normal fixer');
			$string_json = self::fix_json( $text );
			$results = json_decode( $string_json );
		}

		if ( $results ) {
			self::error_log( 'OK' );

			return $results;
		} else {
			self::error_log( 'JSON nok.' );
			return self::get_last_error();
		}
	}

	public static function replace_double_quotes( $text ) {
		return preg_replace( '/"/', "'", $text );
	}
	
	public static function fix_key_value( $var_name, $text ) {
		$suffix = "<EOL>";
		$start = ":::";
		$limiter_start = $suffix;
	
		//return preg_replace('/' . $start . ' ' . $var_name . ': (.*?)<EOL>/', '"' . $var_name . '": ' . "\"$1\"," . $suffix, $text);
		//return preg_replace('/' . $start . ' ' . $var_name . ': (.*?)<EOL>/', '"' . $var_name . '": ' . "\"$1\"," . $suffix, $text);
		return preg_replace(
			'/:::' . $var_name . ':(((?!:::).)*)/',
			':::"' . $var_name . '":' . '"' . self::replace_double_quotes( "$1" ) . '"',
			$text
		);
	}

	public static function fix_pseudo_yaml( $text ) {
		$i = 0;
		self::log('debug', "*** step $i\n\n:" . $text); $i++;
		$text = preg_replace('/:smiley:/', "<smiley>", $text);
		self::log('debug', "*** step $i\n\n:" . $text); $i++;
		
		$text = preg_replace( '/(\\\r|\\\n|\s|\t)*:::(\\\r|\\\n|\s|\t)*/s', ":::", $text);
		$text = preg_replace( '/[[:cntrl:]]/s', "<EOL>", $text);
		$text = preg_replace('/---/', "", $text);

		return $text;
	}

	public static function fix_pseudo_yaml2( $text ) {
		$i = 2;
		//self::log('debug', "*** step $i\n\n:" . $text); $i++;

		$text = preg_replace('/"/', "'", $text);

		//$text = preg_replace( '/.*"text": "(.*)"index".*/s', "$1", $text );
		$text = preg_replace( '/.*"content":"(.*)},"finish_reason".*/s', "$1", $text );
		self::log('debug', "*** step $i\n\n:" . $text); $i++;

		self::log('debug', "*** step $i\n\n:" . $text); $i++;

		$text = preg_replace( '/",(<EOL>|\s)*$/s', "", $text);
		self::log('debug', "*** step $i\n\n:" . $text); $i++;
		$text = preg_replace('/(<EOL>)*:::(<EOL>)*/', ":::", $text);
		self::log('debug', "*** step $i\n\n:" . $text); $i++;
		$text = preg_replace('/:::(\s|\t)*/', ":::", $text);
		self::log('debug', "*** step $i\n\n:" . $text); $i++;
		$text = preg_replace('/:::([^:]*):(\s|\t)+/', ":::$1:", $text);
		self::log('debug', "*** step $i\n\n:" . $text); $i++;
		$text = preg_replace('/:::([^:]*):(<EOL>)+/', ":::$1:", $text);
		self::log('debug', "*** step $i\n\n:" . $text); $i++;

		//$text = preg_replace('/:::([^:]*)/', self::fix_key_value( "$1", $text), $text );
		$text = preg_replace(
						'/:::([^:]*):/',
						'","'. preg_replace( '/"/', "'", "$1" ) . '":"',
						$text
				);
		self::log('debug', "*** step $i\n\n:" . $text); $i++;
		
		// Removes pointless CRLF: at the beginning, before and after "
		$text = preg_replace( '/^",(.*)/', "$1" . '"', $text );
		self::log('debug', "*** step $i\n\n:" . $text); $i++;
		$text = preg_replace( '/"(\\\r|\\\n)*/', '"', $text );
		self::log('debug', "*** step $i\n\n:" . $text); $i++;
		$text = preg_replace( '/(\\\r|\\\n)*"/', '"', $text );
		self::log('debug', "*** step $i\n\n:" . $text); $i++;

		$text = preg_replace( '/!!!\s*start\s*!!!",/s', '', $text );
		self::log('debug', "*** step $i\n\n:" . $text); $i++;
		$text = preg_replace( '/!!!\s*end\s*!!!.*$/s', '"', $text );
		$pos = strpos( $text, '"', strlen( $text ) - 1);
		Veepdotai_Util::log( 'debug', 'Pos du ": ' . $pos . '.');
		if ( $pos === false ) {
			$text = $text . '"';
		}
		self::log('debug', "*** step $i\n\n:" . $text); $i++;

		$text = '{' . $text . '}';
		self::log('debug', "*** step $i\n\n:" . $text); $i++;
		
		return $text;
	}

	/**
	 *
	 */
	public static function fix_results( $r ) {
		$section = null;
		if ( property_exists( $r, 'section' ) ) {
			self::log( 'debug', 'A section property exists.' );
			$section = $r->section;
			if ( is_string( $section ) ) {
				self::log( 'debug', 'Section is string : $section = $r.' );
				$section = $r;
			} elseif ( is_null( $section ) ) {
				self::log( 'debug', 'Section is null : $section = $r->sections[0].' );
				$section = $r->sections[0];
			} elseif ( is_array( $section ) ) {
				self::log( 'debug', 'Section is an array : $section = $r->section[0].' );
				$section = $r->section[0];
			} else {
				self::log( 'debug', 'The format of the r->section is not known.' );
			}
		} elseif ( property_exists( $r, 'sections' ) ) {
			if ( is_array( $r->sections ) ) {
				$section = $r->sections[0];
			} else {
				self::log( 'debug', 'The format of the r->sections is not known.' );
			}
		} else {
			$section = $r;
		}

		return $section;
	}

	public static function get_language() {
		// return 'fr_FR';
		return wp_get_current_user()->locale;
	}

	/**
	 * Creates a file from a process number and writes to it the user this process owns to so 
	 * we can link them together.
	 */
	public static function set_user_login( $login ) {
		//return wp_get_current_user()->user_login
		$filename = self::get_run_directory() . '/' . self::get_user_stamp();
		
		$filectime = filectime( $filename );
		Veepdotai_Util::log( 'debug', 'Checking file creation time for: ' . $filename . ': ' . $filectime );
		/*
		if ( $filectime && $filectime < time() + VEEPDOTAI_PLUGIN_FILE_COOKIE_LIFETIME ) {
			// The file is still valid. It should not be reused already.
			die('Pb about user login setting');
		}
		*/

		file_put_contents( $filename, $login );

		return $login;
	}

	/**
	 * Returns WP_User
	 */
	public static function get_user() {
		return new WP_User(get_user_by( 'login', self::get_user_login() ) );
	}

	public static function get_user_login() {

		if ( ! wp_doing_cron() ) {
			$username = wp_get_current_user()->user_login;
			Veepdotai_Util::log( 'debug', 'Util::get_user_login(): returning ' . $username );
			return $username;
		}

		Veepdotai_Util::log( 'debug', 'Util::get_user_login(): computes filename.' );
		$filename = self::get_run_directory() . '/' . self::get_user_stamp();
		Veepdotai_Util::log( 'debug', 'Util::get_user_login(): filename ' . $filename );

		$username = file_get_contents( $filename );
		Veepdotai_Util::log( 'debug', 'Util::get_user_login(): user ' . $username );

		return $username;
	}

	public static function get_user_stamp() {
		return getmypid();
	}

	public static function get_tmp_dir() {
		if ( ! is_dir( VEEPDOTAI_PLUGIN_TMP_DIR )
				&& ! mkdir( VEEPDOTAI_PLUGIN_TMP_DIR, 0777, true ) ) {
			return false;
		}

		return VEEPDOTAI_PLUGIN_TMP_DIR;
	}

	public static function fix_json( $raw ) {
		$i    = 1;
		$text = ( new \Delight\Str\Str( $raw ) )->normalizeLineEndings( 'EOL' );

		$blank_chars = '\s|EOL|\t';

		// Some chars before { or |: [a-zA-Z...]* {|[ => {|[
		// ^[^{\[]*({|[) => '{|[' because it breaks json format
		$string = preg_replace( '/^' . '[^\{\[]*(\{|\[)/', '$1', $text );
		self::log( 'debug', "$i. ############\n" . $string );
		$i++;

		// ,, => , because it breaks json format
		$string = preg_replace( '/,+/', ',', $string );
		self::log( 'debug', "$i. ############\n" . $string );
		$i++;

		// ^EOL{|[
		$string = preg_replace( '/(' . $blank_chars . ')*{(' . $blank_chars . ')*/', '{', $text );
		self::log( 'debug', "$i. ############\n" . $string );
		$i++;

		// 1234,EOL  "
		// $string = preg_replace('/,(' . $blank_chars . ')*\"/', ',"', $string);
		$string = preg_replace( '/,(\s|\t)*EOL(\s|\t)*\"/', ',"', $string );
		self::log( 'debug', "$i. ############\n" . $string );
		$i++;

		// ",EOL"
		// $string = preg_replace('/\\",EOL\\"/', '\",\"', $string);
		$string = preg_replace( '/,EOL/', ',', $string );
		self::log( 'debug', "$i. ############\n" . $string );
		$i++;

		// :EOL"
		// $string = preg_replace('/:EOL\"/', ':"', $string);
		$string = preg_replace( '/"(' . $blank_chars . ')*:(' . $blank_chars . ')*"/', '":"', $string );
		self::log( 'debug', "$i. ############\n" . $string );
		$i++;

		// "EOL    }EOL  ],"
		$string = preg_replace( '/"(' . $blank_chars . ')*}(' . $blank_chars . ')*],"/', '"}],"', $string );
		self::log( 'debug', "$i. ############\n" . $string );
		$i++;

		// ",}" => }
		$string = preg_replace( '/"(' . $blank_chars . ')*,(' . $blank_chars . ')*}/', '"}', $string );

		// EOL  }EOL}
		// $string = preg_replace('/(' . $blank_chars . ')*}(' . $blank_chars . ')*}/', '}}', $string);
		$string = preg_replace( '/(' . $blank_chars . ')*}/', '}', $string );
		self::log( 'debug', "$i. ############\n" . $string );

		// Some chars before/after the {} or [] and not enclosed in ""
		$string = preg_replace( '/(}|])[^",}\]]*/', '$1', $string );
		$string = preg_replace( '/[^",}\]]*(}|])/', '$1', $string );
		// EOL => ''
		$string = preg_replace( '/EOL/', '\n', $string );
		self::log( 'debug', "$i. ############\n" . $string );

		return $string;
	}

	public static function get_last_error() {
		switch ( json_last_error() ) {
			case JSON_ERROR_NONE:
				$r = ' - No errors';
				break;
			case JSON_ERROR_DEPTH:
				$r = ' - Maximum stack depth exceeded';
				break;
			case JSON_ERROR_STATE_MISMATCH:
				$r = ' - Underflow or the modes mismatch';
				break;
			case JSON_ERROR_CTRL_CHAR:
				$r = ' - Unexpected control character found';
				break;
			case JSON_ERROR_SYNTAX:
				$r = ' - Syntax error, malformed JSON';
				break;
			case JSON_ERROR_UTF8:
				$r = ' - Malformed UTF-8 characters, possibly incorrectly encoded';
				break;
			default:
				$r = ' - Unknown error';
				break;
		}

		return $r;
	}

	/**
	 *
	 */
	public static function replace_special_chars( $string ) {

		/*
		 Another way to replace chars. Seems to be buggy.
				$normalized_raw = "";
				if (mb_detect_encoding($raw, 'utf-8', true) === false) {
					$normalized_raw = mb_convert_encoding($raw, 'utf-8', 'iso-8859-1');
				}
				$r = $this->convert_to_valid_json($normalized_raw);
		*/

		$unwanted_array = array(
			'Š' => 'S',
			'š' => 's',
			'Ž' => 'Z',
			'ž' => 'z',
			'À' => 'A',
			'Á' => 'A',
			'Â' => 'A',
			'Ã' => 'A',
			'Ä' => 'A',
			'Å' => 'A',
			'Æ' => 'A',
			'Ç' => 'C',
			'È' => 'E',
			'É' => 'E',
			'Ê' => 'E',
			'Ë' => 'E',
			'Ì' => 'I',
			'Í' => 'I',
			'Î' => 'I',
			'Ï' => 'I',
			'Ñ' => 'N',
			'Ò' => 'O',
			'Ó' => 'O',
			'Ô' => 'O',
			'Õ' => 'O',
			'Ö' => 'O',
			'Ø' => 'O',
			'Ù' => 'U',
			'Ú' => 'U',
			'Û' => 'U',
			'Ü' => 'U',
			'Ý' => 'Y',
			'Þ' => 'B',
			'ß' => 'Ss',
			'à' => 'a',
			'á' => 'a',
			'â' => 'a',
			'ã' => 'a',
			'ä' => 'a',
			'å' => 'a',
			'æ' => 'a',
			'ç' => 'c',
			'è' => 'e',
			'é' => 'e',
			'ê' => 'e',
			'ë' => 'e',
			'ì' => 'i',
			'í' => 'i',
			'î' => 'i',
			'ï' => 'i',
			'ð' => 'o',
			'ñ' => 'n',
			'ò' => 'o',
			'ó' => 'o',
			'ô' => 'o',
			'õ' => 'o',
			'ö' => 'o',
			'ø' => 'o',
			'ù' => 'u',
			'ú' => 'u',
			'û' => 'u',
			'ý' => 'y',
			'þ' => 'b',
			'ÿ' => 'y',
		);

		$str = strtr( $string, $unwanted_array );

		return $str;
	}

	/**
	 * Moves the user to the provided admin page for the Veepdotai plugin.
	 */
	public static function go_to_url( $page, $move = true ) {
		if ( ! str_contains( $page, 'http' ) ) {
			$admin_url   = get_admin_url();
			$prefix_menu = 'admin.php?page=veepdotai-veepdotai-menu-';
			$page_url    = $admin_url . $prefix_menu . $page;
		} else {
			$page_url = $page;
		}

		self::log( 'debug', 'Page_url: ' . $page_url );

		if ( $move ) {
			echo '<script>window.location.replace("' . esc_url( $page_url ) . '")</script>';
		} else {
			return esc_url( $page_url );
		}
	}

	public static function log_step_started( $user_log_file, $user_run_file, $pid, $topic, $msg = '' ) {
        $key = self::get_date() . ' ' . $pid;
		error_log("$key - ${topic}STARTED${msg}\n", 3, $user_log_file);
		error_log("$key - ${topic}STARTED_${msg}\n", 3, $user_run_file);
//        file_put_contents( $user_log_file, "$key - ${topic}STARTED${msg}\n", FILE_APPEND);
//        file_put_contents( $user_run_file, "$key - ${topic}STARTED_${msg}\n", FILE_APPEND);
    }

    public static function log_step_finished( $user_log_file, $user_run_file, $pid, $topic, $msg = '') {
        $key = self::get_date() . ' ' . $pid;
		error_log("$key - ${topic}FINISHED${msg}\n", 3, $user_log_file);
		error_log("$key - ${topic}FINISHED_${msg}\n", 3, $user_run_file);
//        file_put_contents( $user_log_file, "$key - ${topic}FINISHED${msg}\n", FILE_APPEND);
//        file_put_contents( $user_run_file, "$key - ${topic}FINISHED_${msg}\n", FILE_APPEND);
    }

	public static function log_step_paused( $user_log_file, $user_run_file, $pid, $topic, $msg = '') {
        $key = self::get_date() . ' ' . $pid;
		error_log("$key - ${topic}PAUSED${msg}\n", 3, $user_log_file);
		error_log("$key - ${topic}PAUSED_${msg}\n", 3, $user_run_file);
//        file_put_contents( $user_log_file, "$key - ${topic}PAUSED${msg}\n", FILE_APPEND);
//        file_put_contents( $user_run_file, "$key - ${topic}PAUSED_${msg}\n", FILE_APPEND);
    }

	public static function log_step_continued( $user_log_file, $user_run_file, $pid, $topic, $msg = '') {
        $key = self::get_date() . ' ' . $pid;
		error_log("$key - ${topic}CONITNUED${msg}\n", 3, $user_log_file);
		error_log("$key - ${topic}CONTINUED_${msg}\n", 3, $user_run_file);
//        file_put_contents( $user_log_file, "$key - ${topic}PAUSED${msg}\n", FILE_APPEND);
//        file_put_contents( $user_run_file, "$key - ${topic}PAUSED_${msg}\n", FILE_APPEND);
    }

	public static function log_step_error( $user_log_file, $user_run_file, $pid, $topic, $msg = '') {
        $key = self::get_date() . ' ' . $pid;
		error_log("$key - ${topic}ERROR${msg}\n", 3, $user_log_file);
		error_log("$key - ${topic}ERROR_${msg}\n", 3, $user_run_file);
		error_log("$key - _ERROR_\n", 3, $user_log_file);
		error_log("$key - _ERROR_\n", 3, $user_run_file);
//        file_put_contents( $user_log_file, "$key - ${topic}FINISHED${msg}\n", FILE_APPEND);
//        file_put_contents( $user_run_file, "$key - ${topic}FINISHED_${msg}\n", FILE_APPEND);
    }

	/**
	 * Logs information without buffering so you can see process progression
	 */
	public static function log_direct( $o ) {
		ob_end_flush();
		ob_start();
		echo esc_html( $o );
		ob_flush();
		flush();
		ob_end_flush();
	}

	public static function log( $level, $message, $object = null ) {
		if ( is_string( $object ) ) {
			do_action( 'wonolog.log.' . $level, array( 'message' => $message ) );
		} else {
			do_action( 'wonolog.log.' . $level, array( 'message' => $message ), $object );
		}

		Veepdotai_Util::var_error_log($message);
		Veepdotai_Util::var_error_log($object);
	}

	public static function error_log( $msg, $object = null ) {
		self::var_error_log( $msg );
		self::var_error_log( $object );
	}

	public static function var_error_log( $object = null, $message_type = 3, $path = '/var/www/log/wordpress.log' ) {
		ob_start();                    // start buffer capture
		var_dump( $object );           // dump the values
		$contents = ob_get_contents(); // put the buffer into a variable
		ob_end_clean();                // end capture
		error_log( $contents, $message_type, $path );        // log contents of the result of var_dump( $object )
	}

	public static function s( $str, $charset = null ) {
		return new \Delight\Str\Str( $str, $charset );
	}

}
