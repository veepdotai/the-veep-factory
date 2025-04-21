'use client'

import { Logger } from "react-logger-lib"
import testdata from "../data.json"

//import PDF from '@/components/veepdotai-pdf-config/components/PDF';
import PDFParams from "@/components/veepdotai-pdf-config/components/PDFParams";

import dynamic from 'next/dynamic'
import DataTableTanStack from "@/components/datatable/shadcn-dt-tanstack/content/page";
 
const DynamicPDFWithNoSSR = dynamic(
  () => import('@/components/veepdotai-pdf-config/components/PDF'),
  { ssr: false }
)

export default function TestPDFExport() {
  const log = Logger.of(TestPDFExport.name)

  let style = {
    test: {
      color: "black",
      fontSize: "3rem"
    }
  }

  let text = testdata.textSlides

  let params = testdata.attachmentGenerationOptions
  let stylesheet = params.styles

  /**
   * A4 at 300 dpi: 2480x3508 => 620x877 at 75 dpi
   */
  //let docWithViewer = (msg: string) => <DynamicPDFWithNoSSR initContent={msg} initParams={new PDFParams(params)} viewType={testdata.attachmentViewType} viewOptions={viewOptions} />
  let docWithViewer = (msg: string) => <DynamicPDFWithNoSSR
                                          initContent={msg}
                                          initParams={new PDFParams(params)}
                                          viewType={testdata.attachmentViewType}
                                          viewOptions={testdata.attachmentViewOptions} />
  
  return (
    <>{
        text != "" ?
            docWithViewer(text) 
          :
            <>Content is null</>
      }
    </>
  )
}


