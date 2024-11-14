import { useState } from 'react'

import { Button, Tab, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import md5 from 'js-md5';
import { t } from 'i18next';

import { createPlateEditor } from '@udecode/plate-common/react';
import { MarkdownPlugin } from '@udecode/plate-markdown';
import { HeadingPlugin } from '@udecode/plate-heading/react';


import { Separator } from "src/components/ui/shadcn/separator"
import { ToggleGroup, ToggleGroupItem } from "src/components/ui/shadcn/toggle-group"
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/shadcn/popover'
import { Tabs, TabsList, TabsTrigger } from "src/components/ui/shadcn/tabs"

import PDFPanel from 'src/components/veepdotai-pdf-config/PDFPanel'
import PDFParams from 'src/components/veepdotai-pdf-config/components/PDFParams';

import { Icons } from "src/constants/Icons";
import EKeyLib from '../../lib/util-ekey';
import { Utils } from '../../lib/utils';
import { UtilsForm } from '../../lib/utils-form';
import Veeplet from '../../lib/class-veeplet'

import MyContentDetailsUtils from './MyContentDetailsUtils'
import Content from './Content';
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
              <TabsTrigger id="details-menu-pipeline" value="pipeline">
                <MyContentDetailsForDesktop.TT id="m-pipeline" title={t("Pipeline")}>
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
                  <MyContentDetailsForDesktop.TT id="m1" title={t("MainContent") + "_test"}>
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

    if (content.startsWith('[{')) {
      log("Content is in CRT format: " + content[0])
      content = Utils.convertDoubleQuotesToQuotesInJSON(content)
      log("content after \" replacement with ': content: " + content);

      const editor = createPlateEditor({ value: JSON.parse(content), plugins: [MarkdownPlugin] });      
      content = editor.api.markdown.serialize();      
    }

    log("content is now json: " + JSON.stringify(content));

    return (
        <PDFViewer content={content} data={data} />
    )
  }

}

export function PDFViewer( {content, data} ) {
  let log = Logger.of(PDFViewer.name);

  log.trace("data: " + JSON.stringify(data))

  let role = "admin";
  let hasConfigCapabilities = role === "admin" ? true : false;
  const [pdfContent, setPdfContent] = useState(content);

  let vo = UtilsDataConverter.convertGqlVContentsToVO(data.nodes)
  vo = vo[0]
  vo.author = vo.givenName

  log.trace("vo: " + JSON.stringify(vo))

  return(

    <PDFPanel
      initContent={pdfContent}
      initParams={new PDFParams(vo)}
      displayConfigPanel={hasConfigCapabilities} />
  )

}