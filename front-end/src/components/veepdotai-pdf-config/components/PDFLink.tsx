import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Logger } from 'react-logger-lib';
//import { t } from 'src/components/lib/utils'
import { t, Utils } from 'src/components/lib/utils'

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

import PDFDocument from './pdf-document/PDFDocument';
import PDFParams from './PDFParams';

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
        //instance,
        document,
        title,
        initContent,
        initParams,
        viewOptions,
        showProcessButton = true,
        children
    }) {
    const log = Logger.of(PDFLink.name)

    log.trace("Parameters:##################################################\n",
        "id:", id,
        "title:", title,
        "initContent:", initContent,
        "initParams:", initParams,
        "viewOptions:", viewOptions,
        "showProcessButton:", showProcessButton,
        "viewOptions:", viewOptions
    )

    const [cookies] = useCookies(['JWT']);

    const [content, setContent] = useState(initContent)
    const [params, setParams] = useState(initParams)
    const mydoc = () => <PDFDocument content={content} params={new PDFParams(params)} />

    let doc = mydoc()

    const [pageNumber, setPageNumber] = useState(1)
    const [numPages, setNumPages] = useState<number>()

    const [instance, update] = usePDF({document: doc}); 
    
    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    //    function handleProcess(blob): void {
    function handleProcess({ url, fileName } : {url: string}): void {
        log.trace("handleProcess: url: ", url, "fileName:", fileName)
        try {
            if (!url) throw new Error("No URL available")

            Utils.notify({
                "title": t("Saving..."),
                "description": <div className="mt-2 w-[500px] rounded-md">{t("UploadingContent")}</div>
            })

            /*
            PubSub.publish("TOAST", {
                "title": t("Saving..."),
                "description": <div className="mt-2 w-[500px] rounded-md">{t("UploadingContent")}</div>
            })
            */

            fetch(url)
                .then(response => response.blob())
                .then((blob) => {
                    let metadata = { type: 'application/pdf' };
                    let file = new File([blob], fileName, metadata)
                    log.trace("handleProcess: file: ", file)
                    if (cookies) {
                        UploadLib.upload(cookies, file, "CONTENT_UPLOADED")
                    } else {
                        alert("No available cookies!")
                        log.trace(t("NoAvailableCookies"))
                    }
                })
        } catch (e) {
            log.trace("handleProcess: e:", e)
        }
    }

    function processPDF(topic, msg) {
        log.trace("processPDF: topic:", topic, " msg:", msg)
        let fileName = msg.fileName
        log.trace("processPDF: fileName:", fileName)
        let pdfUrl = localStorage.getItem("pdfUrl")
        handleProcess({url: pdfUrl, fileName: fileName})
    }

    function onSuccess(topic, msg) {     
        Utils.notify({
            "title": t("Status Of PDF Upload"),
            "description": <div className="mt-2 w-[500px] rounded-md">{t("DataSaved")}</div>
        })

/*
        PubSub.publish("TOAST", {
            "title": t("Status Of PDF Upload"),
            "description": <div className="mt-2 w-[500px] rounded-md">{t("DataSaved")}</div>
        })
*/
    }

    function getArray(l) {
        let arr = []
        for(let i = 0; i < l; i++) {
            arr.push(i)
        }
        return arr
    }

    function updatePDF(topic, message) {
        log.trace("updatePDF: viewOptions: ", viewOptions)
        log.trace("updatePDF: initParams: ", initParams)

        if (message?.params) {
            let params = message.params 
            log.trace("updatePDF: topic: ", topic, "paramsUpdated: ", params)
            log.trace("updatePDF: params: ", params.attachmentGenerationOptions)
            setParams(params.attachmentGenerationOptions)
        }

        if (message?.content) {
            let mycontent = message.content 
            log.trace("updatePDF: content:", mycontent)
            setContent(mycontent)
        }
    }  

    function updatePDF2(topic, message) {
        log.trace("updatePDF: viewOptions: ", viewOptions)
        log.trace("updatePDF: initParams: ", initParams)

        let params = message.params 
        log.trace("updatePDF: topic: ", topic, "paramsUpdated: ", params)
        log.trace("updatePDF: params: ", params.attachmentGenerationOptions)

        setParams(params.attachmentGenerationOptions)
        log.trace("updatePDF: content:", content)
        setContent(content)
    }  

    function showActions() {
        let actions = [
            {
                action: () => handleProcess({url: pdfUrl}),
                text: t("ShareAction"),
                icon: getIcon('share')
            },
            {
                action: () => handleProcess({url: pdfUrl}),
                text: t("SaveAction"),
                icon: getIcon('save'),
                viewType: 'icon' // among icon|icon+text|text|text+icon
            },
            {
                action: () => handleProcess({url: pdfUrl}),
                text: t("ShareAction"),
                icon: getIcon('download')
            }
        ]

        return (
            <>
                {showProcessButton && 
                    actions.map((action, i) =>
                        <Button className={"p-2 bg-black text-white text-sm font-bold rounded-none" + (i > 0 ? " z-20" : "")} onClick={action.action}>
                            {("icon" == action.viewType && action.icon)
                                || ("icon+text" == action.viewType && (<>{action.icon} {action.text}</>))
                                || ("text" == action.viewType && (<>{action.text}</>))
                                || ("text+icon" == action.viewType && (<>{action.text} {action.icon}</>))
                            }
                        </Button>
                    )
                }
            </>
        )
    }

    let pdfUrl = instance?.url

    useEffect(() => {
        localStorage.setItem("pdfUrl", pdfUrl)
    }, [pdfUrl])

    useEffect(() => {
        log.trace("JCK: useEffect[params]: id: ", id, "style... params: ", params)
        if (params) {
            //This will trigger document update through the update method
            update(<PDFDocument content={content} params={new PDFParams(params)} />)
        }
    }, [params, content])

    useEffect(() => {
        PubSub.subscribe("CONTENT_UPLOADED", onSuccess)
        if (id) {
            log.trace(`Suscribe to PROCESS_PDF_${id}`)
            PubSub.subscribe("PROCESS_PDF_" + id, processPDF)
        }
        PubSub.subscribe("SOURCE_EDITOR_UPDATED", updatePDF)
    }, [])


    log.trace("document:", doc)

    let width = viewOptions.width ? viewOptions.width : 533
    let height = viewOptions.height ? viewOptions.height : 533
    let widthAndHeightCN = (width && `min-w-[${width}px]`) + (height && ` min-h-[${height}px]`)

    // className doesn't work on the following Node
    //let pdfUrl = instance?.url
    let pdfBlob = instance?.blob

    if (instance?.loading) return <div style={{width: `${width}px`, minHeight: `${height}px`}} className="flex items-center justify-center">Loading...</div>
    if (instance?.error) return <div>Something went wrong: {instance.error}</div>;

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
                                <div className={"p-2 bg-black text-white text-sm font-bold w-100"}>{params.title} : {numPages ? numPages : "..."} pages</div>
                                {false && showActions()}
                            </div>
                            <div style={{width: `${width}px`, minHeight: `${height}px`}}>
                                <DocView key={params.title} className="" loading={loading} file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
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
