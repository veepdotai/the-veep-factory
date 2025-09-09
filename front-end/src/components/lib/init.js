import { Logger } from 'react-logger-lib';

import { Constants } from "src/constants/Constants"
import initAppJSLogs from './init-logs.js'
import { pushState } from './utils-analytics.js';

import defaultUserAppConfig from './default-user-app-config.json'

export default function initVeepdotaiApp(setCookie, setDone) {
    const log = Logger.of(initVeepdotaiApp.name);

    /**
     * Updates constants to the situation (localhost or anything else)
     * 
     * @param {*} window 
     */
    function initConstants(window) {
        if (Constants.WORDPRESS_URL == null) {
            Constants.WORDPRESS_URL = window.location.protocol + '//' + window.location.host
        }
        alert("initConstants: Constants.WORDPRESS_URL: " + Constants.WORDPRESS_URL);

        if (Constants.ROOT == null) {
            Constants.ROOT = window.location.hostname == 'localhost' ? '': window.location.pathname
        }
        alert("initConstants: Constants.ROOT: " + Constants.ROOT);

        if (Constants.APP_URL == null) {
            if (window.location.hostname == 'localhost') {
                Constants.APP_URL = 'http://' + window.location.host // host includes port number 
            } else {
                Constants.APP_URL = Constants.WORDPRESS_URL + Constants.ROOT;
            } 
        }
        alert("initConstants: Constants.APP_URL: " + Constants.APP_URL);

        log.trace("initConstants: Constants.ROOT: " + Constants.ROOT + " / " + window.location.hostname);

        if (Constants.WORDPRESS_REST_URL == null) {
            Constants.WORDPRESS_REST_URL = Constants.WORDPRESS_URL;
        }

        if (Constants.WORDPRESS_GRAPHQL_ENDPOINT == null) {
            Constants.WORDPRESS_GRAPHQL_ENDPOINT = Constants.WORDPRESS_URL + '/graphql';
        }

        if (Constants.LINKEDIN_CLIENT_REDIRECT_URI == null) {
            Constants.LINKEDIN_CLIENT_REDIRECT_URI = Constants.APP_URL + '/linkedin';
        }

        if (Constants.COVER_URL == null) {
            Constants.COVER_URL = Constants.WORDPRESS_URL + "/prefs/cover";
        }

        if (Constants.CATALOG_CARD_HEIGHT == null) {
            Constants.CATALOG_CARD_HEIGHT = "110";
        }

        if (Constants.CATALOG_CARD_WIDTH == null) {
            Constants.CATALOG_CARD_WIDTH = { className: 'pb-2', xs: 12, md: 6, lg: 3, xl: 3};
        }

        if (Constants.CATALOG_PROMPT_WIDTH == null) {
            Constants.CATALOG_PROMPT_WIDTH = "225px";
        }

        if (Constants.CATALOG_PROMPT_HEADER_WIDTH == null) {
            Constants.CATALOG_PROMPT_HEADER_WIDTH = "223px";
        }

        if (Constants.INITIAL_PROCESS_DURATION == null) {
            Constants.INITIAL_PROCESS_DURATION = "600";
        }

        if (Constants.DEFAULT_USER == null) {
            Constants.DEFAULT_USER = "demo";
        }

        if (Constants.DEFAULT_USER_APP_CONFIG == null) {
            Constants.DEFAULT_USER_APP_CONFIG = defaultUserAppConfig
            log.trace("initConstants: Constants.DEFAULT_USER_APP_CONFIG:", Constants.DEFAULT_USER_APP_CONFIG)
        }

        return Constants;
    }

    /**
     * 
     * @param {*} analyticsJSContainer 
     */
    function initAnalytics(analyticsJSContainer) {
        log.trace("initAnalytics: Matomo injection: Container: " + analyticsJSContainer);

        var _mtm = window._mtm = window._mtm || [];
        _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
        (function() {
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.async=true; g.src=analyticsJSContainer; s.parentNode.insertBefore(g,s);
        })();
    }

    /**
     * 
     * @param {*} wls stands for window.location.search 
     */
    function initCookies(wls, setCookie, setDone) {
        /* Cookies management */
        let JWT = (new URLSearchParams(wls))?.get('JWT');
        log.trace('JWT (in searchParams) before setting JWT cookie: '+ JWT);
        if (JWT) {
            // There is a JWT in the request. Store it in a cookie
            log.trace("App: connected with JWT param")

            // We reload the page to get rid of the JWT parameter which 
            // could be stolen to connect on the behalf of the user.
            // Ideally, this JWT should be a very short one (10s, 30s,
            // 1 min max?).
            setCookie('JWT', cookie.JWT, {
                path: '/',
                maxAge: 60*60*24
            });
    
            let origin = window.location.toString();
            let newOrigin = origin.substring(0, origin.indexOf('?'))
            window.location.hash = "#";
            //pushState("#login");
        }
    }

    /* Prevent use of back button */
    function initListeners() {

        function handleBack(e) {
            e.preventDefault();
            window.confirm("Are you sure you want to quit the application?");
        };
        window.onbeforeunload = handleBack;
        window.onpagehide = handleBack;

        window.onhashchange = (e) => {
            let h = window.location.hash;
            log.trace('hashchange event fired.');
            log.trace('hashchange: uid: ' + window.uid);
            log.trace('hash: ' + h);

            _mtm.push({
                'customPageUrl': '/' + h,
                'customPageTitle': 'Veep.AI App / ' + h,
                'userId': window.uid
            })
            
            /*
            _paq.push(['setUserId', window.uid]);
            _paq.push(['setCustomUrl', '/' + h]);
            _paq.push(['setDocumentTitle', 'Veep.AI App / ' + h]);
            _paq.push(['trackPageView']);
            */
        };
    }

    initAppJSLogs(Constants.PRODUCTION ? 'TRACE': 'TRACE');
    initAnalytics(Constants.ANALYTICS_JS_CONTAINER);
    initCookies(window.location.search, setCookie, setDone);
    initListeners(window);
    //initAppJSLogs(Constants.PRODUCTION ? 'NONE': 'NONE');
    initConstants(window);
}
