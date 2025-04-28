import { useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';
import { t } from 'src/components/lib/utils'
import { useCookies } from 'react-cookie';

import { Constants } from "src/constants/Constants";

import BaseCodeEditor from './BaseCodeEditor';

export default function JSCodeEditor({source = ""}) {
  const log = Logger.of(JSCodeEditor.name);

  let topics = ["PDF_EXPORT_OPTIONS_UPDATED", "SOURCE_EDITOR_UPDATED"]

  const promptPrefix = "ai-prompt-";

  const [initialValue, setInitialValue] = useState(JSON.stringify(source, null, 2));

  const [cookies] = useCookies(['JWT']);

  const conf = {
    service: Constants.WORDPRESS_REST_URL + "/?rest_route=/veepdotai_rest/v1/veeplets",
    'token': cookies.JWT,
    'prefix': promptPrefix
  }

  function handleSave(source) {

    function getFormData(value) {
      var formData = new FormData();
      formData.append('value', value);
  
      return formData;
    }

    let jsonSource = JSON.parse(source)
    log.trace("handleSave: source: ", jsonSource)

    topics.map((topic, i) => {
      log.trace("Publishing: topic: ", topic, " with value: ", jsonSource)
      PubSub.publish(topic, jsonSource)
    })

    log.trace("handleSave: source: ", source);
  }

  function updateSourceEditor(message) {
    log.trace("updateSourceEditor: message: ", message);

    setInitialValue(message.data);
  }

  function init() {
    log.trace("init: source: ", source)
    PubSub.subscribe("UPDATE_SOURCE_EDITOR", updateSourceEditor);

    languageOptions = {
      validate: true, // active la validation
      allowComments: false, // permet les commentaires JSON style JS
      enableSchemaRequest: false, // permet de charger des schémas distants
      schemas: [
        {
          uri: "https://veep.ai/schemas/tvf/ccc/pdf-export", // the-veep-factory (tvf) content campaign creator (ccc)
          fileMatch: ["*"],
          schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string" },
                age: { type: "number" },
                infos: { type: "object", required: [], properties: {
                  email: {type: "string", format: "email"} 
                }
              }
            }
          }
        }
      ]
    }
  }

  useEffect(() => {
  }, []);

  let languageOptions = {}
  let editorPreOptions = { jsonDefaults: { diagnosticsOptions: languageOptions }}
  init()
  
  return (
      <BaseCodeEditor topics={topics} language='json' initialValue={initialValue} action={handleSave} languageOptions={languageOptions} editorPreOptions={editorPreOptions} />
  )
}
