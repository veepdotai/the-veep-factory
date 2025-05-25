import { useEffect, useId, useState } from 'react'
import { Logger } from 'react-logger-lib'
import { t } from 'src/components/lib/utils'

import { useMediaQuery } from 'usehooks-ts'

import { PDFViewer } from '@react-pdf/renderer'
import { usePDF } from '@react-pdf/renderer';

import PDFLink from './PDFLink'
import PDFDocument from './pdf-document/PDFDocument'
import PDFParams from './PDFParams'
import { ErrorBoundary } from 'react-error-boundary';

/**
 * 
 * @param {*} props contains a content String (either markdown or JSON) and an instance of PDFParams
 * @returns a pdf renderer with the new pdf inside
 */
export default function PDF( {initContent, id = null, initParams = null, viewType = "custom", viewOptions = {}} ) {
  const log = Logger.of(PDF.name)

  function logParameters() {
    log.trace("Parameters:\n####################################################################################################",
      "initContent: ", initContent,
      "initParams: ", initParams,
      "viewType: ", viewType,
      "viewOptions: ", viewOptions
    )
  }

  logParameters()

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [content, setContent] = useState(initContent)
  const [params, setParams] = useState(initParams)
  const [myViewType, setMyViewType] = useState(viewType)
  const [myViewOptions, setMyViewOptions] = useState(viewOptions)
//  const mydoc = () => <PDFDocument content={content} params={new PDFParams(params)} />
//  const [instance, update] = usePDF(mydoc())

  log.trace("id: ", id, "style... initParams: ", initParams)
  log.trace("content: ", content)

  function updateInfosPanel(topic, newParams) {      
    log.trace(`updateInfosPanel: style... content:`, content)
    log.trace(`updateInfosPanel: newParams:`, newParams)
    setParams(newParams)
  }

  function updatePDF(topic, message) {
    logParameters()

    log.trace("updatePDF: topic: ", topic, "paramsUpdated: ", message.params)
    log.trace("updatePDF: params: ", message.params.attachmentGenerationOptions)
    setParams(message.params.attachmentGenerationOptions)

    log.trace("updatePDF: content:", content)
    setContent(content)
  }  

  function getViewOptions() {
    return myViewOptions
  }

  function logError({error, info}) {
      log.error("ErrorBoundary from PDF caught an error:", error, "info:", info)
      PubSub.publish("TOAST", {
          "title": t("Error"),
          "description": <div className="mt-2 w-[500px] rounded-md">
              <p>{JSON.stringify(error)}</p>
              <p>{JSON.stringify(info)}</p>
          </div>
      })
  }

  //useEffect(() => {
  //  log.trace("JCK: useEffect[doc]: id: ", id, "style... doc: ", doc)
  //}, [doc])

  /*
  useEffect(() => {
    log.trace("JCK: useEffect[params]: id: ", id, "style... params: ", params)
    if (params) {
      update(<PDFDocument content={content} params={new PDFParams(params)} />) // This will trigger document update through the update method
    }
  }, [params, content])
  */

  useEffect(() => {
    log.trace("useEffect[]: id: ", id, "style... params: ", params)
    PubSub.subscribe("INFOS_PANEL_UPDATED", updateInfosPanel)
    //PubSub.subscribe("SOURCE_EDITOR_UPDATED", updatePDF)
  }, [])

  //       { (instance && params && content?.length) ?
  return (
    <>
      { (/*instance &&*/params && content?.length) ?
          <>
            <ErrorBoundary fallback={<h1>There is an error from PDF</h1>} onError={logError} >
              { ("embedded" === myViewType) &&
                  <PDFViewer witdh={533} height={533} {...getViewOptions()}>
                    <PDFDocument content={content} params={new PDFParams(params)} />
                  </PDFViewer> }
              {/* ("custom" === viewType) && <PDFLink id={id} instance={instance} document={mydoc()} title={params?.title} viewOptions={viewOptions}/> */}
              { ("custom" === myViewType) && <PDFLink id={id} title={params?.title} initContent={content} initParams={params} viewOptions={myViewOptions}/> }
            </ErrorBoundary>
          </>
        :
          <p>Loading...</p>
      }
    </>
  )

}
