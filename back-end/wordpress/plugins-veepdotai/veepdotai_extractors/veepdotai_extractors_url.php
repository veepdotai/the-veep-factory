<?php

if (! defined('ABSPATH')) { exit; }

use Html2Text\Html2Text;

add_filter( 'url_provided_as_source', 'Veepdotai_Extractors_Url::extract_content_from_url', 10, 1 );

class Veepdotai_Extractors_Url {

    public static function log( $msg, $level = 3, $filename = "/tmp/openai.log") {
        //error_log( $msg . "\n", $level, $filename );
        Veepdotai_Util::log( "debug", $msg );
    }

    public static function extract_content_from_url( $input_url ) {
        self::log( __METHOD__ . ": an input url has been provided: " . $input_url);

        $ch = curl_init();
        curl_setopt( $ch, CURLOPT_URL, $input_url );
        curl_setopt( $ch, CURLOPT_HEADER, 0 );
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );

        $res = curl_exec( $ch );

        curl_close( $ch );

        $html = new Html2Text( $res );
        $text = $html->getText();

        //self::log( __METHOD__ . ": stripped_content: " . $text . ".");
        return $text;
    }
}

