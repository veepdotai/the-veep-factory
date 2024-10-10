<?php

if (! defined('ABSPATH')) { exit; }

require 'vendor/autoload.php';
require 'lib/RD_Text_Extraction.php';
require 'lib/Veepdotai_Text_Extraction.php';
require 'lib/Veepdotai_Mimetypes.php';
/**
 * @package Veepdotai
 * @version 1.0.0
 */
/*
Plugin Name: veepdotai_extractors
Plugin URI: http://wordpress.org/plugins/veepdotai_extractors
Description: Veepdotai Content Extractors
Author: JC Kermagoret
Version: 1.0.0
Author URI: http://www.veep.ai
*/

require_once 'veepdotai_extractors_url.php';
require_once 'veepdotai_extractors_file.php';
require_once 'veepdotai_extractors_file_audio.php';
