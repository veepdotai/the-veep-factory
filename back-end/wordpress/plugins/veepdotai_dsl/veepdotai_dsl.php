<?php
/**
 * @package Veepdotai
 * @version 0.0.1
 */
/*
Plugin Name: veepdotai_dsl
Plugin URI: http://wordpress.org/plugins/veepdotai_dsl/
Description: Provides a way to express complex prompts
Author: JC Kermagoret
Version: 1.0.0
Author URI: http://www.veep.ai
*/

// If this file is called directly, abort.
if (! defined('WPINC')) {
    die;
}

define( 'VEEPDOTAI_DSL_VERSION', '0.0.1');
define( 'VEEPDOTAI_DSL_PLUGIN_DIR', plugin_dir_path(__FILE__) );

require "vendor/autoload.php";
require "class-veepdotai-dsl.php";

function veepdotai_dsl() {
}

//veepdotai_dsl();
