https://tommcfarlin.com/php-codesniffer/

git clone git@github.com:WordPress-Coding-Standards/WordPress-Coding-Standards.git wpcs
composer require "squizlabs/php_codesniffer=*"
export PATH=$(pwd)/vendor/bin:$PATH

phpcs --config-set installed_paths /path/to/wp-coding-standards/wpcs

