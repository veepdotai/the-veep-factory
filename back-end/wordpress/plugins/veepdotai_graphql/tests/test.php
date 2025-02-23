<?php

$meta = [
	"veepdotaiPhase3Content",
	"veepdotaiPhase14Content",
];

function onlyPhase( $string ) {
	echo $string . "\n" ;
	$res = strpos( $string, "veepdotaiPhase" ) === false;
	echo "Res: $res";

	return ! $res;
}

function onlyIdx( $string ) {
	$matches = [];
	preg_match( "/veepdotaiPhase(\d*)Content/", $string, $matches);
	if ( $matches ) {
		return $matches[1];
	}
}

$meta_v_phase = array_filter( $meta, "onlyPhase" );
$meta_v_phase_idx = array_map( "onlyIdx", $meta_v_phase );
//for ( $i = 0; $i < ) {
//
//}

var_dump( $meta );
var_dump( $meta_v_phase );
var_dump( $meta_v_phase_idx );
