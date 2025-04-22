"use client";

import { useState } from 'react'
import { Logger } from 'react-logger-lib'
import { t } from "i18next"

import { cn } from '../ui/shadcn/utils'
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ScrollArea, } from '@/components/ui/scroll-area'
   
import { Icons } from '@/constants/Icons'

import PDF from '../veepdotai-pdf-config/components/PDF';
import { Dialog, DialogContent, DialogTrigger } from '../ui/shadcn/dialog';
import { Button } from '../ui/shadcn/button';
import PDFParams from '../veepdotai-pdf-config/components/PDFParams';

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

export default function SocialNetworkPreview({viewType = "LinkedIn", content, mode = "edit", attachmentGenerationOptions = {}, attachmentViewType = "custom", attachmentViewOptions = {}}) {
    const log = Logger.of(SocialNetworkPreview.name)
    log.trace("attachmentGenerationOptions: ", attachmentGenerationOptions)
    
    const [condensedView, setCondensedView] = useState(true)

    function preview(content){
        let dialog = 
            <Dialog className="h-75">
                <DialogTrigger>PDF</DialogTrigger>
                <DialogContent className="h-75">
                    <PDF className="h-75" initContent={content} initParams={new PDFParams(attachmentGenerationOptions)} viewType={getAttachmentViewType()} />
                </DialogContent>
            </Dialog>

        return dialog
    }
    
    /**
     * Gets the view type for the current user. A default value is provided to the user, who can update it to suit its needs.
     * @returns 
     */
    function getAttachmentViewType() {
        return attachmentViewType
    }

    function getPDFContent(content : string) {
        let pdfContent = content.replace(/.*---.*---(\r?\n)*(.*)/mis, "$1").trim()
        log.trace("getPDFContent: ", pdfContent)
        return pdfContent
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
                    <div className={cn(textStyle, "align-text-middle")}>1d {dotChar} {Icons.world(14)}</div>
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
                <PDF className="h-75" initContent={getPDFContent(content)} initParams={new PDFParams(attachmentGenerationOptions)} viewType={getAttachmentViewType()} viewOptions={attachmentViewOptions} />
            </div>

        let footer = 
            <div>
                <div className="flex justify-between w-100 pt-1">
                    {["Up", "Support", "Publish", "Share"].map((action) => 
                        <a key={action} onClick={() => alert(t("JustPreview"))} className="px-3 py-1 rounded-1 hover:cursor-pointer hover:bg-slate-100 text-xs d-inline align-middle">
                            {Icons[action.toLowerCase()]} {t("LI" + action)}
                        </a>)
                    }
                </div>
                <div className="pt-2 flex justify-between w-100">
                    <a onClick={() => alert(t("JustPreview"))} className="text-xs text-blue-600 hover:cursor-pointer hover:text-underline d-inline align-middle">{Icons['add-content']} {t("LIHits")}</a>
                    <a onClick={() => alert(t("JustPreview"))} className="text-xs text-blue-600 hover:cursor-pointer hover:text-underline">{t("LIViewAnalytics")}</a> 
                </div>
            </div>

        return (
            <Card className="w-100 h-full whitespace-break-spaces">
                <CardTitle><Button onClick={() => preview()}>{t("Preview")}</Button></CardTitle>
                <CardContent className='m-0 p-0'>
                    <ScrollArea className="w-100 h-full">
                        <div className='p-3 pt-0'>
                            {header}
                        </div>
                        {"edit" === mode ?
                                <div className='p-3 pt-0'>
                                    {data.content}
                                </div>
                            :
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

    return (
        <>
            {viewType == "LinkedIn" && getLinkedInContent(content)}
        </>
    )
}
