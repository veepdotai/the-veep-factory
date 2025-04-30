import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Logger } from 'react-logger-lib';
//import { t } from 'src/components/lib/utils'
import { t } from 'src/components/lib/utils'

import PubSub from "pubsub-js"

import { usePDF } from '@react-pdf/renderer';
import { Document as DocView, Page as PageView } from 'react-pdf'

import { Constants } from '@/constants/Constants';
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { pdfjs } from 'react-pdf';

let getPdfjsUrl = () => {
    const log = Logger.of("PDFLink")
    log.trace("getPdfjsUrl: Constants: ", Constants)

    let url = ""
    if (Constants.PDFJS_EXTERNAL_URL && Constants.PDFJS_EXTERNAL_URL != "") {
        url = Constants.PDFJS_EXTERNAL_URL
        url = url?.replace(/\{\{pdfjs.version\}\}/, pdfjs.version)
    } else {
        url = `${Constants.PDFJS_EXTERNAL_ROOT}@${pdfjs.version}/build/pdf.worker.min.mjs` 
    }
    log.trace("getPdfjsUrl: url:", url)
    return `${url}`
}

/**
 * Sometimes //unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs worked, sometimes not.
 * Still some things are obscure...
 */
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    getPdfjsUrl(),
    import.meta.url,
).toString();

import { getIcon } from '@/constants/Icons';
import { Button } from 'src/components/ui/shadcn/button'
import Loading from '@/components/common/Loading';
import { UploadLib } from '@/components/upload-widget/UploadLib';
import { throws } from 'assert';

//const usePDF = dynamic(() => import('@react-pdf/renderer/usePDF'), { ssr: false })
/**
 * CustomPDFViewer component based on react-pdf.
 * 
 * Adds:
 * - current page number (of) total page number
 * - page navigation to go from page to page
 * - a button to process (save/validate) the pdf
 *
 * @param document PDF document
 * @param title document title
 * @param viewOptions options for the PDF viewer
 * @returns 
 */  
export default function PDFLink({
        id,
        document,
        title,
        viewOptions,
        showProcessButton = true,
        children
    }) {
    const log = Logger.of(PDFLink.name)
    const [cookies] = useCookies(['JWT']);

    let doc = document || children

    const [pageNumber, setPageNumber] = useState(1)
    const [numPages, setNumPages] = useState<number>()

    const [instance, updateInstance] = usePDF({ document: doc}); 
    let pdfUrl = instance.url
    let pdfBlob = instance.blob
    
    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    //    function handleProcess(blob): void {
    //function handleProcess({ url } : {url: string}): void {
    function handleProcess({ url } : {url: string}): void {
        log.trace("handleProcess: url: ", url)
        try {
            if (!url) throw new Error("No URL available")

            fetch(url)
                .then(response => response.blob())
                .then((blob) => {
                    let metadata = { type: 'application/pdf' };
                    let file = new File([blob], "mypdf.pdf", metadata)
                    log.trace("handleProcess: file: ", file)
                    if (cookies) {
                        UploadLib.upload(cookies, file, "CONTENT_UPLOADED")
                    } else {
                        alert("No available cookies!")
                        log.trace(t("NoAvailableCookies"))
                    }
                })
        } catch (e) {
            alert("Error when processing content: " + JSON.stringify(e))
        }
    }

    function processPDF(topic, msg) {
        log.trace("processPDF: topic: ", topic, " msg: ", msg)
        let pdfUrl = localStorage.getItem("pdfUrl")
        handleProcess({url: pdfUrl})
    }

    function onSuccess(topic, msg) {        
        PubSub.publish("TOAST", {
            "title": t("Status Of PDF Upload"),
            "description": <div className="mt-2 w-[500px] rounded-md">{t("DataSaved")}</div>
        })
    }

    function getArray(l) {
        let arr = []
        for(let i = 0; i < l; i++) {
            arr.push(i)
        }
        return arr
    }

    useEffect(() => {
        localStorage.setItem("pdfUrl", pdfUrl)
    }, [pdfUrl])

    useEffect(() => {
        updateInstance(doc)
    }, [doc])

    useEffect(() => {
        PubSub.subscribe("CONTENT_UPLOADED", onSuccess)
        if (id) {
            log.trace(`Suscribe to PROCESS_PDF_${id}`)
            PubSub.subscribe("PROCESS_PDF_" + id, processPDF)
        }
    }, [])

    log.trace("document:", doc)
    log.trace("viewOptions:", viewOptions)

    let width = viewOptions.width ? viewOptions.width : 533
    let height = viewOptions.height ? viewOptions.height : 533
    let widthAndHeightCN = (width && `min-w-[${width}px]`) + (height && ` min-h-[${height}px]`)

    // className doesn't work on the following Node
    if (instance.loading) return <div style={{width: `${width}px`, minHeight: `${height}px`}} className="flex items-center justify-center">Loading...</div>
    if (instance.error) return <div>Something went wrong: {instance.error}</div>;

    let leftButtonCN = pageNumber > 1 ? "place-content-stretch rounded-full bg-black text-white font-bold z-10" : "z-0"
    let rightButtonCN = pageNumber < numPages ? "place-content-stretch rounded-full bg-black text-white font-bold z-10" : "z-0"

    let loading = <div style={{minHeight: `${height}px`}} className="flex items-center justify-center">Loading...</div>

    return (
        <>
            { pdfUrl && pdfUrl != "" &&
                <>
                    {log.trace("render: pdfUrl: ", pdfUrl)}
                    <div className={`flex justify-center`}>
                        <div style={{marginRight: "-50px"}} className="flex flex-col justify-center">
                            <Button variant="ghost" className={leftButtonCN} onClick={() => pageNumber > 1 && setPageNumber(pageNumber - 1)}>&lt;</Button>
                        </div>
                        <div style={{width: `${width}px`}} className="">
                            <div className="flex justify-between">
                                <div className={"p-2 bg-black text-white text-sm font-bold w-100"}>{title} : {numPages ? numPages : "..."} pages</div>
                                {showProcessButton && <Button className={"p-2 bg-black text-white text-sm font-bold rounded-none"} onClick={() => handleProcess({url: pdfUrl})}>{getIcon('share')}</Button>}
                                {showProcessButton && <Button className={"p-2 bg-black text-white text-sm font-bold rounded-none z-20"} onClick={() => handleProcess({url: pdfUrl})}>{getIcon('save')}</Button>}
                                {showProcessButton && <Button className={"p-2 bg-black text-white text-sm font-bold rounded-none z-20"} onClick={() => handleProcess({url: pdfUrl})}>{getIcon('download')}</Button>}
                            </div>
                            <div style={{width: `${width}px`, minHeight: `${height}px`}}>
                                <DocView key={title} className="" loading={loading} file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                                    <PageView height="533px" pageNumber={pageNumber} loading="..." {...viewOptions} />
                                </DocView>
                            </div>
                            <div className="p-2 bg-black text-white text-sm font-bold w-100">{t("Page")} {pageNumber} {t("Of")} {numPages ? numPages : "..."}</div>
                        </div>
                        <div style={{marginLeft: "-50px"}} className="flex flex-col justify-center">
                            <Button variant="ghost" className={rightButtonCN} onClick={() => pageNumber < numPages && setPageNumber(pageNumber + 1)}>&gt;</Button>
                        </div>
                    </div>
                </>
            }
        </>
    )
}
