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
import PDF from '@/components/veepdotai-pdf-config/components/PDF';

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

  function getPDF({initContent = "# Titre\n\nTexte", initParams = {}, title = "test", viewType = "custom", viewOptions = {}}) {
    //<PDFLink key={`doca-${i}`} document={doc} title="test" />)
    return (
      <PDF initContent={initContent} initParams={initParams} title={title} viewType={viewType} viewOptions={viewOptions} />
    )
  }
  let document1 = []
  for(let i = 0; i < 10; i++) {
    document1[i] = getDocument(`Bonjour: ${i}: ${time}`, i)
  }

  let document2 = []
  for(let i = 0; i < 10; i++) {
    document2[i] = getDocument(`Au revoir: ${i}: ${time}`, i)
  }

  let params = {
    "title": "This is a title",
    "subtitle": "This is a subtitle",
    "!format": "A4",
    "format": "LinkedIn",
    "organizationName": "Veep.AI",
    "author": "Jean-Christophe Kermagoret",
    "version": "1.0.0",
    "date": "12/04/2025",
    "footer": "Veep.AI - The Veep Factory",
    "featuredImage": "https://media.licdn.com/dms/image/v2/C5603AQH1QwJjj0fKQQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1519680310484?e=1750896000&v=beta&t=dnCGvWqWsWC2EBg_duKjnEL-OYJVdA8lkQnyDcLarcQ",
    "backgroundImage": "https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg",
    "backgroundImageCover": "https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg",
    "backgroundImageBackCover": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Lion_d%27Afrique.jpg",

    "dimensions": {"width": 800, "height": 800},
    "!dimensions": "A4",
    "displayHeader": true,
    "displayFooter": true,
    "newPage": true,
    "displayToc": true,
    
    "stylesheet": {
      "title": { "fontSize": 100, "fontWeight": "bold" },
      "subtitle": { "fontSize": 35 },
      "featuredImage": { "width": 200 },
      "!metadataLine": { "color": "black" },
      "!author": { "label": { "color": "black" }, "value": { "color": "red"} }
    }
  }

  let options = {
    "width": 533,
    "height": 533,
    "!showToolbar": true,
    "className": "",
    "style": {},
    "canvasBackground": "orange",
    "!rotate": "90"
  }

  return (
    <>
      {getPDF({initParams: params, viewOptions: options})}
    </>
  )
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
            {document1.map((doc, i) => getPDF({}))}
          </TabsContent>
          <TabsContent value="social network" className="flex flex-col">
            {/*document2.map((doc, i) => getContent(doc, i))}*/}
            {/*document2.map((doc, i) => <SocialNetworkPreview key={`docc${i}`} content={{content: "# titre\n\nSome text"}} document={doc} />)*/}
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
