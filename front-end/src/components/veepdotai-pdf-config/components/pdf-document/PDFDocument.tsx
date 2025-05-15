import { Logger } from 'react-logger-lib';
import { t } from 'src/components/lib/utils';

import FirstPage from './FirstPage'
import Toc from './Toc'
import LastPage from './LastPage'
import ContentPages from './ContentPages'
import DocUtils from './DocUtils'

import { Font, Page, View, Text, Document } from '@react-pdf/renderer';

Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
});

import { convert }  from "@/components/veepdotai-pdf-config/lib/AbstractContent"

/**
 * Builds PDF content from provided params/metadata and text content
 * 
 * @param {*} content content as simple markdown or structured content as an array of lines of content
 * @param {*} params document metadata (title, subtitle...)
 * @returns 
 */
export default function PDFDocument({content, params}) {
  const log = (...args) => Logger.of(PDFDocument.name).trace(args)

  let normalizedContent = Array.isArray(content) ? content : convert(content)
  log("normalizedContent:", normalizedContent)

  let data = {
    title: params?.title,
    subtitle: params?.subtitle,
    featuredImage: params?.featuredImage,
    organizationName: params?.organizationName,
    author: params?.author,
    version: params?.version,
    date: params?.date,
    backgroundImage: params?.backgroundImage || params?.backgroundImg,
    backgroundImageCover: params?.backgroundImageCover || params?.backgroundImgCover,
    backgroundImageBackCover: params?.backgroundImageBackCover || params?.backgroundImgBackCover,
    footer: params?.footer,
    backCover: params?.backCover || [],
    dimensions: params?.dimensions || "A4",

    displayFirstPage: params?.displayFirstPage,
    displayMetadata: params?.displayMetadata,
    displayToc: params?.displayToc,
    displayTocOnFirstPage: params?.displayTocOnFirstPage,

    displayHeader: params?.displayHeader,
    displayHeaderOnFirstPage: params?.displayHeaderOnFirstPage,
    displayHeaderOnLastPage: params?.displayHeaderOnLastPage,
    displayHeaderOnSpecificPage: params?.displayHeaderOnSpecificPage,

    displayFooter: params?.displayFooter,
    displayFooterOnFirstPage: params?.displayFooterOnFirstPage,
    displayFooterOnLastPage: params?.displayFooterOnLastPage,
    displayFooterOnSpecificPage: params?.displayFooterOnSpecificPage,
    newPage: params?.newPage,

    styles: params?.styles || {},
  }

  log("PDFDocument: params: ", params)
  log("PDFDocument: data: ", data)

  return (
    <>
      {
        (content && params) ?
            <Document>
              <Page style={data.styles?.scontentPage} bookmark={"contenu"} size={data?.dimensions}>

              <FirstPage params={data} />
              {DocUtils.getContentIfRequested({
                requested: data.displayToc,
                content: () => <Toc normalizedContent={normalizedContent} params={data} />}
              )}
              {DocUtils.getContentIfRequested({
                requested: true,
                styles: {"width": 800, "height": 800},
                content: () => <ContentPages content={content} normalizedContent={normalizedContent} params={data} />}
              )}
              {data?.backCover?.map(function(item) {return <LastPage params={data} number={item[0]-1} />})}
              </Page>
            </Document>
          :
            <Document>
              <Page>
                <Text>Content is unavailable...</Text>
              </Page>
            </Document>
      }
    </>
  );
}
