import { useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';
import { t, Utils } from 'src/components/lib/utils'
import { useCookies } from 'react-cookie';

import { Constants } from "src/constants/Constants";

import BaseCodeEditor from './BaseCodeEditor';

export default function JSCodeEditor({source = ""}) {
  const log = (...args) => Logger.of(JSCodeEditor.name).trace(args)

  const [initialValue, setInitialValue] = useState(JSON.stringify(source, null, 2))

  let topics = ["PDF_EXPORT_OPTIONS_UPDATED", "SOURCE_EDITOR_UPDATED"]
  const promptPrefix = "ai-prompt-"
  const [cookies] = useCookies(['JWT'])
  const conf = {
    service: Constants.WORDPRESS_REST_URL + "/?rest_route=/veepdotai_rest/v1/veeplets",
    'token': cookies.JWT,
    'prefix': promptPrefix
  }

  function handleSave(source) {
    log("handleSave: source: ", source)

    let jsonSource = Utils.convert2json(source)
    topics.map((topic, i) => {
      let message = { params: jsonSource }
      log("handleSave: Publishing: topic: ", topic, "message: ", message)
      PubSub.publish(topic, message)
    })
  }

  function handleChange(source) {
    log("handleSave: source: ", source)

    let jsonSource = Utils.convert2json(source)
    topics.map((topic, i) => {
      let message = { params: jsonSource }
      log("handleSave: Publishing: topic: ", topic, "message: ", message)
      PubSub.publish(topic, message)
    })
  }

  function updateSourceEditor(message) {
    log("updateSourceEditor: message: ", message);

    setInitialValue(message.data);
  }

  function init() {
    log("init: source: ", source)
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
      <BaseCodeEditor
        topics={topics}
        language='json'
        initialValue={initialValue}
        action={handleSave}
        onChange={handleChange}
        languageOptions={languageOptions}
        editorPreOptions={editorPreOptions}
        showSaveButton={false}
      />
  )
}