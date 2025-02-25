"use client";

import { useEffect, useState, useRef } from 'react'
import { Logger } from "react-logger-lib"
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { Button } from '@/components/ui/button';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)
import { UploadLib } from './UploadLib'

export default function App() {
    const log = Logger.of(App.name)

    const inputRef = useRef(null);
    const [files, setFiles] = useState([])

    const handleGQLQuery = () => {
      log.trace("App: handleGQLQuery: ")
      UploadLib.query()
    }

    const handleTestMutation = () => {
      log.trace("App: handleTestMutation: ")
      UploadLib.test("coucou2")
    }

    const handleGQLUploadMutation = () => {
      log.trace("App: handleGQLUploadMutation: ")
      UploadLib.upload(files[0].file)
    }

    const handleSubmit = () => {

        let files = inputRef.current?.files
        log.trace(`handleSubmit: files: `, files)
        if (files) {
          log.trace("files is not null")

          let myfile = files[0]
          UploadLib.upload(myfile)
          log.trace("onFileUpload: selectedFile: " + myfile.name);

          //PubSub.publish("FILE_ADDED", { "veepdot-ai-input-file": file })
          //UploadLib.sendRecording(conf, fd, veeplet, setContentId);
          //allFiles.forEach(f => f.remove())
          //setFiles([])
        } else {
          log.trace("files is null")
        }
    }

    function handleFiles(files) {
      log.trace(`handleFiles`, files)
      setFiles(files)
      return true
    }

    useEffect(() => {
    }, [])

    return (
      <div className="App">

        <FilePond
          files={files}
          onupdatefiles={handleFiles}
          allowMultiple={true}
          maxFiles={3}
          //server="/api"
          name="files"
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        />

        <Button onClick={handleSubmit}>Submit</Button>
        <Button onClick={handleGQLQuery}>Test GraphQL query</Button>
        <Button onClick={handleTestMutation}>Test GraphQL mutation</Button>
        <Button onClick={handleGQLUploadMutation}>Test GraphQL upload mutation</Button>
      </div>
  )
}