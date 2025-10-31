<?php
/**
 * @package Lokavivo
 * @version 1.0.0
 */
/*
Plugin Name: lokavivo_graphql
Plugin URI: http://wordpress.org/plugins/lokavivo_graphql/
Description: Provides graphql glue between WP, Loakvivo and Veepdotai
Author: JC Kermagoret
Version: 1.0.0
Author URI: http://www.lokavivo.eu
Requires Plugins: veepdotai_graphql,wp-graphql
*/

//require_once 'veepdotai/veepdotai_graphql.php';
require_once 'lokavivo/lokavivo_graphql.php';

// Register facet for Posts if facetwp plugin is installed
if (function_exists("register_graphql_facet_type")) {
  add_action( 'graphql_facetwp_init', function () {
    register_graphql_facet_type( 'lcontent' );
  } );  
}