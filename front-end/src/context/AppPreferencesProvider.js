import { createContext, useState } from 'react';
import { Logger } from 'react-logger-lib';

export const AppPreferencesContext = createContext(null);

export function AppPreferencesProvider ( {children, appPrefs, setAppPrefs} ) {
    const log = Logger.of(AppPreferencesProvider.name);
    log.trace("Initialization.")

/*
    const [appPrefs, setAppPrefs] = useState({});
 
    useEffect(() => {
        // Gets app preferences
        function getAppPreferences() {
            return getGenericData({
            "topic": "APP_PREFERENCES", "cookies": cookies, "ns": "app_prefs", "service": "prefs", "setData": setAppPrefs
            });
        }

        getAppPreferences();
    },[])
*/
    return (
        <AppPreferencesContext.Provider value={{ appPrefs, setAppPrefs }}>
            {children}
        </AppPreferencesContext.Provider>
    )
}