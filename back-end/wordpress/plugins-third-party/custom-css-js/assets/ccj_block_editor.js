/* Load the custom codes in the Desktop version of the editor, only for WP >= 6.6 */
jQuery(document).ready(function($) {
	if ( CCJ_codes['wp_version'].localeCompare('6.6', undefined, { numeric: true, sensitivity: 'base' }) < 0 ) {
		loadInternalCustomCodes( $('head') );
		loadExternalCustomCodes( $('head') );
	}
});



/* Load the custom codes in the Mobile/Tablet version of the editor */
jQuery(document).bind('DOMNodeInserted', function(e) {
	if ( e.target.className !== 'block-editor-iframe__container' ) return;

	jQuery('iframe').on('load', function() {
		let head_frm = jQuery('iframe[name=editor-canvas]').contents().find('head');

		if ( CCJ_codes['jquery'].length > 0 ) {
			head_frm.append( '<script src="' + CCJ_codes['jquery'] + '" id="jquery-core-js"></script>' );
		}

		loadInternalCustomCodes( head_frm );
		loadExternalCustomCodes( head_frm );
	});
});


/* Load external custom codes */
function loadExternalCustomCodes( where ) {
	if ( CCJ_codes['external'].length === 0 ) return; 
		
	for ( custom_code_file of CCJ_codes['external'] ) {
		let link = custom_code_file.includes( '.css' ) ?
			'<link rel="stylesheet" id="' + custom_code_file + '" href="' + CCJ_codes.path + custom_code_file + '" media="all">' :
			'<script type="text/javascript" src="' + CCJ_codes.path + custom_code_file + '"></script>'; 
		where.append( link );
	}
}

/* Load internal custom codes */
function loadInternalCustomCodes( where ) {
	if ( CCJ_codes['internal'].length === 0 ) return;
		
	for ( custom_code_file of CCJ_codes['internal'] ) {
		jQuery.ajax({
			url: CCJ_codes.path + custom_code_file,
			async: false,
			dataType: 'text',
			success: function(response) {
				jQuery( where ).append(response);
			}
		});
	}
}
