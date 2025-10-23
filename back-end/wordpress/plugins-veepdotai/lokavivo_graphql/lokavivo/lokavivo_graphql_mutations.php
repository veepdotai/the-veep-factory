<?php

namespace Lokavivo\Graphql\Mutations;

//require_once "veepdotai_graphql_mutations_admin.php";

add_action( 'init', function() {
    \Lokavivo\Graphql\Mutations\register();
});

/**
 * @package Veepdotai\Graphql
 * @version 0.0.1
 * Registers custom graphql operations
 * 
 */

function register() {
}

function log( $msg ) {
	\Veepdotai_Util::log( 'debug', 'GraphQL Mutations: ' . $msg );
}

function register_type() {
    
}