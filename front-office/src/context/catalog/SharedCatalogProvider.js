import { createContext, useState, useEffect } from 'react';
import { Logger } from 'react-logger-lib';

export const SharedCatalogContext = createContext(null);

export function SharedCatalogProvider ( {children} ) {
    const log = Logger.of(SharedCatalogProvider.name);
    log.trace("Initialization.")

    const [sharedCatalog, setSharedCatalog] = useState("");

    return (
            <SharedCatalogContext.Provider value={{ sharedCatalog, setSharedCatalog }}>
                {children}
            </SharedCatalogContext.Provider>
    )
}