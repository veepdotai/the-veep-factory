<?php

if ( $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https' )
{
    $_SERVER['HTTPS']       = 'on';
    $_SERVER['SERVER_PORT'] = 443;
}

define('DB_COLLATE', 'utf8mb4_general_ci');
define('DB_CHARSET', 'utf8mb4');

define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

define('PEXELS_API_KEY', '');
define('UNSPLASH_API_KEY', '');

define('STRIPE_SK', getenv('STRIPE_SK') );

define('CONF_CLIENT_ID', getenv('LINKEDIN_CLIENT_ID') );
define('CONF_CLIENT_SECRET', getenv('LINKEDIN_CLIENT_SECRET') );
define('CONF_CLIENT_REDIRECT_URI', getenv('LINKEDIN_CLIENT_REDIRECT_URI') ); // 'https://3000-veepdotai-voice2post-jy1dot3bmal.ws-eu117.gitpod.io/linkedin'

define('INFLUX_ORG_ID', getenv('INFLUX_ORG_ID') );
define('INFLUX_TOKEN', getenv('INFLUX_TOKEN') );
define('USAGE_SERVER', getenv('USAGE_SERVER') );
define('USAGE_BUCKET_NAME', getenv('USAGE_BUCKET_NAME') );
define('USAGE_USER_TEST', getenv('USAGE_USER_TEST') );

$table_prefix = 'wp_';

