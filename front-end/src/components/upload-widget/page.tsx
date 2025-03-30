"use client";

import { useEffect, useState, useRef } from 'react'
import { useCookies } from 'react-cookie'
import { Logger } from "react-logger-lib"

import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button';
import { Input } from "src/components/ui/shadcn/input"
import { UploadLib } from './UploadLib'

export default function Upload({ className, fieldName, form, ...field }) {
  const log = Logger.of(Upload.name)

  const [cookies] = useCookies(['JWT']);

  const inputRef = useRef(null);
  const [files, setFiles] = useState([])
  const [disabled, setDisabled] = useState(true)

  const topic = "UPLOAD_FILE_SUCCESS_" + fieldName
  log.trace("topic: ", topic)

  const handleGQLUploadMutation = () => {
    log.trace("handleGQLUploadMutation: ", cookies, "topic: ", topic)
    for (var i = 0; i < files.length; i++) {
      log.trace(`handleGQLUploadMutation: files[${i}]`, files[i])
      UploadLib.upload(cookies, files[i].file, topic, form)
    }
  }

  function onSuccess(topic, content) {
    let form = content.form
    let field = content.data

    log.trace("onSuccess: topic: ", topic)
    log.trace("onSuccess: field: ", field)
    let id = "input-" + fieldName
    log.trace("onSuccess: input id: ", id)
    log.trace("onSuccess: form: ", form)
    form.setValue(fieldName, field?.uploaded?.url)
    //document.getElementById(id).value = field?.uploaded?.url
  }

  function handleFiles(files) {
    log.trace(`handleFiles`, files)
    setFiles(files)
    return true
  }

  useEffect(() => {
    PubSub.subscribe(topic, onSuccess)

  }, [])

  log.trace("input id: ", "input-" + fieldName)

  return (
    <div className="Upload">
      <Input id={"input-" + fieldName} className={cn("sr-only", className)} {...field} />
      {form.getValues(fieldName) ? <img src={form.getValues(fieldName)} width="100"/> : <></>}
      <FilePond
        files={files}
        onupdatefiles={handleFiles}
        allowMultiple={false}
        maxFiles={1}
        //server="/api"
        name="files"
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />

      <Button className={disabled} onClick={handleGQLUploadMutation}>Upload</Button>
    </div>
  )
}