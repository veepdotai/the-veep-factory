
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
    function convertJsonToAbstractContent(content) {
      let res = []
      let all = JSON.parse(content)
      for (let i = 0; i < all.slides?.length; i++){
          res.push([
          all.slides[i].number,
          all.slides[i].title,
          [[all.slides[i].subtitle, all.slides[i].summary]],
          "./images/nothing.png",
          "./images/nothing.png",
          null])
      }
  
      return res
    }
  
    function convertMarkdownToAbstractContent(content) {

      /**
       * 
       * @param {String} title The current title we want to prepare
       * @param {Array} lines The following markdown content
       * @returns 
       */
      function convertMarkdownLinesToAbstractContent(markdownTitle, lines) {
        let res = []
        //checking every following content
        for (let i = 1; i < lines?.length; i ++){
          let line = lines[i]
          let isHigherTitle = getMarkdownLevel(line) > 0 && getMarkdownLevel(line) <= getMarkdownLevel(markdownTitle) 
          if (isHigherTitle) {
            // Next content is a higher title => a subtitle that can't be
            // in the current subtitle -> stop adding content
            return res
          } else if (getMarkdownLevel(line) == 0) {
            // Next content is just a para
            res.push(line)
          } else {
            // Next content is subtitle -> recursion
            // get rid of the # before the subtitle
            let title = line.replace(/#+\s*/, "")      
            let sub = [title]
            //sub = sub.concat(convertMarkdownLinesToAbstractContent(line, lines.slice(i)))
            sub = [...sub, ...convertMarkdownLinesToAbstractContent(line, lines.slice(i))]
            i = i + sub?.length - 1
            res.push(sub)
          }
        }
        return res
      }
      // The markdown is divided using newLines
      // It is possible that it does not work if there is no blank line
      // in between every separate title / subtitle/ paragraph
      let lines = content.split(/(?:[^\S\n]*\n){1,}\s*/)
  
      // Checking for every level 1 titles which will be used as
      // reference points
      function getTitleIndexes(lines) {
          let titleIndexes = []
          for (let i = 0; i < lines?.length; i ++){
              let line = lines[i]
              if (getMarkdownLevel(line) == 1){
                  titleIndexes.push(i)
              } else if (line == ""){
                  line = " "
              }
          }
  
          return titleIndexes
      }
  
      let titleIndexes = getTitleIndexes(lines)
      // If there isn't lvl 1 title at all or there is none within the // 
      // first 10 linebreaks
      // And so?
      if (titleIndexes?.length == 0 || titleIndexes[0] > 10){
          titleIndexes.unshift(0)
          lines.unshift(' ')
      }
  
      let res = []
  
      // Loop to every title: get rid of the # and every space before
      // the title, then generating content and pushing the result page
      for (let i = 0; i < titleIndexes?.length; i++){
          let currentTitleIndex = titleIndexes[i]
          let currentMarkdownTitle = lines[currentTitleIndex] 
          let currentTitle = currentMarkdownTitle.replace(/^#+\s*/, "")
          res.push([
              i,
              currentTitle,
              convertMarkdownLinesToAbstractContent(currentMarkdownTitle, lines.slice(currentTitleIndex)),
              "./images/nothing.png",
              "./images/nothing.png",
              null
          ])
      }
  
      return res
  
    }
        
    /**
     * Gets the markdown level of a string
     * 
     * @param {String} string 
     * @returns the level of importance of the string in a markdown (o => paragraph, 1 => title1, 2 => title2...)
     */
    function getMarkdownLevel(string){
        let level = 0
        for (let i = 0; i < string?.length; i ++){
          if (string[i] != '#' && string[i] != ' ' || (string[i] == ' ' && level > 0)){
            break
          } else if (string[i] == '#'){
            level += 1
          }
        }
        return level
    }

    function convertContentToAbstractContent(content) {
      let res = []
      try {
          res = convertJsonToAbstractContent(content)
      } catch (e) {
          res = convertMarkdownToAbstractContent(content)
      }
  
      return res
    }

export {convertMarkdownToAbstractContent as convert}