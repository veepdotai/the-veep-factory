jQuery(document).ready(function ($) {
    
    
    
    function hideAndShowAllOptionsOnPostPageLinkedIn(){
        if($("#dont-sent-to-linkedin-checkbox").prop('checked') == true){
            $('.custom-linkedin-metabox-setting').hide(); 
        } else {
            $('.custom-linkedin-metabox-setting').show();
        }      
    }
    
    
    //hide all share options if dont share this post is checked
    if($('#dont-sent-to-linkedin-checkbox').length){
        hideAndShowAllOptionsOnPostPageLinkedIn();
    }
    
    
    
    $('#dont-sent-to-linkedin-checkbox').change(function(){
        
        hideAndShowAllOptionsOnPostPageLinkedIn();
        
    });
    
    
    
    
    
    
    
    
    
    
    
    $(document).on('click', '.send-to-linkedin', function(event) { 
        event.preventDefault(); 
            
            $(this).after('<p style="color: blue; font-weight: bold;" class="linkedin-share-sending-message">Sending...Please wait...</p>');
        
            //share to linkedin
            var thisLink = $(this);
            var postID = $(this).attr("data");

            //do request    
            var data = {
            'action': 'post_to_linkedin',
            'postID': postID,   
            };

            jQuery.post(ajaxurl, data, function(response) { 

                console.log(response);

                $('.linkedin-share-sending-message').remove();

                if(response == "success"){
                    thisLink.after('<p style="color: green; font-weight: bold;" class="linkedin-share-success-message">Successfully Shared!</p>');
                } else {
                    //post already shared
                    thisLink.after('<p style="color: red; font-weight: bold;" class="linkedin-share-success-message">We tried to send the post but no profile is selected for this post.</p>');
                }

                setTimeout(function() {
                    $('.linkedin-share-success-message').slideUp();
                    }, 4000);


            }); //end response   
            
            
        
    }); //end button click
    
    
    
    
    
    
    
    //common function if any option changes
    $(document).on('change', '#dont-sent-to-linkedin-checkbox, #custom-share-message, #profile-selection-linkedin', function(event) { 
        

        //var itemChanged = $(this);
        
        var postID = $('.send-to-linkedin').attr("data");
        
        var updatedShareMessage = $('#custom-share-message').val();
        
        
        if ($('#dont-sent-to-linkedin-checkbox').is(':checked')) {
            var dontShareAction = "update";
        } else {
            var dontShareAction = "delete";
        }
        
        var profiles = $('#profile-selection-linkedin').val();
        
        
        //console.log(eventStartDateTime);
        

        var data = {
        'action': 'update_linkedin_post_meta',
        'postID': postID,
        'updatedShareMessage': updatedShareMessage,
        'dontShareAction': dontShareAction,
        'profiles': profiles,
        };

        jQuery.post(ajaxurl, data, function(response) { 
            if(response == "success"){
                                
                $('.linkedin-settings-saved').slideDown();
                

                setTimeout(function() {
                $('.linkedin-settings-saved').slideUp();
                }, 3000);

            }
        }); //end response  
  
        
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    //toggle locations for default location selection
    $('#wpwrap').on("click","#post-meta-profile-list .profile-selection-list-item-small", function(event){
        event.preventDefault();
        
        var valueOfSetting = $('#profile-selection-linkedin').val();
        
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
            
            
            $('#profile-selection-linkedin').val(newSettingValue).change();
            
        } else {
            
            //we need to add the item
            
            var itemSelected = false;  
            
            $(this).addClass('selected');
            $(this).find('.profile-selected-icon').removeClass('fa-times-circle-o');
            $(this).find('.profile-selected-icon').addClass('fa-check-circle-o');
            
            if(valueOfSetting == ''){
                $('#profile-selection-linkedin').val(profileId).change();   
            } else {
                $('#profile-selection-linkedin').val(valueOfSetting+','+profileId).change();      
            }
  
        }
        
        
        
    });
    
    
    
    
    
    
    
    
    //this below script makes sure to not share the post. this is activated when someone has configured the plugin settings this way
    if($('#dont-sent-to-linkedin-checkbox').length){
        
        if($('#dont-sent-to-linkedin-checkbox').attr('data') == 'dont-publish-by-default'){
            
            $('#dont-sent-to-linkedin-checkbox').prop('checked', true);
            
            var postID = $('.send-to-linkedin').attr("data");
            
            console.log(postID);

            //run the request to make the post meta 
            var data = {
            'action': 'update_dont_share',
            'postID': postID,
            'dontShareAction': 'update',  
            };

            jQuery.post(ajaxurl, data, function(response) { 
                if(response == "success"){
                    //no need to run any success function
                    hideAndShowAllOptionsOnPostPageLinkedIn();
                }
            }); //end response  

        }
    }
    
    
    
    
    
    
    
    
});



