import { Fragment, useState } from 'react'
import { Logger } from 'react-logger-lib'
import { UtilsContent } from "../../../lib/utils-content"
import { Utils, guv } from "../../../lib/utils"
import parse from 'html-react-parser';

import EKeyLib from '../../../lib/util-ekey';

import Veeplet from '../../../lib/class-veeplet'
//import EditorHome from '../../../common/mdxeditor/index';
import Content from '../Content';
import MyContentDetailsUtils from '../MyContentDetailsUtils';
import { PlateEditor } from '../../PlateEditor';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ScrollArea } from 'src/components/ui/shadcn/scroll-area';
import SocialNetworkPreview from '../../SocialNetworkPreview';

import defaultData from 'src/config/template-definitions/layout-default.json'
import MergedContent from './MergedContent';
import { cn } from '@/lib/utils'; 

export default function SideBySideViewContent( { prompt, data, cid, width = 1 } ) {
    const log = Logger.of(SideBySideViewContent.name)

    const _guv = (param, defaultData = null) => guv("SideBySideViewContent_" + param)

    const MAX = ["xs", "sm", "md", "lg", "xl"]
    const [viewType, setViewType] = useState(_guv("VIEW")) // normal, carousel, preview 
        
    function getViewTypes() {
      return (
        <div className="flex flex-row text-sm gap-2">
          <Button variant={viewType === "normal" ? "default" : "ghost"} className="m-0 p-0" onClick={() => setViewType("normal")}>Normal</Button>
          <Button variant={viewType === "carousel" ? "default" : "ghost"} className="m-0 p-0" onClick={() => setViewType("carousel")}>Carousel</Button>
          <Button variant={viewType === "preview" ? "default" : "ghost"} className="m-0 p-0" onClick={() => setViewType("preview")}>Preview</Button>
        </div>
      )
    }

    function format(_content, _parse = false) {
        if (_content && typeof _content === "string") {
          if (! _parse) {
            return _content?.replace(/\n/g, "<br />");
          } else {
            return parse(_content?.replace(/\n/g, "<br />"));
          }
        } else {
          return "";
        }
    }

    /**
     * Carousel view
     */
    function getCarouselItem(content, i) {
      return (
        <CarouselItem key={i} className={`pl-1 flex justify-center items-center max-w-${MAX[width - 1]}`}>
          {content}
        </CarouselItem>
      )
    }

    function embedContentWithCarousel(contents) {
      let carouselCN = "m-auto w-[800px]"

      return (
        <Carousel opts={{align: "start",}} className={carouselCN}>
          <CarouselPrevious />
          <CarouselNext />
          <CarouselContent className="-ml-1">
            {contents}
          </CarouselContent>
        </Carousel>
      )
    }

    function getNormalItem(content) {
      return content
    }

    /**
     * Preview view
     */
    function getPreviewItem(node, editorWithContent, content, i, params) {
      log.trace("getPreviewItem: node: ", node)
      log.trace("getPreviewItem: document: ", document)


      let outerCN = `flex w-${_guv("PREVIEW_WIDTH")} m-2`
      log.trace("getPreviewItem: outerCN:", outerCN)

      let innerCN = `h-${_guv("PREVIEW_HEIGHT")}` // "h-100" 
      log.trace("getPreviewItem: innerCN:", innerCN)

      return (
        <div key={i} className={cn(outerCN, innerCN)}>
          <ScrollArea className={innerCN}>
              <SocialNetworkPreview
                data={node}
                editorWithContent={editorWithContent}
                content={{content: content}}
                mode="alone"
                {...params}
              />
          </ScrollArea>
        </div>
      )
    }

    function embedContentWithPreview(contents) {
      return (
        <ScrollArea className="w-100 h-[800px]">
          <div className={`p-1 w-1/${width} flex flex-wrap`}>
              {contents}
          </div>
        </ScrollArea>
      )
    }

    /**
     * Normal view with scrollbars
     */
    function embedContentWithScrollbar(contents) {
      return (
          <ScrollArea className="h-[801px]">
            {/*<div className={`p-1 w-1/${width} flex overflow-x-auto space-x-2`}>*/}
            <div className={`p-1 w-1/${width} flex flex-wrap`}>
                {contents}
            </div>
          </ScrollArea>
      )
    }

    function getViewItem({data, editorWithContent, content, viewType, i, params}) {
      log.trace("getViewItem: data:", data, "editorWithContent:", editorWithContent, "content:", content, "viewType:", viewType, "i:", i, "params:", params)
      let res
      switch (viewType) {
        case "carousel":
          res = getCarouselItem(content, i)
          break;
        case "normal":
          res = getNormalItem(content)
          break;
        case "preview":
          res = getPreviewItem(data, editorWithContent, content, i, params)
          break;
        default:
      }

      log.trace("res:", res)
      return res
    }

    /**
     * 
     */
    function getContents(data, chain, viewType, params) {
        log.trace("getContents: data:", data, "chain:", chain, "viewType:", viewType, "params:", params)

      //let chain = [].concat(prompt.prompts.chain);
        let stepsNb = chain?.length;
        let getContentsParams = (prompt, data, _promptId, i, viewType, params) => {
          log.trace("getContentsParams: data:", data, "_promptId:", _promptId, "i:", i, "viewType:", viewType, "params:", params)

          return UtilsContent.getParamsForContentThroughPrompt(prompt, data, _promptId, i, viewType, params) 
        }
        let contents = chain.map((_promptId, i) =>
          <Fragment key={_promptId}>
            {log.trace("getContentsParamsInChain.map:", getContentsParams(prompt, data, _promptId, i, viewType, params))}
            {getViewItem(getContentsParams(prompt, data, _promptId, i, viewType, params))}
          </Fragment>);
        log.trace("getContents: contents:", contents);

        return (
          <div className={`p-1`}>
            { "carousel" == viewType && embedContentWithCarousel(contents)}
            { "normal" == viewType && embedContentWithScrollbar(contents)}
            { "preview" == viewType && embedContentWithPreview(contents)}
          </div>
        );
    }

    function getOptions(options) {
      let attachmentGenerationOptions = {...options.attachmentGenerationOptions}
      let attachmentViewType = options.attachmentViewType 
      let attachmentViewOptions = {...options.attachmentViewOptions}
  
      let attachmentParams = {
        attachmentGenerationOptions: attachmentGenerationOptions,
        attachmentViewType: attachmentViewType,
        attachmentViewOptions: attachmentViewOptions
      }

      return attachmentParams
    }

    let chain = Veeplet.getChainAsArray(prompt.prompts.chain);
    
    //getContents(chain, viewType, attachmentParams)
    return (
      <>
      
        <>{getViewTypes()}</>
        { chain ?
            getContents(data, chain, viewType, getOptions(defaultData))
          :
            <>Loading...</>
        }
      </>
    )

}