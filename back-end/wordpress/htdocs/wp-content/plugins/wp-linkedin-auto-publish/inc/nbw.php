<?php

    function northernbeacheswebsites_information(){

        $html = '<style type="text/css">
        
        @media only screen and (min-width: 768px){
        .northern_beaches_websites {
            column-count: 4;
            column-gap: 1em;
        }}

        .northern_beaches_websites .nbw_item {
            display: inline-block;
            background: #fff;
            border-radius: 4px;
            box-shadow: 0px 0px 3px 0px rgba(0,0,0,.1);
            vertical-align: top;
            width: 100%;
            overflow: hidden;
            margin-bottom: 1em;
        }

        .northern_beaches_websites .nbw_item_inner {

            padding: 15px;
 
        }

        .northern_beaches_websites i {

            color: #3fa5bf;
 
        }

        .northern_beaches_websites .type {
            background: #e1dede;
            padding: 5px 10px;
            border-radius: 2px;
            text-transform: uppercase;
            font-weight: 900;
            letter-spacing: 1px;
            font-size: 11px !important;
            margin-right: 8px;
        }

        .northern_beaches_websites .name {
            font-weight: 900;
            font-size: 16px;
            margin-bottom: 10px !important;
            display: block;
            text-decoration: none !important;
            color: inherit !important;
            word-wrap: break-word;
        }

        .northern_beaches_websites .call-to-action {
            display: inline-block;
            background: #3fa5bf;
            color: #fff !important;
            text-decoration: none !important;
            border-radius: 4px;
            font-weight: 700 !important;
            padding: 8px 13px;
            clear: both;
            box-shadow: 0px 1px 3px 1px rgba(0,0,0,.1);
        }

        .northern_beaches_websites .description {
            display: block;
            margin-bottom: 18px;
            margin-top: 13px;
            font-style: normal !important;
        }

        .northern_beaches_websites_heading {
            margin-bottom: 30px !important;
            margin-top: 30px !important;
            font-weight: 300 !important;

        }
        .nbw_item.installed {
            opacity: .3;
        }

        .nbw_item.service {
            background: #3fa5bf;

        }

        .nbw_item.service .name, .nbw_item.service .description{
            color: white !important;
        }
        .nbw_item.service .name {
            font-weight: 700 !important;
        }
        

        .nbw_item.service .call-to-action {
            background-color: white !important;
            color: #3fa5bf !important;
            box-shadow: 0px 1px 3px 1px rgba(0,0,0,.3);

        }

        .nbw_item.service .type {
            background-color: #338da3 !important;
            color: white !important;
        }    

        .donate-button {
            background: #3ea5bf;
            color: #fff !important;
            font-weight: bold !important;
            text-decoration: none;
            padding: 10px 15px;
            font-size: 16px;
            border-radius: 4px;
            margin-left: 10px;
            box-shadow: 0px 0px 3px 0px rgba(0,0,0,.3);
            letter-spacing: 1px;
        }

        </style>';

        $html .= '<h1 class="northern_beaches_websites_heading">Check out other great plugins and services by Northern Beaches Websites or<a target="_blank" class="donate-button" href="https://northernbeacheswebsites.com.au/product/donate-to-northern-beaches-websites/">Donate now</a></h1>';


        

        $installledPlugins = get_plugins();
        
        $installledPluginsArray = array();

        foreach($installledPlugins as $key => $value) {

            if( strlen($key) > 0 && strpos($key, '/') !== false && strpos($key, '.php') !== false ){

                $valueToInsert = explode('/',$key);

                $valueToInsert = str_replace('.php','',$valueToInsert[1]);
                //array_push($installledPluginsArray,$value['Name']);
                array_push($installledPluginsArray,$valueToInsert);
            }

            
        }

        $html .= '<div class="northern_beaches_websites">';
        //var_dump($installledPluginsArray);
        //var_dump($installledPlugins);

        $getTransient = get_transient('northern_beaches_websites'); 
        
        //do free plugins
        //get data
        if ($getTransient != false){
            $pluginData = $getTransient;
        } else {
            $args = array(
                'author' => 'northernbeacheswebsites',
            );
            
    
            // do request to get plugins from WordPress
            $response = wp_remote_post('http://api.wordpress.org/plugins/info/1.0/',array('body' => array(
                        'action' => 'query_plugins',
                        'request' => serialize((object)$args)
                    )
                )
            );

            if ( 200 == wp_remote_retrieve_response_code( $response ) ) {
                $returned_object = unserialize(wp_remote_retrieve_body($response));
                $pluginData = $returned_object->plugins;
                set_transient( 'northern_beaches_websites',$pluginData,DAY_IN_SECONDS*7);
            }    

        }    

        //var_dump($pluginData);

        //only do something if variable is set
        if(isset($pluginData)){
            $pluginInstallAddress = get_admin_url().'plugin-install.php?tab=plugin-information&plugin=';

            foreach($pluginData as $plugin){

                
            

                //check to see if installed
                if(in_array($plugin->slug,$installledPluginsArray)){
                    $class='installed';
                    $buttonText='Installed';
                    $ctaLink = '';
                } else {
                    $class='';   
                    $buttonText='Learn more';
                    $ctaLink = 'href="'.$pluginInstallAddress.$plugin->slug.'"';
                }

                if($plugin->slug == 'wp-gotowebinar'){
                    global $gotowebinar_is_pro;

                    if(isset($gotowebinar_is_pro) && $gotowebinar_is_pro=="YES"){
                        $class='';   
                        $buttonText='Learn more';
                        $ctaLink = 'href="'.$pluginInstallAddress.$plugin->slug.'"';
                    }
                }

                if($plugin->slug == 'ideapush'){
                    global $ideapush_is_pro;

                    if(isset($ideapush_is_pro) && $ideapush_is_pro=="YES"){
                        $class='';   
                        $buttonText='Learn more';
                        $ctaLink = 'href="'.$pluginInstallAddress.$plugin->slug.'"';
                    }
                }

                if($plugin->slug == 'wp-roster'){
                    global $wp_roster_is_pro;

                    if(isset($wp_roster_is_pro) && $wp_roster_is_pro=="YES"){
                        $class='';   
                        $buttonText='Learn more';
                        $ctaLink = 'href="'.$pluginInstallAddress.$plugin->slug.'"';
                    }
                }



                $html .= '<div class="nbw_item '.$class.'">';
                $html .= '<div class="nbw_item_inner">';

                    $html .= '<a target="_blank" '.$ctaLink.' class="name">'.$plugin->name.'</a>';

                    $html .= '<div class="item-meta">';
                        $html .= '<span class="type">FREE PLUGIN</span>';

                        $rating = ceil($plugin->rating/20);
                        $ratingOutput = '';
                        for($i = 0 ; $i < $rating; $i++){
                            $ratingOutput .= '<i class="fa fa-star" aria-hidden="true"></i>';
                        }    

                        $html .= '<span class="rating">'.$ratingOutput.'</span>';
                    $html .= '</div>';    

                    $html .= '<span class="description">'.$plugin->short_description.'</span>'; 
                    


                    $html .= '<a target="_blank" '.$ctaLink.' class="call-to-action">'.$buttonText.'</a>'; 

                $html .= '</div>'; 
                $html .= '</div>'; 
            }

        } //end if free plugin is found

        $proPlugins = array(
            
            array('name'=>'IdeaPush Pro','slug'=>'ideapush','description'=>'IdeaPush but with multiple boards and so much more!','cta'=>'https://northernbeacheswebsites.com.au/ideapush-pro/'),   
            
            array('name'=>'WP GoToWebinar Pro','slug'=>'wp-gotowebinar','description'=>'Sell your GoToWebinar\'s via WooCommerce and integrate with CRM and email marketing packages.','cta'=>'https://northernbeacheswebsites.com.au/wp-gotowebinar-pro/'),  

            array('name'=>'WP Roster Pro','slug'=>'wp-roster','description'=>'WP Roster but with advanced notifications, multiple rosters, run sheets and efficiency improvements.','cta'=>'https://northernbeacheswebsites.com.au/wp-roster-pro/'),  

            array('name'=>'Pardot to Gravity Forms Connector','slug'=>'pardot-gravityforms-connector','description'=>'Connect Pardot to Gravity Forms with custom field support.','cta'=>'https://northernbeacheswebsites.com.au/pardot-to-gravity-forms-connector/'), 

            array('name'=>'Progressive Profiling for Gravity Forms','slug'=>'progressive-profiling-gravityforms','description'=>'Brings the magic of progressive profiling to Gravity Forms.','cta'=>'https://northernbeacheswebsites.com.au/progressive-profiling-for-gravity-forms/'),       

            array('name'=>'ServiceM8 to Gravity Forms Connector','slug'=>'servicem8-gravityforms-connector','description'=>'Connect ServiceM8 to Gravity Forms.','cta'=>'https://northernbeacheswebsites.com.au/servicem8-to-gravity-forms-connector/'), 

            array('name'=>'Sinch SMS Notifications for WooCommerce','slug'=>'sinch-sms-notifications-woocommerce','description'=>'Send SMS notifications for WooCommerce orders.','cta'=>'https://northernbeacheswebsites.com.au/sinch-sms-notifications-for-woocommerce/'), 

                array('name'=>'AutoSocial','slug'=>'autosocial','description'=>'Send posts to multiple social profiles.','cta'=>'https://northernbeacheswebsites.com.au/autosocial/'), 
        );

        foreach($proPlugins as $plugin){

            if(in_array($plugin['slug'],$installledPluginsArray)){
                $class='installed';
                $buttonText='Installed';
                $ctaLink = '';
            } else {
                $class='';   
                $buttonText='Learn more';
                $ctaLink = 'href="'.$plugin['cta'].'"';
            }

            if($plugin['slug'] == 'wp-gotowebinar'){
                global $gotowebinar_is_pro;

                if(isset($gotowebinar_is_pro) && $gotowebinar_is_pro=="YES"){
                    $class='installed';
                    $buttonText='Installed';
                    $ctaLink = '';
                } else {
                    $class='';   
                    $buttonText='Learn more';
                    $ctaLink = 'href="'.$plugin['cta'].'"';    
                }
            }

            if($plugin['slug'] == 'ideapush'){
                global $ideapush_is_pro;

                if(isset($ideapush_is_pro) && $ideapush_is_pro=="YES"){
                    $class='installed';
                    $buttonText='Installed';
                    $ctaLink = '';
                } else {
                    $class='';   
                    $buttonText='Learn more';
                    $ctaLink = 'href="'.$plugin['cta'].'"'; 
                }
            }



            $html .= '<div class="nbw_item '.$class.'">';
            $html .= '<div class="nbw_item_inner">';
                $html .= '<a target="_blank" '.$ctaLink.' class="name">'.$plugin['name'].'</a>';

                $html .= '<div class="item-meta">';
                    $html .= '<span class="type">PRO PLUGIN</span>';

                $html .= '</div>';    

                $html .= '<span class="description">'.$plugin['description'].'</span>'; 
                
                $html .= '<a target="_blank" '.$ctaLink.' class="call-to-action">'.$buttonText.'</a>'; 
            $html .= '</div>'; 
            $html .= '</div>'; 

        }

        
        $current_user = wp_get_current_user();
        $firstName = $current_user->user_firstname; 
        $lastName = $current_user->user_lastname;
        $email = $current_user->user_email; 

        $services = array(
            
            array('name'=>'Website Design & Development','description'=>'Custom website design and development for small-large businesses','cta'=>'http://northernbeacheswebsites.com.au/contact?enquiry=Website'),  
                
            array('name'=>'Graphic Design','description'=>'Logos, business cards, flyers, booklets, you name it, we do it!','cta'=>'http://northernbeacheswebsites.com.au/contact?enquiry=Graphics'), 
            
            array('name'=>'Search Engine Optimisation','description'=>'Get to the top of Google with Northern Beaches Websites.','cta'=>'http://northernbeacheswebsites.com.au/contact?enquiry=SEO'),

            array('name'=>'Ad Management','description'=>'Efficient and cost effective ad design and management with Google Adwords and Facebook Ads.','cta'=>'http://northernbeacheswebsites.com.au/contact?enquiry=Ad Management'),

            array('name'=>'WordPress Support & Plugin Customisation/Development','description'=>'We know WordPress inside out, no matter how big or small your project is contact us for a quote.','cta'=>'http://northernbeacheswebsites.com.au/contact?enquiry=WordPress'),        

        );


        foreach($services as $service){

            $class='service';   
            $ctaLink = 'href="'.$service['cta'].'&firstName='.$firstName.'&lastName='.$lastName.'&email='.$email.'"';
          
            $html .= '<div class="nbw_item '.$class.'">';
            $html .= '<div class="nbw_item_inner">';
                $html .= '<a target="_blank" '.$ctaLink.' class="name">'.$service['name'].'</a>';

                $html .= '<div class="item-meta">';
                    $html .= '<span class="type">SERVICE</span>';

                $html .= '</div>';    

                $html .= '<span class="description">'.$service['description'].'</span>'; 
                
                $html .= '<a target="_blank" '.$ctaLink.' class="call-to-action">Enquire</a>'; 
            $html .= '</div>'; 
            $html .= '</div>'; 

        }








        



        $html .= '</div>';    

        return $html;


    } //end function

?>