import { ScrollArea, ScrollBar } from "src/components/ui/shadcn/scroll-area"

export default function ContentPanelWithSheet2panels( {id = null, info = null, content = null}) {

  return (
    <>

          {false ?
            <ScrollArea className="w-100 whitespace-nowrap">
                <ScrollBar orientation="vertical" />
                {info ? content(info.id) : ""}
            </ScrollArea>
          :
            <>{info?.id ? content(info.id) : ""}</>
          }
    </>
  )
}
