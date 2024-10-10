#!/bin/bash

. ./.env
. ./back-end/wordpress/bin/generate-wp-config-php.sh
. ./back-end/wordpress/bin/setup-env.sh

v_install_configure
#v_read_pass

DB_NAME="wp_prod"
DB_USER="root"
DB_PASSWORD=$INPUT_PASSWD

v_generate_wp_configure > wp-config.php.generated && \
	mv wp-config.php.generated back-end/wordpress/htdocs/wp-config.php
