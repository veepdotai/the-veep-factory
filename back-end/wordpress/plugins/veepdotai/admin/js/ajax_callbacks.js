function ajax_save_interview() {
	let form = document.getElementById( "veep_form_interview" );
	let fd   = new FormData( form );
	fd.append( 'action', 'save_interview' );
	fd.append( 'security', MyAjax.security );

	jQuery.ajax(
		{
			url: MyAjax.ajaxurl,
			data: fd,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function (response) {
				console.log( response );
			}
		}
	);
}

function ajax_save_article(e, nexts) {
	let form = document.getElementById( "veep_form_edcal" );
	let fd   = new FormData( form );
	fd.append( 'action', 'save_article' );
	fd.append( 'security', MyAjax.security );

	jQuery.ajax(
		{
			url: MyAjax.ajaxurl,
			data: fd,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function (response) {
				console.log( response );
				if (nexts) {
					next = nexts[0];
					if (nexts.length > 1) {
						next( e, nexts.slice( 1 ) );
					} else {
						next( e, null );
					}
				}
			}
		}
	);
}

function ajax_transcribe(e, nexts) {
	e.preventDefault();
	elt = e.currentTarget;

	var fd = new FormData();
	fd.append( 'action', 'transcribe' );
	fd.append( 'security', MyAjax.security );

	// This information is required to indicate where does the audio come from
	// id = elt.parentElement.parentElement.parentElement.parentElement.id;
	if (elt.nodeName == 'IMG') {
		id = elt.parentElement.parentElement.parentElement.parentElement.id;
	} else {
		id = elt.parentElement.parentElement.parentElement.id;
	}
	fd.append( 'audio', id );

	content_id = null;
	try {
		content_id = jQuery( '#veepdotai-content-id' )[0].value;
	} catch (e) {
		console.log( "No content-id available." );
	}

	
	if ( ! content_id) {
		fd.append( 'veepdotai-ai-record-audio_data', elt.blob, elt.filename );
	}

	// self = this;
	jQuery.ajax(
		{
			url: MyAjax.ajaxurl,
			data: fd,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function(data){
				console.log( new Date() + ": returns from the server" );
				// id = self.parentElement.parentElement.parentElement.id;
				textarea           = jQuery( '#' + id + ' textarea' )[0];
				textarea.innerHTML = data;
				textarea.value     = data;

				if (nexts) {
					next = nexts[0];
					if (nexts.length > 1) {
						next( e, nexts.slice( 1 ) );
					} else {
						next( e, null );
					}
				}

			}
		}
	)
}

function ajax_publish(e) {
	e.preventDefault();

	console.log( 'Calling transcribing to publish from ajax_publish' );
	ajax_edcal_transcribe_to_publish( e );
}

function ajax_edcal_transcribe_to_publish( e ) {
	// e.preventDefault(); // Already done!
	elt = e.currentTarget;

	let form = document.getElementById( "veep_form_edcal" );
	let fd   = new FormData( form );
	fd.append( 'action', 'transcribe_to_publish' );
	fd.append( 'security', MyAjax.security );

	if (elt.nodeName == 'IMG') {
		id = elt.parentElement.parentElement.parentElement.parentElement.id;
	} else {
		id = elt.parentElement.parentElement.parentElement.id;
	}
	fd.append( 'audio', id );

	content_id = null;
	try {
		content_id = jQuery( '#veepdotai-content-id' )[0].value;
	} catch (e) {
		console.log( "No content-id available." );
	}

	if ( ! content_id) {
		fd.append( 'veepdotai-ai-record-audio_data', elt.blob, elt.filename );
	}

	jQuery.ajax(
		{
			url: MyAjax.ajaxurl,
			data: fd,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function (response) {
				console.log( 'Executing transcribe to publish action.' );
				console.log( response );
			}
		}
	)
}

function ajax_publish_in_front_mode(e) {
	e.preventDefault();
	ajax_transcribe(
		e,
		[
			ajax_save_article,
			ajax_edcal_generate_article,
			ajax_edcal_generate_image,
			ajax_save_article,
			ajax_edcal_publish_article
		]
	)
}

function create_links(blob, filename) {
	var publish = document.createElement( 'a' );
	publish.classList.add( 'publish' );
	publish.href      = "#";
	publish.innerHTML = "🏗️ Publier";
	publish.blob      = blob;
	publish.filename  = filename;
	publish.addEventListener( "click", ajax_publish );

	var upload = document.createElement( 'a' );
	upload.classList.add( 'transcribe' );
	upload.href      = "#";
	upload.innerHTML = "✅ Retranscrire";
	upload.blob      = blob;
	upload.filename  = filename;
	upload.addEventListener( "click", ajax_transcribe );

	return {
		"upload": upload,
		"publish": publish
	};
}

/**
 * Fix json by removing prohibited chars then returns valid json
 *
 * @param { text } data
 * @returns json object
 */
function get_json(data) {
	result = data
			.replace( /{(\s|\n)*/g, "{" )
			.replace( /(\s|\n)*}/g, "}" )
			.replace( /\[(\s|\n)*/g, "[" )
			.replace( /(\s|\n)]/g, "]" )
			.replace( /(\s|\n)*],(\s|\n)*/g, "]," )
			.replace( /\",\n\s*\"/g, "\",\"" )
			.replace( /\n/g, "\\n" );

	return JSON.parse( data );
}

function ajax_edcal_publish_article(e) {
	e.preventDefault();

	var fd = new FormData();
	fd.append( 'action', 'publish_article' );
	fd.append( 'security', MyAjax.security );

	self = this;
	jQuery.ajax(
		{
			url: MyAjax.ajaxurl,
			data: fd,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function(data) {
				console.log( new Date() + ": edcal_generate_article returns from the server" );
				response        = data;
				window.location = data;
			}
		}
	)

}

function ajax_edcal_generate_image(e, nexts = null) {
	e.preventDefault();

	function setValue(selector, value, widgetType = 'text') {
		try {
			if ("textarea" === widgetType) {
				jQuery( selector )[0].innerHTML = value.replace( /EOL/g,'\n' );
				jQuery( selector )[0].value     = jQuery( selector )[0].innerHTML;
			} else {
				jQuery( selector )[0].value = value;
			}
		} catch (e) {

		}
	}

	function process(ajaxurl, fd) {
		defaultImage = "https://www.veep.ai/r/default-image-veep.jpeg";
		jQuery.ajax(
			{
				url: ajaxurl,
				data: fd,
				processData: false,
				contentType: false,
				type: 'POST',
				success: function(data) {
					console.log( new Date() + ": edcal_generate_image returns from the server" );
					response = JSON.parse( data );
					if ( 0 == response.length ) {
						response = [
							{
								media: defaultImage
							}
						];
					}
					query    = prompt ? prompt : title;
					setValue( ".veepdotai-ai-section-edcal1-img-prompt", query );
					setValue( ".veepdotai-ai-section-edcal1-img-href", response[0].media );
					if (nexts) {
						next = nexts[0];
						if (nexts.length > 1) {
							next( e, nexts.slice( 1 ) );
						} else {
							next( e, null );
						}
					}
				}
			}
		)
	}

	var fd = new FormData();
	fd.append( 'action', 'generate_image' );
	fd.append( 'security', MyAjax.security );
	prompt = "";
	title  = "";

	prompt = jQuery( '.veepdotai-ai-section-edcal1-img-prompt' )[0].value;
	title  = jQuery( '.veepdotai-ai-section-edcal1-title' )[0].value;
	prompt = prompt ? prompt : title;
	fd.append( 'prompt', prompt );
	fd.append( 'title', title );
	process( MyAjax.ajaxurl, fd );

	/*
	try {
		prompt = jQuery('.veepdotai-ai-section-edcal1-img-prompt')[0].value;
		fd.append('prompt', prompt);
		process(MyAjax.ajaxurl, fd);
	} catch (e) {
		console.log("No prompt id.");
		alert('Pas de prompt disponible pour l\'image. Indiquez des mots-clés pour permettre une recherche sur la base d\'images.');
		title = jQuery('.veepdotai-ai-section-edcal1-title')[0].value;
		fd.append('title', title);
	}
	*/

}

function ajax_edcal_generate_article(e, nexts = null) {
	e.preventDefault();

	var fd = new FormData();
	fd.append( 'action', 'generate_article' );
	fd.append( 'security', MyAjax.security );
	contentId = "";
	try {
		contentId = document.getElementById( 'veepdotai-content-id' ).value;
	} catch (e) {
		console.log( "No content id." );
	}
	fd.append( 'content_id', contentId );
	fd.append( 'veepdotai-ai-idea', document.getElementById( 'veepdotai-ai-idea' ).value );

	function setValue(selector, value, widgetType = 'text') {
		try {
			if ("textarea" === widgetType) {
				jQuery( selector )[0].innerHTML = value.replace( /EOL/g,'\n' );
			} else {
				jQuery( selector )[0].value = value;
			}
		} catch (e) {

		}
	}

	self = this;
	jQuery.ajax(
		{
			url: MyAjax.ajaxurl,
			data: fd,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function(data) {
				console.log( new Date() + ": edcal_generate_article returns from the server" );
				//response = JSON.parse( data );
				//post     = response.choices[0].text;
				post = data;
				linkedin = post.linkedin ? post.linkedin.replace( /<img[^\>]*alt="(.*?)"[^\>]*>/g,"$1" ) : "";
				setValue( ".veepdotai-ai-section-edcal1-title", post.title );
				setValue( ".veepdotai-ai-section-edcal1-description", post.description, "textarea" );
				setValue( ".veepdotai-ai-section-edcal1-content", post.content, "textarea" );
				setValue( ".veepdotai-ai-section-edcal1-linkedin", linkedin, "textarea" );
				setValue( ".veepdotai-ai-section-edcal1-themes", post.themes );
				setValue( ".veepdotai-ai-section-edcal1-hashtags", post.hashtags );
				setValue( ".veepdotai-ai-section-edcal1-keywords", post.keywords );
				setValue( ".veepdotai-ai-section-edcal1-img-prompt", post['image'] );
				setValue( ".veepdotai-ai-section-edcal1-idea", post.idea );

				console.log( 'The article has been generated.' );

				if (nexts) {
					next = nexts[0];
					if (nexts.length > 1) {
						next( e, nexts.slice( 1 ) );
					} else {
						next( e, null );
					}
				}
			}
		}
	)
}

function ajax_edstrat_generate_editorial_strategy(e) {
	e.preventDefault();

	var fd = new FormData();
	fd.append( 'action', 'generate_editorial_strategy' );
	fd.append( 'security', MyAjax.security );
	fd.append( 'content_id', document.getElementById( 'veepdotai-content-id' ).value );
	fd.append( 'veepdotai-ai-section-edstrat0-keywords', document.getElementById( 'veepdotai-ai-section-edstrat0-keywords' ).value );

	function setValue(selector, value, widgetType = 'text') {
		try {
			if ("textarea" === widgetType) {
				jQuery( selector )[0].innerHTML = value;
			} else {
				jQuery( selector )[0].value = value;
			}
		} catch (e) {

		}
	}

	self = this;
	jQuery.ajax(
		{
			url: MyAjax.ajaxurl,
			data: fd,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function(data) {
				// response = get_json(data);
				response = JSON.parse( data );
				post     = response.choices[0].text;
				strategy = post.split( /\r?\n/ ).filter( line => line.trim() !== '' ).join( '\n' );
				setValue( ".veepdotai-ai-section-edstrat0-strategy", strategy, "textarea" );
			}
		}
	)
}
