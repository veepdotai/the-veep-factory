<?php

/*
*		Plugin Name: WP LinkedIn Auto Publish
*		Plugin URI: https://www.northernbeacheswebsites.com.au
*		Description: Publish your latest posts to LinkedIn profiles or companies automatically. 
*		Version: 8.15
*		Author: Martin Gibson
*		Author URI:  https://www.northernbeacheswebsites.com.au
*		Text Domain: wp-linkedin-auto-publish   
*		Support: https://www.northernbeacheswebsites.com.au/contact
*		Licence: GPL2
*/



/**
* 
*
*
* Create admin menu and add it to a global variable so that admin styles/scripts can hook into it
*/
add_action( 'admin_menu', 'wp_linkedin_autopublish_add_admin_menu' );
add_action( 'admin_init', 'wp_linkedin_autopublish_settings_init' );

function wp_linkedin_autopublish_add_admin_menu(  ) { 
    $menu_icon_svg = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMiIgYmFzZVByb2ZpbGU9InRpbnkiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDIwIDIwIiBvdmVyZmxvdz0ic2Nyb2xsIiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48Zz48Zz48cGF0aCBmaWxsPSIjOUVBM0E3IiBkPSJNMTcuNywxSDIuM0MxLjYsMSwxLDEuNiwxLDIuM3YxNS40QzEsMTguNCwxLjYsMTksMi4zLDE5aDE1LjNjMC43LDAsMS4zLTAuNiwxLjMtMS4zVjIuM0MxOSwxLjYsMTguNCwxLDE3LjcsMXogTTYuMywxNi4zSDMuN1Y3LjdoMi43VjE2LjN6IE01LDYuNkM0LjEsNi42LDMuNSw1LjksMy41LDVjMC0wLjksMC43LTEuNSwxLjUtMS41YzAuOSwwLDEuNSwwLjcsMS41LDEuNUM2LjYsNS45LDUuOSw2LjYsNSw2LjZ6IE0xNi4zLDE2LjNoLTIuN3YtNC4yYzAtMSwwLTIuMy0xLjQtMi4zYy0xLjQsMC0xLjYsMS4xLTEuNiwyLjJ2NC4ySDhWNy43aDIuNnYxLjJoMGMwLjQtMC43LDEuMi0xLjQsMi41LTEuNGMyLjcsMCwzLjIsMS44LDMuMiw0LjFWMTYuM3oiLz48L2c+PC9nPjwvZz48L3N2Zz4=';
    
    global $wp_linkedin_autopublish_settings_page;
	$wp_linkedin_autopublish_settings_page = add_menu_page( 'WP LinkedIn Auto Publish', 'WP LinkedIn Auto Publish', 'manage_options', 'wp_linkedin_auto_publish', 'wp_linkedin_autopublish_options_page',$menu_icon_svg);
}
/**
* 
*
*
* Gets, sets and renders options
*/
require('inc/options-output.php');
/**
* 
*
*
* Output the wrapper of the settings page and call the sections
*/
function wp_linkedin_autopublish_options_page(  ) { 
    require('inc/options-page-wrapper.php');
}
/**
* 
*
*
* Add custom links to plugin on plugins page
*/
function wp_linkedin_autopublish_plugin_links( $links, $file ) {
   if ( strpos( $file, 'wp-linkedin-autopublish.php' ) !== false ) {
      $new_links = array(
               '<a href="https://northernbeacheswebsites.com.au/product/donate-to-northern-beaches-websites/" target="_blank">' . __('Donate') . '</a>',
               '<a href="https://wordpress.org/support/plugin/wp-linkedin-auto-publish" target="_blank">' . __('Support Forum') . '</a>',
            );
      $links = array_merge( $links, $new_links );
   }
   return $links;
}
add_filter( 'plugin_row_meta', 'wp_linkedin_autopublish_plugin_links', 10, 2 );
/**
* 
*
*
* Add settings link to plugin on plugins page
*/
function wp_linkedin_autopublish_settings_link( $links ) {
    $settings_link = '<a href="admin.php?page=wp_linkedin_auto_publish">' . __( 'Settings' ) . '</a>';
    array_unshift( $links, $settings_link );
  	return $links;
}
$plugin = plugin_basename( __FILE__ );
add_filter( "plugin_action_links_$plugin", 'wp_linkedin_autopublish_settings_link' );
/**
* 
*
*
* Gets version number of plugin
*/
function wp_linkedin_autopublish_get_version() {
	if ( ! function_exists( 'get_plugins' ) )
        require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
	$plugin_folder = get_plugins( '/' . plugin_basename( dirname( __FILE__ ) ) );
	$plugin_file = basename( ( __FILE__ ) );
	return $plugin_folder[$plugin_file]['Version'];
}
/**
* 
*
*
* Load admin styles and scripts
*/
function wp_linkedin_autopublish_register_admin($hook)
{
    
    //get settings page
    global $wp_linkedin_autopublish_settings_page;
    
    if(in_array($hook, array('post.php', 'post-new.php', 'edit.php') )){
        
        //scripts
        wp_enqueue_script( 'custom-admin-post-script-linkedin', plugins_url( '/inc/postscript.js', __FILE__ ), array( 'jquery'),wp_linkedin_autopublish_get_version());    
        
        //styles
        wp_enqueue_style( 'post-style-linkedin', plugins_url( '/inc/poststyle.css', __FILE__ ),array(),wp_linkedin_autopublish_get_version());
        wp_enqueue_style( 'font-awesome-icons-linkedin', plugins_url( '/inc/external/font-awesome.min.css', __FILE__ ));
        
        
    } elseif ($wp_linkedin_autopublish_settings_page == $hook){    
        
        //scripts
        wp_enqueue_script( 'custom-admin-script-linkedin', plugins_url( '/inc/adminscript.js', __FILE__ ), array( 'jquery','jquery-ui-accordion','jquery-ui-tabs','jquery-form','wp-color-picker' ),wp_linkedin_autopublish_get_version());
        wp_enqueue_script('jquery-ui-accordion');
        wp_enqueue_script('jquery-ui-tabs');
        wp_enqueue_script('jquery-form');
        

        //styles
        wp_enqueue_style( 'custom-admin-style-linkedin', plugins_url( '/inc/adminstyle.css', __FILE__ ),array(),wp_linkedin_autopublish_get_version());
        wp_enqueue_style( 'font-awesome-icons-linkedin', plugins_url( '/inc/external/font-awesome.min.css', __FILE__ ));    
    } else {
        
        return;
    }    

}
add_action( 'admin_enqueue_scripts', 'wp_linkedin_autopublish_register_admin' );
/**
* 
*
*
* Function to get current page URL
*/
function wp_linkedin_autopublish_current_page_url() {
    
    
    $options = get_option( 'wp_linkedin_autopublish_settings' );
    
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') { 
        $serverType = 'https://';    
    } else {
        $serverType = 'http://'; 
    }
        
    $currentPageUrl = $serverType . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']; 
    $findCurrentPageUrl = strpos($currentPageUrl,"wp_linkedin_auto_publish")+24;
    $trimCurrentPageUrl = substr($currentPageUrl,0,$findCurrentPageUrl);
    return $trimCurrentPageUrl;
}
/**
* 
*
*
* Function to get the posts URL
*/
function wp_linkedin_autopublish_posts_page_url() {

    $currentPageUrl = $_SERVER['REQUEST_URI']; 

    $findCurrentPageUrl = strpos($currentPageUrl,"admin.php");

    $trimCurrentPageUrl = substr($currentPageUrl,0,$findCurrentPageUrl)."edit.php";
    
    return $trimCurrentPageUrl;
}
/**
* 
*
*
* Function to generate random state for API call
*/
//function wp_linkedin_autopublish_state_generator($length = 21) {
//    return substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length/strlen($x)) )),1,$length);
//}
/**
* 
*
*
* Function that gets the access token
*/
function wp_linkedin_autopublish_save_access_token(){

    if ( ! current_user_can( 'manage_options') ){
		return;
	}
            
    //lets delete transients so data is more fresh
    delete_transient( 'wp_linkedin_autopublish_get_companies' );
    delete_transient( 'wp_linkedin_autopublish_get_profile' );

    //get options    
    $options = get_option( 'wp_linkedin_autopublish_settings' );    

    $code = $_POST['code']; 
    $redirectUrl = 'https%3A%2F%2Fnorthernbeacheswebsites.com.au%2Fredirectlinkedin%2F';

    $response = wp_remote_post( 'https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code='.$code.'&redirect_uri='.$redirectUrl.'&client_id=8640n1zn844brm&client_secret=IDRdaazTtBBuREGS', array(
        'headers' => array(
            'Content-Length' => 0,
        ),
    ));
    
    if ( 200 == wp_remote_retrieve_response_code( $response ) ) {
            
        $decodedBody = json_decode(preg_replace('/("\w+"):(\d+(\.\d+)?)/', '\\1:"\\2"', $response['body']), true);

         
        $pluginSettings = get_option('wp_linkedin_autopublish_auth_settings');
        $pluginSettings['access_token'] = $decodedBody['access_token'];
        $pluginSettings['access_token_expiry'] = date('d/m/Y',time() + 86400 * 60);
        update_option('wp_linkedin_autopublish_auth_settings', $pluginSettings);
        
        echo 'SUCCESS'; 
        
    } else {
        echo wp_remote_retrieve_response_code( $response ).' '.wp_remote_retrieve_response_message( $response ).' '.wp_remote_retrieve_body( $response );  
    }

    wp_die();
 
} 
add_action( 'wp_ajax_save_linkedin_access_token', 'wp_linkedin_autopublish_save_access_token' );
/**
* 
*
*
* Function that displays settings tab content
*/
function wp_linkedin_autopublish_tab_content ($tabName) {
    
    //get options    
    $options = get_option( 'wp_linkedin_autopublish_settings' ); 
    $optionsAuth = get_option( 'wp_linkedin_autopublish_auth_settings' ); 

    if(! is_array($options) ){
        $options = array();
    }

    if(! is_array($optionsAuth) ){
        $optionsAuth = array();
    }

    
    ?>
<div class="tab-content" id="<?php echo $tabName; ?>">
    <div class="meta-box-sortables ui-sortable">
        <div class="postbox">
            <div class="inside">
                
                
                <?php if($tabName == 'helpPage') { ?>
                
                <div id="accordion">
                    
                    
                    <h3><i class="fa fa-question-circle-o" aria-hidden="true"></i> How does the plugin work and how do I set things up</h3>
                    <div>
                        <p>First you need to authenticate the plugin. This can be done by going to the <a class="open-tab" href="#authorisationPage">Connect</a> tab and clicking the "Connect with LinkedIn" button. You will be prompted to allow access to your profile to our application. You will then be redirected back to the plugin settings page and then you should be automatically redirected to the <a class="open-tab" href="#authorisationPage">Profile Selection</a> tab where you can select if you want use your profile and/or selected companies with the plugin. Then you will be redirected to the <a class="open-tab" href="#sharingOptionsPage">Sharing Options</a> tab where you can set the defaults for sharing to LinkedIn and some additional options.</p>
                        
                        
                        <p>Now on your post/page/custom post type you will see the "WP LinkedIn Auto Publish Settings" metabox (if you have enabled it from the <a class="open-tab" href="#sharingOptionsPage">Sharing Options</a> tab). In this metabox you can change the defaults you have just set for the specific post if need be. Now once you publish the post the data will be sent to your selected profile and/or company pages. You can also press the "Share Now" button in the metabox to sent the post to LinkedIn straight away without having to publish the post (just be careful not to press the share now button and then publish the post in one go otherwise the post could be sent twice).</p>
                        
                        <p>Remember in the <a class="open-tab" href="#additionalOptionsPage">Additional Options</a> tab you can choose not to share posts automatically with LinkedIn - by default posts will be shared to LinkedIn.</p>
                        
                    </div>
                    
                    
                    
                    <h3><i class="fa fa-question-circle-o" aria-hidden="true"></i> I have successfully authenticated but posts aren't being sent to LinkedIn what's going on?</h3>
                    <div>
                        There could be several reasons why posts aren't going to LinkedIn, let's go through a few of these:
                        
                        <ol>
                            <li>Make sure on your post page that you haven't checked the 'Don't share this post' checkbox.</li>
                            <li>Make sure a profile is selected on the post. The default profile selection in the plugin settings will only work for new posts, if you share existings posts it may say the share is successful and not actually share because no profile was actually selected on the metabox on the page.</li>
                            <li>Make sure the category that your post belongs to hasn't been checked on the 'Don't Share Select Post Categories on LinkedIn' option on the <a class="open-tab" href="#sharingOptionsPage">sharing options tab</a>.</li>
                            <li>If you have shared the post to LinkedIn already and you haven't changed any of the shared content LinkedIn won't let you share it again because it detects that as duplicate content. So you will need to change the content before sharing again.</li>
                        </ol>
                        
                    </div>

                    <h3><i class="fa fa-question-circle-o" aria-hidden="true"></i> How do I share an image to LinkedIn?</h3>
                    <div>
                        You must set a feature imaged on your post or page. A featured image is a standard WordPress post field; to learn more about setting the featured image please click <a target="_blank" href="https://www.youtube.com/watch?v=9admKGpM3A0">here</a>. 
                    </div>
                    
                    
                    <h3><i class="fa fa-question-circle-o" aria-hidden="true"></i> Why do I need to re-connect the plugin every 60 days?</h3>
                    <div>
                        Unfortunately this is not my choice. LinkedIn uses oAuth 2.0 and they expire access tokens every 60 days for what they must say is for 'security purposes'. I know this makes life suck even more than it already does. If LinkedIn should provide a way to enable access tokens that don't expire I will be onto this ASAP. However just before your access token will expire you will see a notice on your WordPress dashboard prompting you to renew the access token. Renewing the access token just requires clicking the 'Connect with LinkedIn' button on the <a class="open-tab" href="#authorisationPage">Connect</a> tab so you can ensure your posts always get shared to LinkedIn. 
                    </div>
                    
                    
                    <h3><i class="fa fa-question-circle-o" aria-hidden="true"></i> Can I share to LinkedIn Articles?</h3>
                    <div>
                        No, the LinkedIn API doesn't provide the ability to share to LinkedIn Articles. You can only share to personal profiles or company pages. When or if LinkedIn provides the ability to share to LinkedIn articles you can be sure we'll be on it! 
                    </div>

                    <h3><i class="fa fa-question-circle-o" aria-hidden="true"></i> How do I clear all plugin settings?</h3>
                    <div>
                        Please click <a data-nonce="<?php echo wp_create_nonce('delete_plugin_settings'); ?>" id="clear-all-linkedin-settings" href="#">here</a>.
                    </div>
                    
                    
                    <h3><i class="fa fa-question-circle-o" aria-hidden="true"></i> I am still having issues with the plugin, what can I Do?</h3>
                    <div>
                        Please visit the <a target="_blank" href="https://wordpress.org/support/plugin/wp-linkedin-auto-publish">forum</a>. <strong style="color: red !important;">Before writing on the forum make sure you have read the above FAQ and you have the latest version of this plugin installed and it would be a good idea to also make sure you have the latest version of WordPress installed and make sure your post has the below diagnostic information otherwise I won't respond. Also have you tried disabling all other plugins? Maybe there's a javascript issue caused by another plugin which is not allowing our plugin to work properly.</strong> Please be specific and screenshots often say a thousand words so please try and do this. I will try and resolve your issue from my end however sometimes I can't replicate every issue and in these circumstances I may ask you to provide access to your WordPress install so I can properly diagnose things. 
                        
                        <div class="diagnostic-info"><?php echo 'PHP Version: <strong>'.phpversion().'</strong>'; ?></br>
                        <?php echo 'Wordpress Version: <strong>'.get_bloginfo('version').'</strong>'; ?></br>
                        Plugin Version: <strong><?php echo wp_linkedin_autopublish_get_version(); ?></strong></br>
                    
                        <?php 
                        
                        echo 'Core plugin settings: <strong>'.json_encode($options).'</strong></br>';                          

                        echo 'Do not share posts by default: <strong>';
                        
                        if( array_key_exists('wp_linkedin_autopublish_default_publish',$options) ){
                            echo 'Yes';
                        } else {
                            echo 'No';
                        }
                        
                        echo '</strong></br>'; 
                                                  
                        // echo 'Share method: <strong>'.$options['wp_linkedin_autopublish_share_method'].'</strong></br>'; 
                                                  
                                                                                                    
                        echo 'Currently authenticated: <strong>'.$optionsAuth['access_token_expiry'].'</strong></br>';     
                        
                        // echo 'Default share profiles: <strong>'.$options['wp_linkedin_autopublish_default_share_profile'].'</strong></br>';  
                        
                        // echo 'Default share message: <strong>'.$options['wp_linkedin_autopublish_default_share_message'].'</strong></br>';  

                        // echo 'Sharing to post types: <strong>'.$options['wp_linkedin_autopublish_share_post_types'].'</strong></br>';  
                        
                        $current_theme = wp_get_theme();
                        $current_theme_name = $current_theme->name;

                        // var_dump($current_theme);

                        echo 'Active Theme: <strong>'.$current_theme.'</strong></br>';   

                                                  
                                                  ?>
                                                  
        
                        Active Plugins:</br> 
                        <?php 
                        $active_plugins=get_option('active_plugins');
                        $plugins=get_plugins();
                        $activated_plugins = array();

                        foreach ($active_plugins as $plugin){           
                            array_push($activated_plugins, $plugins[$plugin]);     
                        } 

                        if(!empty($activated_plugins)){
                            echo '<ul class="activated-plugins">';

                            foreach ($activated_plugins as $key){  
                                echo '<li><strong>'.$key['Name'].'</strong></li>';
                            }

                            echo '</ul>';
                        }
                        


                        //we also want to display log information
                        echo '<br>';
                        echo 'Log Information:';

                        $logging_option_name = 'wp_linkedin_autopublish_logging';

                        //if no option exists, create it
                        if(!get_option($logging_option_name)){
                            update_option($logging_option_name, array());
                        }

                        $current_log_data = get_option($logging_option_name);

                        if( count($current_log_data) > 0 ){
                            echo '<ul class="log-data">';

                                //lets reverse the data so the latest item shows first
                                $current_log_data = array_reverse($current_log_data);

                                foreach($current_log_data as $current_log_data_item){
                                    echo '<li><strong>'.stripslashes_deep($current_log_data_item).'</strong></li>';
                                }

                            echo '</ul>';
                        }


                        ?></div>
                        
                    </div>

                    

    
                
                    
                </div>
             
                <?php } elseif($tabName == 'authorisationPage') { ?>


                    <?php

                    $options = get_option( 'wp_linkedin_autopublish_settings' );
                    $optionsAuth = get_option( 'wp_linkedin_autopublish_auth_settings' );
    
                    $redirectUrl = 'https%3A%2F%2Fnorthernbeacheswebsites.com.au%2Fredirectlinkedin%2F';

                    $scope = array('w_organization_social','r_organization_social','w_member_social','r_basicprofile','r_liteprofile','rw_organization_admin');
                    $scope = implode('%20',$scope);

                    $authorisationUrl = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=8640n1zn844brm&redirect_uri='.$redirectUrl.'&state='.urlencode(wp_linkedin_autopublish_current_page_url()).'&scope='.$scope;
                    
                    //only do test if auth setting available
                    if(isset($optionsAuth['access_token'])){
                    
                    
                        $authenticationTest = wp_linkedin_autopublish_authentication_test();

                        if($authenticationTest == "SUCCESS"){

                            $authenticationMessage = __('You are successfuly authenticated! You will need to reauthenticate before: ', 'wp-linkedin-autopublish' ).$optionsAuth['access_token_expiry'].__('. To do so just click the button just below.', 'wp-linkedin-autopublish' );

                        } else {

                            $authenticationMessage = __('An error occured, the error reported by LinkedIn is: ', 'wp-linkedin-autopublish' ).' '.$authenticationTest;    
                        }

                        ?>

                        <div style="margin-top: 20px; margin-left: 20px; margin-right: 20px;" data-dismissible="disable-done-notice-forever" class="notice notice-info inline">
                            <p><h3><?php _e('Current Authentication Status', 'wp-linkedin-autopublish' ); ?></h3>

                        <?php echo $authenticationMessage; ?></p>
                        </div>

                    <?php } ?>

                    <a style="margin: 20px;" href="<?php echo esc_attr($authorisationUrl); ?>" name="linkedin_autopublish_get_authorisation" id="linkedin_autopublish_get_authorisation" class="button-secondary"><i style="color: #0077b5;" class="fa fa-linkedin-square" aria-hidden="true"></i> <?php _e('Connect with LinkedIn', 'wp-linkedin-autopublish' ); ?></a>    
                

                <?php } else { ?>
                
                <!--table-->
                <table class="form-table">


                <!--fields-->
                <?php
                settings_fields($tabName);
                do_settings_sections($tabName);
                ?>
                    
                <button type="submit" name="submit" id="submit" class="button button-primary linkedin-save-all-settings"><i class="fa fa-check-square" aria-hidden="true"></i>
 <?php _e('Save All Settings', 'wp-linkedin-autopublish' ); ?></button>  
                    
                </table>
                
                <?php } ?>
                

            </div> <!-- .inside -->
        </div> <!-- .postbox -->                      
    </div> <!-- .meta-box-sortables --> 
</div> <!-- .tab-content -->     
    <?php
}
/**
* 
*
*
* Add metabox to post
*/
function wp_linkedin_autopublish_metabox($postType){
    $options = get_option( 'wp_linkedin_autopublish_settings' );
    $explodedPostTypes = explode(",",$options['wp_linkedin_autopublish_share_post_types']);
    $explodedPostTypes = array_map('strtolower', $explodedPostTypes);
    
    if(in_array($postType,$explodedPostTypes)) {
        add_meta_box( 'wp_linkedin_autopublish_meta_box',__('WP LinkedIn Auto Publish Settings', 'wp-linkedin-autopublish' ), 'wp_linkedin_autopublish_build_meta_box',$postType,'side','high');      
    } 
}
add_action( 'add_meta_boxes', 'wp_linkedin_autopublish_metabox' );
/**
* 
*
*
* Add callback function to metabox content
*/
function wp_linkedin_autopublish_build_meta_box ($post) {
  $options = get_option( 'wp_linkedin_autopublish_settings' );
  wp_nonce_field( basename( __FILE__ ), 'wp_linkedin_autopublish_meta_box_nonce' );
    
    $current_custom_linkedin_share_message = get_post_meta( $post->ID, '_custom_linkedin_share_message', true );
    
    $current_dont_share_post_linkedin = get_post_meta( $post->ID, '_dont_share_post_linkedin', true );  
    
    $current_profile_selection_linkedin = get_post_meta( $post->ID, '_profile_selection_linkedin', true );    
    
    
?>
<div class='inside'>
    
    
    
    <p>        
    <?php if($current_dont_share_post_linkedin == "yes") $current_dont_share_post_linkedin_checked = 'checked="checked"'; ?>
    <div id="dont-sent-to-linkedin-checkbox-line">   
    <input id="dont-sent-to-linkedin-checkbox" <?php if(isset($options['wp_linkedin_autopublish_default_publish'])){echo 'data="dont-publish-by-default"';}?> type="checkbox" name="dont-share-post-linkedin" value="yes" <?php if(isset($current_dont_share_post_linkedin_checked)){ echo esc_attr($current_dont_share_post_linkedin_checked);} ?>> <?php echo __( 'Don\'t share this post', 'wp-linkedin-autopublish' ); ?></div>
    </p>
    
    
    
	<p class="custom-linkedin-metabox-setting"><?php echo __( 'Custom Share Message:', 'wp-linkedin-autopublish' ); ?><br>
        <textarea cols="29" rows="3" name="custom-linkedin-share-message" id="custom-share-message"><?php
    
        if(strlen($current_custom_linkedin_share_message)>0) {
           echo esc_attr($current_custom_linkedin_share_message); 
        } elseif (isset($options['wp_linkedin_autopublish_default_share_message'])) {
            echo esc_attr($options['wp_linkedin_autopublish_default_share_message']);
        } else {
            echo '';
        }  
    
        ?></textarea>
	</p>
    
    
    
    <div style="padding-top:5px;" class="custom-linkedin-metabox-setting"><?php echo __( 'Profile selection:', 'wp-linkedin-autopublish' ); ?><br>
        
        <ul id="post-meta-profile-list">

            <?php
            
            if(metadata_exists('post', $post->ID, '_profile_selection_linkedin')){
                
                $selectedItems = $current_profile_selection_linkedin;        
                $selectedItems = explode(",",$selectedItems);   
                
            } elseif(isset($options['wp_linkedin_autopublish_default_share_profile'])){
                $selectedItems = $options['wp_linkedin_autopublish_default_share_profile'];        
                $selectedItems = explode(",",$selectedItems);     
            } else {
                $selectedItems = array();    
            }                                            

            echo wp_linkedin_autopublish_get_companies_render_profile_list_items($selectedItems);     

            ?>                                            
        </ul>

        
        
        <input style="display:none;" name="profile-selection-linkedin"  id="profile-selection-linkedin" value="<?php
    
        if(metadata_exists('post', $post->ID, '_profile_selection_linkedin')) {
           echo esc_attr($current_profile_selection_linkedin); 
        } elseif(isset($options['wp_linkedin_autopublish_default_share_profile'])) {
            echo $options['wp_linkedin_autopublish_default_share_profile'];     
        } else {
            echo '';    
        }  
    
        ?>">
	</div>
    
    
    
    
    
  
    
    
    <?php if(metadata_exists('post', $post->ID, '_sent_to_linkedin')) {
    echo '<strong>Share History</strong></br>';
            
    foreach(array_reverse(get_post_meta($post->ID, '_sent_to_linkedin', true )) as $share){
            echo $share.'</br>';
    }                    
    }
    ?>
    <a href="" style="margin-top: 10px;" data="<?php echo $post->ID; ?>" class="custom-linkedin-metabox-setting button send-to-linkedin"><?php echo __( 'Share Now', 'wp_linkedin_autopublish' ); ?></a>

    <div style="display: none; margin-top:15px;" data-dismissible="disable-done-notice-forever" class="notice notice-success is-dismissible inline linkedin-settings-saved">
    <p><?php  _e('Settings saved', 'wp-linkedin-autopublish' ); ?></p>       
    </div>
    
    
</div>
<?php     
}
/**
* 
*
*
* Function to save meta box information
*/
function wp_linkedin_autopublish_save_meta_boxes_data($post_id,$post){
    if ( !isset( $_POST['wp_linkedin_autopublish_meta_box_nonce'] ) || !wp_verify_nonce( $_POST['wp_linkedin_autopublish_meta_box_nonce'], basename( __FILE__ ) ) ){
	return;
    }
    //don't do anything for autosaves 
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ){
		return;
	}
    //check if user has permission to edit posts otherwise don't do anything 
    if ( ! current_user_can( 'edit_post', $post_id ) ){
		return;
	}
    
    //get and set options
    if ( isset( $_REQUEST['custom-linkedin-share-message'] ) ) {
		update_post_meta( $post_id, '_custom_linkedin_share_message', sanitize_textarea_field($_POST['custom-linkedin-share-message'] ));
	}
    
    if ( isset( $_REQUEST['profile-selection-linkedin'] ) ) {
		update_post_meta( $post_id, '_profile_selection_linkedin', sanitize_text_field( $_POST['profile-selection-linkedin'] ) );
	}
    
    
    if ( isset( $_REQUEST['dont-share-post-linkedin'] ) ) {
		update_post_meta( $post_id, '_dont_share_post_linkedin', sanitize_text_field( $_POST['dont-share-post-linkedin'] ) );
	} else {
        delete_post_meta($post_id, '_dont_share_post_linkedin');
    }
}
add_action( 'save_post', 'wp_linkedin_autopublish_save_meta_boxes_data',10,2);






















/**
* 
*
*
* Function share post on linkedin
*/
function wp_linkedin_autopublish_post_to_linkedin ($new_status, $old_status, $post) {

    //if the old status isn't published and the new statusis carry out the share to linkedin
    if ('publish' === $new_status) {
        
        //get options
        $options = get_option( 'wp_linkedin_autopublish_settings' );

        //get categories user has chosen not to share and separate comma values and turn it into an array
        $explodedCategories = explode(",",$options['wp_linkedin_autopublish_dont_share_categories']);

        //get the current category
        $thePostCategory = get_the_category($post->ID);
        $thePostCategoryArray = array();

        foreach($thePostCategory as $categoryName){
            array_push($thePostCategoryArray,$categoryName->name);       
        }

        //compare the 2 arrays and count how many duplicates there are 
        $thePostCategoryComparison = count(array_intersect($explodedCategories,$thePostCategoryArray));    

        //get the custom post types the user has nominated to share    
        $explodedPostTypes = explode(",",$options['wp_linkedin_autopublish_share_post_types']);
        $explodedPostTypes = array_map('strtolower', $explodedPostTypes);
        $postType = $post->post_type;

        //first check if the user has decided to not share the post and check if the user has nominated to not share category belonging to the post and then check if the user has nominated to share the post type whether this be a post, page or custom post type
        if(get_post_meta($post->ID, '_dont_share_post_linkedin', true ) !== "yes" && $thePostCategoryComparison == 0 && in_array($postType,$explodedPostTypes)) {  

            wp_linkedin_autopublish_post_to_linkedin_common ($post->ID);

        } //end if user has decided to share post
    } //end if post transition has gone to published
}
add_action( 'transition_post_status', 'wp_linkedin_autopublish_post_to_linkedin', 10, 3 );
/**
* 
*
*
* This function shares a post to LinkedIn by pressing the share to linkedin button
*/
function wp_linkedin_autopublish_post_to_linkedin_common ($postId){
    
    $options = get_option( 'wp_linkedin_autopublish_settings' );
    $optionsAuth = get_option( 'wp_linkedin_autopublish_auth_settings' );
    
    //first we need to create the content package
    
    //if the custom comment has been blanked out try getting the default message otherwise get the custom comment
    if(strlen(get_post_meta($postId, '_custom_linkedin_share_message', true ))<1) {
        $linkedinComment = $options['wp_linkedin_autopublish_default_share_message'];   
    } else {
        $linkedinComment = get_post_meta($postId, '_custom_linkedin_share_message', true ); 
    }
    
    //for each variable used replace it with the actual value
    //create an associative array to be used for shortcode replacement 
    $post_title = html_entity_decode(get_the_title($postId));
    
    $variables = array(
        "post_title" => $post_title,
        "post_link" => get_permalink($postId),
        "post_excerpt" => html_entity_decode( get_the_excerpt($postId), ENT_COMPAT, 'UTF-8' ),
        "post_content" => preg_replace("~(?:\[/?)[^/\]]+/?\]~s", '',strip_tags(get_post_field('post_content',$postId))),
        "post_author" => get_the_author_meta('display_name',get_post_field('post_author',$postId)),
        "website_title" => html_entity_decode(get_bloginfo('name'))
    );    

    foreach($variables as $key => $value){
        $linkedinComment = str_replace('['.strtoupper($key).']', $value, $linkedinComment); 
    }
    
    //limit the comment to 200 characters total for a subject
    $subject = html_entity_decode(substr($linkedinComment,0,200));

    //remote brackets as LinkedIn doesn't like this in commentary
    $linkedinComment = str_replace('[','\\[',$linkedinComment);
    $linkedinComment = str_replace('(','\\(',$linkedinComment);
    $linkedinComment = str_replace('{','\\{',$linkedinComment);
    $linkedinComment = str_replace(']','\\]',$linkedinComment);
    $linkedinComment = str_replace(')','\\)',$linkedinComment);
    $linkedinComment = str_replace('}','\\}',$linkedinComment);
    $linkedinComment = str_replace('@','\\@',$linkedinComment);
    $linkedinComment = str_replace('<','\\<',$linkedinComment);
    $linkedinComment = str_replace('>','\\>',$linkedinComment);

    //limit the comment to 700 characters total
    $linkedinComment = substr($linkedinComment, 0, 3000);    

    // Create JSON body
    $json = array(
        'commentary' => $linkedinComment,
        // 'author' => 'urn:li:'.$profileType.':'.$profileId, //we need to do this later on
        'visibility' => 'PUBLIC',
        'distribution' => array(
            'thirdPartyDistributionChannels' => array(
            ),
            'targetEntities' => array(

            ),
            'feedDistribution' => 'MAIN_FEED'
        ),
        'lifecycleState' => 'PUBLISHED',
        'isReshareDisabledByAuthor' => false
    );

    $featured_image = get_the_post_thumbnail_url($postId);
    $post_link = get_permalink($postId);

    //if there's no featured image don't share an image...
    if( $featured_image == false ){
        $json['content'] = array(
            'article' => array(
                'source' => $post_link,
                'title' => $post_title,
            ),
        );  
    }

    //foreach starts here
    if(metadata_exists('post', $postId, '_profile_selection_linkedin')){
        $profilesToShareTo = get_post_meta($postId, '_profile_selection_linkedin', true ); 
    } else {
        $profilesToShareTo = $options['wp_linkedin_autopublish_default_share_profile'];
    }

    
    $profilesToShareToArray = explode(',', $profilesToShareTo);

    if(strlen($profilesToShareTo) < 1){
        return "no profile";
    }
    
    //get companies and profiles
    $getCompanies = wp_linkedin_autopublish_get_companies();
    $getProfile = wp_linkedin_autopublish_get_profile();
    
    if(is_array($getProfile)){


        //lets create an associative array to get company names 
        $companyNames = array();
        
        if($getCompanies !== 'ERROR'  && count($getCompanies['elements']) > 0){
            foreach($getCompanies['elements'] as $company){
                $companyNames[$company['organization']] = $company['organization~']['localizedName'];    
            }
        }

        
        //loop through locations
        foreach($profilesToShareToArray as $profile){

            $logging_information = array();

            //log the time
            $logging_information['time'] = current_time('Y-m-d H:i:s');
            $logging_information['plugin_version'] = wp_linkedin_autopublish_get_version();

            //we need to determine whether we are sharing to a profile or a company as the endpoint is different
            //to achieve this we are going to see if the profile is in the profile 

            if($profile == $getProfile['id']){ 
                $shareName = $getProfile['firstName']['localized']['en_US'].' '.$getProfile['lastName']['localized']['en_US'];
                $author = 'urn:li:person:'.$profile;
                $json['author'] = $author;

                $logging_information['sharing_to'] = 'PROFILE';

            } else {
                //we are sharing a company
                if (strpos($profile, 'urn:li:organization') === false) {
                    $profile = 'urn:li:organization:'.$profile;
                }
                $shareName = $companyNames[$profile];
                $author = $profile;
                $json['author'] = $author;

                $logging_information['sharing_to'] = 'COMPANY';
            }

            //do we need to upload an image?
            if( $featured_image !== false ){
                
                //log that a featured image is being posted
                $logging_information['featured_image'] = true;

                //lets first upgrade the quality of the image if possible
                if(get_the_post_thumbnail_url($postId, 'full') == false){
                    $featured_image = get_the_post_thumbnail_url($postId);
                } else {
                    $featured_image = get_the_post_thumbnail_url($postId, 'full');
                }

                $logging_information['featured_image_url'] = $featured_image;

                $json_body = array(
                    'initializeUploadRequest' => array(
                        'owner' => $author
                    ),
                );

                $response = wp_remote_post( 'https://api.linkedin.com/rest/images?action=initializeUpload', array(
                    'headers' => array(
                        'Linkedin-Version' => '202405',
                        'Authorization' => 'Bearer '.$optionsAuth['access_token'],
                        'Content-Type' => 'application/json',
                    ),
                    'body' => json_encode($json_body),
                ));

                $status = wp_remote_retrieve_response_code( $response );

                $logging_information['upload_initialisation_status'] = $status;

                if($status == 200){
                    $decodedBody = json_decode(preg_replace('/("\w+"):(\d+(\.\d+)?)/', '\\1:"\\2"', $response['body']), true);

                    $asset = $decodedBody['value']['image'];
                    $upload_url = $decodedBody['value']['uploadUrl'];

                    $c = curl_init();
                    curl_setopt($c, CURLOPT_URL, $featured_image);
                    curl_setopt($c, CURLOPT_HEADER, false);
                    curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($c, CURLOPT_SSL_VERIFYPEER, false);
                    curl_setopt($c, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.1 Safari/537.11');
                    $image_data = curl_exec($c);
                    curl_close($c);

                    //do alternative option here
                    //this may be needed if 401 authorization required on image
                    if( is_bool($image_data) ){
                        $attachment_id = attachment_url_to_postid( $featured_image );
                        $image_local_path = get_attached_file( $attachment_id );

                        $image_feed = fopen ($image_local_path, 'rb');
                        $image_size = filesize ($image_local_path);
                        $image_data = fread($image_feed, $image_size);
                        fclose ($image_feed);
                    }

                    //get the content of the file   
                    $get_file = wp_remote_get($featured_image, array(
                        'timeout'     => 15,
                        'sslverify' => false
                    ));
                    
                    // $header = wp_remote_retrieve_headers($get_file);
                    $header = wp_remote_retrieve_headers($get_file);
                    $header = (array) $header; //set it to array as it might be an object
                    $header = array_values($header);

                    if(!empty($header)){
                        $header_content = $header[0]['content-type'];

                        //now we need to upload the file
                        $response = wp_remote_post( $upload_url, array(
                            'headers' => array(
                                'Authorization' => 'Bearer '.$optionsAuth['access_token'],
                                'Content-Type' => $header_content,
                            ),
                            'body' => $image_data,
                            'timeout'     => 15,
                            'sslverify' => false
                        ));

                        $status = wp_remote_retrieve_response_code( $response );

                        $logging_information['upload_status'] = $status;

                        //if link and image
                        $json['content'] = array(
                            'article' => array(
                                'source' => $post_link,
                                'title' => $post_title,
                                'thumbnail' => $asset,
                            ),
                        );   
                    }
                }
            } else {
                $logging_information['featured_image'] = false;
            }

            $url = 'https://api.linkedin.com/rest/posts';

            $logging_information['post_url'] = $url;

            $response = wp_remote_post( $url, array(
                'headers' => array(
                    'Linkedin-Version' => '202405',
                    'Authorization' => 'Bearer '.$optionsAuth['access_token'],
                    'Content-Type' => 'application/json',
                ),
                'body' => json_encode( $json ),
            ));

            $status = wp_remote_retrieve_response_code( $response );

            $logging_information['status'] = $status;
            $logging_information['body'] = stripslashes(json_encode( $json ));
            $logging_information['access_token_length'] = strlen($optionsAuth['access_token']);

            if( $status == 201 ||  $status == 200){

                $headers = wp_remote_retrieve_headers( $response );

                $activity = $headers['x-linkedin-id'];

                $sharedUrl = 'https://www.linkedin.com/feed/update/'.$activity;

                //get current date and time in the wordpress format and to the wordpress timezone    
                $dateTime = date(get_option('date_format').' '.get_option('time_format'),strtotime(get_option('gmt_offset').' hours'));

                //get the current time and create a link that goes to the post    
                $linkedinResponse = '<a target="_blank" href="'.$sharedUrl.'">'.$dateTime.' ('.$shareName.')</a>'; 

                //update the post meta with time and URL        
                //if the post hasn't been shared before send an array with the data if it has been shared get the existing array and append the new item to the array
                if(metadata_exists('post',$postId,'_sent_to_linkedin')){

                    $existingShares = array();
                    foreach(get_post_meta($postId, '_sent_to_linkedin', true ) as $share){
                        array_push($existingShares,$share); 
                    }
                    array_push($existingShares,$linkedinResponse);
                    update_post_meta($postId, '_sent_to_linkedin',$existingShares);

                } else {
                    update_post_meta($postId, '_sent_to_linkedin',array($linkedinResponse));   
                } 
                
                update_post_meta($postId, '_dont_share_post_linkedin','yes');

            } else { //end 200/201 status check
                //do some more error logging
                //store the data and response in a variable
                $response_data = json_decode( wp_remote_retrieve_body( $response ), true);

                $logging_information['error_code'] = $response_data['code'];
                $logging_information['error_message'] = $response_data['message'];
            }

            //now that we have the logging information, lets create and add to the log
            $logging_option_name = 'wp_linkedin_autopublish_logging';

            //if no option exists, create it
            if(!get_option($logging_option_name)){
                update_option($logging_option_name, array());
            }

            $current_log_data = get_option($logging_option_name);

            //if the log contains more than 10 records, remove the last record
            $amount_of_items_in_log = count($current_log_data);

            if($amount_of_items_in_log > 10){
                array_shift($current_log_data);
            }

            //lets add our current log to the array
            array_push($current_log_data, json_encode($logging_information));

            //lets update the option
            update_option($logging_option_name, $current_log_data);

        } //end for each
    } //end check of if profile exists

    return 'success';

} //end function

/**
* 
*
*
* This function shares a post to LinkedIn by pressing the share to linkedin button
*/
function wp_linkedin_autopublish_post_to_linkedin_instantly (){
    
    //set php variables from ajax variables
    $postID = intval($_POST['postID']);

    if ( ! current_user_can( 'edit_post', $postID ) ){
		wp_die();
	}
  
    
    //call share method
    echo wp_linkedin_autopublish_post_to_linkedin_common ($postID);


    //return success
    //echo "success";
    wp_die(); // this is required to terminate immediately and return a proper response
    
}
add_action( 'wp_ajax_post_to_linkedin', 'wp_linkedin_autopublish_post_to_linkedin_instantly' );






/**
* 
*
*
* Function to prevent republishing post that has already been sent to linkedin by default
*/
function wp_linkedin_autopublish_dont_republish($post_id,$post){
if ( ! current_user_can( 'edit_post', $post_id ) ){
		return;
	}
    
    //check to see if post is published
    if('publish' == $post->post_status) { 
        update_post_meta( $post_id, '_dont_share_post_linkedin', 'yes');    
    }  
}
add_action( 'save_post', 'wp_linkedin_autopublish_dont_republish',11,2);
/**
* 
*
*
* This function makes the above function only run the first time
*/
function wp_linkedin_autopublish_remove_function_except_first_publish()
{
  remove_action('save_post','wp_linkedin_autopublish_dont_republish',11,2);
}
add_action('publish_to_publish','wp_linkedin_autopublish_remove_function_except_first_publish');
/**
* 
*
*
* Display warning message that the access token is about to expire
*/
function wp_linkedin_autopublish_token_expiry_warning() {
    
    //only show if current user can manage options as re-authentication can only occur on the settings page and only admin users can access this
    if (current_user_can('manage_options')) {

        $options = get_option( 'wp_linkedin_autopublish_auth_settings' );

        //if the user hasn't saved any settings yet there's no need to display this message
        if(isset($options['access_token_expiry']) && strlen($options['access_token_expiry'])>0){
            //get expiry date
            $expiryDate = $options['access_token_expiry'];
            $newExpiryDate = date_format(date_create_from_format('d/m/Y', $expiryDate), 'm/d/Y');
            $expiryDateUnix = strtotime($newExpiryDate);
            //get todays date
            $todaysDate = date('m/d/Y', time());
            $todaysDateUnix = strtotime($todaysDate);
            //get difference between dates
            $daysBetweenDates = ceil(($expiryDateUnix - $todaysDateUnix) / 86400);
            //show expiry date in a format based on users selected Wordpress date format
            $newExpiryDateLocalised = date_format(date_create_from_format('d/m/Y', $expiryDate), get_option('date_format'));

            $menuPage = menu_page_url('wp_linkedin_auto_publish',0);
            
            if(abs($daysBetweenDates) == 1) {
                $dayPlural = "day";    
            } else {
                $dayPlural = "days";    
            }
                
            if($daysBetweenDates < 8 && $daysBetweenDates > 0){
                $class = 'notice notice-error';
                $message = '<h3 style="margin-top: 0px;">WP LinkedIn Auto Publish Notice</h3> WP LinkedIn Auto Publish needs to be re-authenticated! If the plugin isn\'t re-authenticated the autopublish feature will stop working on: <strong>'. $newExpiryDateLocalised.'</strong> (that\'s just '.$daysBetweenDates.' '.$dayPlural.' away). <a style="font-weight:bold;" href="'.$menuPage.'">Click here</a> to re-authenticate.';

                printf( '<div class="%1$s"><p>%2$s</p></div>', $class, $message ); 
            }
            
            if($daysBetweenDates == 0){
                $class = 'notice notice-error';
                $message = '<h3 style="margin-top: 0px;">WP LinkedIn Auto Publish Notice</h3> WP LinkedIn Auto Publish needs to be re-authenticated! Automatic publishing of your posts to LinkedIn will stop today. <a style="font-weight:bold;" href="'.$menuPage.'">Click here</a> to re-authenticate.';

                printf( '<div class="%1$s"><p>%2$s</p></div>', $class, $message ); 
            }
            
            if($daysBetweenDates < 0){
                $class = 'notice notice-error';
                $message = '<h3 style="margin-top: 0px;">WP LinkedIn Auto Publish Notice</h3> WP LinkedIn Auto Publish needs to be re-authenticated! Automatic publishing of your posts to LinkedIn stopped working on: <strong>'. $newExpiryDateLocalised.'</strong> (that was '.abs($daysBetweenDates).' '.$dayPlural.' ago.). <a style="font-weight:bold;" href="'.$menuPage.'">Click here</a> to re-authenticate.';

                printf( '<div class="%1$s"><p>%2$s</p></div>', $class, $message ); 
            }
            
        } 
    }     

}
add_action( 'admin_notices', 'wp_linkedin_autopublish_token_expiry_warning' );
/**
* 
*
*
* Check if it's necessary to add a column to the all pages listing
*/
function wp_linkedin_autopublish_page_column_required(){
    //get option of what post types to share

    if( !get_option('wp_linkedin_autopublish_settings') ){
        return false;
    } else {
        $options = get_option( 'wp_linkedin_autopublish_settings' );

        if( array_key_exists('wp_linkedin_autopublish_share_post_types',$options) ){
            $explodedPostTypes = explode(",",$options['wp_linkedin_autopublish_share_post_types']);
            $explodedPostTypes = array_map('strtolower', $explodedPostTypes);

            if(in_array("page",$explodedPostTypes)){
                return true;    
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
/**
* 
*
*
* Create new column on the posts page
*/
function wp_linkedin_autopublish_additional_posts_column($columns) {
    
    $options = get_option( 'wp_linkedin_autopublish_settings' );
    
    if(isset($options['wp_linkedin_autopublish_hide_posts_column'])){
        return $columns;
    } else {
        $new_columns = array(
        'shared_on_linkedin' => __( 'Shared on LinkedIn', 'wp-linkedin-autopublish' ),
        );
        $filtered_columns = array_merge( $columns, $new_columns );
        return $filtered_columns;       
    }
}
add_filter('manage_posts_columns', 'wp_linkedin_autopublish_additional_posts_column');
if(wp_linkedin_autopublish_page_column_required()==true){
    add_filter('manage_page_posts_columns', 'wp_linkedin_autopublish_additional_posts_column');   
}
/**
* 
*
*
* Add content to the new posts page column
*/
function wp_linkedin_autopublish_additional_posts_column_data( $column ) {
    
    $options = get_option( 'wp_linkedin_autopublish_settings' );
    
    // Get the post object for this row so we can output relevant data
    global $post;
  
    // Check to see if $column matches our custom column names
    switch ( $column ) {

    case 'shared_on_linkedin' :
    if(metadata_exists('post', $post->ID, '_sent_to_linkedin')) {
    foreach(array_reverse(get_post_meta($post->ID, '_sent_to_linkedin', true )) as $share){
            echo $share.'</br>';
    }   
    } else {
       
        echo 'Not shared <a class="send-to-linkedin" href="" data="'.$post->ID.'">Share now</a>';    
                
       //edit_post_link( 'share now', 'Not shared ', '', $post->ID, '');
        
        
    } 
      break;    
    }
}
add_action( 'manage_posts_custom_column', 'wp_linkedin_autopublish_additional_posts_column_data' );
// if pages have been opted not to be shared hide the column on the all pages listing
if(wp_linkedin_autopublish_page_column_required()==true){
    add_action('manage_page_posts_custom_column', 'wp_linkedin_autopublish_additional_posts_column_data');
}
/**
* 
*
*
* Add translation
*/
add_action('plugins_loaded', 'wp_linkedin_autopublish_translations');
function wp_linkedin_autopublish_translations() {
	load_plugin_textdomain( 'wp-linkedin-autopublish', false, dirname( plugin_basename(__FILE__) ) . '/inc/lang/' );
}
/**
* 
*
*
* Function to get companies
*/
function wp_linkedin_autopublish_get_companies() {
	
    // delete_transient('wp_linkedin_autopublish_get_companies');

    $getTransient = get_transient('wp_linkedin_autopublish_get_companies'); 
    
    //if the transient exists
    if ($getTransient != false){

        return $getTransient;

    } else {
        
        if( get_option( 'wp_linkedin_autopublish_auth_settings' ) ){
            $options = get_option( 'wp_linkedin_autopublish_auth_settings' );

            $companyUrl = 'https://api.linkedin.com/rest/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&count=100';

            $json_feed = wp_remote_get( $companyUrl, array(
                'headers' => array(
                    'Linkedin-Version' => '202405',
                    'Authorization' => 'Bearer '.$options['access_token'],
                    'X-RestLi-Protocol-Version' => '2.0.0',
                ),
            ));

            
            $json_response = wp_remote_retrieve_response_code($json_feed); 

            // var_dump($json_response);
            // var_dump($options['access_token']);
            // var_dump($companyUrl);

            if($json_response == 200) {

                $decodedBody = json_decode(preg_replace('/("\w+"):(\d+(\.\d+)?)/', '\\1:"\\2"', $json_feed['body']), true);

                //we need to do another API call and then pass this into a nice array for further processing

                $company_ids = array();

                foreach($decodedBody['elements'] as $company){


                    $organisation_id = $company['organization'];

                    //we need to parse this
                    $organisation_exploded = explode(':', $organisation_id);

                    array_push($company_ids,$organisation_exploded[3]);

                }  

                $nice_data = array();
                
                if(!empty($company_ids)){

                    $companies_as_comma_list = implode(',',$company_ids);

                    //now lets get further info
                    $url = 'https://api.linkedin.com/rest/organizations?ids=List('.$companies_as_comma_list.')';
                    $response = wp_remote_get( $url, array(
                        'headers' => array(
                            'Authorization' => 'Bearer '.$options['access_token'],
                            'Linkedin-Version' => '202405',
                            'X-Restli-Protocol-Version' => '2.0.0',
                        ),
                    ));

                    $status = wp_remote_retrieve_response_code($response);

                    if($status == 200){
                        $decodedBody = json_decode(preg_replace('/("\w+"):(\d+(\.\d+)?)/', '\\1:"\\2"', $response['body']), true);

                        foreach($decodedBody['results'] as $company_id => $company_info){

                            // var_dump($company_info['localizedName']);
                            
                            $pushArray = array(
                                'organization' => 'urn:li:organization:'.$company_id,
                                'organization~' => array('localizedName'=>$company_info['localizedName']),
                            );

                            array_push($nice_data, $pushArray);
                        }
                    }

                }

                $nice_data = array('elements' => $nice_data);

                // var_dump($nice_data);

                set_transient( 'wp_linkedin_autopublish_get_companies',$nice_data,MINUTE_IN_SECONDS*5);
                
                return $nice_data;    
            } else {
                return 'ERROR';
            }
        }
    }
}
/**
* 
*
*
* Function to get profile
*/
function wp_linkedin_autopublish_get_profile() {
	
    
    $getTransient = get_transient('wp_linkedin_autopublish_get_profile'); 
    
    
    //if the transient exists
    if ($getTransient != false){

        return $getTransient;

    } else {
        
        if( get_option( 'wp_linkedin_autopublish_auth_settings' ) ){
            $options = get_option( 'wp_linkedin_autopublish_auth_settings' );

            $profileUrl = 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,vanityName,profilePicture(displayImage~:playableStreams))';

            $json_feed = wp_remote_get( $profileUrl , array(
                'headers' => array(
                    'Authorization' => 'Bearer '.$options['access_token'],
                ),
            ));

            
            $json_response = wp_remote_retrieve_response_code($json_feed); 

            if($json_response == 200) {

                $decodedBody = json_decode(preg_replace('/("\w+"):(\d+(\.\d+)?)/', '\\1:"\\2"', $json_feed['body']), true);
                set_transient( 'wp_linkedin_autopublish_get_profile',$decodedBody,MINUTE_IN_SECONDS*5);
                return $decodedBody;    
            } else {
                return 'ERROR';
            }
        }

    }
    
}
/**
* 
*
*
* function to dismiss welcome message for current version
*/
function wp_linkedin_autopublish_dismiss_welcome_message() {
    
    if (!current_user_can('manage_options')) {
        wp_die();    
    }
    
    
	//get options
    $options = get_option( 'wp_linkedin_autopublish_settings' );
    
    $pluginVersion = sanitize_text_field($_POST['pluginVersion']);
    
    $options['wp_linkedin_autopublish_dismiss_welcome_message'] = $pluginVersion;
    
    //update the options
    update_option('wp_linkedin_autopublish_settings', $options);
    
    echo 'SUCCESS';
    wp_die();    
    
    
}
add_action( 'wp_ajax_dismiss_welcome_message', 'wp_linkedin_autopublish_dismiss_welcome_message' );
/**
* 
*
*
* Function to get profile
*/
function wp_linkedin_autopublish_authentication_test() {
	
    $options = get_option('wp_linkedin_autopublish_auth_settings' );
   

    $profileUrl = 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,vanityName,profilePicture(displayImage~:playableStreams))';

    $response = wp_remote_get( $profileUrl , array(
        'headers' => array(
            'Authorization' => 'Bearer '.$options['access_token'],
        ),
    ));

    if ( ! is_wp_error( $response ) ) {

        $status = wp_remote_retrieve_response_code( $response );

        if ( 200 == $status ) {
            return 'SUCCESS'; 
        } else {
            // The response code was not what we were expecting, record the message
            $decodedBody = json_decode(preg_replace('/("\w+"):(\d+(\.\d+)?)/', '\\1:"\\2"', $response['body']), true);
            return $status.' '.$decodedBody['message'];
        }
    } else {
        // There was an error making the request
        return 'There was an error making the request.';
    }

}
/**
* 
*
*
* Function to get a list of profiles and company used in meta and plugin settings
*/
function wp_linkedin_autopublish_get_companies_render_profile_list_items($selectedItems) {
    
    $options = get_option( 'wp_linkedin_autopublish_settings' );
    $existingSetting = $options['wp_linkedin_autopublish_profile_selection'];

    if(isset($existingSetting)){
        $settingToArray = explode(",",$existingSetting);     
    } else {
        $settingToArray = array();    
    }
    
    
    $getCompanies = wp_linkedin_autopublish_get_companies();
    $getProfile = wp_linkedin_autopublish_get_profile();
    




    //set the variable initially
    $html = '';


    if( !is_null($getProfile) && $getProfile !== "ERROR"){

        if(in_array($getProfile['id'], $settingToArray)){
            
            if(in_array($getProfile['id'], $selectedItems)){
                $listClass = 'selected';
                $iconClass = 'fa-check-circle-o';
            } else {
                $listClass = ''; 
                $iconClass = 'fa-times-circle-o';
            }


            $html .= '<li class="profile-selection-list-item-small '.$listClass.'" data="'.$getProfile['id'].'">';

                //image 
                $html .= '<img src="'.$getProfile['profilePicture']['displayImage~']['elements'][0]['identifiers'][0]['identifier'].'" class="location-image" height="42" width="42">';

                //location information
                $html .= '<div class="profile-information">';
                    
                    //address
                    $html .= '<span class="profile-name">'.$getProfile['firstName']['localized']['en_US'].' '.$getProfile['lastName']['localized']['en_US'].'</span>';
            
                    //name
                    $html .= '<span class="profile-description">Profile</span>';


                $html .= '</div>';

                //render appropriate icon
                $html .= '<i class="profile-selected-icon fa '.$iconClass.'" aria-hidden="true"></i>';

            $html .= '</li>';    
  
        }
        
    } //end if profile    
        
        
        
        
        



    if( is_array($getCompanies) && $getCompanies !== "ERROR" && count($getCompanies['elements']) > 0){


        foreach ($getCompanies['elements'] as $company) {
            
            if(in_array($company['organization'], $settingToArray)){

                if(in_array($company['organization'], $selectedItems)){
                    $listClass = 'selected';
                    $iconClass = 'fa-check-circle-o';
                } else {
                    $listClass = ''; 
                    $iconClass = 'fa-times-circle-o';
                }

                $html .= '<li class="profile-selection-list-item-small '.$listClass.'" data="'.$company['organization'].'">';


                    // var_dump($company['organization~']);

                    //image 

                    if( array_key_exists('logoV2',$company['organization~']) ){

                        $html .= '<img src="'.$company['organization~']['logoV2']['original~']['elements'][0]['identifiers'][0]['identifier'].'" class="location-image" height="42" width="42">';
                    }

                    //location information
                    $html .= '<div class="profile-information">';
                        
                        //address
                        $html .= '<span class="profile-name">'.$company['organization~']['localizedName'].'</span>';
                
                        //name
                        $html .= '<span class="profile-description">Company</span>';

                        

                    $html .= '</div>';

                    //render appropriate icon
                    $html .= '<i class="profile-selected-icon fa '.$iconClass.'" aria-hidden="true"></i>';

                $html .= '</li>';    
            }
                
        }
    }  //end companies  
    
    
    return $html;

}
/**
* 
*
*
* This function updates the post meta when changed on the post
*/
function wp_linkedin_autopublish_update_meta_on_post(){
    
    $post = intval($_POST['postID']);
    
    if ( ! current_user_can( 'edit_post', $post ) ){
		wp_die();
	}
    
    
    $updatedShareMessage = sanitize_text_field($_POST['updatedShareMessage']);
    $dontShareAction = sanitize_text_field($_POST['dontShareAction']);
    $profiles = sanitize_text_field($_POST['profiles']);


    update_post_meta($post, '_custom_linkedin_share_message',$updatedShareMessage);
    update_post_meta($post, '_profile_selection_linkedin',$profiles);

    
    if($dontShareAction == "update"){
        update_post_meta($post, '_dont_share_post_linkedin','yes');     
    } else {
        delete_post_meta($post, '_dont_share_post_linkedin');    
    }



    echo "success";
    wp_die();
    

}
add_action( 'wp_ajax_update_linkedin_post_meta', 'wp_linkedin_autopublish_update_meta_on_post' );
/**
* 
*
*
* Display warning message about version 6.0
*/
function wp_linkedin_autopublish_version_six_notice() {
    $optionsAuth = get_option( 'wp_linkedin_autopublish_auth_settings' );
    $options = get_option( 'wp_linkedin_autopublish_settings' );
    
    $menuPage = menu_page_url('wp_linkedin_auto_publish',0);
    
    //if the user has existing settings but dont have the new auth settings it means we should show this message
    
    if(!isset($optionsAuth['access_token']) && isset($options['wp_linkedin_autopublish_default_share_message']) ){
              
    
        $class = 'notice notice-error';
        $message = '<h3 style="margin-top: 0px;">WP LinkedIn Auto Publish Important Upgrade Notice - PLEASE READ</h3> 
        
        <p>Thanks for upgrading to version 6. <strong>Version 6 is a big update to the plugin and it requires that you re-authenticate the plugin immidiately and also review the new settings that are available otherwise things won\'t work</strong>. There are 2 big changes in version 6 which resolve major pain points of the plugin, so we think this version is a big win for everyone. Firstly you no longer need to create a LinkedIn application anymore, you can just connect to mine. This is going to be heaps easier for new users as creating the application can be a bit fiddly and took a lot of support time. So if you have re-authenticated the plugin feel free to remove your existing LinkedIn application you created (that is providing you are not using it anywhere else).</p>
        
        <p>Secondly we have added a commonly requested feature, now you can share to a profile and/or companies in one go! You will now see the new "Profile Selection" tab in the settings where you can select what profile and/or companies you want to use with the plugin. Then in the "Sharing Options" tab you can choose the default profile and/or companies you want to share with, and this profile/and or companies will show in the post/page/custom post meta box.</p>
        
        
        <p>Also you might be interested in a new plugin we released called WP Google My Business Auto Publish. It enables you to do all the great things WP LinkedIn Auto Publish does but for Google My Business, and like this plugin it\'s fully free. Check it out <a href="'.get_admin_url().'plugin-install.php?tab=plugin-information&plugin=wp-google-my-business-auto-publish">here</a>.</p>
        
        <p>To remove this message please <a href="'.$menuPage.'">re-authenticate the plugin</a>.</p>
        
    
        
        
        
        
        ';

        printf( '<div class="%1$s"><p>%2$s</p></div>', $class, $message ); 
     

    }      
}
add_action( 'admin_notices', 'wp_linkedin_autopublish_version_six_notice' );
/**
* 
*
*
* This function deletes all plugin settings
*/
function wp_linkedin_autopublish_delete_all_linkedin_settings(){
    
    $nonce = $_POST['nonce'];

    if( current_user_can('administrator') && wp_verify_nonce( $nonce, 'delete_plugin_settings' ) ){
        //delete options
        delete_option( 'wp_linkedin_autopublish_auth_settings' );
        delete_option( 'wp_linkedin_autopublish_settings' );

        //delete transients
        delete_transient( 'wp_linkedin_autopublish_get_companies' );
        delete_transient( 'wp_linkedin_autopublish_get_profile' );

        echo 'SUCCESS';
    }

    wp_die();
    
}
add_action( 'wp_ajax_delete_all_linkedin_settings', 'wp_linkedin_autopublish_delete_all_linkedin_settings' );
/**
* 
*
*
* This function updates the dont share checkbox when the value is changed
*/
function wp_linkedin_autopublish_update_dont_share_option (){
    
    //set php variables from ajax variables
    $post = intval($_POST['postID']);
    $dontShareAction = $_POST['dontShareAction'];
    
    if($dontShareAction == "update"){
        update_post_meta($post, '_dont_share_post_linkedin','yes');     
    } else {
        delete_post_meta($post, '_dont_share_post_linkedin');    
    }
    
    //return success
    echo "success";
    wp_die(); // this is required to terminate immediately and return a proper response
    
}
add_action( 'wp_ajax_update_dont_share', 'wp_linkedin_autopublish_update_dont_share_option' );


?>