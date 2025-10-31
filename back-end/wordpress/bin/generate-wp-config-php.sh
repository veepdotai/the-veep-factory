#!/bin/bash

RET=""

v_generate_random_secret() {
	PASSWORD=$(tr -dc 'A-Za-z0-9!"#$%&()*+,-./:;<=>?@[\]^_`{|}~' </dev/urandom | head -c 64; echo)

	RET="$PASSWORD"
}

v_generate_output() {
	v_generate_random_secret
	echo "define('$1', '$RET');"
}

v_wp_config_start() {
	echo "<?php"
	echo

	echo "#define( 'WP_PLUGIN_DIR', '/var/www/plugins' );"
	echo
	echo "define('DB_NAME', getenv( 'TVF_DB_NAME' ));"
	echo "define('DB_HOST', getenv( 'TVF_DB_HOST' ));"
	echo "define('DB_USER', getenv( 'TVF_DB_USER' ));"
	echo "define('DB_PASSWORD', getenv( 'TVF_DB_PASSWORD' ));"
	echo

	# we use quotes because we don't variable interpolations
	echo '# $ALLOWED_SERVER_NAMES mytest.veep.ai,lokavivo.docker.localhost'
	echo '$allowed_server_names = explode( ",", getenv( "TVF_ALLOWED_SERVER_NAMES" ) );'
	echo 'error_log("SERVER_NAME: " . $_SERVER["SERVER_NAME"] . " / HOST_NAME: " . $_SERVER["HOST_NAME"] . "\\n", 3, "/tmp/debug.log");'
	echo
	echo '$server_name_is_allowed = in_array( $_SERVER["SERVER_NAME"], $allowed_server_names );'
	echo 'error_log("SERVER_NAME: " . $_SERVER["SERVER_NAME"] . ": " . $server_name_is_allowed . "\\n", 3, "/tmp/debug.log");'
	echo
	echo '#if ( in_array( $_SERVER["SERVER_NAME"], ["mytest.veep.ai", "localhost"] ) ) {'
	echo 'if ( $server_name_is_allowed ) {'
	echo '	error_log("server_name_allowed\\n", 3, "/tmp/debug.log");'
	echo '	$protocol = isset( $_SERVER["HTTPS"] ) && $_SERVER["HTTPS"] == "on" ? "https" : "http";'
	echo '	define( "WP_SITEURL", $protocol . "://" . $_SERVER["SERVER_NAME"] . "" );'
	echo '	define( "WP_HOME", $protocol . "://" . $_SERVER["SERVER_NAME"] . "" );'
	echo '} else {'
	echo '	header("HTTP/1.1 501 Not Implemented For This ServerName");'
	echo '	exit;'
	echo '}'
	echo
}

v_wp_config_end() {
	echo
	echo "require_once(ABSPATH . 'wp-veep.php');"
	echo "require_once(ABSPATH . 'wp-settings.php');"
}

v_secrets() {
	v_generate_output 'AUTH_KEY'
	v_generate_output 'AUTH_SALT'
	v_generate_output 'SECURE_AUTH_KEY'
	v_generate_output 'SECURE_AUTH_SALT'
	v_generate_output 'LOGGED_IN_KEY'
	v_generate_output 'LOGGED_IN_SALT'
	v_generate_output 'NONCE_KEY'
	v_generate_output 'NONCE_SALT'
}

v_generate_wp_config() {
	v_wp_config_start
	v_secrets
	v_wp_config_end
}

