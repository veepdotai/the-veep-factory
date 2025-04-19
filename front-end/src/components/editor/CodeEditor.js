import { useContext, useEffect, useRef, useState } from 'react';
import { loader } from '@monaco-editor/react';
//import { monaco } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next';
import { useCookies } from 'react-cookie';
import TOML from '@iarna/toml';

import PubSub from 'pubsub-js';

import { Constants } from "src/constants/Constants";
import Veeplet from 'src/components/lib/class-veeplet.js';
import { VeepletContext } from 'src/context/VeepletProvider';

import SuspenseClick from '../common/SuspenseClick';
import Loading from '../common/Loading';

/**
 * Monaco options:
 * - https://microsoft.github.io/monaco-editor/playground.html?source=v0.45.0#example-creating-the-editor-hello-world
 * Multi model editor:
 * - https://codesandbox.io/p/sandbox/multi-model-editor-kugi6?file=%2Fsrc%2FApp.js%3A12%2C20
 */
export default function CodeEditor() {
  const log = Logger.of(CodeEditor.name);

  const promptPrefix = "ai-prompt-";

  const [initialValue, setInitialValue] = useState(false);
  const [disabledSaveButton, setDisabledSaveButton] = useState(true);
  const [saving, setSaving] = useState(false);

  const { veeplet, setVeeplet } = useContext(VeepletContext);

  const editorRef = useRef(null);

  const [cookies] = useCookies(['JWT']);

  const conf = {
    service: Constants.WORDPRESS_REST_URL + "/?rest_route=/veepdotai_rest/v1/veeplets",
    'token': cookies.JWT,
    'prefix': promptPrefix
  }

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  /*
  function selectVeeplet(topic, veepNs) {
    log.trace("veepNs (=> veeplet): " + veepNs);
    setVeeplet(veepNs);
  }
  */
  function getFormData(value) {
    var formData = new FormData();
    formData.append('value', value);

    return formData;
  }

  function handleOnChange() {
    setDisabledSaveButton(false)
  }

  function handleSave() {
    setSaving(true);
    let source = editorRef.current.getValue();

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
/*
  function updateSourceEditorListener(topic, message) {
    updateSourceEditor(message);
  }
*/
  function updateSaveButton(message) {
    log.trace("updateSave: " + JSON.stringify(message));
    if (message['result']) {
      setDisabledSaveButton(true)
      setSaving(false);
    } else {
      alert("Can't save the prompt. Take a copy of it if you want to keep it and try again.");

      setDisabledSaveButton(false)
      setSaving(false);
    }
  }

  function updateSaveButtonListener(topic, message) {
    updateSaveButton(message);
  }

  useEffect(() => {
    if (veeplet) {
      Veeplet.load(conf, promptPrefix + veeplet, updateSourceEditor);
    }
  }, [veeplet]);

  useEffect(() => {
    PubSub.subscribe( "POST_PROMPT_OPTION_RESULT", updateSaveButtonListener);

    async function initEditor() {
      loader.config({ monaco });
      const monacoInstance = await loader.init();
      const toml = await import('./languages/toml');
      monacoInstance.languages.register({ id: 'toml' });
      monacoInstance.languages.setLanguageConfiguration('toml', toml.conf);
      monacoInstance.languages.setMonarchTokensProvider('toml', toml.language);
    }

    initEditor();
  }, []);

  return (
    <>
    {
      initialValue ?
        <>
          <p>Veeplet: {veeplet}</p>
          <Editor
            height="50vh"
            defaultLanguage="toml"
            options={{
              wordWrap: "bounded"
            }}
            defaultValue={initialValue}
            onMount={handleEditorDidMount}
            onChange={handleOnChange}
          />
          <SuspenseClick waiting={saving} disabled={disabledSaveButton} handleAction={handleSave} label={t("Menu.Save")} />
        </>
        :
        <>
          <Loading />
        </>
    }
    </>
  );
}
