import { Logger } from 'react-logger-lib';

import styles from './NativeColorPicker.module.css';

export default function NativeColorPicker({varName, veepletName, handleClick}) {
    const log = Logger.of(NativeColorPicker.name);

    function handleAction(e) {
        let color = e.target.value;
        log.trace('handleAction: color: ' + color);
        PubSub.publish( "VEEPLET_COLOR_CHANGED_" + veepletName, color);
    }

    return (
        <input id={`${varName}`} className={styles.roundedSquare} type="color" onChange={handleClick}/>
    )
}
