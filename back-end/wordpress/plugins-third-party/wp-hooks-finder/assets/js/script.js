document.body.setAttribute("class", "");
document.body.setAttribute("style", "display:block");

jQuery(document).ready(function() {

    if( jQuery('div').hasClass('wphf-hook') ) {
        jQuery('div').removeClass('wphf-hook');
        jQuery('div').removeAttr('style');
    }
});