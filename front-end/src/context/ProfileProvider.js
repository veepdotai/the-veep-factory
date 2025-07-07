import { createContext, useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib';
import { cookies, useCookies } from 'react-cookie';

import { getGenericData } from "src/api/service-fetch"

export const ProfileContext = createContext(null);

export function ProfileProvider ( {children} ) {
    const log = (...args) => Logger.of(ProfileProvider.name).trace(args);

    log("Initialization.")

    const [profile, setProfile] = useState(null);
    const [cookies] = useCookies(['JWT']);

    useEffect(() => {
        // Gets profile
        function initProfile() {
            return getGenericData({
                "topic": "PROFILE", "cookies": cookies, "ns": "mywp", "service": "profile", "setData": setProfile
            });
        }
        
        initProfile();
    },[])

    useEffect(() => {
        if (profile) {
            log('useEffect: profile: ', profile);
            window.uid = profile['user_email'];
            log('useEffect: uid: ' + window.uid);
        }
    }, [profile]);

    return (
        <ProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    )
}