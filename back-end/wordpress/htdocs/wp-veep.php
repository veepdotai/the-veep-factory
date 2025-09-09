<?php

if ( isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https' )
{
    $_SERVER['HTTPS']       = 'on';
    #$_SERVER['SERVER_PORT'] = 443;
}

define('DB_COLLATE', 'utf8mb4_general_ci');
define('DB_CHARSET', 'utf8mb4');

define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

define('PEXELS_API_KEY', '');
define('UNSPLASH_API_KEY', '');

define('STRIPE_SK', getenv('STRIPE_SK') );

define('LINKEDIN_CLIENT_ID', getenv('LINKEDIN_CLIENT_ID') );
define('LINKEDIN_CLIENT_SECRET', getenv('LINKEDIN_CLIENT_SECRET') );
define('LINKEDIN_CLIENT_REDIRECT_URI', getenv('LINKEDIN_CLIENT_REDIRECT_URI') );
define('LINKEDIN_SCOPE', getenv('LINKEDIN_SCOPE'));

define('INFLUX_ORG_ID', getenv('INFLUX_ORG_ID') );
define('INFLUX_TOKEN', getenv('INFLUX_TOKEN') );
define('USAGE_SERVER', getenv('USAGE_SERVER') );
define('USAGE_BUCKET_NAME', getenv('USAGE_BUCKET_NAME') );
define('USAGE_USER_TEST', getenv('USAGE_USER_TEST') );

$table_prefix = 'wp_';

