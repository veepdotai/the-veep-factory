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

  const { linkedInLogin } = useLinkedIn({
    clientId: Constants.LINKEDIN_CLIENT_ID,
    scope: Constants.SCOPE,
    redirectUri: Constants.REDIRECT_URL, // for Next.js, you can use `${typeof window === 'object' && window.location.origin}/linkedin`
    //redirectUri: `${window.location.origin}/linkedin`, // for Next.js, you can use `${typeof window === 'object' && window.location.origin}/linkedin`
    //redirectUri: `http://localhost/wp-content/plugins/veepdotai_publish_social/callback.php`, // for Next.js, you can use `${typeof window === 'object' && window.location.origin}/linkedin`
    //redirectUri: `http://localhost/wp-json/veepdotai_rest/v1/oauth/`, // for Next.js, you can use `${typeof window === 'object' && window.location.origin}/linkedin`
    onSuccess: (code) => {
      log.trace("useLinkedIn: onSuccess: code: " + code);
      fetch(Constants.WORDPRESS_REST_URL + "/wp-json/veepdotai_rest/v1/oauth/?"
              + "&code=" + code
              + "&JWT=" + cookies.JWT)
        .then((res) => {
          return res.json()
        }).then((data) => {
          log.trace("/wp-json/veepdotai_rest/v1/oauth/: access_token: " + data.linkedin?.access_token); 
          PubSub.publish("LINKEDIN_SIGNIN_RESULT", data.linkedin?.access_token);
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
  }, []);

  return (
    <>
      <SuspenseClick waiting={waiting} disabled={disabled} handleAction={linkedInLogin} label={t("SignInLinkedIn")} />
      {/*<Button onClick={linkedInLogin}>{t("SignInLinkedIn")}</Button>*/}
    </>

  );
}