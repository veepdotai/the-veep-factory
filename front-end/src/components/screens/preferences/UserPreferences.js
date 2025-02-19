import { useState, useEffect } from "react";
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';
import { t } from "i18next";

import GenericForm from '../../form/GenericForm';

export default function UserPreferences() {
  const log = Logger.of(UserPreferences.name);

  const [fields, setFields] = useState();

  function setData(topic, message) {
    log.trace("UserPreferences: setFields: " + JSON.stringify(message));
    setFields(message);
  }

  useEffect(() => {
    PubSub.subscribe("USER_PREFERENCES", setData)
  }, []);

  return (
    <>
      {
        fields ?
          <GenericForm title={t('Menu.UserPreferences')} data={fields} />
        :
          <>{t("NoAvailableData")}</>
      }
    </>
  )

}
