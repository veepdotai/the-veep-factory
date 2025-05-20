import { Logger } from 'react-logger-lib';
import { t } from 'src/components/lib/utils';

import { Font, Page, Text, View } from '@react-pdf/renderer';

import DocUtils from './DocUtils'

Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
});

/**
 * Renders a last page according to its number and the data contained in the
 * parameter props
 * 
 * @param {Int} number 
 * @returns The rendered last page
 */
export default function LastPage({params, number = 0}) {
  const log = (...args) => Logger.of(LastPage.name).trace(args)

  log("lastPage: processing...");

  function getPart() {
    return (
      <View>
        <Text style={params.styles?.backPageTitle}>{params?.backCover[number][3]}</Text>
        <Text style={params.styles?.backPageContent}>{params?.backCover[number][2]}</Text>
        {/* DocUtils.background(params, params?.backCover[number][1])*/}
        {params?.backgroundImageBackCover && DocUtils.background(params, params?.backgroundImageBackCover)}
        {/*footer()*/}
      </View>
    )
  }
  return (
    <>
      {true ?
          <View break style={params.styles?.lastPage}>
            {getPart()}
          </View>
        :
          <Page key={number} style={params.styles?.lastPage} id="backCover" bookmark={t("BackCover")} size={params?.dimensions}>
            {getPart()}
          </Page>
      }
    </>
  )
}
