<?php

define('DB_NAME', 'wp_prod');
define('DB_USER', 'root');
define('DB_PASSWORD', 'coucou');

define('AUTH_KEY', 'WB:Zwz6nja~5QBImafU>6uZn|HGWiQB8r&Trm8Ml+&H/T$SF-*@;pWoO^N4-VyO)');
define('AUTH_SALT', 'qCM(N*&-So1{M0-zTNH-T){"31ON//Z1PYgUu%gBE58S.uG<!2.TX}2LVy6c*%gp');
define('SECURE_AUTH_KEY', '2<`)2[6lnX#`|[[!V1czk*QS|o%,*BsI@(C8IHc|@.1338"TIOF~ceQ1G7PDe!L{');
define('SECURE_AUTH_SALT', 'BRT;OZ432vhP[h_[h]jbdoT]HCIvXV<Iawh[YO&xYtWBL.=BiL;w6psw1o<]l^?K');
define('LOGGED_IN_KEY', 'V<>vQy@6*1Bd%nVC1y.zVlgc@16Px.^RBIS}^xmlCq8gw9ZWi]KCj}:y+9%cj`Fx');
define('LOGGED_IN_SALT', '@eg"`IFH[v2}KCgv7[(Tl:`awLj]"-grE7jVIj7kF0vR"fP10jUHKW66*=wvq753');
define('NONCE_KEY', 'Kqp<Sk[k}3sSU*`Xwc~#f"Y&RKCQ"`vY7uWeN{iphXU8>b@et=zA3z2+7=b!lVNO');
define('NONCE_SALT', ';y%"XOx^|$YEPSWHnkd60Jwhwt!Tv3Ib_ns24PQ6+rb+#]`]9"{4nbrH~Ub~?@_g');

require_once(ABSPATH . 'wp-veep.php');
require_once(ABSPATH . 'wp-settings.php');
