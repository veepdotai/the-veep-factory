import { ResizableHandle, ResizablePanel, ResizablePanelGroup, } from "src/components/ui/shadcn/resizable"
import { ScrollArea, ScrollBar } from "src/components/ui/shadcn/scroll-area"

export default function ContentPanelWithMain( {side, id = null, info = null, content = null}) {

  return (
    <>
      {info?.id ? content(info.id) : content}
    </>
  )
}
