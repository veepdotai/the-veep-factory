'use client'

import { useState } from "react"

import { PDFDownloadLink, Document, Page, View, Text, BlobProvider } from "@react-pdf/renderer";
//import { PDFViewer } from '@react-pdf/renderer';

import { Document as DocView, Page as PageView } from "react-pdf";
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
  ).toString();
 
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import PDFLink from "@/components/veepdotai-pdf-config/components/PDFLink";
import SocialNetworkPreview from "@/components/screens/SocialNetworkPreview";
//import PDF from '@/components/veepdotai-pdf-config/components/PDF';
import PDF from "@/components/export/pdf/PDF";

export default function Mytest() {

  let now = (new Date())
  let time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
  console.log(time)

  let getDocument = (msg = "", i) => <Document key={`docu-${i}`}>
    <Page>
      <View>
        <Text>My text: {msg}.</Text>
      </View>
    </Page>
  </Document>      

  let document1 = []
  for(let i = 0; i < 10; i++) {
    document1[i] = getDocument(`Bonjour: ${i}: ${time}`, i)
  }

  let document2 = []
  for(let i = 0; i < 10; i++) {
    document2[i] = getDocument(`Au revoir: ${i}: ${time}`, i)
  }

  return (
    <div className="h-screen w-full" data-registry="plate">
      <h1>test.</h1>
        <Tabs className="m-auto flex flex-col w-[500px]">
          <TabsList defaultValue={"un"}>
            <TabsTrigger value="un">un</TabsTrigger>
            <TabsTrigger value="deux">deux</TabsTrigger>
            <TabsTrigger value="social network">Social Network</TabsTrigger>
            <TabsTrigger value="PDF">PDF</TabsTrigger>
          </TabsList>
          <TabsContent value="un" className="flex flex-col">
            {/*document1.map((doc, i) => getContent(doc, i))*/}
            {document1.map((doc, i) => <PDFLink key={`doca-${i}`} document={doc} title="test" />)}
          </TabsContent>
          <TabsContent value="deux" className="flex flex-col">
            {/*document2.map((doc, i) => getContent(doc, i))*/}
            {document2.map((doc, i) => <PDFLink key={`docb-${i}`} document={doc} title="test" />)}
          </TabsContent>
          <TabsContent value="social network" className="flex flex-col">
            {/*document2.map((doc, i) => getContent(doc, i))}*/}
            {document2.map((doc, i) => <SocialNetworkPreview key={`docc${i}`} content={{content: "# titre\n\nSome text"}} document={doc} />)}
          </TabsContent>
          <TabsContent value="PDF" className="flex flex-col">
            {/*document2.map((doc, i) => <PDF key={`docd-${i}`} initContent={{content: "# titre\n\nSome text"}} initParams={{}} />)*/}
          </TabsContent>
        </Tabs>
      <div className="m-auto flex flex-col w-[500px]">
        {/*document.map((doc, i) => <PDFViewWithCustomActions key={`doca-${i}`} document={doc} />)*/}
      </div>
    </div>
  );

}
