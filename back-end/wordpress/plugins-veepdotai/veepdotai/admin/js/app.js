// webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						// stream from getUserMedia()
var rec; 							// Recorder.js object
var input; 							// MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext // audio context to help us record

// I know, a better architecture should be welcome :-(
var themes = [
	'vocal', // Vocal page
	'benefits', 'pains', 'solutions', 'strengths' // Interview page
]
themes.forEach(
	element => {
		addEventListeners( element );
	}
);

/**
 * Attach events to buttons in a veep_id_* as id element.
 *
 * @param {*} buttonName
 * @param {*} field
 * @returns
 */
function getElementById(buttonName, field) {
	// return document.getElementById(buttonName + '-' + field);
	return jQuery( '#veep_id_' + field + ' #' + buttonName )[0];
}

function addEventListeners(field) {
	var recordButton = getElementById( "recordButton", field );
	var stopButton   = getElementById( "stopButton", field );
	var pauseButton  = getElementById( "pauseButton", field );

	if (recordButton && stopButton && pauseButton) {
		recordButton.addEventListener( "click", startRecording );
		stopButton.addEventListener( "click", stopRecording );
		pauseButton.addEventListener( "click", pauseRecording );
	}
}

function disableButton(self, buttonName, disabled, label) {
	var button      = jQuery( '#' + self.parentElement.id + ' #' + buttonName )[0];
	button.disabled = disabled;
	if (label) {
		button.innerHTML = label;
	}
}

function startRecording(e) {
	cleanForm();
	totalSeconds = 0;
	pauseTimer   = false;

	e.preventDefault();
	console.log( "recordButton clicked" );

	/*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/

	var constraints = { audio: true, video: false }

	/*
		Disable the record button until we get a success or fail from getUserMedia()
	*/

	// this.disabled = true;
	/*jQuery('#' + this.parentElement.id + ' recordButton')[0].disabled = true;
	jQuery('#' + this.parentElement.id + ' stopButton')[0].disabled = false;
	jQuery('#' + this.parentElement.id + ' pauseButton')[0].disabled = false;
	*/
	// this.parentElement.getElementById('pauseButton').disabled = false;
	disableButton( this, 'recordButton', true );
	disableButton( this, 'stopButton', false );
	disableButton( this, 'pauseButton', false );

	// recordButton.disabled = true;
	// stopButton.disabled = false;
	// pauseButton.disabled = false

	/*
		We're using the standard promise based getUserMedia()
		https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia( constraints ).then(
		function(stream) {
			console.log( "getUserMedia() success, stream created, initializing Recorder.js ..." );

			/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

			*/
			audioContext = new AudioContext();

			// update the format
			document.getElementById( "formats" ).innerHTML = "Format: 1 channel pcm @ " + audioContext.sampleRate / 1000 + "kHz"

			/*  assign to gumStream for later use  */
			gumStream = stream;

			/* use the stream */
			input = audioContext.createMediaStreamSource( stream );

			/*
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
			*/
			rec = new Recorder( input,{numChannels:1} )

			// start the recording process
			rec.record()

			console.log( "Recording started" );

		}
	).catch(
		function(err) {
			// enable the record button if getUserMedia() fails
			disableButton( this, 'recordButton', false );
			disableButton( this, 'stopButton', true );
			disableButton( this, 'pauseButton', true );
			/*
				recordButton.disabled = false;
				stopButton.disabled = true;
				pauseButton.disabled = true
				*/
		}
	);
}

function pauseRecording(e){
	e.preventDefault();
	if (pauseTimer) {
		pauseTimer = false;
	} else {
		pauseTimer = true;
	}
	console.log( "pauseButton clicked rec.recording=",rec.recording );
	if (rec.recording) {
		// pause
		rec.stop();
		disableButton( this, 'pauseButton', false, 'Resume' )
		// pauseButton.innerHTML="Resume";
	} else {
		// resume
		rec.record()
		disableButton( this, 'pauseButton', false, 'Pause' )
		// pauseButton.innerHTML="Pause";

	}
}

function stopRecording(e) {
	e.preventDefault();
	pauseTimer = true;

	console.log( "stopButton clicked" );

	// disable the stop button, enable the record too allow for new recordings

	disableButton( this, 'stopButton', true );
	disableButton( this, 'recordButton', false );
	disableButton( this, 'pauseButton', true );

	/*  stopButton.disabled = true;
	recordButton.disabled = false;
	pauseButton.disabled = true;
	*/
	// reset button just in case the recording is stopped while paused
	disableButton( this, 'pauseButton', true, 'Pause' )
	// pauseButton.innerHTML="Pause";

	// tell the recorder to stop the recording
	rec.stop();

	// stop microphone access
	gumStream.getAudioTracks()[0].stop();

	// create the wav blob and pass it on to createDownloadLink
	rec.exportWAV( createDownloadLink );
}

function createDownloadLink(blob) {

	var url     = URL.createObjectURL( blob );
	var size    = blob.size;
	var sizeElt = document.createElement( 'span' );
	var au      = document.createElement( 'audio' );
	var li      = document.createElement( 'li' );
	var link    = document.createElement( 'a' );
	var remove  = document.createElement( 'a' );

	// name of .wav file to use during upload and download (without extension)
	var filename = new Date().toISOString();

	// add controls to the <audio> element
	au.controls = true;
	au.src      = url;

	// save to disk link
	link.href      = url;
	link.download  = filename + ".wav"; // download forces the browser to donwload the file using the  filename
	link.innerHTML = "Save to disk (" + (size / 1024 / 1024).toFixed( 2 ) + "MB)";

	sizeElt.setAttribute( 'class', 'size' );
	sizeElt.innerHTML = size;
	sizeElt.style     = "display: none";

	// save to disk link
	remove.href      = '';
	remove.innerHTML = "❌";
	remove.addEventListener(
		"click",
		function(e) {
			e.preventDefault();
			this.parentElement.remove();
		}
	);

	// add the new audio element to li
	li.appendChild( sizeElt );
	li.appendChild( au );

	// add the filename to the li
	li.appendChild( document.createTextNode( filename + ".wav (" + (size / 1024 / 1024).toFixed( 3 ) + " MB)" ) )

	// add the save to disk link to li
	// li.appendChild(link);
	li.appendChild( remove );

	// upload and publish links
	var elts = create_links( blob, filename );

	li.appendChild( document.createTextNode( " " ) )// add a space in between
	li.appendChild( elts.upload )// add the upload link to li
	li.appendChild( elts.publish )// add the publish link to li

	// add the li element to the ol
	var recordingsList = null;
	var found          = false;
	themes.forEach(
		element => {
			try {
				var display = jQuery( '#veep_id_' + element )[0].style.display;
				if ( ! found && display == 'block') {
					recordingsList = jQuery( '#veep_id_' + element + ' #recordingsList' )[0];
					found          = true;
				}
			} catch (e) {
        // I know. A better architecture sould be welcome.
        // These elements don't exist. Just ignore them.
        // Interesting when in vocal or in entretien page.
			}

		}
	);
	recordingsList.appendChild( li );
}
