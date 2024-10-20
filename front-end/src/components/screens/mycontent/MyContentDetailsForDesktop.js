import { useState } from 'react'

import { Button, Tab, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import md5 from 'js-md5';
import { t } from 'i18next';

import { Separator } from "src/components/ui/shadcn/separator"
import { ToggleGroup, ToggleGroupItem } from "src/components/ui/shadcn/toggle-group"
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/shadcn/popover'
import { Tabs, TabsList, TabsTrigger } from "src/components/ui/shadcn/tabs"

//import PDF from '../../export/pdf/PDF.js';

import PDFPanel from '../../veepdotai-pdf-config/page.js'

import { Icons } from "src/constants/Icons";
import EKeyLib from '../../lib/util-ekey';
import { UtilsForm } from '../../lib/utils-form';
import Veeplet from '../../lib/class-veeplet'

import MyContentDetailsUtils from './MyContentDetailsUtils'
import Content from './Content';

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
              <TabsTrigger id="details-menu-metadata" value="metadata">
                <MyContentDetailsForDesktop.TT id="m-metadata" title={t("Metadata")}>
                  {Icons.metadataView}
                </MyContentDetailsForDesktop.TT>
              </TabsTrigger>
              <TabsTrigger id="details-menu-transcription" value="transcription">
                <MyContentDetailsForDesktop.TT id="m-transcription" title={t("Transcription")}>
                  {Icons.transcriptionView}
                </MyContentDetailsForDesktop.TT>
              </TabsTrigger>
              <TabsTrigger id="details-menu-pipeline" value="pipeline">
                <MyContentDetailsForDesktop.TT id="m-pipeline" title={t("Pipeline")}>
                  {Icons.support}
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
              {/*
              <TabsTrigger id="details-menu-sideBySide-content" value="sideBySide-content">
                  <MyContentDetailsForDesktop.TT id="m2" title={t("SideBySideView")}>{Icons.comparedView}</MyContentDetailsForDesktop.TT>
              </TabsTrigger>
              */}
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

  static desktopPDFContent(selectedFormat, prompt, data, contentId) {
    let log = MyContentDetailsForDesktop.log
    log.trace("desktopContent: prompt: " + JSON.stringify(prompt));
    let content = MyContentDetailsUtils.getContent(prompt, data, contentId, true);
    log.trace("desktopContent: content: " + JSON.stringify(content));

    return (<PDFViewer content={content} />)
  }

}

export function PDFViewer( {content} ) {

  const [pdfContent, setPdfContent] = useState(content);

  return(
    <PDFPanel content={pdfContent} />
  )

}