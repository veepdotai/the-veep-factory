import { Logger } from 'react-logger-lib';
import { t } from 'src/components/lib/utils';

import { Font, Link, Page, Text, Image, View, Document } from '@react-pdf/renderer';

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


  function getContentIfRequested({content, requested = true, fixed = false, breakPage = true, styles = {"width": 800, "height": 800},
})  {
    return (
      <View fixed={fixed} break={breakPage} style={styles} render={() => requested && "" !== requested && content()} />
    )
  }

  function getNothingImage() {
    return "/assets/images/nothing.png"
  }

  /**
   * Creates and return the first page of the pdf
   * @returns The first page of the PDF
   */
  function firstPage() {
    log("firstPage: processing...");

    let title = data?.title?.replace(/[^a-zA-Z0-9]/g, "")
    log("firstpage: title: ", title)

    function getFeaturedImage() {
      return (
        <View fixed style={data?.styles?.featuredImageContainer}>
          <Image key={"featuredImage"} style={data?.styles?.featuredImage} src={data?.featuredImage} />
        </View>
      )
    }

    function getPart() {
      return (
        <>
            {/*getContentIfRequested({requested: data?.featuredImage, breakPage: false, content: getFeaturedImage})*/}
            {getFeaturedImage()}

            {getInlineContent("title", "title")}
            {getInlineContent("subtitle", "subtitle")}

            {getContentIfRequested({
              requested: data.displayMetadata ?? false,
              breakPage: false, 
              content: () => (<View style={data?.styles?.metadataBlock}>
                {/*getInlineContentWithLabel(45, t("Company"), data?.companyName, "company")*/}
                {getInlineContentWithLabel(30, t("OrganizationName"), data?.organizationName, "organizationName", data?.styles)}
                {getInlineContentWithLabel(30, t("Author"), data?.author, "author", data?.styles)}
                {getInlineContentWithLabel(15, t("Version"), data?.version, "version", data?.styles)}
                {getInlineContentWithLabel(0, t("Date"), data?.date, "date", data?.styles)}
              </View>)
            })}
            {/*data?.backgroundImageCover == getNothingImage() ? background(data?.backgroundImage) : background(data?.backgroundImageCover)*/}

            {footer()}
        </>
      )
    }

    return (
      <>
        { true ?
            <View style={data?.styles?.firstPage}>
              {getContentIfRequested({requested: data?.displayFirstPage, breakPage: true, content: getPart})}
            </View>
          :
            <Page style={data?.styles?.firstPage} bookmark={t("CoverPage")} size={data?.dimensions || "A4"}>
              {getPart()}    
            </Page>
        }
      </>
    )

  }

  /**
   * Creates and return the Table of Content of the PDF - /!\ DOES NOT WORK PROPERLY
   * @returns the Table of Content of the PDF
   */
  function toc() {
    let titles = []

    // titles are extracted from content 
    normalizedContent.map((page) => {
      titles.push(page[1])
    })

    log("toc: titles: ", titles)

    {/*
        <Page style={data.styles?.tocPage} bookmark={t("TOC")} size={data?.dimensions}>
        </Page>
      }

    */}
    /**
     * A4: width: 2480, height: 3508
     */
    function getPart() {
      return (
        <View break style={data.styles?.contentTable}>
          <View style={data.styles?.contentTableBlock}>
            <Text style={data.styles?.contentTableTitle}>{t("TOC")}</Text>

            <View style={data.styles?.contentTableLinks}>
              { titles ?
                  titles.map((title, i) => {
                    return (
                      <>
                        <Text style={data.styles?.contentTableTitle1}>{title}</Text>
                        {/*<Text>My link: <Link key={`${title}-${i}`} style={data.styles?.link} src={"#" + (i+1)}>My {title}</Link></Text>*/}
                      </>
                    )
                  })
                :
                  <Text>{t("NoContent")}</Text>
              }
            </View>
          </View>
          {background(data?.backgroundImage)}
        </View>
      )
    }

    return (
      <>
        {true ? 
          getContentIfRequested({requested: data?.displayToc, content: getPart})
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
            log("contentPages: page ${i}:", page[5])

            function getPart() {
              return (
                <>
                  {header()}

                  <Text style={data.styles?.title1}>{page[1]}</Text>
                  {page[2].map((subtitle, i) => {
                    if (typeof(subtitle) == "string"){
                      return (<Text key={`text-${i}`} style={data.styles?.text}>{subtitle}</Text>)
                    } else {
                      return displaySubtitle(1, subtitle)
                    }
                  })}
                  {page[4] != getNothingImage() && (<Image src={page[4]} style={page[5] != null ? page[5].image : data.styles?.imageContent} />)}
                  
                  {footer()}
                  
                  {/*background(page[3] == getNothingImage() && data?.backgroundImage != getNothingImage() ? data?.backgroundImage : page[3])*/}
                  {background(data?.backgroundImage)}
                </>
              )
            }
            return (
              <>
                {true ?
                    <View break style={data.styles?.contentPage}>
                      {getPart()}
                    </View>
                  :
                    <Page key={`content-${i}`} style={data.styles?.contentPage} id={page[0]} bookmark={t(page[1])} size={data?.dimensions}>
                      {getPart()}
                    </Page>
                }
              </>
            )
          })}
        </>
      )
    } else if (content?.length > 0) {
      //Without a new page every new title
      let bookmark = content[0]?.length > 0 ? t(content[0][1]) : t("Content")
      function getPart() {
        return (
          <>
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
                  {page[4] != getNothingImage() ? (<Image src={page[4]} style={page[5] != null ? page[5].image : data.styles?.imageContent} />) : (console.log())}
                </View>
              )
            })}
            {footer()}
            {background(content[0][3] == getNothingImage() && data?.backgroundImage != getNothingImage() ? data?.backgroundImage : content[0][3])}
          </>
        )
      }

      return (
        <>
          { true ?
              <>
                {/*<View break style={data.styles?.contentPage}>*/}
                {getContentIfRequested({requested: true, breakPage: data?.newPage, styles: data.styles?.contentPage, content: getPart})}
                {/*</View>*/}
              </>
            :
            <Page style={data.styles?.contentPage} id={"content"} bookmark={bookmark} size={data?.dimensions}>
                {getPart()}
            </Page>
          }
        </>
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
      log("displaySubtitle: i: ", i, "subtitle: ", subtitle);
      
      return (
        <>
          <Text key={subtitle} style={data.styles['title' + (i+1)]}>{subtitle[0]}</Text>
            {subtitle.length > 1 ?
                <>{typeof(subtitle[1]) == "string"
                    ? <>
                        <Text style={data.styles?.text}>{subtitle[1]}</Text>
                      </>
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
    log("lastPage: processing...");

    function getPart() {
      return (
        <View>
          <Text style={data.styles?.title}>{data?.backCover[number][3]}</Text>
          <Text style={data.styles?.backPageContent}>{data?.backCover[number][2]}</Text>
          {/* background(data?.backCover[number][1])*/}
          {data?.backgroundImageBackCover && background(data?.backgroundImageBackCover)}
          {/*footer()*/}
        </View>
      )
    }
    return (
      <>
        {true ?
            <View break style={data.styles?.lastPage}>
              {getPart()}
            </View>
          :
            <Page key={number} style={data.styles?.lastPage} id="backCover" bookmark={t("BackCover")} size={data?.dimensions}>
              {getPart()}
            </Page>
        }
      </>
    )
  }

  /**
   * Renders the footer in a view, usable in a page. It contains the page number and displays it
   * @returns the rendered footer
   */
  function header() {
    return(
      <View style={data?.styles?.headerContainer} render={({ pageNumber, totalPages }) => {
        if (data?.displayHeader) {
          if ((1 == pageNumber && ! data?.displayHeaderOnFirstPage)
              || (totalPages == pageNumber && ! data?.displayHeaderOnLastPage)
              || (! data?.displayHeaderOnSpecificPage?.split(/,|\s|\|/).includes(pageNumber))) {
            return <></>
          } else {
            return (
              <>
                <View style={data.styles?.header} fixed>
                  <Text style={data.styles?.headerContent}>{data?.header}</Text>
                  <Text style={data.styles?.pageNumber} render={({ pageNumber, totalPages }) => (`${pageNumber} / ${totalPages}`)} fixed/>
                </View>
              </>
            )
          }
        } else {
          return <></>
        }
      }} />
    )
  }  

  /**
   * Renders the footer in a view, usable in a page. It contains the page number and displays it
   * @returns the rendered footer
   */
  function footer() {
    return(
      <View style={data?.styles?.footerContainer} render={({ pageNumber, totalPages }) => {
        if (data?.displayFooter) {
          if ((1 == pageNumber && ! data?.displayFooterOnFirstPage)
              || (totalPages == pageNumber && ! data?.displayFooterOnLastPage)
              || (! data?.displayFooterOnSpecificPage?.split(/,|\s|\|/).includes(pageNumber))) {
            return <></>
          } else {
            return (
              <>
                <View style={data.styles?.footer} fixed>
                  <Text style={data.styles?.footerContent}>{data?.footer}</Text>
                  <Text style={data.styles?.pageNumber} render={({ pageNumber, totalPages }) => (`${pageNumber} / ${totalPages}`)} fixed/>
                </View>
              </>
            )
          }
        } else {
          return <></>
        }
      }} />
    )
  }  

  /**
   * Renders an image which will be used as a background of the page it is in
   * @param {String} img Url of an image
   * @returns A rendered image usable as a page background
   */
  function background(img){
    return (
      <View key="background" style={data.styles?.companyBackground} fixed>
        <Image style={{...data.styles?.companyBackgroundImage, width : "100%", height: "100%"}} src={img}/>
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
    log(`getInlineStyle: name: ${name}.`);

    let textStyle = {};
    let style = "";
    if (_style == null || _style == "") {
      style = name ? name[0].toUpperCase() + name.substring(1) : "";
      log(`getInlineStyle: style: ${style}.`);
    } else {
      log(`getInlineStyle: name: ${name}.`);
      style = _style[0].toLowerCase() + _style.substring(1);;
    }

    if (! data.styles[style]) {
      textStyle = {};
    } else {
      textStyle = data.styles[style];
    }

    log(`getInlineStyle: textStyle: ${JSON.stringify(textStyle)}.`);
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
    log("getInlineContent: styleName:", styleName);

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

  return (
    <>
      {
        (content && params) ?
            <Document>
              <Page style={data.styles?.scontentPage} bookmark={"contenu"} size={data?.dimensions}>

              {firstPage()}
              {getContentIfRequested({requested: data.displayToc, content: toc})}

              {getContentIfRequested({requested: true, content: contentPages})}

              {data?.backCover?.map(function(item){
                  return lastPage(item[0]-1)
                })
              }
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
