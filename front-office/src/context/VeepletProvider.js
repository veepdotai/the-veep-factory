import { createContext, useState, useEffect } from 'react';
import { Logger } from 'react-logger-lib';

export const VeepletContext = createContext(null);

export function VeepletProvider ( {children} ) {
    const log = Logger.of(VeepletProvider.name);
    log.trace("Initialization.")

    const [veeplet, setVeeplet] = useState("");

    return (
        <VeepletContext.Provider value={{ veeplet, setVeeplet }}>
            {children}
        </VeepletContext.Provider>
    )
}