(function( $ ) {
	'use strict';

	/**
	 * All of the code for your admin-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */

	$( window ).load(
		function() {
			init_loading_page();
			init_sections();
			toggleMode();

			// new ClipboardJS('.clipboard-btn');
		}
	);

})( jQuery );

function init_loading_page() {
	var loading = jQuery( '#loadingDiv' );
	jQuery( document )
		.ajaxStart(
			function () {
				console.log( "Starting ajax call: " + (new Date()).toLocaleTimeString() );
				if (jQuery.modal) {
					jQuery.modal.defaults = {
						escapeClose: false,      // Allows the user to close the modal by pressing `ESC`
						clickClose: false,       // Allows the user to close the modal by clicking the overlay
						showClose: false,        // Shows a (X) icon/link in the top-right corner
						fadeDuration: 250,     // Number of milliseconds the fade transition takes (null means no transition)
						fadeDelay: 1.0          // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
					};

					loading.modal();
				}
			}
		)
		.ajaxStop(
			function () {
				console.log( "Ending ajax call: " + (new Date()).toLocaleTimeString() );
				if (jQuery.modal) {
					jQuery.modal.close();
				}
			}
		);
}

/**
 * Init tabs to make form filling easier
 */
function init_sections() {
	if (jQuery( '.veep_section' ).length > 0) {
		toggle_display( jQuery( '.veep_section' )[0].id );
	}

	if (jQuery( '.veepdotai-ai-section0-text-prompt-post' ).length > 0) {

	};
}

function hide_sections() {
	sections = jQuery( '.veep_section' );
	if (sections) {
		menus = jQuery( 'ul.tabs_questions li' );
		if (menus) {

			for (i = 0; i < sections.length; i++) {
				sections[i].style.display = 'none';
				if (i < menus.length) {
					menus[i].classList.remove( 'displayed' );
				}
			}
		}
	}
}

function toggle_display(eltName) {
	hide_sections();

	try {
		section = jQuery( '#' + eltName )[0];
		menu    = jQuery( '#' + eltName + '_menu' )[0];
		if (section.style.display == 'none') {
			section.style = 'display: block';
			menu.classList.add( 'displayed' );
		} else {
			section.style = 'display: none';
		}
	} catch (e) {
		// I know. A better architecture sould be welcome.
		// These elements don't exist. Just ignore them.
		// Interesting when in vocal or in entretien page.
	}
}

/**
 * Prompts helper
 */
function fillWithSameValues(o) {
	function getValueByClassName(className) {
		return document.getElementsByClassName( className )[0].value;
	}
	function setValueByClassName(className, value) {
		document.getElementsByClassName( className )[0].value = value;
		return document.getElementsByClassName( className )[0].value;
	}

	var value    = o.checked;
	var sections = jQuery( '.veep_section' );
	prompt_pre   = getValueByClassName( 'veepdotai-ai-section0-text-prompt-pre' );
	prompt_post  = getValueByClassName( 'veepdotai-ai-section0-text-prompt-post' );
	for (i = 1; i < sections.length; i++) {
		var cn = 'veepdotai-ai-section' + i + '-text-prompt-';
		if (value == true) {
			// alert('Value is on');
			setValueByClassName( cn + 'pre', prompt_pre );
			setValueByClassName( cn + 'post', prompt_post );
		} else {
			// alert('Value is off');
			setValueByClassName( cn + 'pre', '' );
			setValueByClassName( cn + 'post', '' );
		}
	}
}

/**
 * Cleans objects
 *
 * @param {*} eltName input or textarea
 */
function cleanForm() {

	function cleanElements(eltName) {
		elts = jQuery( eltName );
		console.log( 'There are ' + elts.length + ' elements.' );
		if (elts) {
			elts.map(
				function(i) {
					_name = elts[i].name;
					_type = elts[i].type
					if (_name
						&& _name.startsWith( 'veepdotai-ai-' )
						&& ! /[\d]-prompt$/.test( _name )
						&& 'submit' != _type) {
						console.log( 'Setting ' + _name + ' to "".' );
						eltName == 'textarea' ? elts[i].innerHTML = "" : elts[i].value = "";
					}
				}
			)
		}
	}

	if (jQuery( '#veep_form_edcal' )[0]) {
		cleanElements( 'input' );
		cleanElements( 'textarea' );
	} else if (jQuery( '#veep_form_interview' )[0]) {
		veep_sections = jQuery( '.veep_section' );
		// We look for the current one
		section = veep_sections.filter( i => veep_sections[i].style.display == 'block' )[0];
		jQuery( '#' + section.id + ' textarea' )[0].value = "";
	} else if (jQuery( '#veep_form_site' )[0]) {
		cleanElements( 'input' );
		cleanElements( 'textarea' );
	}
}

function sleep(ms) {
	return new Promise( resolve => setTimeout( resolve, ms ) );
}

function toggleMode() {
	function setDisplay(elts, parentElement = false) {
		if (elts) {
			let elt;
			if (parentElement) {
				elt = elts[0].parentElement;
			} else {
				elt = elts[0];
			}

			if (elt) {
				if (elt.toggle || elt.toggle == '') {
					elt.style.display = elt.toggle;
					elt.toggle        = null;
				} else {
					elt.toggle        = elt.style.display || '';
					elt.style.display = 'none';
				}
			}
		}
		return;
	}

	if (document.getElementById( 'veep_form_edcal' )) {
		/* On editorial calendar */
		setDisplay( jQuery( '.veep_actions' ) );
		setDisplay( jQuery( '.transcribe' ) );
		setDisplay( jQuery( '#veep_id_article_menu' ) );
		setDisplay( jQuery( '.veepdotai-ai-section-edcal0-prompt' ), true );
	} else if (document.getElementById( 'veep_form_edstrat' )) {
		setDisplay( jQuery( '#veepdotai-content-id' ) );
		setDisplay( jQuery( '.veepdotai-ai-section-edstrat0-prompt' ), true );
	} else if (document.getElementById( 'veep_form_site' )) {
		setDisplay( jQuery( '.veep_actions input[name="veepdotai-ai-transform"]' ) );
		setDisplay( jQuery( '.veep_actions input[name="veepdotai-ai-generate-images"]' ) );
		setDisplay( jQuery( '.veep_actions input[name="veepdotai-ai-generate-site"]' ) );
		setDisplay( jQuery( '.veep_actions input[name="veepdotai-ai-generate-pages"]' ) );

		for (i = 0; i < 4; i++) {
			setDisplay( jQuery( '.veepdotai-ai-section' + i + '-img-href' ), true );
			setDisplay( jQuery( '.veepdotai-ai-section' + i + '-img-alt' ), true );
			setDisplay( jQuery( '.veepdotai-ai-section' + i + '-cta-href' ), true );
		}
	}
}
