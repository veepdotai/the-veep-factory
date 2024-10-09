import { useState } from "react";
import { Logger } from 'react-logger-lib';
import IconPicker from "react-icons-picker";
import PubSub from 'pubsub-js';

import styles from "./ReactIconsPicker.module.css";

export default function ReactIconsPicker( { veepletName, handleClick2 }) {
  const log = Logger.of(ReactIconsPicker.name);

  const [iconName, setIconName] = useState("FcImageFile");

  function handleClick(iconName) {
    log.trace('handleAction: iconName: ' + iconName);

    setIconName(iconName);

    PubSub.publish("VEEPLET_ICON_CHANGED_" + veepletName, iconName);
  }

  return (
      <>
        <IconPicker pickButtonStyle={{ border: "0", cursor: "pointer", padding: "10px 0px 10px 10px"}} value={iconName} onChange={handleClick} />
      </>
  )
};
