import { useState, useEffect } from "react";
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';
import { t } from "src/components/lib/utils";

import GenericForm from '../../form/GenericForm';

export default function UserPreferences() {
  const log = Logger.of(UserPreferences.name);

  const [fields, setFields] = useState();

  function setData(topic, message) {
    log.trace("UserPreferences: setFields: ", message);
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
