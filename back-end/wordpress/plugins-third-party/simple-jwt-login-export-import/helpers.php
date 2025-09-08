<?php
/**
 * @param mixed $data
 * @return mixed
 */
function simple_jwt_login_export_import_sanitize($data)
{
    switch (true) {
        case is_array($data):
            foreach ($data as $key => $item) {
                $data[$key] = simple_jwt_login_export_import_sanitize($item);
            }
            break;
        case is_string($data):
            $data = sanitize_text_field(esc_html($data));
            break;
        case is_object($data):
            $data = (object)simple_jwt_login_export_import_sanitize((array)$data);
            break;
    }

    return $data;
}