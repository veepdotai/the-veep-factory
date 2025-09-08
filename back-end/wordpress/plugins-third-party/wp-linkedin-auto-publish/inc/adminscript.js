jQuery(document).ready(function ($) {

    //make help area content into an accordion

    if($('#accordion').length){
        $("#accordion").accordion({
            collapsible: true,
            autoHeight: false,
            heightStyle: "content",
            speed: "fast",
            active: false,
        });
    }
    
    
    //make tabs tabs
    if($('#tabs').length){
        $("#tabs").tabs();
    }
    

    //make links go to particular tabs
    $('.wrap').on("click", ".open-tab", function () {
        var tab = $(this).attr('href');
        var index = $(tab).index() - 1;
        $('#tabs').tabs({
            active: index
        });
    });
    
    
    //add link to hidden link setting when a tab is clicked
    $('.wrap').on("click", ".nav-tab", function () {
        var tab = $(this).attr('href');
        $('#wp_linkedin_autopublish_tab_memory').val(tab);
    });
    
    
    
    //load previous tab when opening settings page
    if($('#wp_linkedin_autopublish_tab_memory').length) {
        if($('#wp_linkedin_autopublish_tab_memory').val().length > 1) {

        var tab = $('#wp_linkedin_autopublish_tab_memory').val();  

        var index = $(tab).index() - 1;
        $('#tabs').tabs({
            active: index
        });
        }
    }
    


    //hides and then shows on click help tooltips
    $(".hidden").hide();
    $(".information-icon").click(function (event) {
        event.preventDefault();
        $(this).next(".hidden").slideToggle();
    });


    
    //common function to get query parameters from url
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    
    
    function getCurrentPageUrl(){
        
        var currentPage = window.location.href;
   
        //the following 3 variables are used to create the redirect URL
        var pluginName = "wp_linkedin_auto_publish";
        var findWhereParamatersStart = currentPage.indexOf(pluginName);
        var redirect = currentPage.substr(0,findWhereParamatersStart+pluginName.length);
        
        return redirect;
        
    }
    
    
    
    //runs get access token ajax
    //get current page
    var currentPage = window.location.href;

    if (currentPage.indexOf("code") !== -1) {
                
        //do request    
        var data = {
            'action': 'save_linkedin_access_token',
            'code': getParameterByName('code'),
        };
        
//        console.log('The code being sent is: '+code);
//        console.log('The redirect being sent is: '+redirect);
        jQuery.post(ajaxurl, data, function (response) {
            
            console.log(response);
            
            if(response == 'SUCCESS'){
                    
                $('#wp_linkedin_autopublish_tab_memory').val('#profileCompanyPage');


                $('#linkedin_autopublish_settings_form').ajaxSubmit({
                    success: function(){
                    }
                });



                //the call was succesful
                $('<div class="notice notice-info is-dismissible"><p>The connection to your LinkedIn account has been successful. You now need to select what profile/companies you want to share with, we will take you there in <span id="countdown"></span></p></div>').insertAfter('#linkedin_autopublish_get_authorisation');


                    var count = 9;
                    var countdown = setInterval(function(){
                    $("#countdown").html(count);
                    if (count == 0) {
                      clearInterval(countdown);
                      window.location.href = getCurrentPageUrl();

                    }
                    count--;
                  }, 1000);



            } else {
                //we ran into an issue
                $('<div class="notice notice-error is-dismissible"><p>Something went wrong, the error reported by LinkedIn is: <strong>'+response+'</strong>. Please try again later or if the issue persists please visit the Help tab.</p></div>').insertAfter('#linkedin_autopublish_get_authorisation');     

            }
            
               
        });

    }
    
    

    
    //hide company select based on whether the user is using a company or profile

    $('#wp_linkedin_autopublish_profile_company :selected').each(function () {
        if ($(this).val() == "profile") {
            $(".company-option").hide();
        } else {
            $(".company-option").show();
        }
    });
    $('#wp_linkedin_autopublish_profile_company').change(function () {
        if ($(this).val() == "profile") {
            $(".company-option").hide();
        } else {
            $(".company-option").show();
        }
    });


    //adds button text to text area
    $('.linkedin_autopublish_append_buttons').click(function () {
        $(this).parent().next().children().val($(this).parent().next().children().val() + $(this).attr("value"));
        $(this).parent().next().children().focus();
    });



    
    
    //code to manage dont share categories

    var selectedDontShareCategories = $('#wp_linkedin_autopublish_dont_share_categories').val();

    if (selectedDontShareCategories != null) {
        var selectedDontShareCategoriesArray = selectedDontShareCategories.split(',');
    }

    $(".dont-share-checkbox").each(function () {

        if ($.inArray($(this).attr('id'), selectedDontShareCategoriesArray) != -1) {
            $(this).prop('checked', true);
        }

        $(this).change(function () {

            if ($(this).is(":checked")) {

                selectedDontShareCategoriesArray.push($(this).attr('id'));

                $('#wp_linkedin_autopublish_dont_share_categories').val(selectedDontShareCategoriesArray.join());

            } else {
                selectedDontShareCategoriesArray.splice($.inArray($(this).attr('id'), selectedDontShareCategoriesArray), 1);
                $('#wp_linkedin_autopublish_dont_share_categories').val(selectedDontShareCategoriesArray.join());
            }

        }); //end change function

    }); //end each function
    
    
    
    
    
    
    
    
    //code to manage share the following post types and pages

    var selectedPostTypesPages = $('#wp_linkedin_autopublish_share_post_types').val();

    if (selectedPostTypesPages != null) {
        var selectedPostTypesPagesArray = selectedPostTypesPages.split(',');
    }

    $(".post-type-checkbox").each(function () {

        if ($.inArray($(this).attr('id'), selectedPostTypesPagesArray) != -1) {
            $(this).prop('checked', true);
        }

        $(this).change(function () {

            if ($(this).is(":checked")) {

                selectedPostTypesPagesArray.push($(this).attr('id'));

                $('#wp_linkedin_autopublish_share_post_types').val(selectedPostTypesPagesArray.join());

            } else {
                selectedPostTypesPagesArray.splice($.inArray($(this).attr('id'), selectedPostTypesPagesArray), 1);
                $('#wp_linkedin_autopublish_share_post_types').val(selectedPostTypesPagesArray.join());
            }

        }); //end change function

    }); //end each function
    
    
    
    
    
    
    
    
    //save settings using ajax    
    $('#linkedin_autopublish_settings_form').submit(function(event) {
        
        event.preventDefault();
        //we need to check whether the boards tab is active and if it is we are going to do some magic first
        
        var activeTab = $('.ui-tabs-active a').attr('href');
        
        //if the current tab is the account and they save the settings lets take them to the location tab.
        
        if(activeTab == '#profileCompanyPage'){
            $('#wp_linkedin_autopublish_tab_memory').val('#sharingOptionsPage');
        }

        
        $('<div class="notice notice-warning is-dismissible settings-loading-message"><p><i class="fa fa-spinner" aria-hidden="true"></i> Please wait while we save the settings...</p></div>').insertAfter('.linkedin-save-all-settings');
        
        //tinyMCE.triggerSave();

        $(this).ajaxSubmit({
            success: function(){

                $('.settings-loading-message').remove();

                $('<div class="notice notice-success is-dismissible settings-saved-message"><p>The settings have been saved.</p></div>').insertAfter('.linkedin-save-all-settings');

                setTimeout(function() {
                    $('.settings-saved-message').slideUp();
                    
      
                    
                }, 3000);
                
                
                
                if(activeTab == '#profileCompanyPage'){
                    location.reload();
                }
                

            }
        });

        return false; 

        $('.settings-loading-message').remove();

    });
    
    
    
    
    //hide welcome message
    $('#wpwrap').on("click","#linkedin-welcome-message .notice-dismiss", function(event){
        
        event.preventDefault();
        
        var pluginVersion = $(this).parent().attr('data-version');
        
        $('#wp_linkedin_autopublish_dismiss_welcome_message').val(pluginVersion);
        
//        $('#google_my_business_auto_publish_settings_form').ajaxSubmit({
//            success: function(){
//            }
//        });
        
        console.log(pluginVersion);
        

        var data = {
                    'action': 'dismiss_welcome_message',
                    'pluginVersion': pluginVersion,
                    };


        jQuery.post(ajaxurl, data, function (response) {
            console.log(response);  

        });
            
            
    

    });
    
    
    
    //toggle profiles for profile selection
    $('#wpwrap').on("click",".profile-selection-list-item", function(event){
        event.preventDefault();
        
        var valueOfSetting = $('#wp_linkedin_autopublish_profile_selection').val();
        
        var profileId = $(this).attr('data');
        
        if($(this).hasClass('selected')){
            
            //we need to remove the item
            
            var itemSelected = true;
            
            $(this).removeClass('selected');
            
            $(this).find('.profile-selected-icon').removeClass('fa-check-circle-o');
            $(this).find('.profile-selected-icon').addClass('fa-times-circle-o');
            
            
            var settingAsAnArray = valueOfSetting.split(',');
            var positionInArray = settingAsAnArray.indexOf(profileId);
            if (positionInArray > -1) {
                settingAsAnArray.splice(positionInArray, 1);
            }
            
            var newSettingValue = settingAsAnArray.join(",");
            
            
            $('#wp_linkedin_autopublish_profile_selection').val(newSettingValue);
            
        } else {
            
            //we need to add the item
            
            var itemSelected = false;  
            
            $(this).addClass('selected');
            $(this).find('.profile-selected-icon').removeClass('fa-times-circle-o');
            $(this).find('.profile-selected-icon').addClass('fa-check-circle-o');
            
            if(valueOfSetting == ''){
                $('#wp_linkedin_autopublish_profile_selection').val(profileId);    
            } else {
                $('#wp_linkedin_autopublish_profile_selection').val(valueOfSetting+','+profileId);      
            }
            

            
        }
        
        //lets change the class
        
        
        //console.log(itemSelected);
        
        
    });
    
    
    
    
    
    //toggle locations for default location selection
    $('#wpwrap').on("click","#default-profile-list .profile-selection-list-item-small", function(event){
        event.preventDefault();
        
        var valueOfSetting = $('#wp_linkedin_autopublish_default_share_profile').val();
        
        var profileId = $(this).attr('data');
        
        if($(this).hasClass('selected')){
            
            //we need to remove the item
            
            var itemSelected = true;
            
            $(this).removeClass('selected');
            
            $(this).find('.profile-selected-icon').removeClass('fa-check-circle-o');
            $(this).find('.profile-selected-icon').addClass('fa-times-circle-o');
            
            
            var settingAsAnArray = valueOfSetting.split(',');
            var positionInArray = settingAsAnArray.indexOf(profileId);
            if (positionInArray > -1) {
                settingAsAnArray.splice(positionInArray, 1);
            }
            
            var newSettingValue = settingAsAnArray.join(",");
            
            
            $('#wp_linkedin_autopublish_default_share_profile').val(newSettingValue);
            
        } else {
            
            //we need to add the item
            
            var itemSelected = false;  
            
            $(this).addClass('selected');
            $(this).find('.profile-selected-icon').removeClass('fa-times-circle-o');
            $(this).find('.profile-selected-icon').addClass('fa-check-circle-o');
            
            if(valueOfSetting == ''){
                $('#wp_linkedin_autopublish_default_share_profile').val(profileId);    
            } else {
                $('#wp_linkedin_autopublish_default_share_profile').val(valueOfSetting+','+profileId);      
            }
            

            
        }
        
    });


    //hide welcome message
    $('#wpwrap').on("click","#clear-all-linkedin-settings", function(event){
        
        event.preventDefault();       

        var nonce = $(this).attr('data-nonce');

        var data = {
                    'action': 'delete_all_linkedin_settings',
                    'nonce': nonce
                    };


        jQuery.post(ajaxurl, data, function (response) {

            console.log(response);  

        });
            
            
    

    });
    
    
    
    
    
});