'use client'

import { useEffect, useState } from "react"

import { Logger } from "react-logger-lib"
import PubSub from "pubsub-js"

import testdata from "../data.json"

import { Button } from "@/components/ui/button"

import { usePDF } from "@react-pdf/renderer"
import PDF from '@/components/veepdotai-pdf-config/components/PDF';
import PDFParams from "@/components/veepdotai-pdf-config/components/PDFParams";

import dynamic from 'next/dynamic'
import DataTableTanStack from "@/components/datatable/shadcn-dt-tanstack/content/page";


const DynamicPDFWithNoSSR = dynamic(
  () => import('@/components/veepdotai-pdf-config/components/PDF'),
  { ssr: false }
)

export default function TestPDFExport() {
  const log = Logger.of(TestPDFExport.name)

  const [text, setText] = useState<string>("#JCK\n" + testdata.textSlides)
  const [params, setParams] = useState(testdata.attachmentGenerationOptions)

  let style = {
    title: {
      color: "black",
      fontSize: "3rem"
    }
  }

  let docWithViewer = (msg: string, params) => <PDF
    initContent={msg}
    initParams={new PDFParams(params)}
    /*viewType={testdata.attachmentViewType}*/
    viewType="custom"
    viewOptions={testdata.attachmentViewOptions}
  />

  useEffect(() => {
    console.log("JCK2: params changed!:", params)
    PubSub.publish("SOURCE_EDITOR_UPDATED", {
      params: { attachmentGenerationOptions: params},
      content: text + ""
    })
  }, [params, text])
  
  return (
    <>
      <Button className="align-center" onClick={() => {
        setParams({
          ...params,
          featuredImage: (params.featuredImage ? null: params.backgroundImageBackCover),
          displayToc: (params.displayToc ? false : true)
        })
      }}>Update metadata</Button>
      <Button className="align-center" onClick={() => {
        setText("# " + Math.random() + "\n\nI'm a new page\n\n" + text)
      }}>Add a page</Button>

    {
        params && text != "" ?
            <>
              {new Date().toString()}
              {docWithViewer(text, params)} 
            </>
          :
            <>Content is null</>
      }
    </>
  )
}


