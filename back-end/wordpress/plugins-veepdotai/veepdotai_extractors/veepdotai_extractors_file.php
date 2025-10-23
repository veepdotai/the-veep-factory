<?php

if (! defined('ABSPATH')) { exit; }

use Smalot\PdfParser\Config;
use Smalot\PdfParser\Parser;

add_filter( 'blob_provided_as_source', 'Veepdotai_Extractors_File::dispatch', 10, 3 );

class Veepdotai_Extractors_File {

    public static function log( $msg, $level = 3, $filename = "/tmp/openai.log") {
        //error_log( $msg . "\n", $level, $filename );
        Veepdotai_Util::log( "debug", $msg );
    }

//    public static function extract_content_from_file( $input_file ) {
    public static function dispatch( $file, $pid ) {
		Veepdotai_Util::create_directories();

        $input = $file[ 'tmp_name' ];
        $filename = $file[ 'name' ];
        $type = $file[ 'type' ];

//			self::log( 'debug', __METHOD__ . ': input: file[tmp_name]: ' . $input );
//			self::log( 'debug', 'File from the request: filename [name]: ' . $filename );
        self::log( __METHOD__ . ': file: ' . json_encode( $file ) );

        $mime_type = mime_content_type( $input );
        self::log( __METHOD__ . ": mime_type: " . $mime_type );

        $suffix = Veepdotai_Mimetypes::mime2ext( $mime_type );

        $transcription = "";
        try {

            if ( preg_match( "#^(audio|video)/#", $mime_type ) ) {
                self::log( __METHOD__ . ": file is an audio or video file: $mime_type" );
                $transcription = Veepdotai_Extractors_File_Audio::extract_content_from_audio( $input, $pid );
            } else {
                $transcription = self::extract_content_from_document( $input );
            }
        } catch (Exception $e) {
            self::log( __METHOD__ . ": An exception has been raised and catched!" );
        }
            
        $output = self::store_file( $input, $pid );
        self::log( __METHOD__ . ": output filename: $output." );

		return [
            "transcription" => $transcription,
            "output_filename" => $output
        ];
	}

    public static function store_file( $input, $pid ) {
        self::log( __METHOD__ . ": input: $input." );

        $mime_type = mime_content_type( $input );
        $suffix = Veepdotai_Mimetypes::mime2ext( $mime_type );
        
        $output = Veepdotai_Util::get_storage_filename( $pid . '-file.' . $suffix );
        self::log( __METHOD__ . ": file is going to be moved to: $output." );

        if ( function_exists( 'wp_handle_upload' ) ) {
            self::log( __METHOD__ . ": wp_handle_upload exists.");
            $file_result = wp_handle_upload( $file );
            $error = $file_result->error;
        } else {
            self::log( __METHOD__ . ": wp_handle_upload doesn\'t exist.");
            $error = false;
        }

        if ( ! $error ) {
            self::log( __METHOD__ . ": no error from the uploaded file. Let\'s move it: $output." );

            rename( $input, $output );
            chmod( $output, 0644 );
        } else {
            self::log( __METHOD__ . ": error from the uploaded file: $output." );
            // What do we do?
            // Throws an error.
            die();
        }

        // We are on the vocal section. Where could we be anyway? On the article part.
        $path = preg_replace( '#.*/wp-content/data/veepdotai/(.*)#', '/$1', $output );
        self::log( "Storing path to retrieve it later: $path." );
        Veepdotai_Util::set_option( 'ai-file-path', $path );

        return $output;
    }

    public static function extract_content_from_document( $input_file ) {
        self::log( __METHOD__ . ": an input file has been provided: " . $input_file );

        $mime_type = mime_content_type( $input_file );
        self::log( __METHOD__ . ": mime_type: " . $mime_type );
        switch( $mime_type ) {
            case 'text/plain':
                $output = self::extract_content_from_text_file( $input_file );
                break;
            case 'application/pdf':
                $output = self::extract_content_from_pdf_file( $input_file );
                break;
            case 'application/vnd.oasis.opendocument.text': /* .odt type */;
            case 'application/vnd.oasis.opendocument.spreadsheet': /* .ods type */;
            case 'application/vnd.oasis.opendocument.presentation': /* .odp type */;
                $output = self::extract_content_from_opendocument_file( $input_file );
                break;
            case 'application/msword':
                $file_ext = "doc";
                $output = self::extract_content_from_msoffice_file( $input_file, $file_ext );
                break;
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                $file_ext = "docx";
                $output = self::extract_content_from_msoffice_file( $input_file, $file_ext );
                break;
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                $file_ext = "xlsx";
                $output = self::extract_content_from_msoffice_file( $input_file, $file_ext );
                break;
            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                $file_ext = "pptx";
                $output = self::extract_content_from_msoffice_file( $input_file, $file_ext );
                break;
            default:
                $output = "";
        }
        
        self::log( __METHOD__ . ": stripped_content: " . $output_file );
        return $output;
    }

    public static function extract_content_from_text_file( $file ) {
        $output = file_get_contents( $file );

        return $output;
    }

    public static function extract_content_from_pdf_file( $file ) {
        //$config = new Config();
        //$config->setFontSpaceLimit(0);
        //$parser = new Parser([], $config); 

        $parser = new Parser(); 
        $pdf = $parser->parseFile($file); 
        $output = $pdf->getText();

        return $output;
    }

    /* Processes doc, docx, xlsx, pptx and pdf files */
    public static function extract_content_from_opendocument_file( $file ) {
        return Veepdotai_Text_Extraction::convert_to_text( $file );
    }
    
    /* Processes doc, docx, xlsx, pptx and pdf files */
    public static function extract_content_from_msoffice_file( $file, $file_ext ) {
        return RD_Text_Extraction::convert_to_text( $file, $file_ext );
    }
}

