import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';

import { Constants } from "src/constants/Constants";

export function getService(cookies, ns, service, method = "GET") {

    const conf = {
        service: Constants.WORDPRESS_REST_URL + '/?rest_route=/veepdotai_rest/v1/' + ns + '/' + service
            + '&JWT=' + cookies.JWT,
        options : {
            'method': method,
            'token': cookies.JWT,
            'mode': 'cors', // no-cors, *cors, same-origin
            'credentials': 'include',
            'Content-Type': 'application/json'
        }
    }

    return conf;
}

export async function getGenericData(params, _conf = null) {
    const log = Logger.of('getGenericData');

    let
      topic = params.topic || null,
      cookies = params.cookies || null,
      ns = params.ns || null,
      service = params.service || null,
      setData = params.setData || null,
      key = params.key || null;

    log.trace(topic + ": " + JSON.stringify(params));
    
    let conf = _conf ? _conf : getService(cookies, ns, service);
    log.trace("conf: " + JSON.stringify(conf));
    
    let result = null;

    //fetch(conf.service, conf.options)
    fetch(conf.service, {...conf.options, "mode": "cors"})
      .then((res) => res?.json())
      .then((data) => {
        log.trace("AppPreferences: " + JSON.stringify(data));
        if (key) {
          result = data[key];
        } else {
          result = data;
        }
        setData(result);
        PubSub.publish(topic, result);
    })

};