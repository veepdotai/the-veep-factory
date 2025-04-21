import { Fragment } from 'react';
import { Logger } from 'react-logger-lib';

import parse from 'html-react-parser';

import EKeyLib from '../../../lib/util-ekey';

import Veeplet from '../../../lib/class-veeplet'
//import EditorHome from '../../../common/mdxeditor/index';
import Content from '../Content';
import MyContentDetailsUtils from '../MyContentDetailsUtils';
import { PlateEditor } from '../../PlateEditor';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import SocialNetworkPreview from '../../SocialNetworkPreview';
import { ScrollArea } from 'src/components/ui/shadcn/scroll-area';

import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { pdfjs } from 'react-pdf';
import PDF from '@/components/veepdotai-pdf-config/components/PDF';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function SideBySideViewContent( { prompt, data, cid, width = 1 } ) {
    const log = Logger.of(SideBySideViewContent.name)

    const MAX = ["xl", "lg", "md", "sm", "xs"]

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
        <div className={`h-[800px]`}>
          <Content className={`p-1`}
            contentId={lcid}
            attrName={attrName}
            title={title}
            
            raw={content}
            contentAsText={format(content)}
            contentAsText2CRLF={content}
            contentAsHtml={parse(format(content))}
          >
            <div className="p-0 bg-neutral-100">
                <PlateEditor className="p-0" view="Advanced" input={content} contentId={lcid} attrName={attrName} viewType={viewType}>
                </PlateEditor>
            </div>
          </Content>
        </div>
      )
    }
    
    /**
     * Get content through the execution of the provided prompt
     */
    function getContentThroughPrompt(_promptId, i, viewType) {
      let promptId = EKeyLib.encode(_promptId);

      let title = ''
      let attrName = ''
      let node = {}

      try {
        title = prompt.prompts[promptId].label;
        if (title.indexOf("STOP") >= 0) return (<></>);

        node = MyContentDetailsUtils.getData(data, i, attrName);
      } catch (e) {
        return (<></>)
      }

      // raw content
      let _content = node?.content ? node.content : node
      let lcid = node?.cid ? node.cid : cid

      // embeds content with editor
      let content = getContent(lcid, attrName, title, _content, viewType)

      return (
        <>
          {"carousel" == viewType && getCarouselItem(content, i)}
          {"normal" == viewType && content}
          {"preview" == viewType && getPreviewItem(_content, i)}
        </>
      )
    }

    function getCarouselItem(content, i) {
      return (
        <CarouselItem key={i} className={`pl-1 flex justify-center items-center max-w-${MAX[width - 1]}`}>
          {content}
        </CarouselItem>
      )
    }

    function getContentWithCarousel(contents) {
      /*
        <Carousel opts={{align: "start",}} className="w-full max-w-screen-full">
      */
      return (
        <Carousel opts={{align: "start",}} className="w-full w-[800px] max-w-screen-full">
          <CarouselContent className="-ml-1">
            {contents}
          </CarouselContent>
          <CarouselPrevious className='absolute left-none right-[5rem] top-0'/>
          <CarouselNext className='absolute right-[2rem] top-0'/>
        </Carousel>
      )
    }

    function getPreviewItem(content, i) {
      /*
      let mediaUrl = "https://humble-space-capybara-v494vgwqp6xcwpv4-3000.app.github.dev/assets/pdf_test_1.pdf"
      let document1 = <Document file={mediaUrl}>
          <Page pageNumber={1} height={525} />
        </Document>
      */
      let document = <PDF initContent={content} params={{}} />      
      log.trace("getPreviewItem: document: ", document)

      return (
        <div key={i} className="flex w-[400px] m-2">
          <ScrollArea className="h-100">
            <SocialNetworkPreview content={{content: content}} params={document} viewType='LinkedIn' attachmentViewType="custom"/>
          </ScrollArea>
        </div>
      )
    }

    function getContentWithPreview(contents) {
      return (
        <ScrollArea className="w-100 h-[800px]">
          <div className={`p-1 w-1/${width} flex flex-wrap`}>
              {contents}
          </div>
        </ScrollArea>
      )
    }

    function getContentWithScrollbar(contents) {
      return (
        <div className={`p-1 w-1/${width} flex overflow-x-auto space-x-2`}>
          {contents}
        </div>
      )
    }

    function getContents(chain, viewType = "normal") {
      //let chain = [].concat(prompt.prompts.chain);
        log.trace("getCompareView: chain: " + typeof chain + " / " + JSON.stringify(chain));
        let stepsNb = chain?.length;
        let contents = chain.map((_promptId, i) => <Fragment key={_promptId}>{getContentThroughPrompt(_promptId, i, viewType)}</Fragment>);

        return (
          <div className={`p-1`}>
            { "carousel" == viewType && getContentWithCarousel(contents)}
            { "normal" == viewType && getContentWithScrollbar(contents)}
            { "preview" == viewType && getContentWithPreview(contents)}
          </div>
        );
    }

    let chain = Veeplet.getChainAsArray(prompt.prompts.chain);
    let viewType = "preview"

    return (
      <>
        { chain ?
            getContents(chain, viewType)
          :
            <></>
        }
      </>
    )

}