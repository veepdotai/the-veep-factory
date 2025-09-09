#!/bin/bash

RET=""

v_generate_random_secret() {
	PASSWORD=$(tr -dc 'A-Za-z0-9!"#$%&()*+,-./:;<=>?@[\]^_`{|}~' </dev/urandom | head -c 64; echo)

	RET="$PASSWORD"
}

v_output() {
	v_generate_random_secret
	echo "define('$1', '${RET}');"
}

v_wp_config_start() {
	echo "<?php"
	echo

	echo "define('DB_NAME', '$DB_NAME');"
	echo "define('DB_HOST', '$DB_HOST');"
	echo "define('DB_USER', '$DB_USER');"
	echo "define('DB_PASSWORD', '$DB_PASSWORD');"
	echo 

	# we use quotes because we don't variable interpolations
	echo 'error_log("SERVER_NAME: " . $_SERVER["SERVER_NAME"] . "\n", 3, "/tmp/test.log");'
	echo 'error_log("HOST_NAME: " . $_SERVER["HOST_NAME"] . "\n", 3, "/tmp/test.log");'

	echo 'if ( in_array( $_SERVER['SERVER_NAME'], ["mytest.veep.ai", "localhost"] ) ) {'
	echo '	$protocol = isset( $_SERVER["HTTPS"] ) && $_SERVER["HTTPS"] == "on" ? "https" : "http";'
	echo '	define( "WP_SITEURL", $protocol . "://" . $_SERVER["SERVER_NAME"] . "" );'
	echo '	define( "WP_HOME", $protocol . "://" . $_SERVER["SERVER_NAME"] . "" );'
	echo '} else {'
	echo '	header("HTTP/1.1 501 Not Implemented");'
	echo '	exit;'
	echo '}'
}

v_wp_config_end() {
	echo
	echo "require_once(ABSPATH . 'wp-veep.php');"
	echo "require_once(ABSPATH . 'wp-settings.php');"
}

v_secrets() {
	v_output 'AUTH_KEY'
	v_output 'AUTH_SALT'
	v_output 'SECURE_AUTH_KEY'
	v_output 'SECURE_AUTH_SALT'
	v_output 'LOGGED_IN_KEY'
	v_output 'LOGGED_IN_SALT'
	v_output 'NONCE_KEY'
	v_output 'NONCE_SALT'
}

v_generate_wp_configure() {
	v_wp_config_start
	v_secrets
	v_wp_config_end
}

