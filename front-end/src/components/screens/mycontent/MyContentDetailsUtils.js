import { ButtonGroup, Button, Col, Row } from 'react-bootstrap'
import { Logger } from 'react-logger-lib'
import { t } from 'i18next'
import parse from 'html-react-parser'

import { ToggleGroup, ToggleGroupItem } from "src/components/ui/shadcn/toggle-group"
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/shadcn/popover'

import MergedContent from './parts/MergedContent'
import AllStepsOneByOneContent from './parts/all-steps-one-by-one'
import SideBySideViewContent from './parts/side-by-side-view-content'

import EKeyLib from '../../lib/util-ekey'
import { UtilsForm } from '../../lib/utils-form'

import Content from './Content'

export default class MyContentDetailsUtils {
  static log = Logger.of(MyContentDetailsUtils.name);

//  static format(_content, _parse = false, needle = "(\\.|\\!|\\?)\\s+([A-Z])", replacement = "$1<br /><br />$2") {
  static format(_content, _parse = false, needle = "(\\.|\\!|\\?)\\s+([A-Z])", replacement = "$1\n\n$2") {
      if (_content) {
      // by default: _content.replace(/\.\s+/g, "<br /><br />");
      let needleRe = new RegExp(`${needle}`, "g")
      let r = _content.replace(needleRe, replacement)
      if (! _parse) {
        return r
      } else {
        let r = _content.replace(/(<br\s+\/>)+/g, "\n\n")
        return r
        //return parse(r);
      }
    } else {
      return "";
    }
  }

  static getItem(data, i) {
    let log = MyContentDetailsUtils.log
    let result = null
    try{
      log.trace(`getItem: data: ${JSON.stringify(data)}`)
      log.trace(`getItem: i: ${i}`)

      result = data.nodes[0].children.edges[i].node;

      log.trace(`getItem: result: ${JSON.stringify(result)}`)

    } catch (e) {
      log.trace(`getItem: exception: ${e}: data: ${JSON.stringify(data)}: i: ${i}`)
      result = "";
    }

    return result;
  }

  static getData(data, i, attrName) {
    let log = (msg) => MyContentDetailsUtils.log.trace("getData: " + msg)
    let result = null
    try{
      log(`getData: data: ${JSON.stringify(data)}`)
      log(`getData: i: ${i}`)
      log(`getData: attrName: ${attrName}`)

      if (data?.__typename === 'post') {
        if (! attrName) {
          result = data[`veepdotaiPhase${i}Content`];
        } else {
          result = data[attrName]
        }
      } else {
        if ( i === null) {
          log(`getData: i: ${i}: this is the parent.`)
          if (! attrName) {
            result = data.nodes[0].content;
          } else {
            result = data.nodes[0][attrName]
          }
          log(`getData: parent's content: ${result}!`)
        } else { // (i >= 0) { // i == 0 is a valid index
          log(`i: ${i}: this is a child.`)
          if (! attrName) {
            result = data.nodes[0].children.edges[i].node['content'];
          } else {
            result = data.nodes[0].children.edges[i].node[attrName]
          }
        }
      }

      log(`getData: result: ${result}`)

    } catch (e) {
      log(`getData: exception: ${e}: attrName: ${attrName}.`)
      result = "";
    }

    return result;
  }

  static getFormatSelectors(formats, setSelected) {
    let className = "p-0";
    let style = {maxWidth: "30rem"};
    let innerStyle = {fontSize: "0.75rem"};

    return (
      <ButtonGroup className="me-2" style={style} aria-label="First group">
        <Button style={innerStyle} variant="light">{t("Formats")}</Button>
        {formats.map((format) =>
          <Button style={innerStyle} onClick={(e) => setSelectedFormat(format)}>{format}</Button>
        )}
      </ButtonGroup>
    )

  }

  static getColumnsSelectors(columns, setWidth) {
    let className = "p-0";
    let style = {maxWidth: "11rem"};
    let innerStyle = {fontSize: "0.75rem"};

    return (
      <>
        { false ?
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-20">
                <ToggleGroup type="single">
                  {columns.map((nb) => 
                    <ToggleGroupItem value={nb} onClick={(e) => setWidth(12/nb)}>{nb}</ToggleGroupItem>
                  )}
                </ToggleGroup>
              </PopoverContent>
            </Popover>
          :
            <ToggleGroup type="single">
              {columns.map((nb) => 
                <ToggleGroupItem value={nb} onClick={(e) => setWidth(12/nb)}>{nb}</ToggleGroupItem>
              )}
            </ToggleGroup>
        }
      </>
    )
  }

  static getContent(prompt, data, cid, returnMarkdown = false) {
    if (returnMarkdown) {
      let content = MergedContent.getContent(prompt, data)
      MergedContent.log.trace(`getContent: content: ${content}`);
      return content;
    } else {
      return (
        <>
          {MergedContent.getElement(prompt, data, cid, returnMarkdown)}
        </>
      )
    }
  }

  static getAllStepsOneByOne(prompt, data, cid) {
    return (<AllStepsOneByOneContent prompt={prompt} data={data} cid={cid} />)
  }

  static getSideBySideView(prompt, data, cid, width = 6) {
    return (<SideBySideViewContent prompt={prompt} data={data} cid={cid} width={width} />)
  }

  static getTranscriptionContent(cid, data) {
    let log = MyContentDetailsUtils.log

    let part = "Transcription"
    //let attrName = `veepdotai${part}`
    let attrName = "veepdotaiTranscription"
    let content = data[attrName]

    let title = t("Transcription");
    log.trace("getTranscriptionContent: [no format]" + content + ".")
    log.trace("getTranscriptionContent: [format=true] => no html parsing" + MyContentDetailsUtils.format(content, true) + ".")
    log.trace("getTranscriptionContent: [format=false] => html parsing" + MyContentDetailsUtils.format(content, false) + ".")
    
    return (
      <Content
        className="h-full"
        contentId={cid}
        attrName={attrName}
        title={title}
        content={MyContentDetailsUtils.format(content, true)}
      />
    )
  }

  static getPromptContent(cid, data) {
    let part = "Prompt";
    let attrName = `veepdotai${part}`;
    let title = t("Prompt");
    return (
      <Content
        className="h-full"
        contentId={cid}
        attrName={attrName}
        title={title}
        content={MyContentDetailsUtils.format(data[attrName], true, "\\n\\s+", "<br /><br />")}
      />
    )

  }

  static getInput(name, varName, params = null) {
    let outerStyle = params?.outerStyle || "";
    let innerStyle = params?.innerStyle || "";
    return (
      <Row {...outerStyle}>
        <Col {...innerStyle}>{UtilsForm.getValue(name, varName, params, veepletObject, MyContentDetailsUtils.handleChange)}</Col>
      </Row>
    )
  }

}
