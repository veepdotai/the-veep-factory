import { Logger } from 'react-logger-lib';
import { t } from 'src/components/lib/utils';

import { Font, Page, Image, View, Text } from '@react-pdf/renderer';

import DocUtils from './DocUtils'

Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
});

/**
 * Creates and return the first page of the pdf
 * @returns The first page of the PDF
 */
export default function FirstPage({params}) {
  const log = (...args) => Logger.of(FirstPage.name).trace(args)

  log("processing...");

  //let title = params?.title?.replace(/[^a-zA-Z0-9]/g, "")
  let title = "coucou"
  log("title:", title)

  function getFeaturedImage() {
    return (
      <View style={params?.styles?.featuredImageContainer}>
        <Image key={"featuredImage"} style={params?.styles?.featuredImage} src={params?.featuredImage} />
      </View>
    )
  }

  function getPart() {

    return (
      <>
          {/*getContentIfRequested({requested: params?.featuredImage, breakPage: false, content: getFeaturedImage})*/}
          {getFeaturedImage()}

          {DocUtils.getInlineContent(params, "title", "title")}
          {DocUtils.getInlineContent(params, "subtitle", "subtitle")}

          {DocUtils.getContentIfRequested({
            requested: params.displayMetadata ?? false,
            fixed: false,
            breakPage: false, 
            content: () => (
              <View style={params?.styles?.metadataBlock}>
                {/*DocUtils.getInlineContentWithLabel(45, t("Company"), params?.companyName, "company")*/}
                {DocUtils.getInlineContentWithLabel(30, t("OrganizationName"), params?.organizationName, "organizationName", params?.styles)}
                {DocUtils.getInlineContentWithLabel(30, t("Author"), params?.author, "author", params?.styles)}
                {DocUtils.getInlineContentWithLabel(15, t("Version"), params?.version, "version", params?.styles)}
                {DocUtils.getInlineContentWithLabel(0, t("Date"), params?.date, "date", params?.styles)}
              </View>)
          })}
          {params?.backgroundImageCover == DocUtils.getNothingImage() ? DocUtils.background(params, params?.backgroundImage) : DocUtils.background(params, params?.backgroundImageCover)}

          {DocUtils.footer(params)}
      </>
    )
  }

  return (
    <>
      { true &&
          <>
            <View style={params?.styles?.firstPage}>
              {/*DocUtils.getContentIfRequested({requested: params?.displayFirstPage, breakPage: true, content: getPart})*/}
              {getPart()}
            </View>
          </>
      }

      {/* false ?
          <View style={params?.styles?.firstPage}>
            {DocUtils.getContentIfRequested({requested: params?.displayFirstPage, breakPage: true, content: getPart})}
          </View>
        :
          <Page style={params?.styles?.firstPage} bookmark={t("CoverPage")} size={params?.dimensions || "A4"}>
            {getPart()}    
          </Page>
      */}
    </>
  )

}
