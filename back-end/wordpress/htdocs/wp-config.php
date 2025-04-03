<?php

define('DB_NAME', 'wp_prod');
define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root');
define('DB_PASSWORD', 'patrick');

define('AUTH_KEY', 'xw>A"b1kNP){O63Mxt(0%0N-aYL^e(6uihj*^HtEBN@k}&DQUNJktGodU#UdeTM3');
define('AUTH_SALT', 'jzO*H_i;dVy,EJx5QQLHC`=J<$M52J&!/Gx)ity`m.zI/QEctBh,QGRtav|i>6yq');
define('SECURE_AUTH_KEY', '[D#UE&~?kg5T?wq6+(CUQ{e${Po^R0~uqrx:.E%pd.Gp3vp[lNHB95H{<H|}.db~');
define('SECURE_AUTH_SALT', ']hOyfg8>{!tE{OLt$HYQi5AhS)@Y7bK&9BmIEf?tJ+E]|4|8cC,A`$0X~7QQ[D^w');
define('LOGGED_IN_KEY', 'o}20bX=49popH%Cc-|m{B`lcQ5|q[t+37"Nk;O^0]Wn-KI",e_DWZ5Y34T|7YW*B');
define('LOGGED_IN_SALT', '(){T1yZhL6vu?sBj4(vtDQ)owl/++5~&-eHc|!TsPRFT!F0Xd8rLpi:fp(I^ow~b');
define('NONCE_KEY', '(C41;%q=mzLjc%E"{/^*}aASz*%:NN48R@*y]f9zL6gA1q>JTb]q~UJ[,^hPl%k*');
define('NONCE_SALT', 'ckGQh~KG47*N5RP1HVV=cxPrC{3&5{Gll9E:%bTqH;zDP=&RzUeKVo*:/;Uwg<_:');

require_once(ABSPATH . 'wp-veep.php');
require_once(ABSPATH . 'wp-settings.php');
