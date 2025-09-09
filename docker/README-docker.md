# Wordpress docker configuration with MariaDB README

## Overview

I want a docker architecture to make hosting easier and based on my own requirements I can totally master.

This architecture must allow to move Veep.AI architecture from one hosting provider to another without any difficulties. There are 2 situations I want to manage:
* dev mode: installing a dev station must be quick and easy, whatever the OS (Win/linux/Osx) and platform is (i686/amd64/arm64...)
* production mode: installing a server architecture must be automatic to be able to deploy solutions in a very quick, easy and SECURE way

## Minimal security configurations

The dev configuration will be public so anonymous dev can use it and spread the word.
The prod configuration is private of course, but must be reproductible by other organizations so they can have their own architecture too.  

Data in dockers must be saved on a regular basis. A restoration process must be available too.

## Architecture

The Veep.AI architecture is for the moment composed of 3 parts:
* a wordpress container with Veep.AI plugins to benefit user management and store/query content through the graphql plugin
* a mariadb container to serve as the WP backend
* a front container for the nextjs front, served by a static engine (only static js)

Why wordpress? Well, I started the project as a admin WP plugin then moved it on nextjs (static only) still using WP as a graphql backend.

We can imagine another architecture graphql is provided by another solution like apollo or hive. It will be done later.

In a first time, we'll think about the minimum configuration for each part then we'll set them up.

# Minimum configuration

What is the minimum configuration for each part and respecting our minimal security considerations of course.

## Database

To init the backend configurations, db must be provided without any user information and any service keys (for example for AI engines access)

This is the first element to configure. Without it, WP can't work.

The database must be created and configured with a specific user and password. Even in dev mode, some AI keys are required to access AI services and they must be restricted and hidden.

Once configured, WP can be installed.

## WP

A fresh installation of WP must be installed with previous DB informations and the DNS name of the provided service.

The following elements must be added:

* the veepdotai plugins of course
* some external WP plugins
* some tweaks in a few files to make things work, specifically for CORS

The following elements must be configured:

* a demo user named demo (is demo@veep.ai required?)
* some keys for external services (OpenAI, mistral)
* some information about the WP user that will be used as the veep demo user
* some veeplets configured for demo user

To make things smoother, we can provide a db template with the required minimum configuration, with standard passwords for root and demo users with the risk to have some ready-to-be-hacked installations. Standard passwords must be updated to mitigate risks and no AI keys must be provided.

# Implementation

Again, 2 situations must be considered:

* dev configuration which requires dev files to be taken into account dynamically, so each file update can be checked in real time
* prod configuration where files are stuck on a certain version, forbidding file updates except for database and user data

For each container, the dev mode and production mode will be considered.

## The mariadb container

### dev mode

In a first time, I want to be able to start with an empty architecture and import my dev/prod configuration.

If the database is empty at first, then create a blank database that permits to start, which is done during the db installation.

Once done, you can:

* import data
* backup data
* restore data

These scripts will be available in the directory /root/bin du container. Un fichier environnement .env sera présent dans ce répertoire avec les permissions 400.

#### Fichier .env

```sh
USER=wordpress
PASSWORD=$(read)
DATABASE=wordpress
BACKUP_PATH=/
BACKUP_FILE=$1
```

#### import data

```sh
docker exec mariadb /usr/bin/mariadb-dump -u $USER $ -p$PASSWORD $DATABASE | gzip > "$BACKUP_PATH/database_backup_$(date +\%F).sql.gz"
```

#### backup data

```sh
docker exec mariadb /usr/bin/mariadb-dump -u $USER $ -p$PASSWORD $DATABASE | gzip > "$BACKUP_PATH/database_backup_$(date +\%F).sql.gz"
```

#### restore data

```sh
gunzip < "$BACKUP_PATH/$BACKUP_FILE" | docker exec -i wordpress-db /usr/bin/mariadb -u $USER $ -p$PASSWORD $DATABASE
```

#### site_url and home wordpress options

They must be updated, either through:

* the admin dashboard
* the database
* the wp-config.php.

Only the database solution will be explained in this section.

```sql
update wp_options set option_value = 'http://localhost' where option_id = 1; // site_url
update wp_options set option_value = 'http://localhost' where option_id = 2; // home
```

## The WP container

dev and production mode are based on the same install. But, in dev mode, we are less concerned by security and we can set a non random password to make management easier. So we can set db passowrd when launching container.

In production mode, installation must be secured to avoid WP corruption through plugin or code installation, code injection, remote code invocation... 


### dev mode

In dev mode, some actions may be done manually to give more flexibility on the station configuration.

We can for example choose to install some php libs through composer. So composer.phar must be installed.

We also want https installed so we can test features in a setup close to the production one.

### ssl installation and configuration

#### mkcert

Install mkcert, then create root cert and local cert for the nae you want

```bash
apt update
apt install mkcert
mkcert -install			# create Root cert in your root directory
mkcert -CAROOT 			# to have the full directory where the CAROOT is stored.
mkcert mytest.veep.ai 	# in your case, write your own server name of course
```

Certs for mytest.veep.ai are created in the current dir where mkcert is executed. Put them in a safe place and configure your apache environment.

At the end, you must also configure your browser so it accepts your local certs without errors being generated with a CA which is not public.

#### /etc/hosts

It is not required your dev station to be known by internet. But you must then add/update /etc/hosts with the following:

```txt
127.0.0.1       localhost mytest.veep.ai	# Of course, change mytest.veep.ai with the name you want
```

#### apache2 configuration

First, install the elements required to use SSL:

```sh
cd /etc/apache2/mod-enabled
ln -s ../mods-available/ssl.* .
ln -s ../mods-available/socache_shmcb.load
```

Second, update default ssl config to suit your needs:

```xml
<VirtualHost *:443>
        ServerAdmin webmaster@localhost
        ServerName mytest.veep.ai

        DocumentRoot /var/www/html
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined

        SSLEngine on

        SSLCertificateFile      /var/www/html/mytest.veep.ai.pem
        SSLCertificateKeyFile   /var/www/html/mytest.veep.ai-key.pem

        <FilesMatch "\.(?:cgi|shtml|phtml|php)$">
                SSLOptions +StdEnvVars
        </FilesMatch>
        <Directory /usr/lib/cgi-bin>
                SSLOptions +StdEnvVars
        </Directory>
</VirtualHost>
```

Last, reload (and not restart), your apache configuration:

```bash
service apache2 reload
```

By reloading, instead of restarting, your configuration is tested and, if not correct, apache is netiher reloaded, nor stop. It stays in the previous configuration. Error messages appear so you can understand what's wrong.

If your restart and you have a configuration error then the server stops and your docker container too. You'll have to configure your container again...

#### configure your browser (so in your Host not in the docker container)

You must add the CA Root cert in your browser so he will accept certs generated by it. The CA Root is the one that has been created in your docker container with the first mkcert command: mkcert -install.

So, get this CA Root from the container and add it in your browser through:

* Parameters/Private and Security: click in security section on View Certificates and import the CA Root. Indicate you want to use it to check web sites.

Click ok, that must be fine.

Of course, you muse also configure mytest.veep.ai (or whatever) in your local /etc/hosts (not only in the docker container I mean) if you chose a fake name, otherwise your browser won't resolve it.

### site_url and home wordpress options

#### static options

These options can be set statically in wp-config.php

```php
define("WP_SITEURL", "http://localhost")
define("WP_HOME", "http://localhost")
```

#### dynamic options among a set of allowed values

These data can be set dynamically according values in the request such as:

* SERVER_PORT
* SERVER_NAME or HTTP_HOST

Be careful to restrict use of a value among allowed values. Otherwise a malicious user could set it to any value he wants that could eventually open a security breach (for example a name that could create trust among newbies).  

```php
error_log("SERVER_NAME: " . $_SERVER['SERVER_NAME'], 3, "/tmp/test.log");
error_log("HOST_NAME: " . $_SERVER['HOST_NAME'], 3, "/tmp/test.log");

$allowed_names = ["mytest.veep.ai", "localhost"];
$name = $_SERVER['SERVER_NAME'];
$protocol = $_SERVER['SERVER_PROTOCOL'];
$port = $_SERVER['SERVER_PORT'];
if ( in_array( $name, $allowed_names ) ) {
	define( 'WP_SITEURL', $protocol . $name . ':' . $port );
	define( 'WP_HOME', $port . $name . ''  . ':' . $port );
}
```

#### composer.phar installation

#!/bin/bash

php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'.PHP_EOL; } else { echo 'Installer corrupt'.PHP_EOL; unlink('composer-setup.php'); exit(1); }"
php composer-setup.php
php -r "unlink('composer-setup.php');"
mv composer.phar /usr/local/bin/

Finally on your dev station, install the "Allow CORS" extension on firefox and enable it. This is required in dev mode but not in production mode, when the js app is served by your WP installation (because, in that situation, CORS is OK of course).

### production mode

In production mode, we can choose to install composer.phar then remove it once installation has been done.

```bash
cd wp-content/plugins/
DIRS="veepdotai veepdotai_billing veepdotai_dsl veepdotai_extractors veepdotai_graphql veepdotai_misc veepdotai_rest veepdotai_usage" 
for $dir in $(echo $DIRS); do
	pushd $dir && composer.phar install && popd;
done
```

#### Comment wonolog until it is updated

In *plugins/veepdotai/veepdotai.php*, comment wonolog (line 141-142) because it needs an update

// Tell the default handler to use the given directory for logs.
//Wonolog\bootstrap();

#### Update JWT iss

In WP/wp-admin/simple-jwt-login/, section authentication/JWT issuer, uncheck iss because it may not be in sync with hostname. If iss is used, JWT can't be shared beetween various hostnames. 

Select iss if used only with one hostname. For example https://app.veep.ai or https://www.lokavivo.eu 

#### Google Authorization

Allow a new redirect url in console.cloud.google.com/API/Clients/... so OAuth2 Google allows this redirect uri, corresponding to the WP_SITEURL

#### LinkedIn

Add a new redirect url for LI authorization in .env.production to allow third-party publishing. It is built dynamically on the host if not present.
Allow a new redirect url in developers.linkedin.com/Mes apps. Select your app then the auth tab.

#### WPGraphQL

In wpgraphql/src/Router.php, update Access-Control-Allow-Origin l.321 
	'Access-Control-Allow-Origin' => 'http://localhost',

Can't use '*' in Access-Control-Allow-Origin, so replace it by a dynamic value based on WP_SITEURL

	$access_control_allow_origin = WP_SITEURL;
	$headers = [
		'Access-Control-Allow-Origin' => $access_control_allow_origin,
		...
	]
