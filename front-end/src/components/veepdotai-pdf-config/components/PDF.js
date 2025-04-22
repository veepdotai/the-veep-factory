import { useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib';
import { t } from 'src/components/lib/utils'

import { useMediaQuery } from 'usehooks-ts';

import { PDFViewer } from '@react-pdf/renderer';
import PDFLink from './PDFLink' 
import PDFDocument from './PDFDocument'

/**
 * 
 * @param {*} props contains a content String (either markdown or JSON) and an instance of PDFParams
 * @returns a pdf renderer with the new pdf inside
 */
export default function PDF( {initContent, initParams = null, viewType = "embedded", viewOptions = {}} ) {
  const log = Logger.of(PDF.name)

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [content, setContent] = useState(initContent)
  const [params, setParams] = useState(initParams)

  log.trace("style... initContent: ", initContent)
  log.trace("style... initParams: ", initParams)

  log.trace("style... content: ", content)
  log.trace("style... params: ", params)

  function updateInfosPanel(topic, newParams) {      
    log.trace(`updateInfosPanel: style... content:`, content)
    log.trace(`updateInfosPanel: newParams:`, newParams)
    setParams(newParams)
  }

  function getViewOptions() {
    return viewOptions
  }

  useEffect(() => {
    PubSub.subscribe("INFOS_PANEL_UPDATED", updateInfosPanel)
  }, [])

  let doc = <PDFDocument content={content} params={params} />
  log.trace("doc: ", doc)

  return (
    <>
      { (content?.length) ?
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
