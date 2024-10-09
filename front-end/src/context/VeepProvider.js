/**
 * The user context is composed of the following elements:
 * - ProfileContext
 * - UserPreferencesContext
 * - AppPreferencesContext (according the profile and the corresponding roles the user has)
 */
import { useState } from 'react';
import { Logger } from 'react-logger-lib';

import { AppPreferencesProvider } from './AppPreferencesProvider';
import { ProfileProvider } from './ProfileProvider';
import { UserPreferencesProvider } from './UserPreferencesProvider';
import { ThirdPartiesDataProvider } from './ThirdPartiesDataProvider';
import { SharedCatalogProvider } from './catalog/SharedCatalogProvider';
import { PersonalCatalogProvider } from './catalog/PersonalCatalogProvider';
import { VeepletProvider } from './VeepletProvider';
import { ContentIdProvider } from './ContentIdProvider';

export default function VeepProvider ( { children, appPrefs, setAppPrefs } ) {
    const log = Logger.of(VeepProvider.name);
    log.trace("Initialization.")
    
    const [ profile, setProfile ] = useState();
    const [ userPrefs, setUserPrefs ] = useState();
    const [ thirdPartiesData, setThirdPartiesData ] = useState();
    const [ sharedCatalog, setSharedCatalog ] = useState();
    const [ personalCatalog, setPersonalCatalog ] = useState();
    const [ veeplet, setVeeplet ] = useState();
    const [ contentId, setContentId ] = useState();

    return (
        <AppPreferencesProvider value={{ appPrefs, setAppPrefs}}>
            <ProfileProvider value={{ profile, setProfile }}>
                <UserPreferencesProvider value={{ userPrefs, setUserPrefs }}>
                    <ThirdPartiesDataProvider value={{ thirdPartiesData, setThirdPartiesData }}>
                        <SharedCatalogProvider value={{ sharedCatalog, setSharedCatalog }}>
                            <PersonalCatalogProvider value={{ personalCatalog, setPersonalCatalog }}>
                                <VeepletProvider value={{ veeplet, setVeeplet }}>
                                    <ContentIdProvider value={{ contentId, setContentId }}>
                                        {children}
                                    </ContentIdProvider>
                                </VeepletProvider>
                            </PersonalCatalogProvider>
                        </SharedCatalogProvider>
                    </ThirdPartiesDataProvider>
                </UserPreferencesProvider>
            </ProfileProvider>
        </AppPreferencesProvider>
    )
}