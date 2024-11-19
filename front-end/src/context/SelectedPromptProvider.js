import { createContext, useState, useEffect } from 'react';
import { Logger } from 'react-logger-lib';

export const SelectedPromptContext = createContext(null);

export function SelectedPromptProvider ( {children} ) {
    const log = Logger.of(SelectedPromptProvider.name);
    log.trace("Initialization.")

    const [selectedPrompt, setSelectedPrompt] = useState();

    return (
        <SelectedPromptContext.Provider value={{ selectedPrompt, setSelectedPrompt }}>
            {children}
        </SelectedPromptContext.Provider>
    )
}