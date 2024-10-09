import { ResizableHandle, ResizablePanel, ResizablePanelGroup, } from "src/components/ui/shadcn/resizable"
import { ScrollArea, ScrollBar } from "src/components/ui/shadcn/scroll-area"

export default function MyContentPanelWithResizable( {side, id = null, info = null, content = null}) {

  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="">
        <ResizablePanel style={{borderRight: "1px solid #eeefff"}} defaultSize={33}>
          <ScrollArea className="w-100 whitespace-nowrap">
            <ScrollBar orientation="vertical" />
            {side()}
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle withHandleStyle={{ marginLeft: "-1px"}} withHandleClassName="bg-light" />
        <ResizablePanel defaultSize={66}>
          {false ?
            <ScrollArea className="w-100 whitespace-nowrap">
                <ScrollBar orientation="vertical" />
                {info ? content(info.id) : ""}
            </ScrollArea>
          :
            <>{info?.id ? content(info.id) : ""}</>
          }
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}
