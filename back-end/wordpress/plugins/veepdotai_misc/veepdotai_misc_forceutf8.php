<?php

namespace Veepdotai\Misc\Encoding;

if (! defined('ABSPATH')) { exit; }

use \ForceUTF8\Encoding;

/**
 * $flag [ "TRANSLIT" | "IGNORE" | "" (noiconv)]
 */
function fixUTF8( $string, $flag = "TRANSLIT" ) {
    return Encoding::fixUTF8($string, $flag);
}
