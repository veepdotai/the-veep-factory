import { useContext, useEffect, useRef, useState } from 'react';
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';
import { t } from 'src/components/lib/utils'
import { useCookies } from 'react-cookie';
import TOML from '@iarna/toml';

import { Constants } from "src/constants/Constants";
import Veeplet from 'src/components/lib/class-veeplet.js';
import { VeepletContext } from 'src/context/VeepletProvider';

import BaseCodeEditor from './BaseCodeEditor';
const driver = await import(`./languages/toml`);

export default function VeepletCodeEditor() {
  const log = Logger.of(VeepletCodeEditor.name);

  const promptPrefix = "ai-prompt-";

  let topic = "POST_PROMPT_OPTION_RESULT"

  const [initialValue, setInitialValue] = useState(false);
  const { veeplet, setVeeplet } = useContext(VeepletContext);
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
    
    log.trace("handleSave: source: " + source);
    let veepletJson = TOML.parse(source);

    let o = new Veeplet(JSON.stringify(veepletJson));
    let newName = o.getChainId();
    
    log.trace("handleSave: newName: " + newName);

    // Replacing \n with #EOL# and not <EOL> because of sanitize instruction
    source = source.replace(/\n/g, "#EOL#");
    let fd = getFormData(source);

    if (veeplet == newName) {
      log.trace("handleSave: name hasn't changed.");
      Veeplet.save(fd, conf, veeplet);
    } else {
      // Part of veeplet name (orgId, category, subcategory, name) changed.
      // veeplet contains the previous name. It must be removed so we add the
      // oldName
      log.trace("handleSave: name has changed.");
      fd.append("oldName", veeplet);
      Veeplet.save(fd, conf, newName);
    }

    // Updating the veeplet should rerender the CodeEditor component
    setVeeplet(newName);
  }

  function updateSourceEditor(message) {
    log.trace("updateSourceEditor: message: " + JSON.stringify(message));

    let optionName = promptPrefix;
    if (! veeplet ) {
      optionName = Object.keys(message)[0] ;
    } else {
      optionName += veeplet ;
    }
    log.trace("updateSourceEditor: optionName: " + optionName);

    if (message[optionName]) {
      let source = message[optionName];
      log.trace("updateSourceEditor: message[optionName]: " + source);

      source = (source + "").replace(/#EOL#/g, "\n");
      log.trace("updateSourceEditor: setting initialValue: " + source);

      // We should normally explore the message.option but there is currently only one...
      setInitialValue(source);
    } else {
      log.trace("updateSourceEditor: setting initialValue: ''.");

      let data = "New file: " + optionName;

      setInitialValue(data);
    }
  }

  useEffect(() => {
    if (veeplet) {
      Veeplet.load(conf, promptPrefix + veeplet, updateSourceEditor);
    }
  }, [veeplet]);

  return (
      <BaseCodeEditor topic={topic} language='toml' driver={driver} initialValue={initialValue} action={handleSave} />
  )
}
