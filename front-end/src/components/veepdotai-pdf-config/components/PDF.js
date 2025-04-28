import { useEffect, useId, useState } from 'react';
import { Logger } from 'react-logger-lib';
import { t } from 'src/components/lib/utils'

import { useMediaQuery } from 'usehooks-ts';

import { PDFViewer } from '@react-pdf/renderer';
import PDFLink from './PDFLink' 
import PDFDocument from './PDFDocument'

import PDFTest from './PDFTest'
import PDFParams from './PDFParams';

/**
 * 
 * @param {*} props contains a content String (either markdown or JSON) and an instance of PDFParams
 * @returns a pdf renderer with the new pdf inside
 */
export default function PDF( {initContent, initParams = null, viewType = "embedded", viewOptions = {}} ) {
  const log = Logger.of(PDF.name)

  const id = useId()
  
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [content, setContent] = useState(initContent)
  const [params, setParams] = useState(initParams)
  const [doc, setDoc] = useState(null)

  //log.trace("id: ", id, "style... initContent: ", initContent)
  log.trace("id: ", id, "style... initParams: ", initParams)

  function updateInfosPanel(topic, newParams) {      
    log.trace(`updateInfosPanel: style... content:`, content)
    log.trace(`updateInfosPanel: newParams:`, newParams)
    setParams(newParams)
  }

  function updatePDF(topic, paramsUpdated) {      
    log.trace("updatePDF: topic: ", topic, "paramsUpdated: ", paramsUpdated)
    log.trace("updatePDF: params: ", paramsUpdated.attachmentGenerationOptions)
    setParams(paramsUpdated.attachmentGenerationOptions)
  }

  function getViewOptions() {
    return viewOptions
  }

  useEffect(() => {
    log.trace("useEffect[doc]: id: ", id, "style... doc: ", doc)
  }, [doc])

  useEffect(() => {
    //log.trace("useEffect[params]: id: ", id, "style... content: ", content)
    log.trace("useEffect[params]: id: ", id, "style... params: ", params)
    setDoc(<PDFDocument content={content} params={new PDFParams(params)} />)
    //setDoc(<p>Params: {JSON.stringify(params)}</p>)
  }, [params])

  useEffect(() => {
    //log.trace("useEffect[]: id: ", id, "style... content: ", content)
    log.trace("useEffect[]: id: ", id, "style... params: ", params)
    PubSub.subscribe("INFOS_PANEL_UPDATED", updateInfosPanel)
    PubSub.subscribe("SOURCE_EDITOR_UPDATED", updatePDF)
    //setDoc(<PDFDocument content={initContent} params={initParams} />)
  }, [])

  //let doc = <PDFDocument content={content} params={params} />
  //<PDFLink document={doc} title={params?.title} viewOptions={viewOptions}/> }
  return (
    <>
      { (doc && content?.length) ?
          <>
            { ("embedded" === viewType) && <PDFViewer witdh={400} {...getViewOptions()}>{doc}</PDFViewer> }
            { ("custom" === viewType) && <PDFLink document={doc} title={params?.title} viewOptions={viewOptions}/> }
          </>
        :
          <p>Loading...</p>
      }
    </>
  )

}
