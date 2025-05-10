import { Fragment, useState } from 'react';
import { Logger } from 'react-logger-lib';

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

import testdata from 'src/config/data.json'
import MergedContent from './MergedContent';

export default function SideBySideViewContent( { prompt, data, cid, width = 1 } ) {
    const log = Logger.of(SideBySideViewContent.name)

    const USERAPP_DEFAULT_VIEW = "preview"

    const MAX = ["xs", "sm", "md", "lg", "xl"]
    const [viewType, setViewType] = useState(USERAPP_DEFAULT_VIEW) // normal, carousel, preview 
        
    function getViewTypes() {
      return (
        <div className="flex flex-row gap-2">
          <Button variant={viewType === "normal" ? "default" : "ghost"} className="text-md" onClick={() => setViewType("normal")}>Normal</Button>
          <Button variant={viewType === "carousel" ? "default" : "ghost"} className="text-md" onClick={() => setViewType("carousel")}>Carousel</Button>
          <Button variant={viewType === "preview" ? "default" : "ghost"} className="text-md" onClick={() => setViewType("preview")}>Preview</Button>
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

    function getContent(lcid, attrName, title, content, viewType) {
      return (
        <>
        {/*<div className={`m-auto h-100`}>*/}
          {MergedContent.getEditor({
            cid: lcid,
            attrName: attrName,
            title: title,
            content: content,
            view: viewType
          })}
        {/*</div>*/}
        </>
      )
    }
    
    /**
     * Get content through the execution of the provided prompt
     */
    function getContentThroughPrompt(_promptId, i, viewType, params) {
      let promptId = EKeyLib.encode(_promptId);

      let title = ''
      let attrName = ''
      let node = {}

      try {
        title = prompt.prompts[promptId].label;
        if (title.indexOf("STOP") >= 0) return (<></>);

        node = MyContentDetailsUtils.getData(data, i, attrName)
        log.trace("getContentThroughPrompt: node:", node)
      } catch (e) {
        return (<></>)
      }

      // raw content for preview
      let _content = node?.content ? node.content : node
      let lcid = node?.cid ? node.cid : cid

      // embeds content with editor
      let content = getContent(lcid, attrName, title, _content, viewType)

      return (
        <>
          {"carousel" == viewType && getCarouselItem(content, i)}
          {"normal" == viewType && content}
          {"preview" == viewType && getPreviewItem(node.data, content, _content, i, params)}
        </>
      )
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

    /**
     * Preview view
     */
    function getPreviewItem(node, editorWithContent, content, i, params) {
      log.trace("getPreviewItem: node: ", node)
      log.trace("getPreviewItem: document: ", document)

      return (
        <div key={i} className="flex w-[550px] m-2">
          <ScrollArea className="h-100">
              <SocialNetworkPreview data={node} editorWithContent={editorWithContent} content={{content: content}} mode="alone" {...params} />
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

    /**
     * 
     */
    function getContents(chain, viewType, params) {
      //let chain = [].concat(prompt.prompts.chain);
        log.trace("getCompareView: chain: " + typeof chain + " / ", chain);
        let stepsNb = chain?.length;
        let contents = chain.map((_promptId, i) => <Fragment key={_promptId}>{getContentThroughPrompt(_promptId, i, viewType, params)}</Fragment>);

        return (
          <div className={`p-1`}>
            { "carousel" == viewType && embedContentWithCarousel(contents)}
            { "normal" == viewType && embedContentWithScrollbar(contents)}
            { "preview" == viewType && embedContentWithPreview(contents)}
          </div>
        );
    }

    let chain = Veeplet.getChainAsArray(prompt.prompts.chain);

    let attachmentGenerationOptions = {...testdata.attachmentGenerationOptions}
    let attachmentViewType = testdata.attachmentViewType 
    let attachmentViewOptions = {...testdata.attachmentViewOptions}

    let attachmentParams = {
      attachmentGenerationOptions: attachmentGenerationOptions,
      attachmentViewType: attachmentViewType,
      attachmentViewOptions: attachmentViewOptions
    }
    
    //getContents(chain, viewType, attachmentParams)
    return (
      <>
        <>{getViewTypes()}</>
        { chain ?
            getContents(chain, viewType, attachmentParams)
          :
            <>Loading...</>
        }
      </>
    )

}