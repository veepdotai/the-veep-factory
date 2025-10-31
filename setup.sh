#!/bin/bash

# Don't forget to load env vars

. ./back-end/wordpress/bin/generate-wp-config-php.sh
. ./back-end/wordpress/bin/generate-wp-veep-php.sh
. ./back-end/wordpress/bin/setup-env.sh

#v_install_configure
#
#v_read_pass

echo "Generating Veep configuration from the following env vars:"
echo
env | grep "^TVF_" | sort 
echo
echo "Generating wp-config.php..." 
v_generate_wp_config > wp-config.php.generated && \
	mv wp-config.php.generated back-end/wordpress/htdocs/wp-config.php
echo "wp-config.php generated."
echo

echo "Generating wp-veep.php..." 
v_generate_wp_veep > wp-veep.php.generated && \
	mv wp-veep.php.generated back-end/wordpress/htdocs/wp-veep.php
echo "wp-veep.php generated."
echo
echo "Veep configuration done."
