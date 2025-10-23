#!/bin/bash

RET=""

v_wp_veep_start() {

	echo "<?php"
	echo
	echo "if ( \$_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https' ) {"
	echo "	\$_SERVER['HTTPS']       = 'on';"
	echo "	\$_SERVER['SERVER_PORT'] = 443;"
	echo "}"
	echo

}

v_wp_veep_body() {

	echo "define( 'WP_DEBUG', true );"
	echo "define( 'WP_DEBUG_LOG', getenv( 'TVF_DEBUG_LOG_PATH' ) );"
	echo "define( 'WP_DEBUG_DISPLAY', false );"
	echo
	echo "define( 'PEXELS_API_KEY', '' );"
	echo "define( 'UNSPLASH_API_KEY', '' );"
	echo
	echo "define( 'STRIPE_SK', 'NOTHING' );"
	echo
	echo "define( 'CONF_CLIENT_ID', getenv( 'TVF_LINKEDIN_CLIENT_ID' ));"
	echo "define( 'CONF_CLIENT_SECRET', getenv( 'TVF_LINKEDIN_CLIENT_SECRET' ));"
	echo "define( 'CONF_CLIENT_REDIRECT_URI', getenv( 'TVF_LINKEDIN_CLIENT_REDIRECT_URI' ));"
	echo "define( 'CONF_CLIENT_SCOPE', getenv( 'TVF_LINKEDIN_SCOPE' ));"
	echo
	echo "define( 'INFLUX_ORG_ID', getenv( 'TVF_INFLUX_ORG_ID' ));"
	echo "define( 'INFLUX_TOKEN', getenv( 'TVF_INFLUX_TOKEN' ));"
	echo "define( 'USAGE_SERVER', getenv( 'TVF_USAGE_SERVER' ));"
	echo "define( 'USAGE_BUCKET_NAME', getenv( 'TVF_USAGE_BUCKET_NAME' ));"
	echo "define( 'USAGE_USER_TEST', getenv( 'TVF_USAGE_DEFAULT_USER_ID' ));"
	echo 
}

v_wp_veep_end() {

	echo "\$table_prefix = 'wp_';"

}

v_generate_wp_veep() {
	v_wp_veep_start
	v_wp_veep_body
	v_wp_veep_end
}
