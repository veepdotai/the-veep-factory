'use client'

import ConfigPanel from './components/ConfigPanel';
import { useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib'
import PubSub from 'pubsub-js'
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from 'src/components/ui/shadcn/resizable';
import { ScrollArea, ScrollBar } from "src/components/ui/shadcn/scroll-area"

import PDFParams from './components/PDFParams';
import PDF from './components/PDF';
import PDFExportForm from '../screens/forms/PDFExportForm';
import { useMediaQuery } from 'usehooks-ts';

import { convert } from './lib/AbstractContent'
//const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink), { ssr: false });
 
/**
 * React component to render a PDF config pannel with a PDF renderer.
 * 
 * Props : params - an instance of PDFParams
 *         content - an instance of (markdown or JSON) String
 */
export default function PDFPanel( {cid, initParams, initContent, displayInfosPanel}) {
    const log = Logger.of(PDFPanel.name)

    const isDesktop = useMediaQuery("(min-width: 768px)");

    const [params, setParams] = useState(initParams || new PDFParams())
    const [content, setContent] = useState(initContent == undefined ? convert(" ") : convert(initContent))

    log.trace(`infosPanel: params: ${JSON.stringify(params)}`)
    log.trace(`infosPanel: content; ${JSON.stringify(content)}`)

    let displayConfigPanel = displayInfosPanel

    function updateInfosPanel(topic, newParams) {
      log.trace(`updateInfosPanel: newParams: ${JSON.stringify(newParams)}`)
      setParams(newParams)
    }

    useEffect(() => {
      PubSub.subscribe("INFOS_PANEL_UPDATED", updateInfosPanel)
    }, [])

    return (
        <div className='h-full bottom-0'>
          { params ?
              isDesktop ?
                  <ResizablePanelGroup direction="horizontal" className='h-full bottom-0'>
                      <ResizablePanel className='bottom-0'>
                          {/*<ConfigPanel content={infosPanel.content} handleCompilePDF={handleCompilePDF} params={infosPanel.params}/>*/}
                          <PDFExportForm cid={cid} params={params} />
                      </ResizablePanel>

                      <ResizableHandle/>

                      <ResizablePanel defaultSize={60} className='vh-100 bottom-0'>
                          <PDF content={content} params={params}/>
                      </ResizablePanel>
                  </ResizablePanelGroup>
                :
                  <ScrollArea className="w-100 whitespace-nowrap h-full">
                    <ScrollBar orientation='vertical' />

                    <div class="columns-1">
                      <PDFExportForm cid={cid} params={params} />
                      <PDF content={content} params={params}/>
                    </div>
                  </ScrollArea>
              :
                <>{t("NoDataAvailable")}</>
          }
        </div>
    );
}

/*const PdfLink = (props) => {
    return (
        <div>
            <PDFDownloadLink document={<MyDocument params={props.params}/>} fileName={props.params.title}>
                {({ blob, url, loading, error }) =>
                    loading ? 'Loading document...' : 'Download pdf'
                }
            </PDFDownloadLink>
        </div>
    );
};*/
