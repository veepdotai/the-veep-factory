import { useEffect, useState } from "react"

import MyContentPanelWithResizable from "./MyContentPanelWithResizable"
import MyContentPanelWithSheet from "./MyContentPanelWithSheet"

export default function MyContentPanel( {side, id = null, info = null, content = null} ) {

  const displayType = "sheet"

  return (
    <>
        { displayType === "sheet" ?
              <MyContentPanelWithSheet side={side} info={info} content={content} />
            :
              <MyContentPanelWithResizable side={side} info={info} content={content} />
        }
    </>
  )
}
