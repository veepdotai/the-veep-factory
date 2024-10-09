
import { createContext, useState, useEffect } from 'react';
import { Logger } from 'react-logger-lib';
import { cookies, useCookies } from 'react-cookie';

import { getGenericData } from "src/api/service-fetch"

export const UserPreferencesContext = createContext(null);

export function UserPreferencesProvider ( {children} ) {
    const log = Logger.of(UserPreferencesProvider.name);
    log.trace("Initialization.")

    const [userPrefs, setUserPrefs] = useState({});
    const [cookies] = useCookies(['JWT']);

    useEffect(() => {
        // Gets user preferences
        function initUserPreferences() {
            return getGenericData({
            "topic": "USER_PREFERENCES", "cookies": cookies, "ns": "user_prefs", "service": "prefs", "setData": setUserPrefs
            });
        }

        initUserPreferences();
    },[])

    return (
        <UserPreferencesContext.Provider value={{ userPrefs, setUserPrefs }}>
            {children}
        </UserPreferencesContext.Provider>
    )
}