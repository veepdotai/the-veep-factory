<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly 
?>

<div class="wrap">
    <div id="poststuff">
        <!--main heading-->
        <h1><i style="color: #0077b5;" class="fa fa-linkedin-square" aria-hidden="true"></i> <?php echo 'WP LinkedIn Auto Publish'; ?><a target="_blank" class="donate-button" href="https://northernbeacheswebsites.com.au/product/donate-to-northern-beaches-websites/">Donate now</a></h1>
        
        <!--notice message-->
        
        <?php 
        //autosocial promotion
        echo '<div class="notice notice-error">';
            echo '<h3 style="margin-top: 15px;" >Upgrade to AutoSocial now!</h3>';

            echo '<p>Please check out the pro version <a href="https://northernbeacheswebsites.com.au/autosocial/">AutoSocial</a> which provides the same functionality as WP LinkedIn Auto Publish but adds Facebook, Google My Business, Twitter, <strong>Instagram (NEW)</strong> and <strong>Pinterest (NEW)</strong>, as well as many more cool features!</p>';

            echo '<a style="margin-top: 5px !important; margin-left: 0px !important; color: white !important;" href="https://northernbeacheswebsites.com.au/autosocial/" class="button button-primary">
            Learn More</a>';

        echo '</div>';


        ?>





        <?php
        
        //get options
        $options = get_option( 'wp_linkedin_autopublish_settings' );
        
        if( !isset($options['wp_linkedin_autopublish_dismiss_welcome_message']) || $options['wp_linkedin_autopublish_dismiss_welcome_message'] != wp_linkedin_autopublish_get_version() ){
 
            
        ?>
        

        <div id="linkedin-welcome-message" data-version="<?php echo wp_linkedin_autopublish_get_version(); ?>" data-dismissible="disable-done-notice-forever" class="notice notice-warning is-dismissible">
        <p><h3>A Message from the Developer</h3><p>Hi there! Thanks for using my plugin. I wrote this plugin because I found there was no free way to share posts on LinkedIn company pages so I thought I would release this plugin. Please rate the plugin <a href="https://wordpress.org/support/plugin/wp-linkedin-auto-publish/reviews/?rate=5#new-post" target="_blank"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></a>'s. If the plugin doesn't work you should read through the <a class="open-tab" href="#helpPage">Help</a> tab FAQ as this will likely solve the issue.</p>
        </div>
        
        <?php } ?>


        <!--start form-->
        <form id='linkedin_autopublish_settings_form' action='options.php' method='post'>
            <!--start tabs-->
            <div id="tabs" class="nav-tab-wrapper"> 
                <ul class="tab-titles">
                    <li><a class="nav-tab" href="#authorisationPage"><i class="fa fa-lock" aria-hidden="true"></i> <?php _e('Connect', 'wp-linkedin-autopublish' ); ?></a></li>
                    <li><a class="nav-tab" href="#profileCompanyPage"><i class="fa fa-briefcase" aria-hidden="true"></i> <?php _e('Profile Selection', 'wp-linkedin-autopublish' ); ?></a></li>
                    <li><a class="nav-tab" href="#sharingOptionsPage"><i class="fa fa-share-alt" aria-hidden="true"></i> <?php _e('Sharing Options', 'wp-linkedin-autopublish' ); ?></a></li>
                    <li><a class="nav-tab" href="#additionalOptionsPage"><i class="fa fa-cogs" aria-hidden="true"></i> <?php _e('Additional Options', 'wp-linkedin-autopublish' ); ?></a></li>
                    <li><a class="nav-tab" href="#helpPage"><i class="fa fa-question" aria-hidden="true"></i> <?php _e('Help', 'wp-linkedin-autopublish' ); ?></a></li>
                </ul>

                <!--add settings pages-->
                <?php 

                wp_linkedin_autopublish_tab_content('authorisationPage'); 

                wp_linkedin_autopublish_tab_content('profileCompanyPage');

                wp_linkedin_autopublish_tab_content('sharingOptionsPage');

                wp_linkedin_autopublish_tab_content('additionalOptionsPage');

                wp_linkedin_autopublish_tab_content('helpPage');

                ?>

            </div> <!--end tabs div-->     
        </form>
        
     
        
        
        
        <!--ad-->
        <?php
            require('nbw.php');  
            echo northernbeacheswebsites_information();
        ?>
        
    </div>
</div>