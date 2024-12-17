import { Logger } from 'react-logger-lib';

import parse from 'html-react-parser';

import EKeyLib from '../../../lib/util-ekey';

import Veeplet from '../../../lib/class-veeplet'
//import EditorHome from '../../../common/mdxeditor/index';
import Content from '../Content';
import MyContentDetailsUtils from '../MyContentDetailsUtils';
import { PlateEditor } from '../../PlateEditor';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/src/components/ui/shadcn/carousel';

export default function SideBySideViewContent( { prompt, data, cid, width = 1 } ) {
    const log = Logger.of(SideBySideViewContent.name)

    const MAX = ["xl", "lg", "md", "sm", "xs"]

    function format(_content, _parse = false) {
        if (_content) {
          if (! _parse) {
            return _content.replace(/\n/g, "<br />");
          } else {
            return parse(_content.replace(/\n/g, "<br />"));
          }
        } else {
          return "";
        }
    }

    function getCarouselItem(content, i) {
      return (
        <CarouselItem key={i} className={`pl-1 flex justify-center items-center max-w-${MAX[width - 1]}`}>
          {content}
        </CarouselItem>
      )
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
    
    function getPromptContent(_promptId, i, viewType) {
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

      let _content = node?.content ? node.content : node
      let lcid = node?.cid ? node.cid : cid

      let content = getContent(lcid, attrName, title, _content, viewType)

      return (
        <>
          {"carousel" == viewType ?
              getCarouselItem(content, i)
            :
              content
          }
        </>
      )
    }

    function getContentWithCarousel(content) {
      return (
        <Carousel opts={{align: "start",}} className="w-full max-w-screen-full">
          <CarouselContent className="-ml-1">
            {content}
          </CarouselContent>
          <CarouselPrevious className='absolute left-none right-[5rem] top-0'/>
          <CarouselNext className='absolute right-[2rem] top-0'/>
        </Carousel>
      )
    }

    function getContentWithScrollbar(content) {
      return (
        <div className={`p-1 w-1/${width} flex overflow-x-auto space-x-2`}>
          {content}
        </div>
      )
    }

    function getContents(chain, viewType = "scroll") {
      //let chain = [].concat(prompt.prompts.chain);
        log.trace("getCompareView: chain: " + typeof chain + " / " + JSON.stringify(chain));
        let stepsNb = chain?.length;
        let contents = chain.map((_promptId, i) => getPromptContent(_promptId, i, viewType));

        return (
          <div className={`p-1`}>
            { "carousel" == viewType ?
                getContentWithCarousel(contents)
              :
                getContentWithScrollbar(contents)
            }
          </div>
        );
    }

    let chain = Veeplet.getChainAsArray(prompt.prompts.chain);
    let viewType = "carousel"

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