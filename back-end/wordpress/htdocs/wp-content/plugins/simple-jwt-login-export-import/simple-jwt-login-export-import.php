<?php
/*
    Plugin Name: Simple-JWT-Login-Export-Import
    Plugin URI: https://simplejwtlogin.com
    Description: Simple-JWT-Login Export-Import Add-on allows you to export or import Simple-Jwt-Login settings
    Author: Nicu Micle
    Author URI: https://profiles.wordpress.org/nicu_m/
    Text Domain: simple-jwt-login-export-import
    Domain Path: /i18n
    Version: 0.3.0
*/

add_action('admin_menu', 'simple_jwt_login_export_import_plugin_create_menu_entry', 11);
if (check_import_export_simple_jwt_login_activated() == false) {
    add_action('admin_notices', 'simple_jwt_login_export_import_plugin_missing_notice');
}

function simple_jwt_login_export_import_plugin_missing_notice()
{
    echo '<div class="error">'
        . __('Simple-JWT-Login-Export-Import plugin requires that the Simple JWT Login plugin is installed.', 'simple-jwt-login-export-import')
        . '</div>';
}

function simple_jwt_login_export_import_plugin_create_menu_entry()
{
    add_submenu_page(
        'main-page-simple-jwt-login-plugin',
        __('Export/Import', 'simple-jwt-login-export-import'),
        __('Export/Import', 'simple-jwt-login-export-import'),
        'manage_options',
        'simple_jwt_login_export_import',
        'simple_jwt_login_export_import_function'
    );
}

function check_import_export_simple_jwt_login_activated()
{
    return in_array(
        'simple-jwt-login/simple-jwt-login.php',
        get_option('active_plugins')
    );
}

function simple_jwt_login_export_import_function()
{
    $isSimpleJwtLoaded = check_import_export_simple_jwt_login_activated();
    if (!$isSimpleJwtLoaded) {
        return;
    }

    $pluginData = get_plugin_data(__FILE__);
    $pluginVersion = isset($pluginData['Version'])
        ? $pluginData['Version']
        : false;
    $pluginDirUrl = plugin_dir_url(__FILE__);
    $simpleJwtLoginpluginDirUrl = plugin_dir_url('simple-jwt-login/simple-jwt-login.php');

    $loadScriptsInFooter = false;
    wp_enqueue_style(
        'simple-jwt-login-bootstrap',
        $simpleJwtLoginpluginDirUrl . 'vendor/bootstrap/bootstrap.min.css',
        [],
        $pluginVersion
    );
    wp_enqueue_style(
        'simple-jwt-login-export-import-style',
        $pluginDirUrl . 'assets/css/style.css',
        [],
        $pluginVersion
    );

    wp_enqueue_script(
        'simple-jwt-bootstrap-min',
        $simpleJwtLoginpluginDirUrl . 'vendor/bootstrap/bootstrap.min.js',
        ['jquery'],
        $pluginVersion,
        $loadScriptsInFooter
    );

    wp_enqueue_script(
        'simple-jwt-login-export-import-scripts',
        $pluginDirUrl . 'assets/js/scripts.js',
        ['simple-jwt-bootstrap-min'],
        $pluginVersion,
        $loadScriptsInFooter
    );

    include_once 'helpers.php';
    include_once 'views/layout.php';
}
