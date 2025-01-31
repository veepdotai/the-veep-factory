'use client';

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Logger } from "react-logger-lib";

import Loading from "../../components/common/Loading";
import { Constants } from "@/constants/Constants";

export default function Redirect() {
    const log = Logger.of(Redirect.name);

    const [cookie, setCookie] = useCookies(['JWT']);
    const [done, setDone] = useState(false);

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

            // We reload the page to get rid of the JWT parameter which could be stolen to connect
            // on the behalf of the user. Ideally, this JWT should be a very short one (10s, 30s, 1 min max?).
            setCookie('JWT', JWT, {
                path: '/',
                maxAge: 60*60*24
            });

        }
    }

    useEffect(() => {
        if (done) {
            window.location.href = Constants.APP_URL;
        }
    }, [done])

    useEffect(() => {
        if (cookie?.JWT) {
            setDone(true);
        }
    }, [cookie])

    useEffect(() => {
        initCookies(window.location.search, setCookie, setDone);
    }, [])

    return (
        <>
            <Loading />
        </>
    )
}