import { createContext, useState, useEffect } from 'react';
import { Logger } from 'react-logger-lib';

export const PersonalCatalogContext = createContext(null);

export function PersonalCatalogProvider ( {children} ) {
    const log = Logger.of(PersonalCatalogProvider.name);
    log.trace("Initialization.")

    const [personalCatalog, setPersonalCatalog] = useState("");

    return (
            <PersonalCatalogContext.Provider value={{ personalCatalog, setPersonalCatalog }}>
                {children}
            </PersonalCatalogContext.Provider>
    )
}