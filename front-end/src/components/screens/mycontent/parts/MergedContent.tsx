import { Logger } from 'react-logger-lib';
import md5 from 'js-md5';
import { t } from 'i18next';
import parse from 'html-react-parser';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import style from "./main.module.css"

import EKeyLib from '../../../lib/util-ekey';
import Veeplet from '../../../lib/class-veeplet'
import EditorHome from '../../../common/mdxeditor/index';
import Content from '../Content';
import MyContentDetailsUtils from '../MyContentDetailsUtils';
import { PlateEditor } from '../../../../components/screens/PlateEditor';

export default class MergedContent {
    static log = Logger.of(MergedContent.name)

    static format(_content, _parse = false) {
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

    static getContent(prompt, data) {
      let displayLabel = false;

      if (! prompt.prompts) return "";

      let log = MergedContent.log
      
      let defaultChain = Veeplet.getChainAsArray(prompt.prompts.chain);
      log.trace(`getContent: prompt.prompts.chain: ${JSON.stringify(defaultChain)}.`);
      //let chain = ["P.1", "Intro", "P.2"];
      //let chain = Veeplet.getChainAsArray("P.1, P.2, Intro");
      //let chain = Veeplet.getChainAsArray(["P.1", "P.2", "Intro"]);
      let chain = Veeplet.getChainAsArray(defaultChain);
      log.trace(`getContent: chain: ${JSON.stringify(chain)}.`);

      log.trace("getContent: chain is not null.");

      let _content = MergedContent.format(MyContentDetailsUtils.getData(data, null, "content"));
      
      if (_content == "") {
        // We build a kind of default content
        let r = chain.map((_promptId, i) => {
          log.trace(`getContent: _promptId: ${JSON.stringify(_promptId)}.`);

          let promptId = EKeyLib.encode(_promptId);
          log.trace(`getContent: promptId: ${JSON.stringify(promptId)}.`);

            try {
              let sectionTitle = prompt.prompts[promptId].label;
              log.trace(`getContent: sectionTitle: ${JSON.stringify(sectionTitle)}.`);
              
              if (! sectionTitle.match(/^stop/i)) {
                log.trace(`getContent: sectionTitle != stop`);

                let j = 0;
                let done = false;
                for(let i = 0; i < defaultChain.length && ! done; i++) {
                  j = i;
                  let currentLabel = defaultChain[i];
                  log.trace(`getMainContent: currentLabel: ${currentLabel}.`);
                  if (sectionTitle == defaultChain[i]) {
                    log.trace(`getMainContent: sectionTitle == currentLabel => j: ${j}.`);
                    done = true;
                  }
                }
                //let sectionContent = data[`veepdotaiPhase${promptId}Content`];  
                //let sectionContent = data[`veepdotaiPhase${i}Content`];
                //ERREUR i n'a pas la bonne valeur !!!
                MergedContent.log.trace(`getContent: j: ${j} `);

                let sectionContent = MyContentDetailsUtils.getData(data, j, "");

                if (displayLabel) {
                  _content += (`# ${sectionTitle}\n\n${sectionContent}\n\n`);
                } else {
                  _content += (`${sectionContent}\n\n`);
                }
              }  
            } catch (e) {
              _content = "No data";
            }
        });
      }
      MergedContent.log.trace(`getContent: content: ${_content} `);
      return _content;
    }

    static getElement(prompt, data, cid, returnMarkdown = false) {
      //let chain = [].concat(prompt.prompts.chain);

      let output = <></>;
      let _content = "";
      let title = t("MainContent");
      let attrName = "post_content";

      try {

        //if (chain) {
          let _content = MergedContent.getContent(prompt, data)
          if (returnMarkdown) {
            return _content
          } else {
            output =
              <Content
                  contentId={cid}
                  attrName={attrName}
                  title={title}

                  raw={_content}
                  contentAsText={MergedContent.format(_content)}
                  contentAsText2CRLF={_content}
                  contentAsHtml={parse(MergedContent.format(_content))}
                >
                    { false ?
                      <Markdown className={style.reactMarkdown} remarkPlugins={[remarkGfm]}>{_content}</Markdown>
                    :
                      <div className="">
                        <PlateEditor mdContent={_content}>
                        </PlateEditor>
                        {/*<EditorHome attrName={attrName} markdown={_content} contentEditableClassName={"details-" + md5(title)} />*/}
                      </div>      
      
                  }
                </Content>
            return output
          }

        //}
      } catch (e) {
        return <>No data</>
      }
    }

    static getElement2(prompt, data, cid, returnMarkdown = false) {
      //let chain = [].concat(prompt.prompts.chain);

      let output = <></>;
      let _content = "";
      let title = t("MainContent");
      let attrName = "post_content";

      try {

        //if (chain) {
          let _content = MergedContent.getContent(prompt, data)
          if (returnMarkdown) {
            return _content
          } else {
            output =
                <Content
                  contentId={cid}
                  attrName={attrName}
                  title={title}

                  raw={_content}
                  contentAsText={MergedContent.format(_content)}
                  contentAsText2CRLF={_content}
                  contentAsHtml={parse(MergedContent.format(_content))}
                >
                    { false ?
                      <Markdown className={style.reactMarkdown} remarkPlugins={[remarkGfm]}>{_content}</Markdown>
                    :
                      <div className={style.reactMarkdown}>
                        <EditorHome attrName={attrName} markdown={_content} contentEditableClassName={"details-" + md5(title)} />
                      </div>
                  }
                </Content>
            return output
          }

        //}
      } catch (e) {
        return <>No data</>
      }
    }
  }