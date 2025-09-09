'use client'

import { useEffect, useState } from "react"

import { Logger } from "react-logger-lib"

import { Button } from "@/components/ui/button"

import { Font, PDFViewer } from '@react-pdf/renderer'
import { usePDF, Document, Page, Text, View, Image, Link } from "@react-pdf/renderer"
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

export default function TestPDFWithNoPage() {
  const log = Logger.of(TestPDFWithNoPage.name)

  const [text, setText] = useState(["# Page 1", "# Page 2"])
  const [params, setParams] = useState(true)
  const [flag, setFlag] = useState(true)

  function getContentIfRequested(label, styles, requested, content) {
    console.log("label: ", label, "requested: ", requested)
    return (
      <View fixed style={styles} render={() => 
          <>
            {requested && content}
          </>
        }
      />
    )
  }

  Font.registerEmojiSource({
    format: 'png',
    url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
  });

  let docWithViewer = (texts, displayImages = true) => (
    <Document style={{height: 600, width: 600}}>
      <Page size={{height: 530, width: 530}} style={{marginLeft: 20, marginRight: 20, border: "5px solid black", backgroundColor: "silver"}}>
      <Link href="2" >Lien</Link>
      {texts.map((page, index) => (
          <>
            <View style={{width: "100%", position: "absolute", top: 50, textAlign: "center"}} break>
              <Text style={{padding: 10, fontSize: 60, fontWeight: 900, letterSpacing: "-5px"}}>
              Happy Papers : la paperasse josyeuse
              </Text>
              <Text style={{padding: 10, fontSize: 50}}>Rendre l’administratif plus humain.</Text>
              <Text style={{padding: 10, fontSize: 20}}>L’objectif n’est pas seulement d’aider… mais de le faire avec légèreté.
Happy Papers, c’est :</Text>

              <Text style={{padding: 10, fontSize: 20}}>😅Moins de stress</Text>
              <Text style={{padding: 10, fontSize: 20}}>😅Plus d’efficacité</Text>
              <Text style={{padding: 10, fontSize: 20}}>😅Un accompagnement personnalisé</Text>
              <Text style={{padding: 10, fontSize: 20}}>😅Une approche simple, joyeuse et rassurante</Text>
            </View>
          </>
        ))}

        {getContentIfRequested(
          "header1",
          {position: "absolute", top: "0", width: "100%"},
          flag,
          <View style={{width: "100%", borderBottom: "1px solid black", backgroundColor: "pink"}}>
            <Image style={{margin: "auto", height: 150, width: 150}} src="https://react-pdf.org/images/logo.png" />
          </View>
        )}

        {getContentIfRequested(
          "header2",
          {position: "absolute", top: "0", width: "100%"},
          !flag,
          <View style={{width: "100%", borderBottom: "1px solid black", backgroundColor: "yellow"}}>
            <Image style={{margin: "auto", height: 50, width: 50}} src="https://react-pdf.org/images/logo.png" />
          </View>
        )}

        {getContentIfRequested(
          "footer1",
          {position: "absolute", bottom: "0", width: "100%"},
          flag,
          <View style={{width: "100%", borderTop: "1px solid black", backgroundColor: "pink"}}>
            <Image style={{margin: "auto", height: 150, width: 150}} src="https://react-pdf.org/images/logo.png" />
          </View>
        )}

        {getContentIfRequested(
          "footer2",
          {position: "absolute", bottom: "0", width: "100%"},
          !flag,
          <View style={{width: "100%", borderTop: "1px solid black", backgroundColor: "yellow"}}>
            <Image style={{width:30, height: 30}} src="https://react-pdf.org/images/logo.png" />
          </View>
        )}

      </Page>
    </Document>
  )

  const [displayImages, setDisplayImages] = useState(true)
  const [instance, update] = usePDF({document: docWithViewer(text, displayImages)})
  //  const [doc, update] = usePDF(docWithViewer(text, params))
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)

  useEffect(() => {
    update(docWithViewer(text, displayImages))
  }, [text, displayImages, flag])

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
        setFlag(!flag)
      }}>{!flag ? "Flag" : "! Flag"}</Button>
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
                    <PageView width={530} height={530} pageNumber={pageNumber} />
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


