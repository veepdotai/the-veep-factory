<?php

/**
 * Class Veepdotai_Text_Extraction
 *
 * Example usage:
 *
 * $response = Veepdotai_Text_Extraction::convert_to_text($path_to_valid_file);
 *
 */
class Veepdotai_Text_Extraction
{
    /**
     * @return bool|string
     */
    protected static function opendocument_to_text( $path_to_file )
    {
        $response = '';
        $zip      = zip_open($path_to_file);

        if (!$zip || is_numeric($zip)) return false;

        while ($zip_entry = zip_read($zip)) {

            if (zip_entry_open($zip, $zip_entry) == FALSE)
                continue;

            if (zip_entry_name($zip_entry) != 'content.xml')
                continue;

            $response .= zip_entry_read($zip_entry, zip_entry_filesize($zip_entry));

            zip_entry_close($zip_entry);
        }

        zip_close($zip);

        $response = str_replace('</text:p>', "\r\n", $response);
        $response = strip_tags($response);

        return $response;
    }

    /**
     * @return array
     */
    public static function get_valid_file_types()
    {
        return [
            'odt',
            'ods',
            'odp'
        ];
    }

    /**
     * @param $path_to_file
     * @return bool|mixed|string
     * @throws Exception
     */
    public static function convert_to_text( $path_to_file )
    {
        if (isset($path_to_file) && file_exists($path_to_file)) {

            $valid_extensions = self::get_valid_file_types();

            $file_info = pathinfo($path_to_file);
            $mime_type = mime_content_type( $path_to_file );
            $file_ext  = Veepdotai_Mimetypes::mime2ext( $mime_type ) ;
//            $file_ext  = strtolower($file_info['extension']);

            if (in_array( $file_ext, $valid_extensions )) {

                $method   = 'opendocument_to_text';
                $response = self::$method( $path_to_file );

            } else {

                throw new \Exception('Invalid file type provided. Valid file types are odt, ods or odp.');

            }

        } else {

            throw new \Exception('Invalid file provided. The file does not exist.');

        }
        
        return $response;
    }

}