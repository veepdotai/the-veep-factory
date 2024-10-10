<?php

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Veepdotai
 * @subpackage Veepdotai/DSL
 * @author     Jean-Christophe Kermagoret <jck@veep.ai>
 */

require plugin_dir_path(__FILE__) . '/lib/php-toml-encoder.php';

use Yosymfony\Toml\Toml;

add_filter( 'veepdotai-process-prompt-object2toml', 'Veepdotai_DSL::convert_object_to_toml', 10, 1);
add_filter( 'veepdotai-process-prompt-toml2object', 'Veepdotai_DSL::convert_toml_to_object', 10, 1);

$output = [];
$inspiration = "";

class Veepdotai_DSL {

	public static function log( $channel, $o = null) {
		$date = gettimeofday(true);
		if ( ! $o ) {
			error_log( "\n$date: $channel:\n", 3, "/tmp/openai.log");
		} else {
			error_log( "\n$date: $channel:\n" . print_r( $o, true) . "\n", 3, "/tmp/openai.log");
		}
	}

	public static function convert_toml_to_object( $root_string ) {

		self::log("Root toml string: " . $root_string);
		$root = Toml::parse( $root_string );

		return $root;
	}

	public static function convert_object_to_toml( $object ) {

		self::log("Object: " . print_r( $object, true) );
		$encoder = new Toml_Encoder();
		$toml = $encoder->encode($object);
        self::log("Resulting root toml string: " . $toml);

		return $toml;
	}

}
