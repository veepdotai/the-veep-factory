'use client'

import { useContext, useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib';
/* https://www.linkedin.com/developers/tools/oauth/token-generator */
import { useLinkedIn } from 'react-linkedin-login-oauth2';
import { useCookies } from 'react-cookie';
import { t } from 'src/components/lib/utils'

import { getGenericData } from "src/api/service-fetch"
import { ThirdPartiesDataContext } from 'src/context/ThirdPartiesDataProvider';

import LinkedInOps from './LinkedInOps';
import GenericForm from '../../form/GenericForm';

export default function LinkedInStatus() {
  const log = Logger.of(LinkedInStatus.name);
  log.trace("Initialization");

  const { thirdPartiesData, setThirdPartiesData } = useContext(ThirdPartiesDataContext);
  const [ linkedInData, setLinkedInData ] = useState(thirdPartiesData?.linkedin);

//  const [socialNetworksData, setSocialNetworksData] = useState();
  const [cookies] = useCookies(['JWT']);
/*
  function getData(accessToken) {
    const REST = 86400 * 1000; // Number of ms in one day
    log.trace("useEffect / getData");

    if (Math.round(Date.now()/1000) > (socialNetworksData.linkedin.expires_at + REST)) {
      
      // 1 day before expiration
      fetch(Constants.WORDPRESS_REST_URL + "/wp-json/veepdotai_rest/v1/oauth/introspectToken"
      + "?access_token=" + accessToken
      + "&JWT=" + cookies.JWT)
      .then((res) => {
        return res.json()
      }).then((data) => {
        log.trace(JSON.stringify(data));
        let snd = socialNetworksData;
        snd.linkedin = data;
        setThirdPartiesData(snd);
      });
    }
  }

  function convertSocialNetworksData(data) {
    let snd_string = data['ai-social-networks-data'];
    log.trace("convertSocialNetworksData: " + snd_string);

    let snd = JSON.parse(snd_string);
    log.trace("snd object in json format: " + JSON.stringify(snd));
    setThirdPartiesData(snd);
  }

  function getSocialNetworksData(cookies, service) {
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
      getSocialNetworksData(cookies, "ai-social-networks-data");
    }
  }
 */

  function updateLinkedInData(topic, data) {
    log.trace("updateLinkedInData: " + JSON.stringify(data));
    setLinkedInData(data?.linkedin);
  }

  /**
   * Get data from the database
   */
  useEffect(() => {
    log.trace("useEffect: " + JSON.stringify(thirdPartiesData));
    setLinkedInData(thirdPartiesData?.linkedin);
    //PubSub.subscribe("UPDATE_SOCIAL_NETWORKS_DATA", updateSocialNetworksData);
    //PubSub.subscribe("LINKEDIN_SIGNIN_RESULT", updateSocialNetworksData);

    PubSub.subscribe("LINKEDIN_ACCESS_TOKEN", updateLinkedInData);

    //log.trace("getSocialNetworksData");
    //getSocialNetworksData(cookies, "ai-social-networks-data");
  }, [thirdPartiesData]);

  return (
    <>
      {linkedInData ?
        <>
          Data:
          <GenericForm title={t('Menu.ApplicationPreferences')} data={linkedInData} />
        </>
        :
        <>{t("NoDataAvailable")}</>
      }
    </>

  );
}