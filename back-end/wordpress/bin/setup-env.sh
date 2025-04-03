#!/bin/bash


SQL_DUMP_FILE=$ENV_SQL_DUMP_FILE

v_read_pass() {
	echo -n Password: 
	read INPUT_PASSWD

	#INITIAL_P_PASSWORD="-ppassword"
	INITIAL_P_PASSWORD="-p0n460teI6zS13WyN"
	RAND_PASS=$(tr -dc 'A-Za-z0-9!?%=' < /dev/urandom | head -c 20)
	PASSWORD=${INPUT_PASSWD:-$RAND_PASS}
	P_PASSWORD="-p$PASSWORD"

	echo "Input password you want to use for ${DB_SYS_MAINT} mysql user and admin wordpress user: $PASSWORD"
}

v_installation() {
	sudo apt-get update

	# Various required packages for Veep to work
	sudo apt-get -y install ffmpeg php8.2-curl

	# Apache Configuration
	#export APACHE_DOCROOT_IN_REPO=../wordpress/htdocs
	#apachectl start
	# APACHE_DOCROOT is defined in /etc/apache2/envvars
	sudo service apache2 start

	# MySQL server installation
	sudo apt-get -y install mysql-server ffmpeg php8.2-curl

	# MySQL post-installation
	sudo chown mysql:$DEV_PLATFORM /var/run/mysqld
	sudo chmod g+rwx /var/run/mysqld

	# MySQL start
	#sudo mysqld_safe -D
	sudo service mysql start

}

v_mysql_configuration() {
	echo "MySQL Configuration"
	echo "* Configuring passwd for root user"
	sql="ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$PASSWORD';"
	echo $sql | sudo mysql -u $DB_SYS_MAINT $INITIAL_P_PASSWORD

	echo "* Flushing privileges for previous user"
	sql="FLUSH PRIVILEGES;"
	echo $sql | sudo mysql -u $DB_SYS_MAINT $INITIAL_P_PASSWORD
}

v_wordpress_configuration() {
	sql="CREATE DATABASE wp_prod;"
	echo $sql | sudo mysql -u $DB_SYS_MAINT $INITIAL_P_PASSWORD

	# replace "app.veep.ai" by the name used on dev env (gitpod, github with codespaces...)
	# be careful, the open ai key contains also app-veep-ai which is intercepted with app.veep.ai regex
        # but this one must not change!
	# ffmpeg executable is /usr/bin/ffmpeg on almost all linux platforms
	#sql_dump_file="/workspace/wordpress/backups/20240621-210000/20240621-1702373413_app_veep_ai.sql"
	echo "Import app.veep.ai wordpress content: $SQL_DUMP_FILE"
	sudo mysql --default-character-set=utf8mb4 -u $DB_SYS_MAINT $INITIAL_P_PASSWORD wp_prod < $SQL_DUMP_FILE

	echo "Update WP admin passwd"
	sql="UPDATE wp_prod.wp_users SET user_pass = md5('$PASSWORD') WHERE ID = 1;"
	echo $sql | sudo mysql -u $DB_SYS_MAINT $INITIAL_P_PASSWORD
}

v_install_configure() {
	v_read_pass
	v_installation
	v_mysql_configuration
	v_wordpress_configuration
}

