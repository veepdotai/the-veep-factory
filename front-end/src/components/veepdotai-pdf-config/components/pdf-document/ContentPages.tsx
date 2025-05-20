import { Logger } from 'react-logger-lib';
import { t } from 'src/components/lib/utils';

import { Font, Link, Page, Text, Image, View, Document } from '@react-pdf/renderer';

import DocUtils from './DocUtils'

Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
});

/**
 * Creates and returns every content pages, depending on whether a new page 
 * should be started at the beginning of a new section of the PDF
 * -> we either render a new page for every title, or a new view inside of a 
 * page which contains every title.
 * 
 * @returns the content of the pdf
 */
export default function ContentPages({content, normalizedContent, params}) {
    const log = (...args) => Logger.of(ContentPages.name).trace(args)

    //With a new page every new title
    //if (content?.length == 1) return (<></>)

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
          <Text key={subtitle} style={params?.styles['title' + (i+1)]}>{subtitle[0]}</Text>
            {subtitle.length > 1 ?
                <>{typeof(subtitle[1]) == "string"
                    ? <>
                        <Text style={params?.styles?.text}>{subtitle[1]}</Text>
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

  if (params?.newPage && content?.length > 0) {
    let bookmark = content[0]?.length > 0 ? t(content[0][1]) : t("Content")
    return (
      <>
        {normalizedContent.map( (page, i) => {
          log("newpage:", params?.newPage, "contentPages: page ${i}:", page[5])

          function getPart() {
            return (
              <>
                {DocUtils.header(params)}

                <Text style={params?.styles?.title1}>{page[1]}</Text>
                {page[2].map((subtitle, i) => {
                  if (typeof(subtitle) == "string"){
                    return (<Text key={`text-${i}`} style={params?.styles?.text}>{subtitle}</Text>)
                  } else {
                    return displaySubtitle(1, subtitle)
                  }
                })}
                {page[4] != DocUtils.getNothingImage() && (<Image src={page[4]} style={page[5] != null ? page[5].image : params?.styles?.imageContent} />)}
                
                {DocUtils.footer(params)}
                
                {/*DocUtils.background(params, page[3] == DocUtils.getNothingImage() && params?.backgroundImage != DocUtils.getNothingImage() ? params?.backgroundImage : page[3])*/}
                {DocUtils.background(params, params?.backgroundImage)}
              </>
            )
          }
          return (
            <>
              {true ?
                  <View break style={params?.styles?.contentPage}>
                    {getPart()}
                  </View>
                :
                  <Page key={`content-${i}`} style={params?.styles?.contentPage} id={page[0]} bookmark={t(page[1])} size={params?.dimensions}>
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
          {DocUtils.header(params)}
          {normalizedContent.map( function(page) {
            log("newpage:", params?.newPage, "contentPages: page ${i}:", page[5])

            return (
              <View id={page[0]}>
                <Text style={params?.styles?.title1}>{page[1]}</Text>
                {
                  page[2].map((subtitle) => {
                    if (typeof(subtitle) == "string") {
                      return (
                        <Text style={params?.styles?.text}>{subtitle}</Text>
                      )
                    } else {
                      return displaySubtitle(1, subtitle)
                    }
                  })
                }
                {page[4] != DocUtils.getNothingImage() ? (<Image src={page[4]} style={page[5] != null ? page[5].image : params?.styles?.imageContent} />) : (console.log())}
              </View>
            )
          })}
          {DocUtils.footer(params)}
          {DocUtils.background(params, content[0][3] == DocUtils.getNothingImage() && params?.backgroundImage != DocUtils.getNothingImage() ? params?.backgroundImage : content[0][3])}
        </>
      )
    }

    return (
      <>
        { true ?
            <>
              {/*<View break style={params?.styles?.contentPage}>*/}
              {DocUtils.getContentIfRequested({requested: true, breakPage: params?.newPage, styles: params?.styles?.contentPage, content: getPart})}
              {/*</View>*/}
            </>
          :
            <Page style={params?.styles?.contentPage} id={"content"} bookmark={bookmark} size={params?.dimensions}>
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

