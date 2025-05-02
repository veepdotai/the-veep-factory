import { createContext, useState, useEffect } from 'react';
import { Logger } from 'react-logger-lib';
import { cookies, useCookies } from 'react-cookie';

import PubSub from 'pubsub-js';

import { getGenericData } from "src/api/service-fetch"

export const ThirdPartiesDataContext = createContext(null);

export function ThirdPartiesDataProvider ( {children} ) {
    const log = Logger.of(ThirdPartiesDataProvider.name);
    log.trace("Initialization.")

    const [thirdPartiesData, setThirdPartiesData] = useState({});
    const [cookies] = useCookies(['JWT']);

    function convertSocialNetworksData(data) {
        if (data && data['ai-social-networks-data']) {
            let snd_string = data['ai-social-networks-data'];
            log.trace("convertSocialNetworksData: " + snd_string);
        
            let snd = JSON.parse(snd_string);
            log.trace("snd object in json format: ", snd);
            setThirdPartiesData(snd);
            //PubSub.publish("LINKEDIN_ACCESS_TOKEN", snd);
        }
    }
    
    function getSocialNetworksData(cookies, service) {
        return getGenericData({
            "topic": "SOCIAL_NETWORKS_DATA",
            "cookies": cookies,
            "ns": "options",
            "service": service,
//            "setData": (data) => data && data['ai-social-networks-data'] && setThirdPartiesData(JSON.parse(data['ai-social-networks-data']))
            "setData": convertSocialNetworksData
        });
    }
    
    useEffect(() => {
        //PubSub.publish("LINKEDIN_ACCESS_TOKEN", thirdPartiesData)
    }, [cookies, thirdPartiesData])

    useEffect(() => {
        // Gets user preferences
        getSocialNetworksData(cookies, "ai-social-networks-data");
    }, [cookies])

    return (
        <ThirdPartiesDataContext.Provider value={{ thirdPartiesData, setThirdPartiesData }}>
            {children}
        </ThirdPartiesDataContext.Provider>
    )
}