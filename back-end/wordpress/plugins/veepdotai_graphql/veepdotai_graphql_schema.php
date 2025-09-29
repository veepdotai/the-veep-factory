<?php

//require_once 'veepdotai_setup_graphql_schema_content.php';
//require_once 'veepdotai_setup_graphql_schema_content_creation.php';
require_once 'veepdotai_graphql_schema_old.php';
//require_once 'veepdotai_graphql_mutations.php';
//require_once 'veepdotai_graphql_mutations_upload.php';
//require_once 'veepdotai_setup_graphql_schema_test.php';

add_action( 'init', function() {
	\schema_old\register_schema();
  //\Veepdotai\Graphql\Mutations\register();
  //\Veepdotai\Graphql\Mutations\Upload\register()
	//\schema_content\register_schema();
	//\schema_content_creation\register_schema();
	
	//register_veepdotai_content_creation_enum();
});

/**
 * https://github.com/wp-graphql/wp-graphql/issues/2092 : query children, based on post_parent
 * https://stackoverflow.com/questions/10750931/wordpress-how-to-add-hierarchy-to-posts/49359200#49359200 : add hierarchical support to posts
 */
add_filter('register_post_type_args', 'add_hierarchy_support', 10, 2);
function add_hierarchy_support($args, $post_type){

  if ($post_type === 'post') { // <-- enter desired post type here

    $args['hierarchical'] = true;
    $args['supports'] = array_merge($args['supports'], array('page-attributes'));
  }

  return $args;
}

// Register facet for Posts
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
