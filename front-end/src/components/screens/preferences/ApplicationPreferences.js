import { useState, useEffect } from "react";
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';
import { t } from 'src/components/lib/utils'

import GenericForm from '../../form/GenericForm';

export default function ApplicationPreferences() {
  const log = Logger.of(ApplicationPreferences.name);

  const [fields, setFields] = useState();

  function setData(topic, message) {
    log.trace("ApplicationPreferences: setFields: " + JSON.stringify(message));
    setFields(message);
  }

  useEffect(() => {
    PubSub.subscribe("APP_PREFERENCES", setData)
  }, []);

  return (
    <>
      {
        fields ?
        <GenericForm title={t('Menu.ApplicationPreferences')} data={fields} />
        :
        <>{t("NoAvailableData")}</>
      }
    </>
  )

}
