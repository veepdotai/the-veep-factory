'use client';

import { useEffect, useState } from 'react';
import { useCookies, CookiesProvider } from 'react-cookie';
import { Logger } from 'react-logger-lib';

import 'src/styles/global.css';
import "src/styles/video-react.css";

import VeepProvider from  "src/context/VeepProvider"
import initVeepdotaiApp from "src/components/lib/init"
import { getGenericData } from "src/api/service-fetch"
import { Utils } from "src/components/lib/utils"

import Index from './index';
import { Constants } from "src/constants/Constants"
import FirstLoading from "src/components/common/FirstLoading"

//export default function App({ Component, pageProps }) {
export default function App() {
  const log = Logger.of(App.name);

  const [cookies, setCookie] = useCookies(['JWT']);
  const [done, setDone] = useState(false);
  const [appPrefs, setAppPrefs] = useState(null);

  // Gets app preferences
  function getAppPreferences() {
    return getGenericData({
      "topic": "APP_PREFERENCES", "cookies": cookies, "ns": "app_prefs", "service": "prefs", "setData": setAppPrefs
    });
  }
  
  useEffect(() => {
    if (done) {

      log.trace("Initialization");
      initVeepdotaiApp(setCookie, setDone);
      log.trace("getAppPreferences");
      getAppPreferences();
      
      window._mtm = _mtm || []; 
      window.uid = "";
    }
  }, [done])

  useEffect(() => {
    log.trace("Cookies: " + JSON.stringify(cookies));
    if (cookies?.JWT) {
      log.trace("Cookies JWT: " + JSON.stringify(cookies.JWT));
      if (! Utils.isCookieValid(cookies.JWT)) {
        window.location = Constants.WORDPRESS_URL + '/wp-login.php';
      } else {
        log.trace("=> setDone: true");
        setDone(true);
      }
    } else {
      window.location = Constants.WORDPRESS_URL + '/wp-login.php';
    }
  }, [cookies]);

  return (
    <CookiesProvider>
      {done ?
        <VeepProvider appPrefs={appPrefs} setAppPrefs={setAppPrefs}>
           <Index />
        </VeepProvider>
        :
        <FirstLoading />
      }
    </CookiesProvider>
  );
}
