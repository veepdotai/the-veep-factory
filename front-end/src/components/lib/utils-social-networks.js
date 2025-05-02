/**
 * Social Networks Utils
 * Used only for LinkedIn for the moment.
 */

function convertSocialNetworksData(data) {
    let snd_string = data['ai-social-networks-data'];
    log.trace("convertSocialNetworksData: " + snd_string);
  
    let snd = JSON.parse(snd_string);
    log.trace("snd object in json format: ", snd);
    setSocialNetworksData(snd);
}
  
function getSocialNetworksData(service) {
    return getGenericData({
      "topic": "SOCIAL_NETWORKS_DATA",
      "cookies": cookies,
      "ns": "options",
      "service": service,
      "setData": convertSocialNetworksData
    });
}
  
function updateSocialNetworksData(topic, accessToken) {
    log.trace(topic + ": updateSocialNetworksData: accessToken: " + accessToken);
    if (accessToken) {
      //getData(accessToken);
      getSocialNetworksData("ai-social-networks-data");
    }
}
