import { Logger } from 'react-logger-lib';

import AppPreferences from './preferences/ApplicationPreferences';

export default function AppParameters() {
    const log = Logger.of(AppParameters.name);

    return (
        <AppPreferences id="app-parameters" />
    )
}