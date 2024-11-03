'use client'

import React from 'react';
import MyDocument from './components/MyDocument';
import dynamic from 'next/dynamic';

import ConfigPanel from './components/ConfigPanel';

import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from 'src/components/ui/shadcn/resizable';
import PdfParams from './components/PdfParams';
import PDF from './components/PDF';
import formatDisplay from './components/FormatDisplay';
import next from 'next';

//const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink), { ssr: false });
 
/**
 * React component used to render a PDF renderer and a PDF config pannel
 * Props : parameter - an instance of PdfParams
 *         content - an instance of (markdown or JSON) String
 */
class PDFPanel extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            params: props.parameter == undefined? new PdfParams() : props.parameter,
            content: props.content == undefined? this.translateContent(" ") : this.translateContent(props.content)
        }

        this.displayConfigPanel = props?.displayConfigPanel
        this.handleCompilePDF = this.handleCompilePDF.bind(this)
    }

    /**
         * Translate the content (either markdown or JSON) in an object
         * -> a list of pages. Each page has a nnumber, a title, and a list of
         * content. The content can be a string (paragraph) or a list 
         * containing a subtitle and its content. The content of a subtitle can 
         * be another subtitle
         * 
         * When using a correct Json, a page will only have one subtitle and 
         * this subtitle will have a String content. This format allows less 
         * options but is better to convey info for LinkedIn PDFs
         * 
         * example of a page (obtained using Markdown) :
         * [
         *  page number,
         *  title of page,
         *  [
         *    content,
         *      [subtitle, content],
         *      [subtitle, [subtitle, content]]
         *    ],
         *  background-image,
         *  content image,
         *  content image CSS
         * ]
         * 
         * @param {String} content 
         * @returns The content in the correct way to be understood by the PDF renderer
         */
    translateContent(content){
      let res = []
        try{
          //JSON
          let temp = JSON.parse(content)
          for (let i = 0; i < temp.slides.length; i++){
            res.push([
              temp.slides[i].number,
              temp.slides[i].title,
              [[temp.slides[i].subTitle, temp.slides[i].summary]],
              "./images/nothing.png",
              "./images/nothing.png",
              null])
          }
        }
        catch{
          //markdown

          //The markdown is divided using newLines
          //It is possible that it does not work if there is no blank line in between every separate title / subtitle/ paragraph
          let temp = content.split(/(?:[^\S\n]*\n){1,}\s*/)

          //Checking for every level 1 titles which will be used as reference points
          let titleIndex = []
          for (let i = 0; i < temp.length; i ++){
            if (this.checkMarkdownLevel(temp[i]) == 1){
              titleIndex.push(i)
            }else if (temp[i] == ""){
              temp[i] = " "
            }
          }

          //If there isn't lvl 1 title at all or there is none within the first 10 linebreaks
          if (titleIndex.length == 0 || titleIndex[0] > 10){
            titleIndex.unshift(0)
            temp.unshift(' ')
          }

          //loop to every title : get rid of the # and every space before the title, then generating content and pushing the result page
          for (let i = 0; i < titleIndex.length; i++){
            let start = 0
            for (let j = 0; j < temp[titleIndex[i]].length; j++){
              if (temp[titleIndex[i]][j] != " " && temp[titleIndex[i]][j] != "#"){
                start = j
                break
              }
            }
            res.push([
              i,
              temp[titleIndex[i]].slice(start),
              this.generateMarkdownTranslation(temp[titleIndex[i]], temp.slice(titleIndex[i])),
              "./images/nothing.png",
              "./images/nothing.png",
              null])
          }

        }
        return res
    }

    /**
     * 
     * @param {String} node The current title we want to prepare
     * @param {Array} other The following markdown content
     * @returns 
     */
    generateMarkdownTranslation(node, other){
      let res = []
      //checking every following content
      for (let i = 1; i < other.length; i ++){

        //next content is a subtitle that can't be in the current subtitle -> stop adding content
        if (this.checkMarkdownLevel(other[i]) <= this.checkMarkdownLevel(node) && this.checkMarkdownLevel(other[i]) > 0 ){
          return res
        }

        // next content is just text
        else if (this.checkMarkdownLevel(other[i]) == 0){
          res.push(other[i])
        }

        //next content is subtitle -> recursion
        else {
          //get rid of the # before the subtitle
          let start = 0
          for (let j = 1; j < other[i].length; j++){
            if (other[i][j] != " " && other[i][j] != "#"){
              start = j
              break
            }
          }

          let sub = [other[i].slice(start)]
          sub = sub.concat(this.generateMarkdownTranslation(other[i], other.slice(i)))
          i += sub.length -1
          res.push(sub)
        }
      }
      return res
    }

    /**
     * Checks the markdown level of a string (number of importance, 0 being just a paragraph, 1 being a level 1 title, 2 being a level 2 title, etc...)
     * @param {String} string 
     * @returns the level of importance of the string in a markdown
     */
    checkMarkdownLevel(string){
      let level = 0
      for (let i = 0; i < string.length; i ++){
        if (string[i] != '#' && string[i] != ' ' || (string[i] == ' ' && level > 0)){
          break
        }else if (string[i] == '#'){
          level += 1
        }
      }
      return level
    }


    /**
     * Refresh the PDF renderer
     * @param {PdfParams} newParams 
     */
    handleCompilePDF(newParams, newContent){
        this.setState({params: newParams, content : newContent})
    }


    /**
     * Renders the component
     * @returns the rendered component
     */
    render() {
        return (
            <div className='h-full bottom-0'>
              { this.displayConfigPanel ?
                  <ResizablePanelGroup direction="horizontal" className='h-full bottom-0'>
                      <ResizablePanel className='bottom-0'>
                          <ConfigPanel content={this.state.content} handleCompilePDF={this.handleCompilePDF} parameter={this.state.params}/>
                      </ResizablePanel>

                      <ResizableHandle/>

                      <ResizablePanel defaultSize={60} className='vh-100 bottom-0'>
                          <PDF content={this.state.content} parameter={this.state.params}/>
                      </ResizablePanel>
                  </ResizablePanelGroup>
                  :
                    <div className='vh-100'>
                      <PDF content={this.state.content} parameter={this.state.params}/>
                    </div>
              }
            </div>
        );
    }
}

/*const PdfLink = (props) => {
    return (
        <div>
            <PDFDownloadLink document={<MyDocument parameter={props.parameter}/>} fileName={props.parameter.title}>
                {({ blob, url, loading, error }) =>
                    loading ? 'Loading document...' : 'Download pdf'
                }
            </PDFDownloadLink>
        </div>
    );
};*/

export default PDFPanel;