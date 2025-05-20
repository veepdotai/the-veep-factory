"use client";

import { useEffect, useId, useState } from 'react'
import { Logger } from 'react-logger-lib'
import { t, Utils } from "src/components/lib/utils"

import moment from 'moment'

import { cn } from '../ui/shadcn/utils'
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ScrollArea, } from '@/components/ui/scroll-area'
import { Button } from '../ui/shadcn/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/shadcn/tabs';

import JSCodeEditor from 'src/components/editor/JSCodeEditor';
import { getIcon } from '@/constants/Icons'

import PubSub from 'pubsub-js'

import PDF from '../veepdotai-pdf-config/components/PDF';
import PDFParams from '../veepdotai-pdf-config/components/PDFParams';
import { Constants } from '@/constants/Constants';
import { useCookies } from 'react-cookie';
import { UtilsGraphQLObject } from '@/api/utils-graphql-object';
import { UtilsGraphQLPublish } from '@/api/utils-graphql-publish';

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
        data,
        editorWithContent = null,
        content,
        id = "",
        mode = "alone",
        action = null,
        attachmentGenerationOptions = {},
        attachmentViewType = "custom",
        attachmentViewOptions = {}}
    ) {
        
    const log = (...args) => Logger.of(SocialNetworkPreview.name).trace(args)

    const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT
    const cookies = useCookies(['JWT'])

    //let localId = "" === id ? Math.round(Math.random() * 1000000000) + "" : id
    const [localId, setLocalID] = useState("" === id ? Math.round(Math.random() * 1000000000) + "" : id)

    log("attachmentGenerationOptions: ", attachmentGenerationOptions)

    log("main: node: ", data)
    let tvfTemplate = Utils.convert2json(Utils.normalize(data?.tvfTemplate), false)
    log("main: databaseId:", data.databaseId, "localId:", localId, "tvfTemplate (normalized): ", tvfTemplate)

    const [options, setOptions] = useState(tvfTemplate && "" !== tvfTemplate? tvfTemplate : {
        attachmentGenerationOptions: attachmentGenerationOptions,
        attachmentViewType: attachmentViewType,
        attachmentViewOptions: attachmentViewOptions
    })    
    const [condensedView, setCondensedView] = useState(true)

    function preview() {
        //PubSub.publish("PROCESS_CODE_EDITOR_CONTENT", {action: handleSave})
    }
    
    function handleSave(source) {
        log("handleSave from SNP")
        log("handleSave from SNP: local source", source)
        log("handleSave from SNP: global cookies", cookies)
        log("handleSave from SNP: global graphqlURI", graphqlURI)
    }

    function saveAll() {
        Utils.notify({title: t("Saving all..."), description: t("Saves layout and carousel")})
        saveContent()
        saveLayout()
        saveCarousel()
    }

    function saveContent() {
        log("saveContent")
    }
    
    /**
     * Saves layout editor content as a metadata of the current document
     */
    function handleSaveLayout(layoutSource) {
        log("handleSaveLayout: layoutSource:", layoutSource)
        let params = {
            graphqlURI: Constants.WORDPRESS_GRAPHQL_ENDPOINT,
            cookies: cookies,
            contentId: data.databaseId,
            name: "tvfTemplate",
            value: Utils.denormalize(layoutSource)
        }
        log("handleSaveLayout: params:", params)
        UtilsGraphQLObject.saveMetadata(params)
    }

    function saveLayout() {
        log("saveLayout")
        PubSub.publish("PROCESS_CODE_EDITOR_CONTENT", {action: handleSaveLayout})
    }

    function saveCarousel() {
        log("saveCarousel")
        let fileName = data.databaseId + "-" + localId + ".pdf"
        let attachmentPath = moment().format("/YYYY/MM/") + fileName
        PubSub.publish( "PROCESS_PDF_" + localId, {fileName: fileName})
        let params = {
            graphqlURI: Constants.WORDPRESS_GRAPHQL_ENDPOINT,
            cookies: cookies,
            contentId: data.databaseId,
            name: "tvfGeneratedAttachment",
            value: attachmentPath
        }
        log("saveCarousel: params:", params)
        UtilsGraphQLObject.saveMetadata(params)
    }

    function saveOnLinkedInAsDRAFT() {
        log("saveOnlinkedInAsDRAFT")
        publishOnLinkedIn("DRAFT")
    }

    function saveOnLinkedInAsPUBLISHED() {
        log("saveOnLinkedInAsPUBLISHED")
        publishOnLinkedIn("PUBLISHED")
    }

    function publishOnLinkedIn(lifecycleState = "DRAFT") {
        log("publish")
        let params = {
            graphqlURI: Constants.WORDPRESS_GRAPHQL_ENDPOINT,
            cookies: cookies,
            content_id: data.databaseId,
            lifecycleState: lifecycleState,
            topics: []
        }
        log("publish: params:", params)
        UtilsGraphQLPublish.publishOnLinkedIn(params)
            .then((data) => {
                log("publish: data:", data)
                alert("publish done!")
            })
            .catch((e) => {
                console.log("publishException", e)
                let label = "SavedOnLinkedInAs" + lifecycleState + "OK"
                if (Array.isArray(e) && 0 === e.length
                    || 0 === Object.keys(e).length) {
                    log("publish: catch: is probably not really an error. e:", JSON.stringify(e))
                    label = "SavedOnLinkedInAs" + lifecycleState + "OK"
                    Utils.notify({title: t(label), description: t(label + "Desc")})
                    log("Publishing on LinkedIn as:", lifecycleState)
                } else {
                    Utils.notify({
                        title: t("SavedOnLinkedInException"),
                        description: JSON.stringify(e)
                    })
                    log("publish: catch: it seems to be a true error: e:", e)
                }
            })
    }

    function enterInEditAndPreviewMode() {
        let params = {
            viewType: "LinkedIn",
            editorWithContent: editorWithContent,
            localId: localId,
            content: content,
            //mode: "edit",
            attachmentGenerationOptions: attachmentGenerationOptions,
            attachmentViewType: attachmentViewType,
            attachmentViewOptions: attachmentViewOptions    
        }
        log("enterInEditAndPreviewMode: ", params)

        let topicSN = "SOCIAL_NETWORK_PREVIEW_" + localId
        log("enterInEditAndPreviewMode: topicSN: ", topicSN)
        PubSub.publish("SOCIAL_NETWORK_PREVIEW_" + localId, params)
    }

    function displayEditAndPreviewSideBySide(
        topic,
        message
    ) {
        log("displayEditAndPreviewSideBySide: topic: ", topic, "params: ", message)
        let {
            viewType = "LinkedIn",
            editorWithContent,
            localId,
            content,
            attachmentGenerationOptions,
            attachmentViewType = "custom",
            attachmentViewOptions
        } = message

        function display(){

            let i = Math.random()
            return (    
                <ScrollArea className="h-100 w-100">
                    <div className="flex justify-center flex-row gap-5">
                        <SocialNetworkPreview key={`mpc-${i}-edit`} data={data} id={localId} viewType="LinkedIn" mode="edit" editorWithContent={editorWithContent} content={content}
                            attachmentGenerationOptions={attachmentGenerationOptions}
                            attachmentViewType={attachmentViewType}
                            attachmentViewOptions={attachmentViewOptions} />
                        <SocialNetworkPreview key={`mpc-${i}-preview`} data={data} id={localId} viewType="LinkedIn" mode="preview" content={content}
                            attachmentGenerationOptions={attachmentGenerationOptions}
                            attachmentViewType={attachmentViewType}
                            attachmentViewOptions={attachmentViewOptions} />
                    </div>
                </ScrollArea>
            )
        }
       
        PubSub.publish("PROMPT_DIALOG", {
            outerCN: "max-w-none w-75 h-75",
            innerCN: "",
            title: t("EditAndPreview"),
            description: t("EditAndPreviewPDF"),
            content: display()
        })

    }
        
    function getAttachmentGenerationOptions() { return options?.attachmentGenerationOptions }
    function getAttachmentViewType() { return options?.attachmentViewType }
    function getAttachmentViewOptions() { return options?.attachmentViewOptions }

    function getPDFContent(content) {
        //let pdfContent = data.content.replace(/.*---.*---(\r?\n?)*(.*)/mis, "$1").trim()
        log("getPDFContent: before transformation: content: ", content)
        let pdfContent = content.replace(/.*---[^\r\n]*---(.*)/mis, "$1")
        log("getPDFContent: ", pdfContent)
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
    function getButton(mode, action: actionProps, buttonLabel ) {
        let o = {}
        if ("function" === typeof action) {
        //if ("object" == typeof action) {
            o.action = action
            o.name = buttonLabel
            o.icon = getIcon(o.name)
            log("getButton: o1: ", o)
            console.log("getButton: o1: ", o)
        } else {
            o = action
        }

        console.log("getButton: o2: ", o)
        return (
            <Button variant={"ghost"} className="w-none" onClick={() => o.action()}>
                {o.icon} {t(Utils.capitalize(o.name, true))}
            </Button>
        )
    }

    function getLinkedInContent(editorWithContent, data: ContentProps) {
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
                    id={localId}
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
            <Card className="w-[533px] h-full whitespace-break-spaces">
                <CardContent className='m-0 p-0'>
                    <ScrollArea className="w-100 h-full">
                        <div className="flex gap-2 m-2 float-right">
                            {"alone" === mode && <div className="">{getButton(mode, enterInEditAndPreviewMode, "enterInEditAndPreviewMode")}</div>}
                            {"edit" === mode &&
                                <div className="">
                                    {getButton(mode, preview, "preview")}
                                    {getButton(mode, saveAll, "saveAll")}
                                    {/*getButton(mode, save, "save")*/}
                                    {/*getButton(mode, saveLayout, "saveLayout")*/}
                                </div>
                            }
                            {"preview" === mode &&
                                <div className="">
                                    {/*getButton(mode, saveCarousel, "saveCarousel")*/}
                                    {getButton(mode, saveOnLinkedInAsDRAFT, "saveOnLinkedInAsDRAFT")}
                                    {getButton(mode, saveOnLinkedInAsPUBLISHED, "saveOnLinkedInAsPUBLISHED")}
                                    {/*getButton(mode, publish, "publish")*/}
                                </div>
                            }
                        </div>
                        <div className='p-3 pt-0'>
                            {header}
                        </div>
                        { "alone" === mode &&
                            <div className='p-3 pt-0'>
                                {data.content}
                                {/*editorWithContent && editorWithContent*/}
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
                                        {/*data.content*/}
                                        {log("getLinkedInContent: data:", data)}
                                        {editorWithContent && editorWithContent}
                                    </div>
                                    {footer}
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
                        {"edit" !== mode && footer}
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
        if ("" != localId) {
        //if ("" != localId || ! editorWithContent) {
            let topicSN = "SOCIAL_NETWORK_PREVIEW_" + localId
            log("useEffect: subscribe: topicSN: ", topicSN)
            PubSub.subscribe(topicSN, displayEditAndPreviewSideBySide)
        }
    }, [localId])

    useEffect(() => {
        let topicPDF = "PDF_EXPORT_OPTIONS_UPDATED"
        PubSub.subscribe(topicPDF, (topic, message) => {
            log("useEffect: topic: ", topic, "message: ", message)
            setOptions(message)
        })

    }, [])

    return (
        <>
            {viewType == "LinkedIn" && getLinkedInContent(editorWithContent, content)}
        </>
    )
}
