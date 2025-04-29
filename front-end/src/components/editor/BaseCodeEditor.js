import { useEffect, useRef, useState } from 'react';
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';
import { t } from 'src/components/lib/utils'

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
    topics,
    language,
    initialValue,
    action,
    driver = null,
    editorPreOptions = {},
    editorPostOptions = {},
    languageOptions = {},
    showSaveButton = true}
  ) {

  const log = Logger.of(BaseCodeEditor.name);

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
 
  function handleOnChange() {
    setDisabledSaveButton(false)
  }

  function updateSaveButton(message) {
    log.trace("updateSave: ", message);
    if (message) {
      setDisabledSaveButton(true)
    } else {
      setDisabledSaveButton(false)
      alert("Can't save data. Take a copy of it if you want to keep it and try again.");
    }

    setSaving(false);
  }

  function handleAction() {
    setSaving(true)

    let source = editorRef.current.getValue();
    action(source)
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
            height="50vh"
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
            onChange={handleOnChange}
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
