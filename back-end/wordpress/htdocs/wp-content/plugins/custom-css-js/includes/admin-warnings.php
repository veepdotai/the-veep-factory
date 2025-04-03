<?php
/**
 * Custom CSS and JS
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

/**
 * CustomCSSandJS_Warnings 
 */
class CustomCSSandJS_Warnings {

    private $allowed_actions = array(
    );

    /**
     * Constructor
     */
    public function __construct() {

        if ( ! function_exists( 'is_plugin_active' ) ) {
            require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
        } 

        add_action( 'wp_ajax_ccj_dismiss', array( $this, 'notice_dismiss' ) );
    }

    /**
     * Allow the dismiss button to remove the notice
     */
    function dismiss_js( $slug ) {
    ?>
        <script type='text/javascript'>
        jQuery(function($){
            $(document).on( 'click', '#<?php echo $slug; ?> .notice-dismiss', function() {
            var data = {
                action: 'ccj_dismiss',
                option: '<?php echo $slug; ?>',
                nonce: $(this).parent().data('nonce'),
            };
            $.post(ajaxurl, data, function(response ) {
                $('#<?php echo $slug; ?>').fadeOut('slow');
            });
            });
        });
        </script>
    <?php
    }


    /**
     * Ajax response for `notice_dismiss` action
     */
    function notice_dismiss() {

        $option = $_POST['option'];

        if ( ! in_array($option, $this->allowed_actions ) ) {
            return;
        }

        check_ajax_referer( $option, 'nonce' );

        update_option( $option, 1 );

        wp_die();
    }

}


return new CustomCSSandJS_Warnings();
