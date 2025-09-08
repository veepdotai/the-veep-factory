<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly 

//define all the settings in the plugin
function wp_linkedin_autopublish_settings_init(  ) { 
    
    //start authorisation section
	register_setting( 'authorisationPage', 'wp_linkedin_autopublish_settings' );
    
	add_settings_section(
		'wp_linkedin_autopublish_authorisation','', 
		'wp_linkedin_autopublish_settings_authorisation_callback', 
		'authorisationPage'
	);


    
    //start profile or company section
    register_setting( 'profileCompanyPage', 'wp_linkedin_autopublish_settings' );
    
    add_settings_section(
		'wp_linkedin_autopublish_profile_company','', 
		'wp_linkedin_autopublish_settings_profile_company_callback', 
		'profileCompanyPage'
	);
    
    
    add_settings_field( 
		'wp_linkedin_autopublish_profile_selection','', 
		'wp_linkedin_autopublish_profile_selection_render', 
		'profileCompanyPage', 
		'wp_linkedin_autopublish_profile_company' 
	);
    
    
    //start sharing options section
    register_setting( 'sharingOptionsPage', 'wp_linkedin_autopublish_settings' );
    
    add_settings_section(
		'wp_linkedin_autopublish_sharing_options','', 
		'wp_linkedin_autopublish_settings_sharing_options_callback', 
		'sharingOptionsPage'
	);
    
    add_settings_field( 
		'wp_linkedin_autopublish_default_share_message','', 
		'wp_linkedin_autopublish_default_share_message_render', 
		'sharingOptionsPage', 
		'wp_linkedin_autopublish_sharing_options' 
	);
    
    add_settings_field( 
		'wp_linkedin_autopublish_default_share_profile','', 
		'wp_linkedin_autopublish_default_share_profile_render', 
		'sharingOptionsPage', 
		'wp_linkedin_autopublish_sharing_options' 
	);
    
    add_settings_field( 
		'wp_linkedin_autopublish_dont_share_categories','', 
		'wp_linkedin_autopublish_dont_share_categories_render', 
		'sharingOptionsPage', 
		'wp_linkedin_autopublish_sharing_options' 
	);
    
    add_settings_field( 
		'wp_linkedin_autopublish_share_post_types','', 
		'wp_linkedin_autopublish_share_post_types_render', 
		'sharingOptionsPage', 
		'wp_linkedin_autopublish_sharing_options' 
	);
    
    
    //start additional settings section
	register_setting( 'additionalOptionsPage', 'wp_linkedin_autopublish_settings' );
    
	add_settings_section(
		'wp_linkedin_autopublish_additional_options','', 
		'wp_linkedin_autopublish_settings_additional_options_callback', 
		'additionalOptionsPage'
	);

	add_settings_field( 
		'wp_linkedin_autopublish_hide_posts_column','', 
		'wp_linkedin_autopublish_hide_posts_column_render', 
		'additionalOptionsPage', 
		'wp_linkedin_autopublish_additional_options' 
	);
    
    add_settings_field( 
		'wp_linkedin_autopublish_default_publish','', 
		'wp_linkedin_autopublish_default_publish_render', 
		'additionalOptionsPage', 
		'wp_linkedin_autopublish_additional_options' 
	);
    

     add_settings_field( 
		'wp_linkedin_autopublish_tab_memory','', 
		'wp_linkedin_autopublish_tab_memory_render', 
		'additionalOptionsPage', 
		'wp_linkedin_autopublish_additional_options' 
	);
    
    add_settings_field( 
		'wp_linkedin_autopublish_dismiss_welcome_message','', 
		'wp_linkedin_autopublish_dismiss_welcome_message_render', 
		'additionalOptionsPage', 
		'wp_linkedin_autopublish_additional_options' 
	);


}

/**
* 
*
*
* The following functions output the callback of the sections
*/
function wp_linkedin_autopublish_settings_authorisation_callback(){}
function wp_linkedin_autopublish_settings_profile_company_callback(){}
function wp_linkedin_autopublish_settings_sharing_options_callback(){}
function wp_linkedin_autopublish_settings_additional_options_callback(){}







function wp_linkedin_autopublish_default_share_profile_render() {  
    
    $options = get_option( 'wp_linkedin_autopublish_settings' );

    if($options !== false){

    ?>
    <tr valign="top">
        <td scope="row">
            <label for="wp_linkedin_autopublish_default_share_profile"><?php _e('The default profiles you want to share with', 'wp-linkedin-autopublish' ); ?></label><i class="fa fa-info-circle information-icon" aria-hidden="true"></i>
            <p class="hidden"><em><?php _e('By default new posts won\'t have a default share profile selected, so please select here what profiles you want to share to by default.', 'wp-linkedin-autopublish' ); ?></em></p>
        </td>
        <td>   
            <?php
                                            
            echo '<ul id="default-profile-list">';                                             
            
            //select items
            if(isset($options['wp_linkedin_autopublish_default_share_profile'])){
                $selectedItems = explode(",",$options['wp_linkedin_autopublish_default_share_profile']);    
            } else {
                $selectedItems = array();    
            }
            
            echo wp_linkedin_autopublish_get_companies_render_profile_list_items($selectedItems);        
    
            echo '</ul>';                                              
            ?>
            
            
        </td>
    </tr>
	<?php 
    
    }
    
    wp_linkedin_autopublish_settings_code_generator('wp_linkedin_autopublish_default_share_profile','Default Share Profiles','','text','','','','hidden-row');
}


function wp_linkedin_autopublish_profile_selection_render() {  
    
    $options = get_option( 'wp_linkedin_autopublish_settings' );

    if($options !== false){

        $existingSetting = $options['wp_linkedin_autopublish_profile_selection'];

    
        $getCompanies = wp_linkedin_autopublish_get_companies();
        $getProfile = wp_linkedin_autopublish_get_profile();
        
        if(isset($existingSetting) && !is_null($existingSetting) ){
            $settingToArray = explode(",",$existingSetting);     
        } else {
            $settingToArray = array();    
        }
        
                    
        $html = '<tr class="linkedin_settings_row" valign="top"><td scope="row" colspan="2"><div class="inside">';

        $html .= '<h3 style="margin-bottom: 20px;">'.__('Select the profile and companies you want to use with the plugin', 'wp-linkedin-autopublish' ).'</h3>';
        
        $html .= '<ul class="linkedin-locations">'; 
            
        if($getProfile !== "ERROR" && !is_null($getProfile)){    

            if(in_array($getProfile['id'], $settingToArray)){
                $listClass = 'selected';
                $iconClass = 'fa-check-circle-o';
            } else {
                $listClass = ''; 
                $iconClass = 'fa-times-circle-o';
            }
        

            $html .= '<li class="profile-selection-list-item '.$listClass.'" data="'.$getProfile['id'].'">';
            
    //                //image 
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
        

        } //end if profile error








        // var_dump($getCompanies);
        if( is_array($getCompanies) && $getCompanies !== "ERROR"  && count($getCompanies['elements']) > 0){

            foreach ($getCompanies['elements'] as $company) {
                
                
                if(in_array($company['organization'], $settingToArray)){
                    $listClass = 'selected';
                    $iconClass = 'fa-check-circle-o';
                } else {
                    $listClass = ''; 
                    $iconClass = 'fa-times-circle-o';
                }

                $html .= '<li class="profile-selection-list-item '.$listClass.'" data="'.$company['organization'].'">';

                    //image 
                    if(array_key_exists('logoV2',$company['organization~'])){
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

        } //end if companies error   

        
        $html .= '</ul>';
        $html .= '</div></td></tr>';
        
        echo $html;
    }

    
        

    
    wp_linkedin_autopublish_settings_code_generator('wp_linkedin_autopublish_profile_selection','Select Profiles','','text','','','','hidden-row');   
}


function wp_linkedin_autopublish_tab_memory_render() {    
    wp_linkedin_autopublish_settings_code_generator('wp_linkedin_autopublish_tab_memory','Tab Memory','Remembers the last settings tab','text','','','','hidden-row');   
}


function wp_linkedin_autopublish_dismiss_welcome_message_render() {    
 wp_linkedin_autopublish_settings_code_generator('wp_linkedin_autopublish_dismiss_welcome_message','Dismiss Welcome Message','','text','','','','hidden-row');   
}











function wp_linkedin_autopublish_default_share_message_render() { 
	$options = get_option( 'wp_linkedin_autopublish_settings' );
	?>
    <tr valign="top">
        <td scope="row">
            <label for="wp_linkedin_autopublish_default_share_message"><?php _e('Default Share Message', 'wp-linkedin-autopublish' ); ?></label>
            </br>
            <a style="margin-top: 5px;" value="[POST_TITLE]" class="button-secondary linkedin_autopublish_append_buttons">[POST_TITLE]</a>
            <a style="margin-top: 5px;" value="[POST_LINK]" class="button-secondary linkedin_autopublish_append_buttons">[POST_LINK]</a>
            <a style="margin-top: 5px;" value="[POST_EXCERPT]" class="button-secondary linkedin_autopublish_append_buttons">[POST_EXCERPT]</a>
            <a style="margin-top: 5px;" value="[POST_CONTENT]" class="button-secondary linkedin_autopublish_append_buttons">[POST_CONTENT]</a>
            <a style="margin-top: 5px;" value="[POST_AUTHOR]" class="button-secondary linkedin_autopublish_append_buttons">[POST_AUTHOR]</a>
            <a style="margin-top: 5px;" value="[WEBSITE_TITLE]" class="button-secondary linkedin_autopublish_append_buttons">[WEBSITE_TITLE]</a>
        </td>
        <td>   
            <textarea cols="46" rows="14" name="wp_linkedin_autopublish_settings[wp_linkedin_autopublish_default_share_message]" id="wp_linkedin_autopublish_default_share_message"><?php if(isset($options['wp_linkedin_autopublish_default_share_message'])) { echo esc_attr($options['wp_linkedin_autopublish_default_share_message']); } else {echo 'New Post: [POST_TITLE] - [POST_LINK]';} ?></textarea>
        </td>
    </tr>
	<?php
}


function wp_linkedin_autopublish_dont_share_categories_render() { 
	$options = get_option( 'wp_linkedin_autopublish_settings' );
	?>
    <tr valign="top">
        <td scope="row">
            <label for="wp_linkedin_autopublish_dont_share_categories"><?php _e('Don\'t Share Select Post Categories on LinkedIn', 'wp-linkedin-autopublish' ); ?></label>
        </td>
        <td>   
            <?php
                                            
            $categories = get_categories( array(
            'hide_empty'   => 0,
            ));

            echo '<ul id="category-listing">';                                                
            foreach ($categories as $category) {
                    echo '<li><input class="dont-share-checkbox" type="checkbox" id="'.esc_attr($category->name).'">' . esc_attr($category->name). '</li>';
            }
            echo '</ul>';                                              
            ?>

            <input style="display:none;" name="wp_linkedin_autopublish_settings[wp_linkedin_autopublish_dont_share_categories]" id="wp_linkedin_autopublish_dont_share_categories" type="text" value="<?php if(isset($options['wp_linkedin_autopublish_dont_share_categories'])) { echo esc_attr($options['wp_linkedin_autopublish_dont_share_categories']); } ?>" class="regular-text" />    
            
        </td>
    </tr>
	<?php
}










function wp_linkedin_autopublish_share_post_types_render() { 
	$options = get_option( 'wp_linkedin_autopublish_settings' );
	?>
    <tr valign="top">
        <td scope="row">
            <label for="wp_linkedin_autopublish_share_post_types"><?php _e('Share the following: Posts, Pages and Custom Post Types', 'wp-linkedin-autopublish' ); ?></label>
        </td>
        <td>   
            <?php
            
            $args = array(
            //    'public'   => true,
               '_builtin' => false
            );

            $output = 'names'; // 'names' or 'objects' (default: 'names')
            $operator = 'and'; // 'and' or 'or' (default: 'and')

            $post_types = get_post_types( $args, $output, $operator );
    
            echo '<ul id="category-listing">';
            echo '<li><input class="post-type-checkbox" type="checkbox" id="Post">Post</li>';
            echo '<li><input class="post-type-checkbox" type="checkbox" id="Page">Page</li>'; 
            foreach ($post_types as $item) {
                $item = ucwords($item);
                echo '<li><input class="post-type-checkbox" type="checkbox" id="'.esc_attr($item).'">' . esc_attr($item). '</li>';    
            }
            echo '</ul>';                                              
            ?>

            <input style="display:none;" name="wp_linkedin_autopublish_settings[wp_linkedin_autopublish_share_post_types]" id="wp_linkedin_autopublish_share_post_types" type="text" value="<?php if(isset($options['wp_linkedin_autopublish_share_post_types'])) { echo esc_attr($options['wp_linkedin_autopublish_share_post_types']); } else {echo ",Post";} ?>" class="regular-text" />    
            
        </td>
    </tr>
	<?php
}


















function wp_linkedin_autopublish_hide_posts_column_render() { 
	$options = get_option( 'wp_linkedin_autopublish_settings' );
	?>
    <tr valign="top">
        <td scope="row">
            <label for="wp_linkedin_autopublish_hide_posts_column"><?php _e('Hide Posts Column', 'wp-linkedin-autopublish' ); ?> </label><i class="fa fa-info-circle information-icon" aria-hidden="true"></i>
            <p class="hidden"><em><?php _e('On your', 'wp-linkedin-autopublish' ); ?> <a href="<?php echo wp_linkedin_autopublish_posts_page_url(); ?>"><?php _e('posts', 'wp-linkedin-autopublish' ); ?></a> <?php _e('page by default there\'s a handy new column which shows which posts have been shared and which ones haven\'t. You can use this setting to hide this column.', 'wp-linkedin-autopublish' ); ?></em></p>
        </td>
        <td>   
            <input type='checkbox' id="wp_linkedin_autopublish_hide_posts_column" name='wp_linkedin_autopublish_settings[wp_linkedin_autopublish_hide_posts_column]' <?php checked( isset($options['wp_linkedin_autopublish_hide_posts_column']), 1 ); ?> value='1'>
        </td>
    </tr>
	<?php
}

function wp_linkedin_autopublish_default_publish_render() { 
	$options = get_option( 'wp_linkedin_autopublish_settings' );
	?>
    <tr valign="top">
        <td scope="row">
            <label for="wp_linkedin_autopublish_default_publish"><?php _e('By default don\'t share posts on LinkedIn', 'wp-linkedin-autopublish' ); ?> </label>
        </td>
        <td>   
            <input type='checkbox' id="wp_linkedin_autopublish_default_publish" name='wp_linkedin_autopublish_settings[wp_linkedin_autopublish_default_publish]' <?php checked( isset($options['wp_linkedin_autopublish_default_publish']), 1 ); ?> value='1'>
        </td>
    </tr>
	<?php
}


function wp_linkedin_autopublish_ssl_mode_render() { 
	$options = get_option( 'wp_linkedin_autopublish_settings' );
	?>
    <tr valign="top">
        <td scope="row">
            <label for="wp_linkedin_autopublish_ssl_mode"><?php _e('Enable SSL mode', 'wp-linkedin-autopublish' ); ?> </label><i class="fa fa-info-circle information-icon" aria-hidden="true"></i>
            <p class="hidden"><em><?php _e('If your website has forced SSL on the WordPress admin area please use this option to resolve authentication issues.', 'wp-linkedin-autopublish' ); ?></em></p>
        </td>
        <td>   
            <input type='checkbox' id="wp_linkedin_autopublish_ssl_mode" name='wp_linkedin_autopublish_settings[wp_linkedin_autopublish_ssl_mode]' <?php checked( isset($options['wp_linkedin_autopublish_ssl_mode']), 1 ); ?> value='1'>
        </td>
    </tr>
	<?php
}



//function to generate settings rows
function wp_linkedin_autopublish_settings_code_generator($id,$label,$description,$type,$default,$parameter,$importantNote,$rowClass) {
    
    //get options
    $options = get_option('wp_linkedin_autopublish_settings');
    
    //value
    if(isset($options[$id])){  
        $value = $options[$id];    
    } elseif(strlen($default)>0) {
        $value = $default;   
    } else {
        $value = '';
    }
    
    
    //the label
    echo '<tr class="linkedin_settings_row '.$rowClass.'" valign="top">';
    echo '<td scope="row">';
    echo '<label for="'.$id.'">'.__($label, 'wp-linkedin-autopublish' );
    if(strlen($description)>0){
        echo ' <i class="fa fa-info-circle information-icon" aria-hidden="true"></i>';
        echo '<p class="hidden"><em>'.$description.'</em></p>';
    }
    if(strlen($importantNote)>0){
        echo '</br><span style="color: #CC0000;">';
        echo $importantNote;
        echo '</span>';
    } 
    echo '</label>';
    
    
    
    if($type == 'shortcode') {
        echo '</br>';
        
        foreach($parameter as $shortcodevalue){
            echo '<a value="['.$shortcodevalue.']" class="linkedin_append_buttons">['.$shortcodevalue.']</a>';
        }       
    }
    
    if($type == 'textarea-advanced') {
        echo '</br>';
        
        foreach($parameter as $shortcodevalue){
            echo '<a value="['.$shortcodevalue.']" data="'.$id.'" class="linkedin_append_buttons_advanced">['.$shortcodevalue.']</a>';
        }       
    }
    
    
    if($type == 'shortcode-advanced') {
        echo '</br>';
        
        foreach($parameter as $shortcodevalue){
            echo '<a value="'.$shortcodevalue[1].'" class="linkedin_append_buttons">'.$shortcodevalue[0].'</a>';
        }       
    }
    
    

    //the setting    
    echo '</td><td>';
    
    //text
    if($type == "text"){
        echo '<input type="text" class="regular-text" name="wp_linkedin_autopublish_settings['.$id.']" id="'.$id.'" value="'.$value.'">';     
    }
    
    //select
    if($type == "select"){
        echo '<select name="wp_linkedin_autopublish_settings['.$id.']" id="'.$id.'">';
        
        foreach($parameter as $x => $xvalue){
            echo '<option value="'.$x.'" ';
            if($x == $value) {
                echo 'selected="selected"';    
            }
            echo '>'.$xvalue.'</option>';
        }
        echo '</select>';
    }
    
    
    //checkbox
    if($type == "checkbox"){
        echo '<label class="switch">';
        echo '<input type="checkbox" id="'.$id.'" name="wp_linkedin_autopublish_settings['.$id.']" ';
        echo checked($value,1,false);
        echo 'value="1">';
        echo '<span class="slider round"></span></label>';
    }
        
    //color
    if($type == "color"){ 
        echo '<input name="wp_linkedin_autopublish_settings['.$id.']" id="'.$id.'" type="text" value="'.$value.'" class="my-color-field" data-default-color="'.$default.'"/>';    
    }
    
    //page
    if($type == "page"){
        $args = array(
            'echo' => 0,
            'selected' => $value,
            'name' => 'wp_linkedin_autopublish_settings['.$id.']',
            'id' => $id,
            'show_option_none' => $default,
            'option_none_value' => "default",
            'sort_column'  => 'post_title',
            );
        
            echo wp_dropdown_pages($args);     
    }
    
    //textarea
    if($type == "textarea" || $type == "shortcode" || $type == "shortcode-advanced"){
        echo '<textarea cols="46" rows="3" name="wp_linkedin_autopublish_settings['.$id.']" id="'.$id.'">'.$value.'</textarea>';
    }
    
    
    //textarea-advanced
//    if($type == "textarea-advanced"){
//        wp_editor(html_entity_decode(stripslashes($value)), $id, $settings = array(
//            'textarea_name' => 'idea_push_settings['.$id.']',
//            'drag_drop_upload' => true,
//            'textarea_rows' => 7,  
//            )
//        );
//    }  
    
    
    if($type == "textarea-advanced"){
        if(isset($value)){    
            wp_editor(html_entity_decode(stripslashes($value)), $id, $settings = array(
            'wpautop' => false,    
            'textarea_name' => 'wp_linkedin_autopublish_settings['.$id.']',
            'drag_drop_upload' => true,
            'textarea_rows' => 7, 
            ));    
        } else {
            wp_editor("", $id, $settings = array(
            'wpautop' => false,    
            'textarea_name' => 'wp_linkedin_autopublish_settings['.$id.']',
            'drag_drop_upload' => true,
            'textarea_rows' => 7,
            ));         
        }
    }
    
    //number
    if($type == "number"){
        echo '<input type="number" class="regular-text" name="wp_linkedin_autopublish_settings['.$id.']" id="'.$id.'" value="'.$value.'">';     
    }

    echo '</td></tr>';

}





?>