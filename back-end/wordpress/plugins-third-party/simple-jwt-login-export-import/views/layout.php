<?php

use SimpleJWTLogin\Modules\SimpleJWTLoginSettings;
use SimpleJWTLogin\Modules\WordPressData;

if (!defined('ABSPATH')) {
    exit;
}

$value = '';
$error = null;
$success = null;
$wordPressData = new WordPressData();

if (!empty($_POST) && isset($_POST['action']) && isset($_POST['_wpnonce'])) {
    $result = $wordPressData
        ->checkNonce($_POST['_wpnonce'], WordPressData::NONCE_NAME);
    if ($result === false) {
        $error = __('Something is wrong.', 'simple-jwt-login-export-import');
    } else {
        $action = sanitize_text_field($_POST['action']);
        switch ($action) {
            case "import":
                if (isset($_POST['settings'])) {
                    $settingsArray = json_decode(stripslashes($_POST['settings']), true);
                    if (!is_array($settingsArray)) {
                        $error = __('Invalid import settings.', 'simple-jwt-login-export-import');
                        break;
                    }

                    $settings = json_encode(
                        simple_jwt_login_export_import_sanitize($settingsArray)
                    );
                    $needUpdate = $wordPressData->getOptionFromDatabase(SimpleJWTLoginSettings::OPTIONS_KEY) !== false;

                    if ($needUpdate) {
                        $wordPressData->updateOption(
                            SimpleJWTLoginSettings::OPTIONS_KEY,
                            $settings
                        );
                    } else {
                        $wordPressData->addOption(
                            SimpleJWTLoginSettings::OPTIONS_KEY,
                            $settings
                        );
                    }

                    $success = __('Settings has been imported.', 'simple-jwt-login-export-import');
                }
                break;

            case 'export':
                $dbData = $wordPressData->getOptionFromDatabase(SimpleJWTLoginSettings::OPTIONS_KEY);
                if (empty($dbData)) {
                    $error = __(
                        'You don\'t  have settings saved for Simple-JWT-Login plugin.',
                        'simple-jwt-login-export-import'
                    );
                    break;
                }
                $value = esc_html($dbData);
                break;
        }
    }
}
?>
<div id="simple-jwt-login-export-import" class="container-fluid">
    <?php
    if ($success !== null || $error !== null) {

        $alertMessage = $success;
        $type = 'success';
        if ($error !== null) {
            $type = 'danger';
            $alertMessage = $error;
        }

        ?>
        <div class="row">
            <div class="alert alert-<?php echo $type; ?>">
                <?php echo esc_html($alertMessage); ?>
            </div>
        </div>
        <?php
    }
    ?>
    <div class="row">
        <div class="col-md-12">
            <h1><?php echo __('Export/Import Settings ', 'simple-jwt-login-export-import'); ?><span
                        class="beta">beta</span></h1>
        </div>
    </div>
    <form method="POST">
        <?php
        $wordPressData->insertNonce(WordPressData::NONCE_NAME);
        ?>
        <div class="row">
            <div class="col-md-12">
                <input type="submit" name="action" value="import" class="btn btn-dark"
                       onclick="return simple_jwt_login_export_import_confirm()"/>
                <input type="submit" name="action" value="export" class="btn btn-dark"/>
            </div>
        </div>
        <hr/>

        <div class="row">
            <div class="col-md-12">
                <label for="settings-response"><b><?php echo __('Response', 'simple-jwt-login-export-import'); ?>
                        :</b></label>
                <textarea
                        id="settings-response"
                        rows="20"
                        name="settings"
                        class="input form-control"
                    <?php if (!empty($value)) {
                        echo "readonly";
                    }
                    ?>
            ><?php echo esc_html($value); ?></textarea>
            </div>
        </div>
    </form>
</div>
