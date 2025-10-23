<?php
/**
 * @package Veepdotai
 * @version 0.0.1
 * Migrate v1 content to v2 format based on vcontent custom content type
 * 
 */

add_action( 'migrate_veep', 'veepdotai_migrate_v1_to_v2', 10, 1 );

function veepdotai_migrate_v1_to_v2() {
	
	$users = get_users( array( 'role__in' => [ 'veepdotai_role_content_marketer' ] ) );
	foreach ($users as $user) {
		echo "<p>Migrating {$user->user_email}/{$user->ID}</p>";
		veepdotai_migrate_one_user( $user->ID );
	}
}

function veepdotai_migrate_one_user( $userid ) {

	$args = array( 
		//'ID' => 2729,
		'post_type' => 'post',
		'post_status' => 'DRAFT',
		'numberposts' => 1000,
		'author' => $userid
	);
	
	$posts = get_posts( $args );
	
	if (is_array($posts) && count($posts) > 0) {
	
		echo "<br />" . count($posts) . "<br />";
		echo "<p>Migrating content</p>";
		foreach( $posts as $post ) {
			echo "<p>Migrating post: {$post->ID}";
			Veepdotai_Util::log( 'debug', 'migrate: ID/post: ' . $post->ID . "/" . print_r($post, true));

			$vcontent_parent_id = create_vcontent_parent( $post );
			create_vcontent_children( $post, $vcontent_parent_id );

			echo "=> vcontent: {$vcontent_parent_id}</p>";

			wp_delete_post($post->ID, false);
		}
		
	}

}

function extract_short_string( $string, $length = 50 ) {
	try {
		return substr( $string, 0, $length );
	} catch (e) {
		Veepdotai_Util::log( 'debug', 'migrate: extract_short_string: ' . print_r($new_post, true));

		return substr( Veepdotai\Misc\Encoding\fixUTF8( $string, "IGNORE" ), 0, $length );
	};
}

function create_vcontent_parent( $post ) {

	$new_post = clone $post;
	$new_post->ID = null;
	$new_post->post_status = "DRAFT";
	$new_post->post_type = "vcontent";
	$new_post->post_name = extract_short_string( $post->post_name );
	$new_post->post_title = extract_short_string( $post->post_title );

	$metadata = get_post_meta( $post->ID );
	$meta = [
		'veepdotaiInputType' => $metadata[ 'veepdotaiInputType' ][0],
		'veepdotaiTranscription' => $metadata[ 'veepdotaiTranscription' ][0],
		'veepdotaiResource' => $metadata[ 'veepdotaiResource' ][0],
		'veepdotaiPrompt' => $metadata[ 'veepdotaiPrompt' ][0],
		'veepdotaiLastStepDone' => $metadata[ 'veepdotaiLastStepDone' ][0],
	];

	$new_post->meta_input = $meta;
	Veepdotai_Util::log( 'debug', 'migrate: new_post: ' . print_r($new_post, true));

	$id = wp_insert_post( $new_post );

	return $id;
}

function onlyPhase( $string ) {
	Veepdotai_Util::log( 'debug', 'migrate: process_veepdotaiPhase_meta: onlyPhase: string ' . print_r($string, true) );
	$matches = [];
	preg_match('/veepdotaiPhase(\d*)Content/', $string, $matches );
	if ( $matches ) {
		return true;
	} else {
		return false;
	}
}

function onlyIdx( $string ) {
	$matches = [];
	preg_match( "/veepdotaiPhase(\d*)Content/", $string, $matches);
	if ( $matches ) {
		return $matches[1];
	}
}

function process_veepdotaiPhase_meta( $meta ) {

	$meta_v_phase = array_values( array_filter( $meta, "onlyPhase" ) );
	Veepdotai_Util::log( 'debug', 'migrate: process_veepdotaiPhase_meta: meta_v_phase: ' . print_r($meta_v_phase, true));
	
	$meta_v_phase_idx = array_map( "onlyIdx", $meta_v_phase );
	
	return $meta_v_phase_idx;
}

function create_vcontent_children( $post, $new_id ) {
	echo "<ul>Creating vparent children for: " . $post->post_title;

	$vparent = get_post( $new_id );
	$post_meta = get_post_meta( $post->ID );

	$meta_keys_idx = process_veepdotaiPhase_meta( array_keys( $post_meta ) );
	Veepdotai_Util::log( 'debug', 'migrate: create_vcontent_children: ' . print_r( $meta_keys_idx, true ) );

	$results = [];
	for ($i = 0; $i < count( $meta_keys_idx ) ; $i++ ) {

		$new_meta_details = $post_meta[ "veepdotaiPhase" . $meta_keys_idx[ $i ] . "Details" ][0];
		Veepdotai_Util::log( 'debug', "migrate: create_vcontent_children: vPhase[$i]Details" . print_r($new_meta_details, true));
		$new_meta_content = $post_meta[ "veepdotaiPhase" . $meta_keys_idx[ $i ] . "Content" ][0];
		Veepdotai_Util::log( 'debug', "migrate: create_vcontent_children: vPhase[$i]Content" . print_r($new_meta_content, true));
		
		// The vcontent customm type inherits data's parent except the following:
		$new_post = clone $post;
		$new_post->ID = null;
		$new_post->post_status = "DRAFT";
		$new_post->post_type = "vcontent";
		$new_post->post_name = extract_short_string( $new_meta_content ) ;
		$new_post->post_title = extract_short_string( $new_meta_content ) ;
		$new_post->post_content = $new_meta_content;
		$new_post->post_parent = $vparent->ID;
		$meta = [
			"veepdotaiDetails" => $new_meta_details,
			"veepdotaiContent" => $new_meta_content,
			"veepdotaiParent" => $vparent->ID,
		];
		$new_post->meta_input = $meta;
		Veepdotai_Util::log( 'debug', 'migrate: create_vcontent_children: ' . print_r( $new_post, true ) );
	
		$vcontent_child_id = wp_insert_post( $new_post );
		Veepdotai_Util::log( 'debug', 'migrate: create_vcontent_children: vcontent_child_id: ' . print_r($vcontent_child_id, true));

		echo "<li>title: " . $new_post->post_title . " vparent child created.</li>";
		echo "</ul>";
		array_push( $results, $vcontent_child_id);
	}

}
