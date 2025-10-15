<?php
/**
 * @package Veepdotai
 * @version 1.0.0
 */
/*
Plugin Name: veepdotai_graphql
Plugin URI: http://wordpress.org/plugins/veepdotai_graphql/
Description: Provides graphql glue between WP and Veepdotai
Author: JC Kermagoret
Version: 1.0.0
Author URI: http://www.veep.ai
*/

require_once 'veepdotai/veepdotai_graphql.php';
//require_once 'lokavivo/lokavivo_graphql.php';

/**
 * https://github.com/wp-graphql/wp-graphql/issues/2092 : query children, based on post_parent
 * https://stackoverflow.com/questions/10750931/wordpress-how-to-add-hierarchy-to-posts/49359200#49359200 : add hierarchical support to posts
 */
add_filter('register_post_type_args', 'add_hierarchy_support', 10, 2);
function add_hierarchy_support($args, $post_type){

  if ($post_type === 'post') {

    $args['hierarchical'] = true;
    $args['supports'] = array_merge($args['supports'], array('page-attributes'));
  }

  return $args;
}

/**
 * Register facets if facetwp plugin is installed
 * Custom content types must be added when they are defined
 */
if (function_exists("register_graphql_facet_type")) {
  add_action( 'graphql_facetwp_init', function () {
    register_graphql_facet_type( 'vcontent' );
    register_graphql_facet_type( 'post' );
  } );
  
  add_filter( 'facetwp_indexer_query_args', function( $args ) {
    $args['post_status'] = [ 'publish', 'draft' ];
    return $args;
  });
  
  add_filter( 'facetwp_api_can_access', function( $boolean ) {
    return current_user_can( 'manage_options' );
  });
}