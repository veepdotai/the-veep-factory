/**
 * Analytics functions
 */

function getQueryString() {
    //return window.location.href.replace(/^[^#]*\?[^\?]*(.*)/, "$1");
    return window.location.href.replace(/[^\?]*(.*)/, "$1");
}

function getHrefExceptQueryString() {
    return window.location.href.replace(/([^\?]*).*/, "$1");
}

function getHrefExceptQueryStringAndHash() {
    return getHrefExceptQueryString().replace(/(#.*)$/, "");
}

function getNewLocation(hash) {
    return getHrefExceptQueryStringAndHash() + "#" + hash + getQueryString();
}

function pushState(_hash) {
    let hash = null;
    if (_hash.indexOf("#") == -1) {
        hash = _hash;
    } else {
        hash = _hash.substring(1, _hash.length);
    }
    let newLocation = getNewLocation(hash);
    window.location = newLocation; // to generate an hashchange event
    //history.pushState({ source: hash}, "", newLocation);
}

export { getQueryString, getHrefExceptQueryString, getNewLocation, pushState };