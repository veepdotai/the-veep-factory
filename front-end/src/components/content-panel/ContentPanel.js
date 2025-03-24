import ContentPanelWithResizable from "./ContentPanelWithResizable"
import ContentPanelWithSheet from "./ContentPanelWithSheet"

export default function ContentPanel( {side, id = null, info = null, content = null} ) {

  const displayType = "sheet"

  return (
    <>
        { displayType === "sheet" ?
              <ContentPanelWithSheet side={side} info={info} content={content} />
            :
              <ContentPanelWithResizable side={side} info={info} content={content} />
        }
    </>
  )
}
