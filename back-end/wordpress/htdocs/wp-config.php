<?php

define('DB_NAME', 'wp_prod');
define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root');
define('DB_PASSWORD', 'patrick');

define('AUTH_KEY', 'iT0ubNlcb=^w[,uqEyWPY>&R;7J3awDAYuk6BV3(y,)dJY77U7j4DA+PM`>X9{]Z');
define('AUTH_SALT', 'T=#E-Tid^l{N}jwxX*a|T4#ocktp!&;+$0]fbH8lNJus}1bSvBt~MZzK2T;JOeS<');
define('SECURE_AUTH_KEY', ')?8z?C6C@d,*GiVY+he0J>Kyd$fc;~lO";Zf:,SAtGq8o,usG#BK-TGP=Nzh9h5j');
define('SECURE_AUTH_SALT', 'M=o?!|YW_cOjpOvDsAyNV/W`J?v=|:CUW&H`66)a^za5Jno?w`uVQ!kn)l8EuH*u');
define('LOGGED_IN_KEY', '_D-l6l;sMV#DXT+p|ze_Q7x{"(a#@hU*6v%NQ1Wut4|LSMg$_l!KkeF3#]k0Zn-E');
define('LOGGED_IN_SALT', 'F]3,Bo,y!e2s)cCY|/|+A[D>(*cHseOCntLRBisX3N/o*7mOx=V]oEqWvdxflr14');
define('NONCE_KEY', 'sNA)eLsD*e6av7}X@QHmPrNFqT{`h!#+_j2b;nbpIw#IDN";p>)8q=Mk4ETk^!ZY');
define('NONCE_SALT', '%"vz^XU>pl/V$[5P}*,BbB65ue(?|f44<pfTAkT*2RCJwW%_9Psn6II9:>Mh.7;m');

require_once(ABSPATH . 'wp-veep.php');
require_once(ABSPATH . 'wp-settings.php');
