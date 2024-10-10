function simple_jwt_login_export_import_confirm()
{
    if(!confirm('Are you sure you want to import these settings into WordPress? These settings will overwrite existing settings for your plugin.')){
        return false;
    };
}