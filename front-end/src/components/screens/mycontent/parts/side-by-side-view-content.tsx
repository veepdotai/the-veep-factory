import { Col } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import md5 from 'js-md5';
import parse from 'html-react-parser';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import EKeyLib from '../../../lib/util-ekey';

import Veeplet from '../../../lib/class-veeplet'
//import EditorHome from '../../../common/mdxeditor/index';
import Content from '../Content';
import MyContentDetailsUtils from '../MyContentDetailsUtils';

export default function SideBySideViewContent( { prompt, data, cid, width = 6 } ) {
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
      let stepsNb = chain.length;
      let r = chain.map((_promptId, i) => {
        let promptId = EKeyLib.encode(_promptId);

        //let title = t(`Phase ${i}: `+ prompt.prompts[row].label);
        let title = '';
        let attrName = '';
        let _content = '';
        try {
          title = prompt.prompts[promptId].label;
          if (title.indexOf("STOP") >= 0) return (<></>);
  
          //let attrName = `veepdotaiPhase${promptId}Content`;
          attrName = `veepdotaiPhase${i}Content`;
          attrName = "content"
          //let _content = format(data[attrName]);
          //_content = data[attrName];
          _content = MyContentDetailsUtils.getData(data, i, attrName);
        } catch (e) {
          return (<></>)
        }

        return (
          <Col className='p-1 h-100' xs={12} lg={width}>
            <Content
              contentId={cid}
              attrName={attrName}
              title={title}
              
              raw={_content}
              contentAsText={format(_content)}
              contentAsText2CRLF={_content}
              contentAsHtml={parse(format(_content))}
            >
            { true ?
              <Markdown remarkPlugins={[remarkGfm]}>{_content}</Markdown>
              :
              <>
              {/* Could be replaced by PlateEditor: <EditorHome attrName={attrName} markdown={_content} contentEditableClassName={"details-" + md5(title)} />*/}
              </>
            }
            </Content>
          </Col>
        )
      });

      return r;
    } else {
      return (<></>);
    }
}