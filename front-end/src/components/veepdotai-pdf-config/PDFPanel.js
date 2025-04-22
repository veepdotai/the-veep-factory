'use client'
//import dynamic from 'next/dynamic'

import { useState } from 'react';
import { Logger } from 'react-logger-lib'
import { t } from 'src/components/lib/utils'

import { useMediaQuery } from 'usehooks-ts';
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from 'src/components/ui/shadcn/resizable';
import { ScrollArea, ScrollBar } from "src/components/ui/shadcn/scroll-area"

import PDFParams from './components/PDFParams';
import PDF from './components/PDF';
import PDFExportForm from '../screens/forms/PDFExportForm';

import { convert } from './lib/AbstractContent'

/**
 * React component to render a PDF config panel with a PDF renderer.
 * 
 * Props : params - an instance of PDFParams
 *         content - an instance of (markdown or JSON) String
 */
export default function PDFPanel( {cid, initParams, initContent, displayInfosPanel}) {
    const log = Logger.of(PDFPanel.name)

    const isDesktop = useMediaQuery("(min-width: 768px)");

    const [params, setParams] = useState(initParams || new PDFParams())
    const [content, setContent] = useState(initContent == undefined ? convert(" ") : convert(initContent))

    log.trace("initContent: ", initContent)
    log.trace("params: ", params)
    log.trace("content: ", content)
    log.trace("content && params: ", (content && params) ? true : false)

    let displayConfigPanel = displayInfosPanel
/*
    function updateInfosPanel(topic, newParams) {      
      log.trace(`updateInfosPanel: style... content: ${JSON.stringify(content)}`)
      log.trace(`updateInfosPanel: newParams: ${JSON.stringify(newParams)}`)
      setParams(newParams)
    }

    useEffect(() => {
      PubSub.subscribe("INFOS_PANEL_UPDATED", updateInfosPanel)
    }, [])
*/
    return (
        <div className='h-full bottom-0'>
          { (content && params) ?
              isDesktop ?
                    <ResizablePanelGroup direction="horizontal" className='h-full bottom-0'>
                        <ResizablePanel className='bottom-0'>
                            {/*<ConfigPanel content={infosPanel.content} handleCompilePDF={handleCompilePDF} params={infosPanel.params}/>*/}
                            <PDFExportForm cid={cid} params={params} />
                        </ResizablePanel>

                        <ResizableHandle/>

                        <ResizablePanel defaultSize={60} className='vh-100 bottom-0'>
                            { content?.length > 1 ?
                                    <>
                                        <PDF initContent={content} initParams={params} viewType="light" viewOptions={{}}/>
                                    </>
                                :
                                    <>{t("NoContent")}</>
                            }
                        </ResizablePanel>
                    </ResizablePanelGroup>
                  :
                    <ScrollArea className="w-100 whitespace-nowrap h-full">
                      <ScrollBar orientation='vertical' />

                      <div className="columns-1">
                        <PDFExportForm cid={cid} params={params} />
                        { content?.length > 1 ?
                                <PDF initContent={content} initParams={params}/>
                            :
                                <>{t("NoContent")}</>
                        }
                      </div>
                    </ScrollArea>
              :
                  <>{t("NoDataAvailable")}</>
          }
        </div>
    );
}

