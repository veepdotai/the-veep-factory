"use client";

import { useState } from 'react'
import { Logger } from 'react-logger-lib'
import { t } from "i18next"

import { cn } from '../ui/shadcn/utils'
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar"
import { Card, CardContent, } from "@/components/ui/card"
import { ScrollArea, } from '@/components/ui/scroll-area'
   
import { Icons } from '@/constants/Icons'


import PDFLink from '../veepdotai-pdf-config/components/PDFLink';
import PDF from '../veepdotai-pdf-config/components/PDF';
import { Dialog } from '../ui/shadcn/plate-ui/dialog';
import { DialogContent, DialogTrigger } from '../ui/shadcn/dialog';

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

export default function SocialNetworkPreview({viewType = "LinkedIn", content, documentSrc = null, document = null}) {
    const log = Logger.of(SocialNetworkPreview.name)
    
    const [condensedView, setCondensedView] = useState(true)

    let documentSource = `# This is title

Some text 2

# First header

And some text

## Second header.1

And other text

A list with bullets:
* un
* deux
* trois

## Second header.2

And some other text

And again
`
    /**
     * Gets the view type for the current user. A default value is provided to the user, who can update it to suit its needs.
     * @returns 
     */
    function getViewType() {
        return "light"
    }

    function getLinkedInContent(content: ContentProps) {
        if (! content.content || typeof content.content !== "string") {
            return <>{t("NoContent")}</>
        }

        let dotChar = <div className="d-inline text-strong txt-sm">·</div>
        let textStyle = "text-xs text-slate-500"

        let maxBaselineLength = 50
        let baseline = content?.baseline ? content.baseline : t("DefaultLIBaseline")

        let maxLength = 80
        let condensedLines = content.content.substring(0, maxLength).split(/\n/)
        let allLines = content.content.split(/\n/)

        let author = content.author

        return (
            <Card className="w-100 max-h-[400px] whitespace-break-spaces">
                <CardContent>
                    <ScrollArea className="w-100 h-[400px]">
                        <div className="pt-2 flex flex-row">
                            <Avatar className="">
                                <AvatarImage src={content.avatarUrl} alt={content.author} />
                                <AvatarFallback>{author ? author.substring(0, 2).toUpperCase() : "CN"}</AvatarFallback>
                            </Avatar>
                            <div className="ms-2 flex-column">
                                <div className="text-strong text-xs align-middle">{author} {dotChar} <span className={textStyle}>1st</span></div>
                                <div className={cn(textStyle, "text-ellipsis")}>{baseline?.substring(0, maxBaselineLength)}...</div>
                                <div className={cn(textStyle, "align-text-middle")}>1d {dotChar} {Icons.world(14)}</div>
                            </div>
                        </div>
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
                        <div className='w-100'>
                            Modal ?
                            <Dialog className="h-75">
                                <DialogTrigger>PDF</DialogTrigger>
                                <DialogContent className="h-75">
                                    <PDF className="h-75" initContent={documentSource} initParams={{title: "Test"}} viewType={getViewType()} />
                                </DialogContent>
                            </Dialog>
                            {/*<PDFLink document={document} title="Test" />*/}
                            {/*
                            {mediaUrl && mediaUrl?.match(/\.pdf$/i) &&
                                <PDFLink document={document} title="Test" />
                            }
                            { mediaUrl && mediaUrl?.match(/\.(png|jpg|jpeg|gif)$/i) && <img src={mediaUrl} /> }
                            */}
                        </div>
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
