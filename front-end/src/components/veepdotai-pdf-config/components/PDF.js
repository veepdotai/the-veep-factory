import { useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next';

import { useMediaQuery } from 'usehooks-ts';
import { Link, Page, Text, Image, View, Document, PDFViewer } from '@react-pdf/renderer';


import { convert }  from "@/components/veepdotai-pdf-config/lib/AbstractContent"
import PDFLink from './PDFLink' 

/**
 * 
 * @param {*} props contains a content String (either markdown or JSON) and an instance of PDFParams
 * @returns a pdf renderer with the new pdf inside
 */
export default function PDF( {initContent, initParams = null, viewType = "complete", viewOptions = {}} ) {
  const log = Logger.of(PDF.name)

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [content, setContent] = useState(initContent)
  const [params, setParams] = useState(initParams)

  log.trace("style... initContent: ", initContent)
  log.trace("style... initParams: ", initParams)

  log.trace("style... initContent: ", content)
  log.trace("style... initParams: ", params)

  function updateInfosPanel(topic, newParams) {      
    log.trace(`updateInfosPanel: style... content:`, content)
    log.trace(`updateInfosPanel: newParams:`, newParams)
    setParams(newParams)
  }

  function getViewOptions() {
    return viewOptions
  }

  useEffect(() => {
    PubSub.subscribe("INFOS_PANEL_UPDATED", updateInfosPanel)
  }, [])

  let doc = <PDFDocument content={content} params={params} />
  log.trace("doc: ", doc)

  return (
    <>
      { (content?.length) ?
          <>
            { ("complete" === viewType) && <PDFViewer {...getViewOptions()}>{doc}</PDFViewer> }
            { ("light" === viewType) && <PDFLink document={doc} title={params?.title} /> }
            </>
        :
          <p>Loading...</p>
      }
    </>
  )

}

/**
 * Builds PDF content from provided params/metadata and text content
 * 
 * @param {*} content content as simple markdown or structured content as an array of lines of content
 * @param {*} params document metadata (title, subtitle...)
 * @returns 
 */
export function PDFDocument({content, params}) {
  const log = Logger.of(PDFDocument.name)

  let normalizedContent = Array.isArray(content) ? content : convert(content)

  let data = {
    title: params?.title,
    subtitle: params?.subtitle || params?.subtitle,
    featuredImage: params?.companyImg,
    organizationName: params?.organizationName,
    author: params?.author,
    version: params?.version,
    date: params?.date,
    imageBg: "",
    imageBg3: "https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg",
    imageBg2: "https://images.pexels.com/photos/6144105/pexels-photo-6144105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    backgroundImage: params?.backgroundImg,
    backgroundImageCover: params?.backgroundImgCover,
    footer: params?.footer,
    backCover: params?.backCover || [],
    dimensions: params?.dimensions || "A4",
    displayHeader: params?.displayHeader,
    displayFooter: params?.displayFooter,
    styles: params?.styles || {},
    newPage: params?.newPage,
    toc: params?.toc,
  }

  /**
   * Creates and return the first page of the pdf
   * @returns The first page of the PDF
   */
  function firstPage() {
    log.trace("firstPage: processing...");
    log.trace("firstpage: data: ", data)

    let title = data?.title?.replace(/[^a-zA-Z0-9]/g, "")
    log.trace("firstpage: title: ", title)

    return (
      <Page style={data?.styles?.firstPage} bookmark={t("CoverPage")} size={data?.dimensions || "A4"}>
        
        {getInlineContent("title", "title")}
        {getInlineContent("subtitle", "subtitle")}

        { data?.featuredImage && <Image key={data?.featuredImage} style={data?.styles?.featuredImage} src={data?.featuredImage} /> }

        {/*key={"view-" + data?.title}*/} 
        <View style={data?.styles?.metadataBlock}>
          {/*getInlineContentWithLabel(45, t("Company"), data?.companyName, "company")*/}
          {getInlineContentWithLabel(30, t("OrganizationName"), data?.organizationName, "organizationName", data?.styles)}
          {getInlineContentWithLabel(30, t("Author"), data?.author, "author", data?.styles)}
          {getInlineContentWithLabel(15, t("Version"), data?.version, "version", data?.styles)}
          {getInlineContentWithLabel(0, t("Date"), data?.date, "date", data?.styles)}
        </View>

        {data?.backgroundImageCover == "./assets/images/nothing.png" ? background(data?.backgroundImage) : background(data?.backgroundImageCover)}

        {/*footer()*/}
      </Page>
    )

  }

  /**
   * Creates and return the Table of Content of the PDF - /!\ DOES NOT WORK PROPERLY
   * @returns the Table of Content of the PDF
   */
  function toc() {
    let titles = []

    normalizedContent.map((page) => {
      titles.push(page[1])
    })

    return (
      <>
        { titles ?
          <Page key="toc" style={data.styles?.tocPage} bookmark={t("TOC")} size={data?.dimensions}>
            <View style={data.styles?.contentTable}>
              <Text style={data.styles?.contentTableTitle}>{t("TOC")}</Text>

              <View style={data.styles?.contentTableLinks}>
                {titles.map((title, i) => {
                  return (
                    <Link key={`${title}-${i}`} style={data.styles?.link} src={"#" + (i+1)}>{title}</Link>
                    )
                  })}
              </View>
            </View>
            {background(data?.backgroundImage)}
          </Page>
          :
          <></>
        }
      </>
    )
  }

  /**
   * Creates and returns every content pages, depending on whether a new page 
   * should be started at the beginning of a new section of the PDF
   * -> we either render a new page for every title, or a new view inside of a 
   * page which contains every title.
   * 
   * @returns the content of the pdf
   */
  function contentPages() {
    //With a new page every new title
    //if (content?.length == 1) return (<></>)

    if (data?.newPage && content?.length > 0) {
      let bookmark = content[0]?.length > 0 ? t(content[0][1]) : t("Content")
      return (
        <>
          {normalizedContent.map( (page, i) => {
            console.log(page[5])
            return (
              <Page key={`content-${i}`} style={data.styles?.contentPage} id={page[0]} bookmark={t(page[1])} size={data?.dimensions}>
                {header()}
                <Text style={data.styles?.title1}>{page[1]}</Text>
                {page[2].map((subtitle, i) => {
                  if (typeof(subtitle) == "string"){
                    return (<Text key={`text-${i}`} style={data.styles?.text}>{subtitle}</Text>)
                  }else {
                    return displaySubtitle(1, subtitle)
                  }
                })}
                {page[4] != "./assets/images/nothing.png" ? (<Image src={page[4]} style={page[5] != null ? page[5].image : data.styles?.imageContent} />) : (console.log())}
                {footer()}
                {background(page[3] == "./assets/images/nothing.png" && data?.backgroundImage != "./assets/images/nothing.png" ? data?.backgroundImage : page[3])}
              </Page>
            )
          })}
        </>
      )
    } else if (content?.length > 0) {
      //Without a new page every new title
      let bookmark = content[0]?.length > 0 ? t(content[0][1]) : t("Content")
      return (
          <Page style={data.styles?.contentPage} id={"content"} bookmark={bookmark} size={data?.dimensions}>
            {header()}
            {normalizedContent.map( function(page) {
              return (
                <View id={page[0]}>
                  <Text style={data.styles?.title1}>{page[1]}</Text>
                  {
                    page[2].map((subtitle) => {
                      if (typeof(subtitle) == "string") {
                        return (
                          <Text style={data.styles?.text}>{subtitle}</Text>
                        )
                      } else {
                        return displaySubtitle(1, subtitle)
                      }
                    })
                  }
                  {page[4] != "./assets/images/nothing.png" ? (<Image src={page[4]} style={page[5] != null ? page[5].image : data.styles?.imageContent} />) : (console.log())}
                </View>
              )
            })}
            {footer()}
            {background(content[0][3] == "./assets/images/nothing.png" && data?.backgroundImage != "./assets/images/nothing.png" ? data?.backgroundImage : content[0][3])}
          </Page>
      )
    }
    else {
      return (<Page><View><Text>No data</Text></View></Page>)
    }
  }


  /**
   * Returns the subtitle and its generated content, which can be another
   * subtitle. The function is recursive :
   * if the content is a subtitle (array) then calls itself again else
   * the content is string -> renders the string and returns
   * 
   * @param {Array} subtitle an array which contains the subtitle and the content associated to it, which can be another subtitle [Subtitle-String, Content]
   * @returns The subtitle and its content
   */
  function displaySubtitle(i, subtitle) {
      return (
        <>
          {/*<Text style={data.styles?.subtitle}>{subtitle[0]}</Text>*/}
          <Text key={subtitle} style={data.styles['title' + i]}>{subtitle[0]}</Text>
            {subtitle.length > 1 ?
                <>{typeof(subtitle[1]) == "string"
                    ? <Text style={data.styles?.text}>{subtitle[1]}</Text>
                    : <>{displaySubtitle(i + 1, subtitle[1])}</>
                  }
                </>
                :
                <></>
            }
        </>
      )
  }

  /**
   * Renders a last page according to its number and the data contained in the
   * parameter props
   * 
   * @param {Int} number 
   * @returns The rendered last page
   */
  function lastPage(number = 0) {
    log.trace("lastPage: processing...");

    return (
      <Page key={number} style={data.styles?.lastPage} id="backCover" bookmark={t("BackCover")} size={data?.dimensions}>
        <Text style={data.styles?.title}>{data?.backCover[number][3]}</Text>
        <Text style={data.styles?.backPageContent}>{data?.backCover[number][2]}</Text>
        {background(data?.backCover[number][1])}
        {/*footer()*/}
      </Page>
    )
  }

  /**
   * Renders the header in a view, usable in a page
   * @returns the rendered header
   */
  function header() {
    if(data?.displayHeader){
      return (
        <View style={data.styles?.header} fixed>
          <Image
              style={data.styles?.image}
              src={data?.featuredImage}
          />
        </View>
      )
    }
  }

  /**
   * Renders the footer in a view, usable in a page. It contains the page number and displays it
   * @returns the rendered header
   */
  function footer() {
    if(data?.displayFooter){
      return(
        <div key="footer">
          <View style={data.styles?.footerMargin} fixed></View>
          <View style={data.styles?.footer} fixed>
            <Text style={data.styles?.footerContent}>{data?.footer}</Text>
            <Text style={data.styles?.pageNumber} render={({ pageNumber, totalPages }) => (`${pageNumber} / ${totalPages}`)} fixed/>
          </View>
        </div>
      )
    }
  }

  /**
   * Renders an image which will be used as a background of the page it is in
   * @param {String} img Url of an image
   * @returns A rendered image usable as a page background
   */
  function background(img){
    return (
      <View key="background" style={data.styles?.companyBackground} fixed>
        <Image style={data.styles?.companyBackgroundImage} src={img}/>
      </View>
    )
  }

  /**
   * 
   * @param {*} name 
   * @param {*} _style 
   * @returns 
   */
  function getInlineStyle(name, _style = null) {
    log.trace(`getInlineStyle: name: ${name}.`);

    let textStyle = {};
    let style = "";
    if (_style == null || _style == "") {
      style = name ? name[0].toUpperCase() + name.substring(1) : "";
      log.trace(`getInlineStyle: style: ${style}.`);
    } else {
      log.trace(`getInlineStyle: name: ${name}.`);
      style = _style[0].toLowerCase() + _style.substring(1);;
    }

    if (! data.styles[style]) {
      textStyle = {};
    } else {
      textStyle = data.styles[style];
    }

    log.trace(`getInlineStyle: textStyle: ${JSON.stringify(textStyle)}.`);
    return textStyle;
  }

  /**
   * 
   * @param {*} name 
   * @param {*} _styleName 
   * @returns 
   */
  function getInlineContent(name, _styleName = null) {
    let styleName = getInlineStyle(name, _styleName);
    log.trace(`getInlineContent: styleName: ${JSON.stringify(styleName)}.`);

    return (
      <>
        { name ?
          <Text key={name} style={styleName}>{data ? data[name] : ""}</Text>
          :
          <></>
        }
      </>
    )

  }

  /**
   * 
   * @param {*} offset parameter never used
   * @param {*} name 
   * @param {*} data 
   * @param {*} _styleName 
   * @returns 
   */
  function getInlineContentWithLabel(offset, name, data, _styleName = null, styles = null) {
    let style = getInlineStyle(name, _styleName);

    return (
      <>
        { name ?
          <View key={name} style={styles?.metadataLine}>
            <Text style={style?.label}>{name}</Text>
            <Text style={style?.sep}>:</Text>
            <Text style={style?.value}>{data}</Text>
          </View>
          :
          <></>
        }
      </>
    )
  }

  /*
  let document1 = <Document>
    {firstPage()}
    {data?.toc ? toc() : (<></>)}

    {contentPages()}

    {data?.backCover?.map(function(item){
        return lastPage(item[0]-1)
      })
    }
  </Document>
  */
  let document = <Document>
    <Page>
      <Text>Ceci est un test</Text>
    </Page>
  </Document>

/*
      (content && params) ?
        {document}

*/
  return (
    <>
    {
      (content && params) ?
          <Document>
            {firstPage()}
            {data?.toc ? toc() : (<></>)}

            {contentPages()}

            {data?.backCover?.map(function(item){
                return lastPage(item[0]-1)
              })
            }
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
