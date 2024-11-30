import { useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib';
import { PDFDownloadLink, Link, Page, Text, Image, View, Document, StyleSheet } from '@react-pdf/renderer';
import { t } from 'i18next';
import dynamic from 'next/dynamic';
import { useMediaQuery } from 'usehooks-ts';


// const which import the pdf renderer
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>{t("Loading...")}</p>,
  },
);  

/**
 * 
 * @param {*} props contains a content String (either markdown or JSON) and an instance of PDFParams
 * @returns a pdf renderer with the new pdf inside
 */
export function PDF( props ) {
  const log = Logger.of(PDF.name)

  const isDesktop = useMediaQuery("(min-width: 768px)");

  log.trace("style... parameters: " + JSON.stringify(props.params))
  return (
    <>
      <PDFViewer width={'100%'} height={isDesktop ? '100%' : '800px'}>
          <PDFDocument
            content={props.content}
            params={props.params}
          />
      </PDFViewer>
    </>

  )
}

/**
 * Builds PDF content from provided params/metadata and text content
 * 
 * @param {*} metadata document metadata (title, subtitle...)
 * @param {*} displayOptions display options
 * @param {*} content document amin content
 * @returns 
 */
export function PDFDocument({content, params}) {
  const log = Logger.of(PDFDocument.name)

  let data = {
    title: params?.title,
    subTitle: params?.subTitle || params?.subtitle,
    featuredImage: params?.companyImg,
    author: params?.author,
    version: params?.version,
    date: params?.date,
    imageBg: "https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg",
    imageBg2: "https://images.pexels.com/photos/6144105/pexels-photo-6144105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    backgroundImage: params?.backgroundImg,
    backgroundImageCover: params?.backgroundImgCover,
    footer: params?.footer,
    backCover: params?.backCover || [],
    dimensions: params?.dimensions,
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

    return (
      <Page style={data.styles?.firstPage} bookmark={t("CoverPage")} size={data?.dimensions}>
        
        {getInlineContent("title", "title")}
        {getInlineContent("subTitle", "subTitle")}

        <Image style={data.styles?.featuredImage} src={data?.featuredImage} />

        <View style={data.styles?.metadataBlock}>
          {/*getInlineContentWithLabel(45, t("Company"), data?.companyName, "company")*/}
          {data?.organizationName ? getInlineContentWithLabel(30, t("OrganizationName"), data.organizationName, "organization", data.styles) : ""}
          {getInlineContentWithLabel(30, t("Author"), data?.author, "author", data.styles)}
          {getInlineContentWithLabel(15, t("Version"), data?.version, "version", data.styles)}
          {getInlineContentWithLabel(0, t("Date"), data?.date, "date", data.styles)}
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

    content.map((page) => {
      titles.push(page[1])
    })

    return (
      <>
        { titles ?
          <Page style={data.styles?.tocPage} bookmark={t("TOC")} size={data?.dimensions}>
            <View style={data.styles?.contentTable}>
              <Text style={data.styles?.contentTableTitle}>{t("TOC")}</Text>

              <View style={data.styles?.contentTableLinks}>
                {titles.map((title, i) => {
                  return (
                    <Link style={data.styles?.link} src={"#" + (i+1)}>{title}</Link>
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
    if (data?.newPage && content?.length > 0) {
      let bookmark = content[0]?.length > 0 ? t(content[0][1]) : t("Content")
      return (
        <>
          {content.map( (page) => {
            console.log(page[5])
            return (
              <Page style={data.styles?.contentPage} id={page[0]} bookmark={t(page[1])} size={data?.dimensions}>
                {header()}
                <Text style={data.styles?.title1}>{page[1]}</Text>
                {page[2].map((subtitle) => {
                  if (typeof(subtitle) == "string"){
                    return (<Text style={data.styles?.text}>{subtitle}</Text>)
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
            {content.map( function(page) {
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
      return (<></>)
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
          {/*<Text style={data.styles?.subTitle}>{subtitle[0]}</Text>*/}
          <Text style={data.styles['title' + i]}>{subtitle[0]}</Text>
          <>{
            typeof(subtitle[1]) == "string"
              ? <Text style={data.styles?.text}>{subtitle[1]}</Text>
              : <>{displaySubtitle(i + 1, subtitle[1])}</>
            }
          </>
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
      <Page style={data.styles?.lastPage} id="backCover" bookmark={t("BackCover")} size={data?.dimensions}>
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
        <>
          <View style={data.styles?.footerMargin} fixed></View>
          <View style={data.styles?.footer} fixed>
            <Text style={data.styles?.footerContent}>{data?.footer}</Text>
            <Text style={data.styles?.pageNumber} render={({ pageNumber, totalPages }) => (`${pageNumber} / ${totalPages}`)} fixed/>
          </View>
        </>
      )
    }
  }

  /**
   * Renders an image which will be used as a background of the page it is in
   * @param {String} img 
   * @returns A rendered image usable as a page background
   */
  function background(img){
    return (
      <View style={data.styles?.companyBackground} fixed>
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
      style = name[0].toUpperCase() + name.substring(1);
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
          <Text style={styleName}>{data[name]}</Text>
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
          <View style={styles?.metadataLine}>
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


  return (
    <>
    {
      content ?
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
        <></>
      }
    </>
  );
}

export default PDF;
