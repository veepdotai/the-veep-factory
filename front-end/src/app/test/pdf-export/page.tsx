'use client'

import { Logger } from "react-logger-lib"

//import PDF from '@/components/veepdotai-pdf-config/components/PDF';
import PDFParams from "@/components/veepdotai-pdf-config/components/PDFParams";

import dynamic from 'next/dynamic'
 
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

  let text = `
# This is title

Some text 2

# First header

And some text

## Second header.1

And other text

A list with bullets:
* un
* deux
* trois

## Second header.2

And some other text

And again

  `

  let stylesheet = {
    title: {
      fontSize: "2rem",
      color: "black"
    }
  }

  let params = {
    title: "test 2",
    subtitle: "subtitle 2",
    stylesheet: stylesheet || {}
  }


  /**
   * A4 at 300 dpi: 2480x3508 => 620x877 at 75 dpi
   */
  let viewOptions = {
    width: "620",
    height: "877",
    showToolbar: true,
    className: "",
    style: {},
  }

  let docWithViewer = (msg: string) => <DynamicPDFWithNoSSR initContent={msg} initParams={new PDFParams(params)} viewType="complete" viewOptions={viewOptions} />
  
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


