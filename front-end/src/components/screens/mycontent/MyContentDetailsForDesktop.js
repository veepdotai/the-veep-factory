import { useState } from 'react'

import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next';

import { TabsList, TabsTrigger } from "src/components/ui/shadcn/tabs"

import PDFPanel from 'src/components/veepdotai-pdf-config/PDFPanel'
import PDFParams from 'src/components/veepdotai-pdf-config/components/PDFParams';

import { Icons } from "src/constants/Icons";
import EKeyLib from '../../lib/util-ekey';
import { Utils } from '../../lib/utils';
import Veeplet from '../../lib/class-veeplet'

import MyContentDetailsUtils from './MyContentDetailsUtils'
import { UtilsDataConverter } from '../../lib/utils-data-converter';

export default class MyContentDetailsForDesktop {
  static log = Logger.of(MyContentDetailsForDesktop.name);

  static TT = ({ id, children, title }) => (
    <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
      <span>{children}</span>
    </OverlayTrigger>
  );

  static getPromptsList(prompt) {
    let tabs = Veeplet.getChainAsArray(prompt.prompts.chain).map((_promptId) => {
      if (_promptId == "STOP") return (<></>);
      let promptId = EKeyLib.encode(_promptId);
      //Object.keys(prompt.prompts.chain).map((promptId, i) => {
      //log.trace("render: row: " + row + ", i: " + i);
      let instructions = prompt.prompts[promptId];
      //let eventKey = i == 1 ? "__prompt__FiRsT__" : row;
      let eventKey = instructions?.label ?? t("UnknownLabel");
      return (
          <TabsTrigger id={`details-menu-${eventKey}`} value={eventKey}>
            <MyContentDetailsForDesktop.TT id={`m-${eventKey}`} title={`${t("Edit")} ${instructions?.label}`}>
              {Icons.editor} {instructions?.label.substring(0,4)}
            </MyContentDetailsForDesktop.TT>
          </TabsTrigger>
      )
    })

    return tabs
  }

  /**
   * 
   * @param {*} prompt 
   * @returns The menus
   */
  static desktopMenuWithTabs(prompt, mode) {
    return (
      <>
        { mode === "side" ?
          <TabsList id="details-menu-chat" variant="pills" className="">
            <div>            
              <TabsTrigger id="details-menu-chat" value="chat">
                <MyContentDetailsForDesktop.TT id="m-conversation" title={t("Chat")}>
                  {Icons.support}
                </MyContentDetailsForDesktop.TT>
              </TabsTrigger>
              <TabsTrigger id="details-menu-transcription" value="transcription">
                <MyContentDetailsForDesktop.TT id="m-transcription" title={t("Transcription")}>
                  {Icons.transcriptionView}
                </MyContentDetailsForDesktop.TT>
              </TabsTrigger>
              <TabsTrigger id="details-menu-metadata" value="metadata">
                <MyContentDetailsForDesktop.TT id="m-metadata" title={t("Metadata")}>
                  {Icons.metadataView}
                </MyContentDetailsForDesktop.TT>
              </TabsTrigger>

              {/*
              <TabsTrigger id="details-menu-sideBySide-content" value="sideBySide-content">
                  <MyContentDetailsForDesktop.TT id="m2" title={t("SideBySideView")}>{Icons.comparedView}</MyContentDetailsForDesktop.TT>
              </TabsTrigger>
              */}
            </div>
          </TabsList>
        :
          <TabsList id="details-menu-main" variant="pills" className="flex justify-start w-100 mh-100">
            <div>
              <TabsTrigger id="details-menu-content" value="content">
                  <MyContentDetailsForDesktop.TT id="m1" title={t("MainContent")}>
                    {Icons.aggregatedView}
                  </MyContentDetailsForDesktop.TT>
              </TabsTrigger>
              <TabsTrigger id="details-menu-pdf" value="pdf-merged-content">
                  <MyContentDetailsForDesktop.TT id="m3" title={t("PDFMergedContent")}>
                    {Icons.pdf}
                  </MyContentDetailsForDesktop.TT>
              </TabsTrigger>
              <TabsTrigger id="details-menu-sideBySide-content" value="sideBySide-content">
                  <MyContentDetailsForDesktop.TT id="m2" title={t("SideBySideView")}>{Icons.comparedView}</MyContentDetailsForDesktop.TT>
              </TabsTrigger>
              <TabsTrigger id="details-menu-calendar-content" value="calendar-content">
                  <MyContentDetailsForDesktop.TT id="m4" title={t("SideBySideView")}>{Icons['editorial-calendar']}</MyContentDetailsForDesktop.TT>
              </TabsTrigger>
            </div>
          </TabsList>
        }
      </>
    )
  }

  static desktopMenu(prompt, mode) {
    return MyContentDetailsForDesktop.desktopMenuWithTabs(prompt, mode)
    //return MyContentDetailsUtils.desktopMenuWithTooltips()
  }

  static desktopMarkdownContent(selectedFormat, prompt, data, contentId) {
    let log = MyContentDetailsForDesktop.log
    log.trace("desktopContent: prompt: " + JSON.stringify(prompt));
    //let content = MyContentDetailsUtils.getContent(prompt, data, contentId, true);
    //log.trace("desktopContent: content: " + JSON.stringify(content));

    return (
      <>
        {MyContentDetailsUtils.getContent(prompt, data, contentId)}
      </>
    )
  }

  /**
   * If content is CRT format then convert it to markdown
   * 
   * @param {*} selectedFormat 
   * @param {*} prompt 
   * @param {*} data 
   * @param {*} contentId 
   * @returns 
   */
  static desktopPDFContent(selectedFormat, prompt, data, contentId) {
    let log = (msg) => MyContentDetailsForDesktop.log.trace("desktopPDFContent: " + msg)
    log("prompt: " + JSON.stringify(prompt));
    log("data: " + JSON.stringify(data));

    let content = MyContentDetailsUtils.getContent(prompt, data, contentId, true);
    content = Utils.convertCrtToMarkdown(content)

    log("content is now json: " + JSON.stringify(content));

    return (
        <PDFViewer cid={contentId} content={content} data={data} />
    )
  }

}

export function PDFViewer( {cid, content, data} ) {
  let log = Logger.of(PDFViewer.name);

  if (cid) {
    log.trace("data: " + JSON.stringify(data))

    let role = "admin";
    let hasConfigCapabilities = role === "admin" ? true : false;
    const [pdfContent, setPdfContent] = useState(content);

    let vo = UtilsDataConverter.convertGqlVContentsToVO(data?.nodes)
    if (Array.isArray(vo) && vo?.length > 0) {
      vo = vo[0]
      vo.author = vo.givenName

      vo.subtitle = vo?.tvfMetadata?.subtitle
      vo.organizationName = vo?.tvfMetadata?.organizationName
      vo.version = vo?.tvfMetadata?.version

      log.trace("vo: " + JSON.stringify(vo))
    } else {
      vo = null;

      log.trace("vo: " + vo)
    }

    return(
      <PDFPanel
        cid={cid}
        initContent={pdfContent}
        initParams={new PDFParams(vo)}
        displayConfigPanel={hasConfigCapabilities} />
    )  
  } else {
    return ( 
      <>{t("NoContentAvailable")}</>
    )
  }
}