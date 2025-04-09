import { useState } from 'react'

import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next';

import { TabsList, TabsTrigger } from "src/components/ui/shadcn/tabs"
import { Checkbox } from "src/components/ui/shadcn/checkbox"

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
   * Tabs order is managed by output variable, according its presence or not. In both cases, all tabs are present.
   * No output => snack content first
   * Output => document first
   * Checkbox to display output option or not.
   * @param {*} prompt 
   * @returns The menus
   */
  static desktopMenuWithTabs(prompt, mode) {
    let log = MyContentDetailsForDesktop.log

    function getSideContent() {
      return (
        <>
          <TabsTrigger key="details-menu-chat" id="details-menu-chat" value="chat">
            <MyContentDetailsForDesktop.TT id="m-conversation" title={t("Chat")}>
              {Icons.support}
            </MyContentDetailsForDesktop.TT>
          </TabsTrigger>
          <TabsTrigger key="details-menu-transcription" id="details-menu-transcription" value="transcription">
            <MyContentDetailsForDesktop.TT id="m-transcription" title={t("Transcription")}>
              {Icons.transcriptionView}
            </MyContentDetailsForDesktop.TT>
          </TabsTrigger>
          <TabsTrigger key="details-menu-metadata" id="details-menu-metadata" value="metadata">
            <MyContentDetailsForDesktop.TT id="m-metadata" title={t("Metadata")}>
              {Icons.metadataView}
            </MyContentDetailsForDesktop.TT>
          </TabsTrigger>
        </>
      )
    }

    function getSnackContentTabs() {
      return (
        <>
          <TabsTrigger key="details-menu-sideBySide-content" id="details-menu-sideBySide-content" value="sideBySide-content">
              <MyContentDetailsForDesktop.TT id="m2" title={t("SideBySideView")}>{Icons.comparedView}</MyContentDetailsForDesktop.TT>
          </TabsTrigger>
          <TabsTrigger key="details-menu-calendar-content" id="details-menu-calendar-content" value="calendar-content">
              <MyContentDetailsForDesktop.TT id="m4" title={t("CalendarView")}>{Icons['editorial-calendar']}</MyContentDetailsForDesktop.TT>
          </TabsTrigger>
        </>
      )
    }

    function getDocumentTabs() {
      return (
        <>
          <TabsTrigger key="details-menu-content" id="details-menu-content" value="content">
              <MyContentDetailsForDesktop.TT id="m1" title={t("MainContent")}>
                {Icons.aggregatedView}
              </MyContentDetailsForDesktop.TT>
          </TabsTrigger>
          <TabsTrigger key="details-menu-pdf" id="details-menu-pdf" value="pdf-merged-content">
              <MyContentDetailsForDesktop.TT id="m3" title={t("PDFMergedContent")}>
                {Icons.pdf}
              </MyContentDetailsForDesktop.TT>
          </TabsTrigger>
        </>
      )
    }

    function displayOutputOptions() {
      function byId(id) {
        return document.getElementById(id)
      }

      function toggle(id) {
        if (byId(id).style === "visibility: display") {
          byId(id).style = "visibility: none"
        } else {
          byId(id).style = "visibility: display"
        } 
      }

      return (
        <div className="flex align-items-center">
            <Checkbox id="output-equation-state" onClick={() => toggle("output-equation")} />
            <label
              htmlFor="output-equation-state"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mx-2"
            >
              {t("Output")}
            </label>
            <input style={{"visibility": "none"}} id="output-equation" class="text-sm" value={prompt.prompts.output} disabled />
        </div>
      )
    }

    log.trace("desktopMenuWithTabs: prompt: ", prompt)
    return (
      <>
        { mode === "side" ?
          <TabsList id="details-menu-chat" variant="pills" className="">
            {getSideContent()}
          </TabsList>
        :
          <TabsList id="details-menu-main" variant="pills" className="flex justify-start w-100 mh-100">
              {prompt?.prompts?.output && getDocumentTabs()}
              {getSnackContentTabs()}
              {! prompt?.prompts?.output && getDocumentTabs()}
              {displayOutputOptions()}
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
        <LayoutPanel cid={contentId} content={content} data={data} />
    )
  }

}

export function LayoutPanel( {cid, content, data} ) {
  let log = Logger.of(LayoutPanel.name);

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