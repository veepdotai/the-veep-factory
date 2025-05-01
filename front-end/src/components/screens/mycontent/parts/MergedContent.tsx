import { Logger } from 'react-logger-lib';
import md5 from 'js-md5';
import { t } from 'src/components/lib/utils'
import parse from 'html-react-parser';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PubSub from "pubsub-js"
import { Button } from "@/components/ui/button"

import style from "./main.module.css"
import EKeyLib from '../../../lib/util-ekey';
import { Utils } from '../../../lib/utils';
import Veeplet from '../../../lib/class-veeplet'
//import EditorHome from '../../../common/mdxeditor/index';
import Content from '../Content';
import MyContentDetailsUtils from '../MyContentDetailsUtils';
import { PlateEditor } from '../../../../components/screens/PlateEditor';

export default class MergedContent {
    static log = Logger.of(MergedContent.name)

    /* Should be stored in a util class for content mgt */
    static saveItPlease(cid, attrName, content, custom = null) {
      let params = {
        cid: cid,
        content: content,
        attrName: attrName,
        custom: custom
      }
      MergedContent.log.trace(`saveItPlease: ${JSON.stringify(params)}`)
      PubSub.publish(`MARKDOWN_CONTENT_${attrName}`, params)
    }

    /**
     * Initially, content was stored in markdown format, but with slate based
     * editor, it is now stored in CRT format which supports versioning,
     * collaborative work... This format is based on json and an empty content
     * means there is a paragraph with an empty content:
     *  - [{"children":[{"text":""}],"type":"p","id":"49pfi"}]
     * 
     * @param content 
     */
    static isEmpty(content) {
      let log = (msg) => MergedContent.log.trace("isEmpty: " + msg)      

      log(`Testing if following content is empty: ${content}`)

      let isEmpty = false
      if (content) {
        if (content?.length == 4 && content == "null") {
          log("content is not null but it contains 'null' => we consider it empty")
          isEmpty = true
        } else if (content?.length == 52) {
          log("content is not null and it is 52?.length, maybe it is the empty CRT?")
          isEmpty = (content[22] + content[23]) === '""' 
        } else if (content?.length < 60) { // 52 exactly?
          log("content is not null and it is < 60?.length, maybe it is the empty CRT with a new format? We just try this case")
          try {
            let jsonContent = JSON.parse(content)
            isEmpty = jsonContent[0].children[0].text == ""
          } catch (e) {
            log("content is not null and it is < 60?.length, but parsing as json failed so there is really some content")
            isEmpty = false
          }
        }
      } else if (content == "") {
        isEmpty = true;
      } else {
        isEmpty = true;
      }

      log("isEmpty: " + isEmpty)
      return isEmpty
    }

    /**
     * Example: prompts.Q29ycmVjdGlvbg
     * @param prompt Gets the content from data corresponding to the one
     * identified by label, identified itself by the _promptId
     * 
     * prompt -> promptId (label) -> promptKey
     */
    static getPromptKey(defaultChain, label) {
      let log = (msg) => MergedContent.log.trace("getPromptKey: " + msg)      

      let j = 0;
      let done = false;
      // Looks for the id corresponding to the prompt label
      for(let i = 0; i < defaultChain?.length && ! done; i++) {
        j = i;
        let currentLabel = defaultChain[i];
        log(`currentLabel: ${currentLabel}.`);
        if (label == defaultChain[i]) {
          log(`label == currentLabel => it's the j: ${j} prompt in the pipeline.`);
          done = true;
        }
      }
      //let sectionContent = data[`veepdotaiPhase${promptId}Content`];  
      //let sectionContent = data[`veepdotaiPhase${i}Content`];
      //ERREUR i n'a pas la bonne valeur !!!
      if (! done) {
        return null;
      } else {
        return j
      }
    }


    /**
     * 
     * @param prompt Gets the content from data corresponding to the one
     * identified by label, identified itself by the _promptId
     * 
     * prompt -> promptId (label) -> promptKey
     * 
     * @param data 
     * @param options 
     * @param _promptId 
     * @returns 
     */
    static getOneContent(prompt, data, options, defaultChain, _promptId) {
      let log = (msg) => MergedContent.log.trace("getOneContent: " + msg)      

      log(`_promptId: ${JSON.stringify(_promptId)}.`);

      let promptId = EKeyLib.encode(_promptId);
      log(`promptId: ${JSON.stringify(promptId)}.`);

      let content = ""
      let label = "";
      try {
        label = prompt.prompts[promptId].label
        log(`label: ${JSON.stringify(label)} is the title of the current prompt.`);
        
        if (! label.match(/^stop/i)) {
          log(`Prompt label != stop`);

          // Are the indexes always stored the same way? Not guaranteed by the specs.
          let j = MergedContent.getPromptKey(defaultChain, label)

          // Checks all the prompts of the pipeline to find the one with the same name
          let sectionContent = MyContentDetailsUtils.getData(data, j, "")?.content;
          log(`sectionContent: ${sectionContent}`)

          let hasTitle = 0 <= sectionContent.search(/^\s{0,3}#/)
          log(`sectionContent: hasTitle: ${hasTitle}`)

          if (options?.displayLabel || ! hasTitle) {
            content += (`# ${label}\n\n${sectionContent}\n\n`);
          } else {
            content += (`${sectionContent}\n\n`);
          }
        }  
      } catch (e) {
        log(e)
        log(`${label} label hasn't any corresponding prompt in the ' ${defaultChain}' pipeline.`)
        content = `${label} label hasn't any corresponding prompt in the '${defaultChain}' pipeline.`;
      }

      return content
    }

    static getMergedContent(prompt, data, options) {
      let log = (msg) => MergedContent.log.trace("getMergedContent: " + msg)

      let defaultChain = Veeplet.getChainAsArray(prompt?.prompts?.output || prompt.prompts.chain);
      log(`prompt.prompts.chain: ${JSON.stringify(defaultChain)}.`);

      let chain = Veeplet.getChainAsArray(defaultChain);
      log(`chain: ${JSON.stringify(chain)}.`);
      log("chain is not null.");

      let content = "" // because content may contain empty CRT
      
      // We build a default content
      let r = chain?.map((_promptId, i) => {
        let oneContent = MergedContent.getOneContent(prompt, data, options, defaultChain, _promptId)
        log(`_promptId: ${_promptId}...${oneContent}!`)
        if (MergedContent.isEmpty(oneContent)) {
           log(`--content is null. Replacing CRT? with ""`)
          oneContent = ""
        } else {
          log(`-- oneContent => ${oneContent}`)
        }
        
        return oneContent
      });

      if (! r) {
        content = ""
      } else {
        log("Joining all the parts contained in the result array.")
        content = r.join("\n\n")
      }

      return content
    }

    static getContent(prompt, data) {
      let log = (msg) => MergedContent.log.trace(`getContent: ${msg}`)
      let options = {
        displayLabel: false
      }

      if (! prompt.prompts) return "";

      // We try to get the merged data from the database
      let node = MyContentDetailsUtils.getData(data, null, "content")
      let dbContent = node?.content
      log("dbContent before formatting: " + dbContent + "!")

      if (MergedContent.isEmpty(dbContent)) {
        log(`Content is empty. Merging existing children content to create one...`) 
        node.content = MergedContent.getMergedContent(prompt, data, options)
      } else {
        log(`Content is not empty... Taking it.`) 
        node.content = dbContent
      }

      log(`node: ${JSON.stringify(node)}`)

      return node
    }

    static getEditor({cid, attrName, title, content, view = "Advanced"}) {
      let editorContainerCN = "p-0" // "p-0 bg-neutral-100"
      let editorCN = "p-0"
      let editorInnerCN = "w-[801px]"

      return (
        <Content
          className={`p-1`}
          contentId={cid}
          attrName={attrName}
          title={title}
          raw={content}
          contentAsText={Utils.format(content)}
          contentAsText2CRLF={content}
          contentAsHtml={parse(Utils.format(content))}
        >
          { false ?
            <Markdown className={style.reactMarkdown} remarkPlugins={[remarkGfm]}>{content}</Markdown>
          :
            <div className={editorContainerCN}>
              <PlateEditor
                className={editorCN}
                contentId={cid}
                attrName={attrName}
                view={view}
                input={content}
                cn={editorInnerCN}>
              </PlateEditor>
            </div>      

          }
        </Content>
      )
    }

    static getElement(prompt, data, cid, returnMarkdown = false) {

      let output = <></>;
      let _content = "";
      let title = t("MainContent");
      let attrName = "post_content";

      try {

          let node = MergedContent.getContent(prompt, data)
          let _content = node.content 
          if (returnMarkdown) {
            return _content
          } else {
            let params = {
              cid: cid,
              attrName: attrName,
              title: title,
              content: _content,
              view: "Advanced"
            }
            output = MergedContent.getEditor(params)
            return output
          }

        //}
      } catch (e) {
        return <>No data</>
      }
    }

  }