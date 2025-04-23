'use client'

import { Logger } from "react-logger-lib"
import testdata from "../data.json"
import { t } from "@/components/lib/utils"

import SocialNetworkPreview from "@/components/screens/SocialNetworkPreview";

export default function MyTest() {
  const log = Logger.of(MyTest.name)

  let now = (new Date())
  let time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
  console.log(time)

  function getText(msg) {
    let text = testdata.textPostAndSlides
    text = text.replace(/\{\{msg\}\}/g, msg)
    return text
  }

  let contents = [
    getText("Test one.")
  ]

  return (
    <div className="h-screen w-full">
      <h1>Manage Post Carousel Test</h1>
      <div className="m-auto flex flex-col w-[1100px]">
          {contents.map((content, i) => {
              log.trace("content: ", content)

              let attachmentGenerationOptions = {...testdata.attachmentGenerationOptions}
              let attachmentViewType = testdata.attachmentViewType 
              let attachmentViewOptions = {...testdata.attachmentViewOptions}

              let attachmentParams = {
                attachmentGenerationOptions: attachmentGenerationOptions,
                attachmentViewType: attachmentViewType,
                attachmentViewOptions: attachmentViewOptions
              }

              return (
                <div className="flex flex-row gap-5">
                  <SocialNetworkPreview key={`mpc-${i}-edit`} mode="edit" content={{content: content}} />
                  <SocialNetworkPreview key={`mpc-${i}-preview`} mode="preview" content={{content: content}} {...attachmentParams} />
                </div>
              )
          })}
      </div>
    </div>
  );

}
