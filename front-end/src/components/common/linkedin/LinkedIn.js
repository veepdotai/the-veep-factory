'use client'

import { useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib';
import { useCookies } from 'react-cookie';
/* https://www.linkedin.com/developers/tools/oauth/token-generator */
import { useLinkedIn } from 'react-linkedin-login-oauth2';

import { t } from 'i18next';
//import {alert} from 'react-bootstrap-confirmation';

import { Constants } from "src/constants/Constants";
import LinkedInOps from './LinkedInOps';
import SuspenseClick from '../SuspenseClick';

export default function LinkedIn() {
  const log = Logger.of(LinkedIn.name);

  log.trace("Constants: " + JSON.stringify(Constants));
  const [cookies] = useCookies(['JWT']);
  const [waiting, setWaiting] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [key, setKey] = useState(0)

  const redirectUri = Constants.LINKEDIN_CLIENT_REDIRECT_URI || `${typeof window === 'object' && window.location.origin}/linkedin`
  log.trace("useLinkedIn: redirectUri: " + redirectUri);
  const { linkedInLogin } = useLinkedIn({
    clientId: Constants.LINKEDIN_CLIENT_ID,
    scope: Constants.SCOPE,
    redirectUri: redirectUri,
    onSuccess: (code) => {
      log.trace("useLinkedIn: setKey: key: " + key);
      setKey(key + 1)
      log.trace("useLinkedIn: onSuccess: code: " + code);
      PubSub.publish("LINKEDIN_SIGNIN_RESULT", code)
      
      let oauthUrl = Constants.WORDPRESS_REST_URL + "/wp-json/veepdotai_rest/v1/oauth/?"
                      + "&code=" + code
                      + "&JWT=" + cookies.JWT
                      + "&redirectUri=" + redirectUri
      log.trace("useLinkedIn: local oauthUrl: " + oauthUrl)
      return fetch(oauthUrl)
        .then((res) => {
          return res.json()
        })
        .then((data) => {
          log.trace("/wp-json/veepdotai_rest/v1/oauth/: data: ", data) 
          PubSub.publish("LINKEDIN_SIGNIN_RESULT", data)
        });
    },
    onError: (error) => {
      log.trace("Error: " + JSON.stringify(error));
      //PubSub.publish("LINKEDIN_SIGNIN_RESULT", false);
    },
  });

  function handleLinkedInLogin(topic, data) {
    linkedInLogin();
  }

  function updateButtons(topic, accessToken) {
    log.trace(topic + ": accessToken: " + accessToken)
    if (! accessToken) {
      alert(t("LinkedInSignInKO"));
    }
    setWaiting(false);
    setDisabled(false);
  }

  useEffect(() => {
    PubSub.subscribe("LINKEDIN_SIGNIN_RESULT", updateButtons);
    PubSub.subscribe("LINKEDIN_LOGIN_ACTION", handleLinkedInLogin);

    /*
    PubSub.publish("LINKEDIN_SIGNIN_RESULT", Constants.ACCESS_TOKEN);
    setWaiting(false)
    setDisabled(true)
    */
  }, []);

  return (
    <div key={key}>
      <SuspenseClick waiting={waiting} disabled={disabled} handleAction={linkedInLogin} label={t("SignInLinkedIn")} />
      {/*<Button onClick={linkedInLogin}>{t("SignInLinkedIn")}</Button>*/}
    </div>

  );
}