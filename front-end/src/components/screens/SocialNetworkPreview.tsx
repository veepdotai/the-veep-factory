"use client";

import { useEffect, useState } from 'react'
import { Logger } from 'react-logger-lib'
import { t, Utils } from "src/components/lib/utils"

import { cn } from '../ui/shadcn/utils'
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ScrollArea, } from '@/components/ui/scroll-area'
import { Button } from '../ui/shadcn/button';

import JSCodeEditor from 'src/components/editor/JSCodeEditor';
import { getIcon } from '@/constants/Icons'

import PubSub from 'pubsub-js'

import PDF from '../veepdotai-pdf-config/components/PDF';
import PDFParams from '../veepdotai-pdf-config/components/PDFParams';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/shadcn/tabs';

interface ContentProps {
    avatarUrl?: string,
    author?: string,
    baseline?: string,
    title: string,
    content: string,
    mediaUrl: string,
    viewType?: string,
    documentSrc?: string,
    document?: Blob
}

export default function SocialNetworkPreview({
        viewType = "LinkedIn",
        content,
        mode = "alone",
        action = null,
        attachmentGenerationOptions = {},
        attachmentViewType = "custom",
        attachmentViewOptions = {}}
    ) {

    const log = Logger.of(SocialNetworkPreview.name)
    log.trace("attachmentGenerationOptions: ", attachmentGenerationOptions)
    
    const [options, setOptions] = useState({
        attachmentGenerationOptions: attachmentGenerationOptions,
        attachmentViewType: attachmentViewType,
        attachmentViewOptions: attachmentViewOptions
    })    
    const [condensedView, setCondensedView] = useState(true)

    function preview() {alert("Preview")}
    function save() {alert("Save")}
    function saveLayout() {alert("SaveLayout")}
    function saveCarousel() {alert("SaveCarousel")}
    function publish() {alert("Publish")}

    function enterInEditAndPreviewMode() {
        let params = {
            viewType: "LinkedIn",
            content: content,
            //mode: "edit",
            attachmentGenerationOptions: attachmentGenerationOptions,
            attachmentViewType: attachmentViewType,
            attachmentViewOptions: attachmentViewOptions    
        }

        log.trace("enterInEditAndPreviewMode: ", params)
        PubSub.publish("SOCIAL_NETWORK_PREVIEW", params)
    }

    function displayEditAndPreviewSideBySide(
        topic,
        message
    ) {
        log.trace("displayEditAndPreviewSideBySide: topic: ", topic, "params: ", message)
        let {
            viewType = "LinkedIn",
            content,
            attachmentGenerationOptions,
            attachmentViewType = "custom",
            attachmentViewOptions
        } = message

        function display(){

            let i = Math.random()
            return (    
                <ScrollArea className="h-100 w-100">
                    <div className="flex flex-row gap-5">
                        <SocialNetworkPreview key={`mpc-${i}-edit`} viewType="LinkedIn" mode="edit" content={content}
                            attachmentGenerationOptions={attachmentGenerationOptions}
                            attachmentViewType={attachmentViewType}
                            attachmentViewOptions={attachmentViewOptions} />
                        <SocialNetworkPreview key={`mpc-${i}-preview`} viewType="LinkedIn" mode="preview" content={content}
                            attachmentGenerationOptions={attachmentGenerationOptions}
                            attachmentViewType={attachmentViewType}
                            attachmentViewOptions={attachmentViewOptions} />
                    </div>
                </ScrollArea>
            )
        }
       
        PubSub.publish("PROMPT_DIALOG", {title: "Edit and Preview", description: "Edit and previw in PDF", content: display()})

    }
        
    function getAttachmentGenerationOptions() { return options.attachmentGenerationOptions }
    function getAttachmentViewType() { return options.attachmentViewType }
    function getAttachmentViewOptions() { return options.attachmentViewOptions }

    function getPDFContent(content) {
        //let pdfContent = data.content.replace(/.*---.*---(\r?\n?)*(.*)/mis, "$1").trim()
        log.trace("getPDFContent: before transformation: content: ", content)
        let pdfContent = content.replace(/.*---[^\r\n]*---(.*)/mis, "$1")
        log.trace("getPDFContent: ", pdfContent)
        return pdfContent
    }

    interface actionProps {
        action: Function
        name?: string
        icon?: any
    }

    /**
     * 
     * @param mode Displays the button to enter in edit and preview side by side only when in "alone" mode
     * @param action 
     * @returns 
     */
    function getButton(mode, action: actionProps ) {
        //if (mode === "alone") {
            let o = {}
            if ("function" === typeof action) {
            //if ("object" == typeof action) {
                o.action = action
                o.name = o.action.name
                log.trace("getButton: o1: ", o)
                o.icon = getIcon(o.name)
            } else {
                o = action
            }

            log.trace("getButton: o2: ", o)
            return (
                <Button variant="outline" className="w-100" onClick={() => o.action()}>
                    {o.icon} {t(Utils.capitalize(o.name, true))}
                </Button>
            )
        //} else {
        //    return ""
        //}
    }

    function getLinkedInContent(data: ContentProps) {
        if (! data.content || typeof data.content !== "string") {
            return <>{t("NoContent")}</>
        }

        let dotChar = <div className="d-inline text-strong txt-sm">·</div>
        let textStyle = "text-xs text-slate-500"
        
        let maxBaselineLength = 50
        let baseline = data?.baseline ? data.baseline : t("DefaultLIBaseline")
        
        let content = data.content.replace(/(.*)---[^\r\n]*---.*/mis, "$1")
        //let content = data.content
        let maxLength = 80
        let condensedLines = content.substring(0, maxLength).split(/\n/)
        let allLines = content.split(/\n/)

        let author = data.author

        let header =
            <div className="pt-2 flex flex-row">
                <Avatar className="">
                    <AvatarImage src={data.avatarUrl} alt={data.author} />
                    <AvatarFallback>{author ? author.substring(0, 2).toUpperCase() : "CN"}</AvatarFallback>
                </Avatar>
                <div className="ms-2 flex-column">
                    <div className="text-strong text-xs align-middle">{author} {dotChar} <span className={textStyle}>1st</span></div>
                    <div className={cn(textStyle, "text-ellipsis")}>{baseline?.substring(0, maxBaselineLength)}...</div>
                    <div className={cn(textStyle, "align-text-middle")}>1d {dotChar} {getIcon("world")(14)}</div>
                </div>
            </div>

        let truncatedContent = 
            <div id="rootLinkedinContent" className="mt-2 text-slate-800 text-xs">
                <div id="linkedinContent">
                    { ! condensedView && allLines.map((line, i) => <p key={i} className="">{line}&nbsp;</p>)}
                    { condensedView && condensedLines.map((line, i) => {
                        return (
                            <p key={i} className="">
                                {line}
                                { i == condensedLines.length - 1 &&
                                    <a className="cursor-pointer hover:text-underline" onClick={(e) => {setCondensedView(false)}}>
                                        <span className="text-slate-500">&nbsp;...more</span>
                                    </a>
                                }
                            </p>
                        )
                    })}
                </div>
            </div>

        let carousel =
            <div className='w-100'>
                <PDF className="h-75"
                    initContent={getPDFContent(data.content)}
                    initParams={new PDFParams(getAttachmentGenerationOptions())}
                    viewType={getAttachmentViewType()}
                    viewOptions={getAttachmentViewOptions()}
                />
            </div>

        let footer = 
            <div>
                <div className="flex justify-between w-100 pt-1">
                    {["Up", "Support", "Publish", "Share"].map((action) => 
                        <a key={action} onClick={() => alert(t("JustPreview"))} className="px-3 py-1 rounded-1 hover:cursor-pointer hover:bg-slate-100 text-xs d-inline align-middle">
                            {getIcon(action.toLowerCase())} {t("LI" + action)}
                        </a>)
                    }
                </div>
                <div className="pt-2 flex justify-between w-100">
                    <a onClick={() => alert(t("JustPreview"))} className="text-xs text-blue-600 hover:cursor-pointer hover:text-underline d-inline align-middle">{getIcon('add-content')} {t("LIHits")}</a>
                    <a onClick={() => alert(t("JustPreview"))} className="text-xs text-blue-600 hover:cursor-pointer hover:text-underline">{t("LIViewAnalytics")}</a> 
                </div>
            </div>

        return (
            <Card className="w-100 h-full whitespace-break-spaces">
                <CardTitle>
                    {"alone" === mode && <div className="w-25">{getButton(mode, enterInEditAndPreviewMode)}</div>}
                    {"edit" === mode && <div className="w-25">{getButton(mode, preview)} | {getButton(mode, save)}</div>}
                    {"preview" === mode && <div className="w-25">{getButton(mode, saveLayout)} | {getButton(mode, saveCarousel)} | {getButton(mode, publish)}</div>}
                </CardTitle>
                <CardContent className='m-0 p-0'>
                    <ScrollArea className="w-100 h-full">
                        <div className='p-3 pt-0'>
                            {header}
                        </div>
                        { "alone" === mode &&
                            <div className='p-3 pt-0'>
                                {data.content}
                            </div>
                        }
                        { "edit" === mode &&
                            <Tabs defaultValue="edit" className="w-full">
                                <TabsList className="w-full">
                                    <TabsTrigger value="edit" className="w-1/2 text-center">{t("Edit")}</TabsTrigger>
                                    <TabsTrigger value="layout" className="w-1/2 text-center">{t("Layout")}</TabsTrigger>
                                </TabsList>
                                <TabsContent value="edit" className="w-full">
                                    <div className='p-3 pt-0'>
                                        {data.content}
                                    </div>
                                </TabsContent>
                                <TabsContent value="layout" className="w-full">
                                    <div className='p-3 pt-0'>
                                        <JSCodeEditor source={options} />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        }
                        { "preview" === mode &&
                            <>
                                <div className='p-3 pt-0'>
                                    {truncatedContent}
                                </div>
                                {carousel}
                            </>
                        }
                        {footer}
                    </ScrollArea>
                </CardContent>
            </Card>
        )
    }

    
    function getInstagramPreview() {

    }

    function getFacebookPreview() {

    }

    function getTiktokPreview() {
    }

    function getDocument() {
    }

    useEffect(() => {
        let topicPDF = "PDF_EXPORT_OPTIONS_UPDATED"
        PubSub.subscribe(topicPDF, (topic, message) => {
            log.trace("useEffect: topic: ", topic, "message: ", message)
            setOptions(message)
        })

        let topicSN = "SOCIAL_NETWORK_PREVIEW"
        PubSub.subscribe(topicSN, displayEditAndPreviewSideBySide)
    }, [])

    return (
        <>
            {viewType == "LinkedIn" && getLinkedInContent(content)}
        </>
    )
}
