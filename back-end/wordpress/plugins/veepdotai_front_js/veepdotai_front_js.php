<?php
/**
 * @package Test
 * @version 1.0.0
 */
/*
Plugin Name: veepdotai_front_js
Plugin URI: http://wordpress.org/plugins/veepdotai_front_js/
Description: Adds widgets to veepdotai
Author: Thomas CARREAU
Version: 0.0.2
Author URI: http://www.veep.ai
*/

require 'vendor/autoload.php';

use ImgFinder\Repository\PexelsRepository;
use ImgFinder\Repository\UnsplashRepository;

// Don't forget to replace by your api's key
if(!defined('PEXELS_API_KEY')){
    define('PEXELS_API_KEY', 'CHANGE_ME'); // value to change
}

if(!defined('UNSPLASH_API_KEY')){
    define('UNSPLASH_API_KEY', 'CHANGE_ME'); // value to change
}

define('VEEPDOTAI_FRONT_JS_VERSION', '1.0.0');
define('VEEPDOTAI_FRONT_JS_PLUGIN_VERSION', '1.0.0');

if (!defined('WPINC')) {
    die;
}

function veepdotai_front_js_enqueue_style()
{
    wp_enqueue_style('veepdotai-front-css-jquery.modal', plugins_url('/veepdotai_front_js/admin/assets/carousel/css/jquery.modal.min.css'), false);
    wp_enqueue_style('veepdotai-front-css-splide-4.1.4', plugins_url('/veepdotai_front_js/admin/assets/carousel/css/splide.min.css'), false);
    wp_enqueue_style('my-veepdotai-front-css-carousel', plugins_url('/veepdotai_front_js/admin/assets/carousel/css/carousel.css'), false);
    wp_enqueue_style('my-veepdotai-front-css-inline-editor', plugins_url('/veepdotai_front_js/admin/assets/inline-editor/css/inline-editor.css'), false);
    wp_enqueue_style('my-veepdotai-front-css-common', plugins_url('/veepdotai_front_js/admin/assets/common/css/common.css'), false);
}

function veepdotai_front_js_enqueue_script()
{
    wp_enqueue_script('veepdotai-front-js-splide-4.1.4', plugins_url('/veepdotai_front_js/admin/assets/carousel/js/splide.min.js'), true);
    wp_enqueue_script('veepdotai-front-js-jquery-3.7.1', plugins_url('/veepdotai_front_js/admin/assets/common/js/jquery-3.7.1.js'), true);
    wp_enqueue_script('veepdotai-front-js-jquery.modal', plugins_url('/veepdotai_front_js/admin/assets/carousel/js/jquery.modal.min.js'), true);

    wp_enqueue_script('my-veepdotai-front-js-loader', plugins_url('/veepdotai_front_js/admin/assets/carousel/js/loader.js'), true);
    wp_enqueue_script('my-veepdotai-front-js-carousel', plugins_url('/veepdotai_front_js/admin/assets/carousel/js/carousel.js'), true);
    wp_enqueue_script('my-veepdotai-front-js-staticJson', plugins_url('/veepdotai_front_js/admin/assets/carousel/js/staticJson.js'), true);

    wp_enqueue_script('my-veepdotai-front-js-inline-editor', plugins_url('/veepdotai_front_js/admin/assets/inline-editor/js/inline-editor.js'), true);

    wp_localize_script(
        'my-veepdotai-front-js-loader',
        'MyAjax',
        array(
            'ajaxurl'  => admin_url('admin-ajax.php'),
            'security' => wp_create_nonce('my-special-string'),
        )
    );
}

add_action('wp_enqueue_scripts', 'veepdotai_front_js_enqueue_style');
add_action('wp_enqueue_scripts', 'veepdotai_front_js_enqueue_script');

add_action('wp_ajax_save_featured_image', 'save_featured_image_callback');
add_action('wp_ajax_save_article_inline', 'save_article_inline_callback');

add_action('wp_ajax_get_json_api', 'get_json_api_callback');

function save_featured_image_callback()
{
    $url = $_POST['src'];
    $alt = $_POST['alt'];
    $postId = $_POST['postId'];
    $isUnsplash = $_POST['isUnsplash'];

    if ($isUnsplash === "true") {
        $url = $url . '&.png';
    }

    $isAlreadyLoaded = isAlreadyLoaded($url);

    if ($isAlreadyLoaded) {
        $imageId = $isAlreadyLoaded;
    } else {
        $imageId = media_sideload_image($url, 0, $url, 'id');
    }

    if (is_int($imageId)) {
        update_post_meta($imageId, '_wp_attachment_image_alt', $alt);
        set_post_thumbnail($postId, $imageId);
    }

    echo $isAlreadyLoaded;
    die;
}

function save_article_inline_callback()
{
    $modifications = $_POST['modifications'];
    $modifications = str_replace('\"', '"', $modifications);
    $modifications = json_decode($modifications);

    $postId = $_POST['postId'];

    $postHtml = get_post($postId)->post_content;
    
    for ($i = 0; $i < count($modifications); $i++){
        $id = $modifications[$i]->id;
        $newContent = $modifications[$i]->content;
        
        $idPos = strpos($postHtml, $id);
    
        $startPos = strpos($postHtml, ">", $idPos)+1;
        $endPos = strpos($postHtml, "</p>", $idPos);
    
        $start = substr($postHtml, 0, $startPos);
        $end = substr($postHtml, $endPos);
    
        $postHtml = $start . $newContent . $end;
    }
    
    $postarr = array(
        'ID'            => $postId,
        'post_content'  => $postHtml
    );

    $response = wp_update_post($postarr);
   
    echo $response;
    die;
}

function get_json_api_callback()
{
    $nbImage = 2;

    $query = sanitize_text_field($_POST["query"]);
    $api = [$_POST["api"]];

    $settings = [
        'img-finder' => [
            'repositories' => [
                PexelsRepository::class => [
                    'params' => [
                        'authorization' => constant('PEXELS_API_KEY')
                    ]
                ],
                UnsplashRepository::class => [
                    'params' => [
                        'authorization' => constant('UNSPLASH_API_KEY')
                    ]
                ]
            ]
        ]
    ];

    $config = ImgFinder\Config::fromArray($settings);

    $finder = new ImgFinder\ImgFinder($config);

    if ($api[0] === "both") {
        $api = ['pexels', 'unsplash'];
    } else {
        $nbImage *= 2;
    }

    $request = ImgFinder\Request::set($query, $api, 1, $nbImage, 'landscape', 1200, 320);
    $response = $finder->search($request);

    $imagesUrls = $response->toArray();

    echo json_encode($imagesUrls);
    die;
}

function isAlreadyLoaded($newUrl)
{
    $args = array(
        'post_type' => 'attachment',
        'post_status' => 'any',
        'posts_per_page' => -1
    );

    $query = new WP_Query($args);

    $newImageId = 0;

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();

            $imageId = get_the_ID();

            $urlSource = get_post_meta($imageId, '_source_url')[0];
            $urlSource = str_replace("\\", "", $urlSource);

            if ($urlSource === $newUrl) {
                $newImageId = $imageId;
            }
        }
    }

    return $newImageId;
}
