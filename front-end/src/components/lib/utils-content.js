import { Constants } from 'src/constants/Constants';
import { Logger } from 'react-logger-lib';
import EKeyLib from './util-ekey';
import MergedContent from '../screens/mycontent/parts/MergedContent';
import MyContentDetailsUtils from '../screens/mycontent/MyContentDetailsUtils';

export const UtilsContent = {
	log: (...args) => Logger.of("UtilsContent").trace(args),

  getContent: function(lcid, attrName, title, content, viewType) {
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
  },
  
  /**
   * Get content through the execution of the provided prompt
   */
  getParamsForContentThroughPrompt: function(prompt, data, _promptId, i, viewType, params) {
    UtilsContent.log("getParamsForContentThroughPrompt: data:", data, "_promptId:", _promptId, "i:", i, "viewType:", viewType, "params:", params)

    let promptId = EKeyLib.encode(_promptId);

    let title = ''
    let attrName = ''
    let node = {}

    try {
      if ("STOP" === _promptId) return (<></>)

      title = prompt.prompts[promptId].label;
      node = MyContentDetailsUtils.getData(data, i, attrName)
      UtilsContent.log("getContentThroughPrompt: node:", node)
    } catch (e) {
      UtilsContent.log("Exception:", e)
      return {}
    }

    // raw content for preview
    let _content = node?.content ? node.content : node
    let lcid = node?.cid ? node.cid : cid

    // embeds content with editor
    let content = UtilsContent.getContent(lcid, attrName, title, _content, viewType)

    let res = {
      viewType: viewType,
      data: node.data,
      editorWithContent: content,
      content: _content,
      i: i,
      params: params
    }

    UtilsContent.log("getParamsForContentThroughPrompt: res:", res)

    return res
  }
}

