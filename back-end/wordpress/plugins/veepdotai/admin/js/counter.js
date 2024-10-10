/**
 * Counter up timer
 */
var minutesLabel = document.getElementById( "minutes" );
var secondsLabel = document.getElementById( "seconds" );
var totalSeconds = 0;
setInterval( setTime, 1000 );
pauseTimer = true;

function setTime() {
	if ( ! pauseTimer) {
		++totalSeconds;
		secondsLabel.innerHTML = pad( totalSeconds % 60 );
		minutesLabel.innerHTML = pad( parseInt( totalSeconds / 60 ) );
	}
}

function pad(val) {
	var valString = val + "";
	if (valString.length < 2) {
		return "0" + valString;
	} else {
		return valString;
	}
}
/* End counter up timer */
