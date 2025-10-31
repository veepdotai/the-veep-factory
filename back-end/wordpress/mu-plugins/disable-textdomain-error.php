<?php
/**
 * Plugin Name: Disable Textdomain Error
 * Description: Prevents triggering errors for the '_load_textdomain_just_in_time' function.
 * Author: Kowsar Hossain
 * Version: 1.0
 * 
 * Note: This is a Must-Use (MU) plugin. Place this file in the 'wp-content/mu-plugins' directory.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

add_filter( 'doing_it_wrong_trigger_error', function( $status, $function_name ) {
    if ( '_load_textdomain_just_in_time' === $function_name ) {
        return false;
    }
    return $status;
}, 10, 2 );
