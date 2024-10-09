import { useState } from 'react';
import { Logger } from 'react-logger-lib';
import md5 from 'js-md5';
import { t } from 'i18next';
import parse from 'html-react-parser';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import style from "./main.module.css"

import { TabsContent } from 'src/components/ui/shadcn/tabs'

import EKeyLib from '../../../lib/util-ekey';

import Veeplet from '../../../lib/class-veeplet'
import EditorHome from '../../../common/mdxeditor/index';
import Content from '../Content';
import MyContentDetailsUtils from '../MyContentDetailsUtils';

export default function AllStepsOneByOneContent( { prompt, data, cid } ) {
    const log = Logger.of(AllStepsOneByOneContent.name)

    const [contentId, setContentId] = useState(cid);

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
      log.trace("getAllStepsOneByOne: chain: " + typeof chain + " / " + JSON.stringify(chain));
      let r = chain.map((_promptId, i) => {
        let promptId = EKeyLib.encode(_promptId);

        let title = "";
        let attrName = "";
        let _content = "";
        let cid = null;
        let item = {};
        let instructions = prompt.prompts[promptId];
        if (instructions) {
          //let title = t(`Phase ${i}: `+ prompt.prompts[row].label);
          title = t(`${instructions.label}`);
          log.trace("getAllStepsOneByOne: title: " + title);
          if (title.indexOf("STOP") >= 0) {
            log.trace("getAllStepsOneByOne: title contains STOP: " + title);
            return (<></>)
          }
  
          //let attrName = `veepdotaiPhase${promptId}Content`;
          //attrName = `veepdotaiPhase${i}Content`;
          attrName = 'veepdotaiContent';
          //let _content = format(data[attrName]);
          //_content = data[attrName];
          //_content = MyContentDetailsUtils.getData(data, i, "content");
          item = MyContentDetailsUtils.getItem(data, i);
          _content = item.content;
          cid = item.databaseId;
          //let markdown = <EditorHome ref={refs.steps[i]} markdown={_content} contentEditableClassName={"details-" + md5(title)} />
        } else {
          return (<></>)
        }

        return (
          <>
            { contentId ?
              <TabsContent value={instructions.label}>
                <Content
                  //ref={refs.steps[i]}
                  contentId={cid}
                  attrName={attrName}
                  title={title}
                  raw={_content ?? ""}
                  //content={parse(format(data[`veepdotaiPhase${i}Content`]))}
                  //content={format(data[`veepdotaiPhase${i}Content`], true)}
                  contentAsText={format(_content)}
                  contentAsText2CRLF={_content}
                  contentAsHtml={parse(format(_content))}
                >
                  { false ?
                      <>
                        <Markdown className={style.reactMarkdown} remarkPlugins={[remarkGfm]}>{_content}</Markdown>
                      </>
                    :
                      <div className={style.reactMarkdown}>
                        <EditorHome cid={cid} attrName={attrName} markdown={_content} contentEditableClassName={"details-" + md5(title)} />
                      </div>
                  }
                </Content>
              </TabsContent>
          :
            <></>
          }
        </>
        )
      });

      //log.trace("getContentParts: " + JSON.stringify(r));
      return r;
    } else {
      return (<></>);
    }
}