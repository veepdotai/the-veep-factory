<?php

if (! defined('ABSPATH')) { exit; }

class Veepdotai_Extractors_File_Audio {

    public static function log( $msg, $level = 3, $filename = "/tmp/openai.log") {
        //error_log( $msg . "\n", $level, $filename );
        Veepdotai_Util::log( "debug", $msg );
    }


    public static function extract_content_from_audio( $input_file, $pid ) {
        /*
        $suffix = preg_replace( '#audio/(.*)#', '$1', $type );
        switch ( $suffix ) {
            case 'webm': $suffix = 'webm'; break;
            case 'mp3': $suffix = 'mp3'; break;
            case 'mpeg': $suffix = 'mp3'; break;
            case 'x-m4a': $suffix = 'm4a'; break;
            case 'xm4a': $suffix = 'm4a'; break;
            case 'mp4': $suffix = 'mp4'; break;
            case 'ogg': $suffix = 'ogg'; break;
            default: $suffix = 'wav';
        }
        */
        $mime_type = mime_content_type( $input_file );
        $suffix = Veepdotai_Mimetypes::mime2ext( $mime_type );
        self::log( __METHOD__ . ": suffix: $suffix.");

        $new_suffix = "ogg";
        //if ( $suffix !== $new_suffix ) {
            $input_file = self::convert( $input_file, $new_suffix );
            self::log( __METHOD__ . ": new input_file after conversion: $input_file.");
        //}

        //$size = intval( $file['size'] );
        $size = filesize( $input_file );
        self::log( __METHOD__ . ": size: $size." );        

        $input_files = [];

/*
		if ( $size > 25000000 ) {
			$duration      = 240; // 240 seconds so the size should be < 25 Mo for middle rate
			$ffmpeg = Veepdotai_Util::get_option( 'ffmpeg' );

			$cmd_ffmpeg = "$ffmpeg -i $input_file"
								. " -f segment -segment_time $duration"
								. " -c copy $input_file%2d.$new_suffix";
            self::log( __METHOD__ . ": ffmpeg cmd: $cmd_ffmpeg." );        

			$output = null;
			$return_val = null;
			exec( $cmd_ffmpeg, $output, $return_val);

			if ( $return_val == 0) {
				// sucess
                $input_files = [
                    "$output-%2d.$suffix"
                ];
        
            } else {
				// failure
			}
		} else {
            $input_files = [ $input_file ];
        }
*/

        $input_files = [ $input_file ];

        $transcription = "";
        for( $i = 0; $i < count( $input_files ); $i++) {
            self::log( __METHOD__ . ": transcribe: step $i." );        
            $transcription .= self::transcribe( $input_files[$i], $pid );
        }

        return $transcription;
    }

    /**
     * https://community.openai.com/t/whisper-api-increase-file-limit-25-mb/566754/2
     * ffmpeg -i audio.mp3 -vn -map_metadata -1 -ac 1 -c:a libopus -b:a 12k -application voip audio.ogg
     */
    public static function convert( $input, $suffix ) {
        $new_input = $input . ".$suffix";
            
        $output = null;
        $retval = null;

        $ffmpeg = Veepdotai_Util::get_option( 'ffmpeg' );

        $cmd = "$ffmpeg -i \"$input\" -vn -map_metadata -1 -ac 1 -c:a libopus -b:a 12k -application voip \"$new_input\"";
        self::log( __METHOD__ . ": ffmpeg cmd: " . $cmd);

        $result = exec( $cmd, $output, $retval );
        self::log( __METHOD__ . ": exec: ffmpeg conversion with status: result: $result.\n" );
        self::log( __METHOD__ . ": exec: returned with status: retval: $retval and output:\n" );
        self::log( __METHOD__ . ": exec: output Details: " . print_r( $output, true ) );

        self::log( __METHOD__ . ": result: $result.");
        if ( $retval == 127 ) {
            // Throws an error
            return null;
        }

        return $new_input;
    }

    public static function transcribe( $input, $pid ) {
		self::log( __METHOD__ . ": output: " . print_r( $input, true) );
		self::log( __METHOD__ . ": pid: $pid");

		$transcription = Veepdotai_Util::get_content_from_audio( $input, $pid );
		self::log( __METHOD__ . ": transcription: $transcription.");

        return $transcription;
	}

}

