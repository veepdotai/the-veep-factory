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
//import EditorHome from '../../../common/mdxeditor/index';
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

        {/*<TabsContent value={instructions.label}>*/}
        {/*</TabsContent>*/}
        return (
          <>
            { contentId ?
                  <>
                    <div className='m-2 p-2 bg-slate-100 rounded-2'>
                      <div className='flex'>
                        <div className="you">You:</div>
                        <div className='label'>[{instructions.label}]</div>
                      </div>

                      <div className='prompt ps-2 text-sm text-wrap'>
                        {instructions.prompt.split(/\n/).map(item => <p>{item}</p>)}
                        {/*instructions.prompt.replace(/\n/g, "<br /><br />")*/}
                      </div>
                    </div>

                    <div className='m-2 p-2 bg-slate-200 rounded-2'>
                      <div className='d-inline'>
                        <div className="ai">AI:</div>
                      </div>
                      <div className='prompt ps-2 text-sm text-wrap'>
                        {/*<Markdown className={style.reactMarkdown} remarkPlugins={[remarkGfm]}>{_content.replace(/#+/g, "").replace(/\n/g, "<br /><br />")}</Markdown>*/}
                        {_content ?
                          _content.replace(/#+/g, "").split(/\n/).map(item => <p>{item}</p>)
                        :
                          t("NoContent")
                          }
                      </div>

                    </div>
                  </>
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