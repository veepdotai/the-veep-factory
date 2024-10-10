<?php
/*
 * @Copyright (c) 2013 Ayush Chaudhary
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * * Redistributions of source code must retain the above copyright
 *   notice, this list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above
 *   copyright notice, this list of conditions and the following disclaimer
 *   in the documentation and/or other materials provided with the
 *   distribution.
 * * Neither the name of the  nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

/**
 * PHP encoder for TOML language: https://github.com/mojombo/toml
 *
 * @author Ayush Chaudhary https://github.com/ayushchd
 *
 * @version 1.0
 *
 */

class Toml_Encoder
{
    
    private $toml_string;
    
    /**
     * Encodes a PHP Array to TOML string
     *
     * @param array $toml_array Array to be processed
     * @return string TOML formatted string
     */
    
    public function encode($toml_array)
    {
        if (!is_array($toml_array)) 
            throw new Exception("Supplied input is not an array");

        $str = "";
        
        foreach ($toml_array as $key => $val) {
            $str .= $this->process($key, $val);
        }

        return $str;
    }

    /**
     * Function that processes each keygroup/key recursively
     * @param  mixed $key
     * @param  mixed $val 
     * @param  string $parent_key contains parent key name for nested keygroups
     * @return string 
     */
    
    private function process($key, $val, $parent_key = "") {

        $str = "";

        if (is_array($val)) {
            if (!$this->is_assoc($val)) {
                $str .= "$key = [" . $this->implode_arr(",", $val) . "] \n";
            } else {
                if ($parent_key)
                    $key = $parent_key . "." . $key;
                $str .= "[$key] \n";
                foreach ($val as $k => $v) {
                    $str .= $this->process($k, $v, $key);
                }
            }
        } else { 
            $val = $this->processValue($val);
            $str .= "$key = $val \n";
        }

        return $str;
    }

    /**
     * Implodes an array recursively
     * @param  string $del 
     * @param  array $arr
     * @return string Imploded String
     */
    
    private function implode_arr($del, $arr) {
        $i = 0;
        $str = "";
        while($i < count($arr)) {

            $val = $arr[$i];

            if (is_array($val)) {
                $str .= "[" . $this->implode_arr(",", $val) . "]";
            } else {
                $val = $this->processValue($val);
                $str .= $val;
            }
            if ($i != count($arr) - 1) 
                    $str .= ",";
            $i++;
        }

        return $str;
    }

    /**
     * Process Different Data types
     * @param  mixed $val
     * @return mixed
     */
    
    private function processValue($val) {
        
        if ($this->isISODate($val)) {
            //date
        } elseif (is_string($val)) {
            $val = $this->processString($val);
        } elseif (is_bool($val)) {
            if ($val)
                $val = "true";
            else
                $val = "false";
        }

        return $val;
    }

    /**
     * Process a string for special chars, etc
     * @param  string $str
     * @return string
     */
    
    private function processString($str) {
        $str = str_replace(array("\0", "\t", "\n", "\r", '"', "\\"), array('\0', '\t', '\n', '\r', '\"', '\\') , $str);
        $str = '"' . $str . '"';
        return $str;
    }

    /**
     * Returns whether the given array is associative or not
     * @param  array  $array
     * @return boolean  
     */
    
    private function is_assoc($array) {
        return (bool)count(array_filter(array_keys($array), 'is_string'));
    }  

    /**
     * Return whether the given value is a valid ISO-Date or not
     * @param  string  $val
     * @return boolean
     */
    
    private function isISODate($val) {
        return preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $val);
    }

}

