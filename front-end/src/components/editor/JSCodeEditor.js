import { useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';
import { t, Utils } from 'src/components/lib/utils'
import { useCookies } from 'react-cookie';

import { Constants } from "src/constants/Constants";

import BaseCodeEditor from './BaseCodeEditor';

export default function JSCodeEditor({source = ""}) {
  const log = (...args) => Logger.of(JSCodeEditor.name).trace(args);

  let topics = ["PDF_EXPORT_OPTIONS_UPDATED", "SOURCE_EDITOR_UPDATED"]

  const promptPrefix = "ai-prompt-";

  let initVal = ""
  try {
    initVal = "" !== source ? JSON.stringify(source, null, 2) : ""
  } catch (e) {
    log("Exception while initializing editor from content stored in database: ", e)
    alert("initVal: exception: " + e + ". source: " + JSON.stringify(source) + "can't be loaded as json")
  }

  log("initVal: ", initVal)
  const [initialValue, setInitialValue] = useState(initVal);

  const [cookies] = useCookies(['JWT']);

  const conf = {
    service: Constants.WORDPRESS_REST_URL + "/?rest_route=/veepdotai_rest/v1/veeplets",
    'token': cookies.JWT,
    'prefix': promptPrefix
  }

  function handleSave(source) {

    log("handleSave: source: ", source)
    function getFormData(value) {
      var formData = new FormData();
      formData.append('value', value);
  
      return formData;
    }

    if (! source || source === "") {
      log("handleSave: source is empty but it can't. It must contain a valid JSON configuration file for the PDF component to display its content with your layout")
    } else {
      let jsonSource = null
      try {
        jsonSource = JSON.parse(source)
        log("handleSave: jsonSource: ", jsonSource)

        if (jsonSource) {
          topics.map((topic, i) => {
            let message = {params: jsonSource}
            log("handleSave: publishing: topic: ", topic, " with value: ", message)
            PubSub.publish(topic, message)
          })
        }
      } catch (e) {
        // Publish this error somewhere for the user to know there is a problem
        alert("handleSave: exception: " + e + ". Your source is not valid. It can't be loaded as json.")
        Utils.notifyError("handleSave: exception: " + e + ". Your source is not valid. It can't be loaded as json.")
        log("handleSave: exception: ", e, "source: ", source)
      }
    }
  }

  function updateSourceEditor(message) {
    log("updateSourceEditor: message: ", message);

    setInitialValue(message.data);
  }

  function init() {
    log("init: source: ", source)
    PubSub.subscribe("UPDATE_SOURCE_EDITOR", updateSourceEditor);

    languageOptions = {
      validate: true,             // enables schema validation
      allowComments: false,       // not standard: allows JS comments like // or /* */
      enableSchemaRequest: false, // enables to remote schema loading
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
        languageOptions={languageOptions}
        editorPreOptions={editorPreOptions}
        showSaveButton={false}
      />
  )
}
