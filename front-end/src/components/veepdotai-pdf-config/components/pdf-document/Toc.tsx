import { Logger } from 'react-logger-lib';
import { t } from 'src/components/lib/utils';

import { Font, Text, View } from '@react-pdf/renderer';

import DocUtils from './DocUtils'

Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
});

/**
 * Creates and return the Table of Content of the PDF - /!\ DOES NOT WORK PROPERLY
 * @returns the Table of Content of the PDF
 */
export default function Toc({normalizedContent, params}) {
  const log = (...args) => Logger.of(Toc.name).trace(args)

  let titles = []

  // titles are extracted from content 
  normalizedContent.map((page) => {
    titles.push(page[1])
  })

  log("toc: titles: ", titles)

  {/*
      <Page style={params.styles?.tocPage} bookmark={t("TOC")} size={params?.dimensions}>
      </Page>
    }

  */}
  /**
   * A4: width: 2480, height: 3508
   */
  function getPart() {
    return (
      <View break style={params.styles?.contentTable}>
        <View style={params.styles?.contentTableBlock}>
          <Text style={params.styles?.contentTableTitle}>{t("TOC")}</Text>

          <View style={params.styles?.contentTableLinks}>
            { titles ?
                titles.map((title, i) => {
                  return (
                    <>
                      <Text style={params.styles?.contentTableTitle1}>{title}</Text>
                      {/*<Text>My link: <Link key={`${title}-${i}`} style={params.styles?.link} src={"#" + (i+1)}>My {title}</Link></Text>*/}
                    </>
                  )
                })
              :
                <Text>{t("NoContent")}</Text>
            }
          </View>
        </View>
        {DocUtils.background(params, params?.backgroundImage)}
      </View>
    )
  }

  return (
    <>
      {true ? 
        DocUtils.getContentIfRequested({
          requested: params?.displayToc,
          fixed: false,
          breakPage: false,
          content: getPart})
      :
        <></>
      }
    </>
  )
}
