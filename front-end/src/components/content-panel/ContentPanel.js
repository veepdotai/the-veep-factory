import ContentPanelWithResizable from "./ContentPanelWithResizable"
import ContentPanelWithSheet from "./ContentPanelWithSheet"
import ContentPanelWithMain from "./ContentPanelWithMain"

/**
 * The way content is displayed depends on the displayType.
 * 
 * @param {*} side - The side component to be displayed.
 * @param {*} id - The identifier for the content panel, default is null.
 * @param {*} info - Additional information to be displayed in the content panel, default is null.
 * @param {*} content - The main content to be displayed in the content panel, default is null. 
 * @param {*} displayType - The type of display for the content panel. It can be "sheet", "side-main", or "main".
 * @returns 
 */
export default function ContentPanel( {side, id = null, info = null, content = null, displayType = "sheet"} ) {

  return (
    <>
        { displayType === "sheet" && <ContentPanelWithSheet side={side} info={info} content={content} />}
        { displayType === "side-main" && <ContentPanelWithResizable side={side} info={info} content={content} />}
        { displayType === "main" && <ContentPanelWithMain side={side} info={info} content={content} />}
    </>
  )
}
