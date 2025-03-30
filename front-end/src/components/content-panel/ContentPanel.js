import ContentPanelWithResizable from "./ContentPanelWithResizable"
import ContentPanelWithSheet from "./ContentPanelWithSheet"
import ContentPanelWithMain from "./ContentPanelWithMain"

export default function ContentPanel( {side, id = null, info = null, content = null, displayType = "sheet"} ) {


  return (
    <>
        { displayType === "sheet" && <ContentPanelWithSheet side={side} info={info} content={content} />}
        { displayType === "side-main" && <ContentPanelWithResizable side={side} info={info} content={content} />}
        { displayType === "main" && <ContentPanelWithMain side={side} info={info} content={content} />}
    </>
  )
}
