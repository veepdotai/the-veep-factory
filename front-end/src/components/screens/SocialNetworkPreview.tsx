"use client";

import { useState } from 'react'
import { Logger } from 'react-logger-lib'
import { t } from "i18next"

import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
import 'react-pdf/dist/esm/Page/TextLayer.css';

import { cn } from '../ui/shadcn/utils'
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar"
import { Card, CardContent, } from "@/components/ui/card"
import { ScrollArea, } from '@/components/ui/scroll-area'
   
import { Icons } from '@/constants/Icons'

interface ContentProps {
    avatarUrl?: string,
    author?: string,
    baseline?: string,
    title: string,
    content: string,
    mediaUrl: string
}

export default function SocialNetworkPreview({viewType = "LinkedIn", content}) {
    const log = Logger.of(SocialNetworkPreview.name)
    
    const [condensedView, setCondensedView] = useState(true)

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
        //let mediaUrl = /*content.mediaUrl ||*/ "https://static.vecteezy.com/system/resources/previews/005/909/455/large_2x/annual-report-template-free-vector.jpg"
        let mediaUrl = "https://3000-veepdotai-voice2post-jy1dot3bmal.ws-eu118.gitpod.io/assets/pdf_test_1.pdf"

        return (
            <Card className="w-100 max-h-[500px]">
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
                            { mediaUrl?.match(/\.pdf$/i) &&
                                <Document file={mediaUrl}>
                                    <Page pageNumber={1} height={525} />
                                </Document>
                            }
                            { mediaUrl && <img src={mediaUrl} /> }
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

    return (
        <>
            {viewType == "LinkedIn" && getLinkedInContent(content)}
        </>
    )
}
