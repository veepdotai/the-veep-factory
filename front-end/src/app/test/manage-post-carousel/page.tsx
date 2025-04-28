'use client'

import { Logger } from "react-logger-lib"
import { Dialog, DialogContent, DialogTrigger } from 'src/components/ui/shadcn/dialog';

import testdata from "../data.json"
import { t } from "@/components/lib/utils"
import PromptDialog from "src/components/common/PromptDialog"
import SocialNetworkPreview from "@/components/screens/SocialNetworkPreview";

export default function MyTest({view = "alone"}) {
  const log = Logger.of(MyTest.name)

  let now = (new Date())
  let time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
  console.log(time)

  function getText(msg) {
    let text = testdata.textPostAndSlides
    text = text.replace(/\{\{msg\}\}/g, msg)
    return text
  }

  /**
   * Preview can be done in dialog, sheet
   */
  function preview(){
    let dialog = 
        <Dialog className="h-75">
            <DialogTrigger>Edit</DialogTrigger>
            <DialogContent className="h-75">
                {displayEditAndPreviewSideBySide()}
            </DialogContent>
        </Dialog>

    return dialog
  }

  function displayEditAndPreviewSideBySide() {
    return (
      <div className="flex flex-row gap-5">
        <SocialNetworkPreview key={`mpc-${i}-edit`} mode="edit" content={{content: content}}
            attachmentGenerationOptions={options}
            attachmentViewType={viewType}
            attachmentViewOptions={viewOptions} />
        <SocialNetworkPreview key={`mpc-${i}-preview`} mode="preview" content={{content: content}}
            attachmentGenerationOptions={options}
            attachmentViewType={viewType}
            attachmentViewOptions={viewOptions} />
      </div>
    )
  }

  let contents = [
    getText("Test one.")
  ]
 
  return (
    <div className="h-screen w-full">
      <PromptDialog />
      <h1>Manage Post Carousel Test</h1>
      <div className="m-auto flex flex-col w-[1100px]">
          {contents.map((content, i) => {
              log.trace("content: ", content)

              let options = {...testdata.attachmentGenerationOptions}
              let viewType = testdata.attachmentViewType 
              let viewOptions = {...testdata.attachmentViewOptions}

              return (
                <>
                    {view === "alone" ?
                        <SocialNetworkPreview key={`mpc-${i}-alone`} mode="alone" content={{content: content}}
                              action={preview}
                              attachmentGenerationOptions={options}
                              attachmentViewType={viewType}
                              attachmentViewOptions={viewOptions} />
                    :
                      <>
                        {displayEditAndPreviewSideBySide()}
                      </>
                    }
                </>
              )
          })}
      </div>
    </div>
  );

}
