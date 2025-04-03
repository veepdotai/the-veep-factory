import { createContext, useState, useEffect } from 'react';
import { Logger } from 'react-logger-lib';

export const ContentIdContext = createContext(null);

export function ContentIdProvider({ children }) {
    const log = Logger.of(ContentIdProvider.name);
    log.trace("Initialization.")

    const [contentId, setContentId] = useState();

    return (
        <ContentIdContext.Provider value={{ contentId, setContentId }}>
            {children}
        </ContentIdContext.Provider>
    )
}