import { useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib';
import { md5 } from "js-md5";
import { PDFViewer, Link, Page, Text, Image, View, Document, StyleSheet } from '@react-pdf/renderer';
import { t } from 'src/components/lib/utils'
import moment from "moment";
import pdfJsonFile from './PDF-stylesheet.json'
  
// Create Document Component
export default function PDF( props ) {
  const log = Logger.of(PDF.name)

  return (
    <>
      <PDFViewer width={'100%'} height={'500rem'}>
          <PDFDocument
            content={props.content}
            title={props.title || "Veep.AI"}
            subtitle={props.subtitle || "Compte rendu" }
            organizationName={props.organizationName }
            featuredImage={props.featuredImage || "./assets/images/veep.png" }
          />
      </PDFViewer>

    </>

  )
}

export function PDFDocument(props) {
  const log = Logger.of(PDFDocument.name)

  const [content, setContent] = useState(props.content);

  const styles = StyleSheet.create(pdfJsonFile);

  let data = {
    title: props.title,
    subtitle: props.subtitle,
    featuredImage: props.featuredImage,
    author: props.author || t("DefaultAuthor"),
    version: props.version || "1.0.1",
    organizationName: props.organizationName,
    date: props.date || moment().format("DD/MM/YYYY"),
    imageBg: "https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg",
    imageBg2: "https://images.pexels.com/photos/6144105/pexels-photo-6144105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    footer: props.footer || t("DefaultFooterContent"),
    backCoverContent: props.backCoverContent || t("DefaultBackCoverContent"),
  }

  function firstPage() {
    log.trace("firstPage: processing...");

    return (
      <Page style={styles.firstPage} bookmark={t("CoverPage")}>
        
        {getInlineContent("title", "title")}
        {getInlineContent("subtitle", "subtitle")}

        <Image style={styles.featuredImage} src={data.featuredImage} />

        <View style={styles.metadataBlock}>
          {/*getInlineContentWithLabel(45, t("Company"), data.companyName, "company")*/}
          {getInlineContentWithLabel(30, t("Author"), data.author, "author")}
          {getInlineContentWithLabel(15, t("Version"), data.version, "version")}
          {getInlineContentWithLabel(0, t("Date"), data.date, "date")}
        </View>

        {footer()}
      </Page>
    )
  }

  function toc() {
    log.trace("toc: content: " + JSON.stringify(content));

    const regex = /(#+ .*)/g;
    const titles = (content + "")?.match(regex);
    log.trace("toc: titles: " + JSON.stringify(titles));

    return (
      <>
        { titles ?
          <Page style={styles.tocPage} bookmark={t("TOC")}>
            <View style={styles.contentTable}>
              <Text style={styles.contentTableTitle}>{t("TOC")}</Text>

              <View style={styles.contentTableLinks}>
                {titles.map((_title, i) => {
                  let htNb = _title.match(/^#*/)[0].length || "";
                  let title = _title.replace(/#+\s*(.*)/, "$1");
                  let style = htNb == 1 ? styles.link : styles.subLink;
                  return (
                    <Link style={style} src={"#" + t(_title)}>{title}</Link>
                    )
                  })}
              </View>
            </View>
          </Page>
          :
          <></>
        }
      </>
    )
  }

  function contentPages() {
    return (
      <Page style={styles.contentPage} id={"content"} bookmark={t("Content")}>
        {header()}
        {text()}
        {footer()}
      </Page>
    )
  }

  function lastPage() {
    log.trace("lastPage: processing...");

    return (
      <Page style={styles.lastPage} id="backCover" bookmark={t("BackCover")}>
        <Text style={styles.backPageContent}>{data.backCoverContent}</Text>
        {footer()}
      </Page>      
    )
  }

  function header() {
    return (
      <View style={styles.header} fixed>
        <Image
            style={styles.image}
            src={data.featuredImage}
        />
      </View>
    )
  }

  function footer() {
    return(
      <View style={styles.footer} fixed>
        <Text style={styles.footerContent}>{data.footer}</Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (`${pageNumber} / ${totalPages}`)} fixed/>
      </View>
    )
  }

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

    if (! styles[style]) {
      textStyle = {};
    } else {
      textStyle = styles[style];
    }

    log.trace(`getInlineStyle: textStyle: ${JSON.stringify(textStyle)}.`);
    return textStyle;
  }

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

  function getInlineContentWithLabel(offset, name, data, _styleName = null) {
    let style = getInlineStyle(name, _styleName);

    return (
      <>
        { name ?
          <View style={{...styles.metadataLine}}>
            <Text style={styles.label}>{name}</Text>
            <Text style={styles.sep}>:</Text>
            <Text style={styles.value}>{data}</Text>
          </View>
          :
          <></>
        }
      </>
    )
  }

  function text() {
    log.trace("text: content: " + JSON.stringify(content));

    const regex = /\r?\n/g;
    const lines = (content + "")?.split(regex);
    log.trace("text: lines: " + JSON.stringify(lines));

    function getContent(line) {
      log.trace("getContent: line: " + JSON.stringify(line));

      let output;
      if (/^#+/.test(line)) {
        output = writeTitle(line);
      } else if (/\.(jpg|jpeg|png|gif)/.test(line)) {
        output = writeParagraphWithImage(line);
      } else {
        output = writeParagraph(line);
      }

      return output;
    }

    function writeTitle(line) {
      log.trace("writeTitle: processing...");

      let titleId = line;
      let breakIfH1 = /^# /.test(line) ? true : false;
      //breakIfH1 = false;
      let htNb = line.match(/^#*/)[0].length || "";
      return (
        <Text style={styles["title" + htNb]} id={titleId} break={breakIfH1}>
          {line.substring(htNb + 1)}
        </Text>
      )
    }

    function writeParagraph(line) {
      log.trace("writeParagraph: processing...");
      log.trace("writeParagraph: line: " + line);

      return (
        <>
          {
            line ?
            <Text style={styles.text}>
              {line}
            </Text>
          :
            <></>
          }
        </>
      )
    }

    function writeParagraphWithImage(line) {
      log.trace("writeParagraphWithImage: processing...");

      let start = true;
      let end = ! right;
      return (
        <View style={styles.container}>
          <Text style={start ? styles.alignStart : styles.alignEnd}>
              {line}
          </Text>
          <Image
              style={styles.imageInPara}
              src={data.imageBg}
          />
        </View>
      )
    }

    return (
      <>
        { lines ?
            lines.map((row, i) => getContent(row))
            :
            <></>
        }
      </>
    )
  }

  useEffect(() => {
    log.trace("useEffect: content: " + JSON.stringify(content));
  }, []);

  return (
    <>
    {
      content ?
        <Document>
          {firstPage()}
          {toc()}

          {contentPages()}

          {lastPage()}
        </Document>
      :
        <></>
      }
    </>
  );
}
