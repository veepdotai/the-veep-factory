import { Logger } from 'react-logger-lib';
import { t } from 'src/components/lib/utils';

import { Font, Link, Page, Text, Image, View, Document } from '@react-pdf/renderer';

Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
});

/**
 * Builds PDF content from provided params/metadata and text content
 * 
 * @param {*} content content as simple markdown or structured content as an array of lines of content
 * @param {*} params document metadata (title, subtitle...)
 * @returns 
 */
const DocUtils = {
  log: (...args) => Logger.of("DocUtils").trace(args),

  getContentIfRequested: function({
    content,
    requested = true,
    fixed = false,
    breakPage = true,
    styles = {}
  }) {

    return (
      <View fixed={fixed} break={breakPage} style={styles} render={() => requested && "" !== requested && content()} />
    )
  },

  getNothingImage: function() {
    return "/assets/images/nothing.png"
  },

  /**
   * Renders the footer in a view, usable in a page. It contains the page number and displays it
   * @returns the rendered footer
   */
  header: function(params) {
    DocUtils.log("header: params: ", params);
    return(
      <View style={params?.styles?.headerContainer} render={({ pageNumber, totalPages }) => {
        if (params?.displayHeader) {
          if ((1 == pageNumber && ! params?.displayHeaderOnFirstPage)
              || (totalPages == pageNumber && ! params?.displayHeaderOnLastPage)
              || (! params?.displayHeaderOnSpecificPage?.split(/,|\s|\|/).includes(pageNumber))) {
            return <></>
          } else {
            return (
              <>
                <View style={params.styles?.header} fixed>
                  <Text style={params.styles?.headerContent}>{params?.header}</Text>
                  <Text style={params.styles?.pageNumber} render={({ pageNumber, totalPages }) => (`${pageNumber} / ${totalPages}`)} fixed/>
                </View>
              </>
            )
          }
        } else {
          return <></>
        }
      }} />
    )
  },

  /**
   * Renders the footer in a view, usable in a page. It contains the page number and displays it
   * @returns the rendered footer
   */
  footer: function(params) {
    return(
      <View style={params?.styles?.footerContainer} render={({ pageNumber, totalPages }) => {
        if (params?.displayFooter) {
          if ((1 == pageNumber && ! params?.displayFooterOnFirstPage)
              || (totalPages == pageNumber && ! params?.displayFooterOnLastPage)
              || (! params?.displayFooterOnSpecificPage?.split(/,|\s|\|/).includes(pageNumber))) {
            return <></>
          } else {
            return (
              <>
                <View style={params.styles?.footer} fixed>
                  <Text style={params.styles?.footerContent}>{params?.footer}</Text>
                  <Text style={params.styles?.pageNumber} render={({ pageNumber, totalPages }) => (`${pageNumber} / ${totalPages}`)} fixed/>
                </View>
              </>
            )
          }
        } else {
          return <></>
        }
      }} />
    )
  },

  /**
   * Renders an image which will be used as a background of the page it is in
   * @param {String} img Url of an image
   * @returns A rendered image usable as a page background
   */
  background: function(params, img){
    return (
      <View key="background" style={params.styles?.companyBackground} fixed>
        <Image style={{...params.styles?.companyBackgroundImage, width : "100%", height: "100%"}} src={img}/>
      </View>
    )
  },

  /**
   * 
   * @param {*} name 
   * @param {*} _style 
   * @returns 
   */
  getInlineStyle: function(params, name, _style = null) {
    DocUtils.log(`getInlineStyle: name: ${name}.`);

    let textStyle = {};
    let style = "";
    if (_style == null || _style == "") {
      style = name ? name[0].toUpperCase() + name.substring(1) : "";
      DocUtils.log(`getInlineStyle: style: ${style}.`);
    } else {
      DocUtils.log(`getInlineStyle: name: ${name}.`);
      style = _style[0].toLowerCase() + _style.substring(1);;
    }

    if (params?.styles && params?.styles[style]) {
      textStyle = params.styles[style];
    } else {
      textStyle = {};
    }

    DocUtils.log(`getInlineStyle: textStyle: ${JSON.stringify(textStyle)}.`);
    return textStyle;
  },

  /**
   * 
   * @param {*} name 
   * @param {*} _styleName 
   * @returns 
   */
  getInlineContent: function(params, name, _styleName = null) {
    let styleName = DocUtils.getInlineStyle(params, name, _styleName);
    DocUtils.log("getInlineContent: styleName:", styleName);

    return (
      <>
        { name ?
          <Text key={name} style={styleName}>{params ? params[name] : ""}</Text>
          :
          <></>
        }
      </>
    )

  },

  /**
   * 
   * @param {*} offset parameter never used
   * @param {*} name 
   * @param {*} data 
   * @param {*} _styleName 
   * @returns 
   */
  getInlineContentWithLabel: function(offset, name, data, _styleName = null, styles = null) {
    let style = DocUtils.getInlineStyle(name, _styleName);

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

}

export default DocUtils