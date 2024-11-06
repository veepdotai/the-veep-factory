'use client'

import React from 'react';

import ConfigPanel from './components/ConfigPanel';

import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from 'src/components/ui/shadcn/resizable';
import PdfParams from './components/PdfParams';
import PDF from './components/PDF';

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
        handleJSONContent(content) {
          let res = []
          let all = JSON.parse(content)
          for (let i = 0; i < all.slides.length; i++){
              res.push([
              all.slides[i].number,
              all.slides[i].title,
              [[all.slides[i].subTitle, all.slides[i].summary]],
              "./images/nothing.png",
              "./images/nothing.png",
              null])
          }
      
          return res
        }
      
        handleMarkdown(content) {
          // The markdown is divided using newLines
          // It is possible that it does not work if there is no blank line
          // in between every separate title / subtitle/ paragraph
          let lines = content.split(/(?:[^\S\n]*\n){1,}\s*/)
      
          // Checking for every level 1 titles which will be used as
          // reference points
          function getTitleIndexes(self, lines) {
              let titleIndexes = []
              for (let i = 0; i < lines.length; i ++){
                  let line = lines[i]
                  if (self.getMarkdownLevel(line) == 1){
                      titleIndexes.push(i)
                  } else if (line == ""){
                      line = " "
                  }
              }
      
              return titleIndexes
          }
      
          let titleIndexes = getTitleIndexes(this, lines)
          // If there isn't lvl 1 title at all or there is none within the // 
          // first 10 linebreaks
          // And so?
          if (titleIndexes.length == 0 || titleIndexes[0] > 10){
              titleIndexes.unshift(0)
              lines.unshift(' ')
          }
      
          let res = []
      
          // Loop to every title: get rid of the # and every space before
          // the title, then generating content and pushing the result page
          for (let i = 0; i < titleIndexes.length; i++){
              let currentTitleIndex = titleIndexes[i]
              let currentMarkdownTitle = lines[currentTitleIndex] 
              let currentTitle = currentMarkdownTitle.replace(/^#+\s*/, "")
              res.push([
                  i,
                  currentTitle,
                  this.generateMarkdownTranslation(currentMarkdownTitle, lines.slice(currentTitleIndex)),
                  "./images/nothing.png",
                  "./images/nothing.png",
                  null
              ])
          }
      
          return res
      
        }
      
        translateContent(content) {
          let res = []
          try {
              res = this.handleJSONContent(content)
          } catch (e) {
              res = this.handleMarkdown(content)
          }
      
          return res
        }
      
        /**
         * 
         * @param {String} title The current title we want to prepare
         * @param {Array} lines The following markdown content
         * @returns 
         */
        generateMarkdownTranslation(markdownTitle, lines) {
          let res = []
          //checking every following content
          for (let i = 1; i < lines.length; i ++){
            let line = lines[i]
            let isHigherTitle = this.getMarkdownLevel(line) > 0 && this.getMarkdownLevel(line) <= this.getMarkdownLevel(markdownTitle) 
            if (isHigherTitle) {
              // Next content is a higher title => a subtitle that can't be
              // in the current subtitle -> stop adding content
              return res
            } else if (this.getMarkdownLevel(line) == 0) {
              // Next content is just a para
              res.push(line)
            } else {
              // Next content is subtitle -> recursion
              // get rid of the # before the subtitle
              let title = line.replace(/#+\s*/, "")      
              let sub = [title]
              sub = sub.concat(this.generateMarkdownTranslation(line, lines.slice(i)))
              i = i + sub.length - 1
              res.push(sub)
            }
          }
          return res
      }
      
      /**
       * Gets the markdown level of a string
       * 
       * @param {String} string 
       * @returns the level of importance of the string in a markdown (o => paragraph, 1 => title1, 2 => title2...)
       */
      getMarkdownLevel(string){
          let level = 0
          for (let i = 0; i < string.length; i ++){
            if (string[i] != '#' && string[i] != ' ' || (string[i] == ' ' && level > 0)){
              break
            } else if (string[i] == '#'){
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