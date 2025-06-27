import { useEffect, useRef, useState } from 'react';
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';
import { t, Utils, guv } from 'src/components/lib/utils'

//import { loader } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';

import SuspenseClick from '../common/SuspenseClick';
import Loading from '../common/Loading';

/**
 * Monaco options:
 * - https://microsoft.github.io/monaco-editor/playground.html?source=v0.45.0#example-creating-the-editor-hello-world
 * Multi model editor:
 * - https://codesandbox.io/p/sandbox/multi-model-editor-kugi6?file=%2Fsrc%2FApp.js%3A12%2C20
 */
export default function 
BaseCodeEditor({
    topics = [],
    language,
    initialValue,
    action = null,
    onChange = null,
    driver = null,
    width = null,
    height = null,
    editorPostOptions = {},
    languageOptions = {},
    showSaveButton = true}
  ) {

  const log = (...args) => Logger.of(BaseCodeEditor.name).trace(args);

  const _guv = (name) => guv("BaseCodeEditor_" + name);

  let _width = width ? width : _guv("WIDTH")
  let _height = height ? height : _guv("HEIGHT")

  const [disabledSaveButton, setDisabledSaveButton] = useState(true);
  const [saving, setSaving] = useState(false);

  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    //editor.getAction('editor.action.formatDocument').run()

    if (driver) {
      monaco.languages.register({ id: language });
      monaco.languages.setLanguageConfiguration(language, driver.conf);
      monaco.languages.setMonarchTokensProvider(language, driver.language);
    }

    if ('json' === language && languageOptions) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions(languageOptions);
    }

  }
 
  function onChangeDefault(source) {
    log("onChangeDefault")
    topics.map((topic, i) => {
      let message = {params: source}
      log("publishing: topic: ", topic, " with value: ", message)
      PubSub.publish(topic, message)
    })
  }

  function handleChange() {
    log("handleChange")
    setDisabledSaveButton(false)
    let source = editorRef.current.getValue();
    log("handleChange: source: ", source)
    if ("function" === typeof onChange) {
      log("handleChange: onChange is a function: let's use it!")
      onChange(source)
    } else if ("default" === onChange) {
      log("handleChange: onChange == 'default': let's use onChangeDefault!")
      onChangeDefault(source)
    } // else we do nothing: no live editor
  }

  function updateSaveButton(message) {
    log("updateSaveButton: ", message);
    if (message) {
      setDisabledSaveButton(true)
    } else {
      setDisabledSaveButton(false)
      log("Can't save data. Take a copy of it if you want to keep it and try again.");
      Utils.notifyError("Can't save data. Take a copy of it if you don't want to lose it and try again but know that clicking again and again on the button may not work.");
    }

    setSaving(false);
  }

  /**
   * Executes the provided action during BaseCodeEditor instanciation
   * @param {*} topic 
   * @param {*} message 
   */
  function handleAction(topic, message) {
    setSaving(true)

    let source = editorRef.current.getValue();
    //let source = message.source
    let myaction = message?.action
    if ("function" === typeof myaction) {
      //log("handleAction: calling ", myaction?.name, ", provided in message, with source parameter:", source)
      log("handleAction: calling myaction, provided in message, with source parameter:", source)
      myaction(source)
    } else if (action) {
      //log("handleAction: calling ", action?.name, ", configured in component call, with source parameter:", source)
      log("handleAction: calling action, configured in component call, with source parameter:", source)
      action(source)
    } else {
      log("handleAction: no configured action. Doing nothing with source parameter:", source)
    }
    //setSaving(false)
  }

  function updateSaveButtonListener(topic, message) {
    updateSaveButton(message);
  }

  useEffect(() => {
    PubSub.subscribe( topics[0], updateSaveButtonListener) // First topic is for this component
    PubSub.subscribe( "PROCESS_CODE_EDITOR_CONTENT", handleAction)
  }, []);

  return (
    <>
    {
      initialValue ?
        <>
          <Editor
            width={_width}
            height={_height}
            defaultLanguage={language}
            options={{
              readOnly: false,
              fontSize: 14,
              wordWrap: "on", // 'off', 'on', 'wordWrapColumn', 'bounded'
              minimap: { enabled: true },
              automaticLayout: true, // redimensionnement auto
              formatOnPaste: true,
              formatOnType: true,
              lineNumbers: "on", // 'off', 'on', 'relative', 'interval'
              tabSize: 2,
              folding: true,
              suggestOnTriggerCharacters: true,
              scrollbar: {
                vertical: "auto",
                horizontal: "auto"
              },
              ...editorPostOptions
            }}
            defaultValue={initialValue}
            onMount={handleEditorDidMount}
            onChange={handleChange}
          />
          {showSaveButton && <SuspenseClick waiting={saving} disabled={disabledSaveButton} handleAction={handleAction} label={t("Menu.Save")} />}
        </>
        :
        <>
          <Loading />
        </>
    }
    </>
  );
}
