<?php

echo "Part 1\n";

$array = [ "values" => "this is my value", "history" => "this is my history"];
var_dump($array);
echo "val:" . $array["values"] . "\n";
$o = json_encode($array);
echo "json_encode: o: ";
var_dump($o);

echo "Part 2\n";

$json_o = '{"values": "This is my value", "history": "this is my history"}';
var_dump($json_o);
$o = json_decode( $json_o );
var_dump($o);

echo "coucou";

