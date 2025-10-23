<?php

require_once 'veepdotai_graphql_schema.php';
require_once 'veepdotai_graphql_mutations.php';

/**
 * Short fix for the 415 error from apollo which doesn't support multipart instead of json rsponses for this use case:
 * https://github.com/wp-graphql/wp-graphql/issues/3323#issuecomment-2695956397
 */
add_filter( 'graphql_is_valid_http_content_type', function( $is_valid, $content_type ) {

  if ( 0 === stripos( $content_type, 'multipart/form-data' ) ) {
    return true;
  }

  return $is_valid;

}, 10, 2 );