import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next'
import PubSub from "pubsub-js"

import { usePDF, PDFDownloadLink, Link, Page, Text, Image, View, Document } from '@react-pdf/renderer';
import { Document as DocView, Page as PageView } from 'react-pdf'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

import { Icons } from '@/constants/Icons';
import { Button } from 'src/components/ui/shadcn/button'
import Loading from '@/components/common/Loading';
import { UploadLib } from '@/components/upload-widget/UploadLib';

export default function PDFLink({document, title}) {
    const log = Logger.of(PDFLink.name)
    const [cookies] = useCookies(['JWT']);

    const [pdfUrl, setPdfUrl] = useState("")
    const [pdfBlob, setPdfBlob] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [numPages, setNumPages] = useState<number>()

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    //    function onValidate(blob): void {
    function onValidate({ url} : {url: string}): void {
        try {
            fetch(url)
            .then(response => response.blob())
            .then((blob) => {
                let metadata = { type: 'application/pdf' };
                let file = new File([blob], "exemple.pdf", metadata)
                log.trace("onValidate: file: ", file)
                if (cookies) {
                    UploadLib.upload(cookies, file, "CONTENT_UPLOADED")
                } else {
                    alert("No available cookies!")
                    log.trace(t("NoAvailableCookies"))
                }
            })
        } catch (e) {
            alert("Error when validating content")
        }
    }

    function onSuccess(topic, msg) {        
        PubSub.publish("TOAST", {
            "title": t("Status Of PDF Link"),
            "description": <div className="mt-2 w-[500px] rounded-md">{t("DataSaved")}</div>
        })
    }

    log.trace("document:", document)

    let getDownloadLink = (document) => {
        return (
            <PDFDownloadLink document={document} fileName={title || "filename.pdf"}>
                {({ blob, url, loading, error }) => {
                    log.trace('getPDFDownloadLink: **********')
                    log.trace('getPDFDownloadLink: blob: ', blob)
                    log.trace('getPDFDownloadLink: url: ', url)
                    log.trace('getPDFDownloadLink: pdfUrl: ', pdfUrl)
                    log.trace("getPDFDownloadLink: url && ! pdfUrl: ", url && pdfUrl != "")
                    log.trace('getPDFDownloadLink: loading: ', loading)
                    log.trace('getPDFDownloadLink: error: ', error)

                    if (loading) {
                        log.trace('getPDFDownloadLink: loading pdf document: loading: ', loading)
                    }
                    
                    if (error) {
                        log.trace('getPDFDownloadLink: loading pdf document: error: ', error)
                    }

                    if (url && pdfUrl == "") {
                        log.trace('getPDFDownloadLink: setting url: ', url)
                        setPdfUrl(url)
                    }

                    if (blob && ! pdfBlob) {
                        log.trace('getPDFDownloadLink: setting blob ', blob)
                        setPdfBlob(blob)
                    }
                }}
            </PDFDownloadLink>
        )
    }

    useEffect(() => {
        PubSub.subscribe("CONTENT_UPLOADED", onSuccess)
    }, [])

    //                        {pdfUrl && <DocView file={pdfUrl} {/*onLoadSuccess={onDocumentLoadSuccess}*/}>

    return (
        <>
            { getDownloadLink(document)}
            { pdfUrl != "" &&
                <div className="flex flex-row">
                    <Button variant="ghost" className="align-right h-screen w-[50px]" onClick={() => pageNumber > 1 && setPageNumber(pageNumber - 1)}>{Icons.prev}</Button>
                    <div className="flex flex-col w-full items-center">
                        <Button onClick={() => onValidate(pdfUrl)}>{t("Validate")}</Button>
                        <div className="align-center text-sm">{t("Page")} {pageNumber} {t("Of")} {numPages ? numPages : "..."}</div>
                        <DocView file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                            <PageView pageNumber={pageNumber} loading="..." />
                        </DocView>
                    </div>
                    <Button variant="ghost" className="h-screen w-[50px]" onClick={() => pageNumber < numPages && setPageNumber(pageNumber + 1)}>{Icons.next}</Button>
                </div>
            }
        </>
    )
}
