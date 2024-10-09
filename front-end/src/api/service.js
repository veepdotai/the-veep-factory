import { Logger } from 'react-logger-lib';


    // index.js
  async function postData(url = "", data = {}) {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",                   // no-cors, *cors, same-origin
      cache: "no-cache",              // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin",     // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",             // manual, *follow, error
      referrerPolicy: "no-referrer",  // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json();
  }

  // Cover.js
  async function getData(topic, data) {
    const prefix = Constants.WORDPRESS_REST_URL + "/?rest_route=/veepdotai_rest/v1";
    const token = "&JWT=" + cookies.JWT;
    let service = prefix + "/options/get-app-prefs" + param + token; 
    log.info("Service: " + service);

    try {
      const res = await fetch(service);
      if (!res.ok) {
        throw new Error("Network response was not OK");
      }
      setCoverUrl(res.data.coverUrl);
    } catch (e) {
      log.error("getData: " + e);
      setCoverUrl(false);
    }

  }
