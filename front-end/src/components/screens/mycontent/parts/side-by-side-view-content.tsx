import { Logger } from 'react-logger-lib';

import parse from 'html-react-parser';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Col, Row } from 'react-bootstrap';
import { ScrollArea, ScrollBar } from '@/src/components/ui/shadcn/scroll-area';

import EKeyLib from '../../../lib/util-ekey';

import Veeplet from '../../../lib/class-veeplet'
//import EditorHome from '../../../common/mdxeditor/index';
import Content from '../Content';
import MyContentDetailsUtils from '../MyContentDetailsUtils';
import { PlateEditor } from '../../PlateEditor';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/src/components/ui/shadcn/carousel';

export default function SideBySideViewContent( { prompt, data, cid, width = 1 } ) {
    const log = Logger.of(SideBySideViewContent.name)

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

    //let chain = [].concat(prompt.prompts.chain);
    let chain = Veeplet.getChainAsArray(prompt.prompts.chain);
    if (chain) {
      log.trace("getCompareView: chain: " + typeof chain + " / " + JSON.stringify(chain));
      let stepsNb = chain?.length;
      let r = chain.map((_promptId, i) => {
        let promptId = EKeyLib.encode(_promptId);

        //let title = t(`Phase ${i}: `+ prompt.prompts[row].label);
        let title = '';
        let attrName = '';
        let node = {};
        try {
          title = prompt.prompts[promptId].label;
          if (title.indexOf("STOP") >= 0) return (<></>);
  
          //let attrName = `veepdotaiPhase${promptId}Content`;
          //attrName = `veepdotaiPhase${i}Content`;
          //attrName = "content"
          //let _content = format(data[attrName]);
          //_content = data[attrName];
          node = MyContentDetailsUtils.getData(data, i, attrName);
        } catch (e) {
          return (<></>)
        }

        let _content = node?.content ? node.content : node
        let lcid = node?.cid ? node.cid : cid

        let max = ["xl", "lg", "md", "sm", "xs"]
        return (
          <CarouselItem key={i} className={`pl-1 off-basis-1/${width} flex justify-center items-center max-w-${max[width - 1]}`}>
            <div className={`h-[800px]`}>
                <Content className={`p-1`}
                  contentId={lcid}
                  attrName={attrName}
                  title={title}
                  
                  raw={_content}
                  contentAsText={format(_content)}
                  contentAsText2CRLF={_content}
                  contentAsHtml={parse(format(_content))}
                >
                  <div className="p-0 bg-neutral-100">
                      <PlateEditor className="p-0" view="Advanced" input={_content} contentId={lcid} attrName={attrName}>
                      </PlateEditor>
                  </div>
              </Content>
            </div>
          </CarouselItem>

        )
      });

      return (
        <div className={`p-1`}>
        {/*<div className={`p-1 w-1/${width} flex overflow-x-auto space-x-2`}>*/}
          <Carousel opts={{align: "start",}} className="w-full max-w-screen-full">
            <CarouselContent className="-ml-1 flex flex-row">
              {r}
            </CarouselContent>
            <CarouselPrevious className='absolute left-none right-[5rem] top-0'/>
            <CarouselNext className='absolute right-[2rem] top-0'/>
          </Carousel>
        </div>
      );
    } else {
      return (<></>);
    }
}