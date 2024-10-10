<?php
/**
 * @package Veepdotai
 * @version 0.0.1
 */

define( "VEEPDOTAI_SETUP_CREDITS", 10);

// Par mois : 5 articles de blog par mois,
// Pour un article, 5 posts LI
// Par semaine : 5 posts LI - éventuellement * 3 pour avoir le choix = 15*5 = 60 par mois
// Itou pour FB|Insta|TT|Pinterest...
// Soit 50 facile...
// Toutes ces informations pourraient êre stockées dans une autre base qui
// gèreraient mieux le côté versatile et volumineux.
define( "MAXITEMS_TO_REGISTER_IN_GRAPHQL", 50 ); // 100?

add_action( 'user_register', 'veepdotai_registration_save', 10, 1 );

/**
 * Setting first credits
 */
function veepdotai_registration_save( $user_id ) {

	$user = get_userdata( $user_id );
	Veepdotai_Util::log( 'debug', 'User: ' . print_r($user, true));

	$user_name = $user->user_login;

	$prefix = "veepdotai";
	$suffix = "-" . $prefix . "-credits";
	
	$default_username = "defaultuser";

	$default_credits = get_option( $default_username . $suffix );
	if ( $default_credits ) {
		$credits = $default_credits;
	} else {
		$credits = VEEPDOTAI_SETUP_CREDITS;
	}
	Veepdotai_Util::log( "debug", "Setting $credits for Username: " . $user_name);
	update_option( $user_name . $suffix, $credits );

}
