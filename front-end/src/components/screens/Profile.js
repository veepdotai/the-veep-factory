import { useState, useEffect } from "react";
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';
import { t } from 'src/components/lib/utils'

import GenericForm from '../form/GenericForm';

export default function Profile() {
  const log = Logger.of(Profile.name);


  const [fields, setFields] = useState();

  function setData(topic, message) {
    log.trace("Profile: setFields: ", message);
    setFields(message);
  }

  useEffect(() => {
    PubSub.subscribe("PROFILE", setData)
  }, []);

  return (
    <>
      {
        fields ?
        <GenericForm title={t('Menu.Profile')} data={fields} />
        :
        <></>
      }
    </>
  )

}
