'use client'

import { useEffect, useState } from "react"

import { Logger } from "react-logger-lib"

import { Button } from "@/components/ui/button"

import { PDFViewer } from '@react-pdf/renderer'
import { usePDF, Document, Page, Text, View, Image } from "@react-pdf/renderer"
import { Document as DocView, Page as PageView, Outline } from "react-pdf"

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`,
    import.meta.url,
).toString();

import dynamic from 'next/dynamic'
import { on } from "events"
const DynamicPDFWithNoSSR = dynamic(
  () => import('@/components/veepdotai-pdf-config/components/PDF'),
  { ssr: false }
)

export default function TestPDFPlain() {
  const log = Logger.of(TestPDFPlain.name)

  const [text, setText] = useState(["# Page 1", "# Page 2"])
  const [params, setParams] = useState(true)

  let docWithViewer = (texts, displayImages = true) => (
    <Document>
      {texts.map((page, index) => (
        <Page size={"A4"}>
          {console.log("displayImages: ", displayImages)}
          <View>
            <Text>{page}</Text>
          </View>
          <View render=
            {() => 
              displayImages ?
              <Text>Image has been removed ({displayImages})</Text>
              : 
              <Image style={{width: 200, height: 100}} src="https://react-pdf.org/images/logo.png" />
            } 
          fixed />
          <View>
              <Text>Test - </Text><Image style={{width: 200}} src="https://react-pdf.org/images/logo.png" />
          </View>
        </Page>
      ))}
    </Document>
  )

  const [displayImages, setDisplayImages] = useState(true)
  const [instance, update] = usePDF({document: docWithViewer(text, displayImages)})
  //  const [doc, update] = usePDF(docWithViewer(text, params))
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)

  useEffect(() => {
    update(docWithViewer(text, displayImages))
  }, [text, displayImages])

  function onLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  if (instance.loading) return <div>Loading...</div>
  if (instance.error) return <div>Error: {instance.error?.message}</div>

  return (
    <>
      <Button className="align-center" onClick={() => {
        setDisplayImages(!displayImages)
      }}>{!displayImages ? "Display images" : "Hide images"}</Button>
      <Button className="align-center" onClick={() => {
        setText([...text, `# Page ${text.length + 1}`])
      }}>Add a page</Button>
      <Button className="align-center" onClick={() => {
        setPageNumber(pageNumber > 0 ? pageNumber - 1 : pageNumber )
      }}>Previous</Button>
      <Button className="align-center" onClick={() => {
        setPageNumber(pageNumber < numPages> ? pageNumber + 1 : pageNumber )
      }}>Next</Button>

      {/*
      { !displayImages &&
          <div>
            <p>displayImages = {displayImages ? "true" : "false"}</p>
            <PDFViewer width={800} height={800} canvasBackground="orange">
              {docWithViewer(text, true)}
            </PDFViewer>
          </div>
      }
      { displayImages &&
        <div>
          <p>displayImages = {displayImages ? "true 2" : "false 2"}</p>
          <PDFViewer width={800} height={800} canvasBackground="orange">
            {docWithViewer(text, false)}
          </PDFViewer>
        </div>
      }
      */}      

      { 
        instance && instance.url &&
            <>
              <a href={instance.url}>Download</a>
              <div key={1/*Math.random()*/}>
                  <DocView file={instance.url}  onLoadSuccess={onLoadSuccess}>
                    <PageView width={800} height={800} canvasBackground="orange" pageNumber={pageNumber}/>
                  </DocView>
              </div>
            </>
      }

      {/* displayImages &&

        instance && instance.url &&
            <>
              <a href={instance.url}>Download</a>
              <div>
                  <DocView file={instance.url}  onLoadSuccess={onLoadSuccess}>
                    <PageView width={800} height={800} canvasBackground="orange" pageNumber={pageNumber}/>
                  </DocView>
              </div>
            </>
      */}

    </>
  )
}


