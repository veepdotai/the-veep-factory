import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next'
import PubSub from "pubsub-js"

import { PDFDownloadLink }  from '@react-pdf/renderer'

import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

import { Icons } from '@/constants/Icons';
import { Button } from 'src/components/ui/shadcn/button'
import Loading from '@/components/common/Loading';
import { UploadLib } from '@/components/upload-widget/UploadLib';

export default function PDFLink({document, params}) {
    const log = Logger.of(PDFLink.name)
    const [cookies] = useCookies(['JWT']);

    const [url, setUrl] = useState()
    const [pageNumber, setPageNumber] = useState(1)
    const [numPages, setNumPages] = useState<number>();

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

/*    function onValidate({ url} : {url: string}): void {
        fetch(url)
            .then(response => response.blob())
*/
    function onValidate(blob): void {
        let metadata = { type: 'application/pdf' };
        let file = new File([blob], "exemple.pdf", metadata)
        UploadLib.upload(cookies, file, "CONTENT_UPLOADED")
    }

    function onSuccess(topic, msg) {        
        PubSub.publish("TOAST", {
            "title": t("Status Of PDF Link"),
            "description": <div className="mt-2 w-[500px] rounded-md">{t("DataSaved")}</div>
        })
    }

    let getDownloadLink = () => {
        return (
            <PDFDownloadLink document={document} fileName={params.title}>
                {({ blob, url, loading, error }) => {
                    if (loading) {
                        log.trace('loading pdf document: loading: ', loading)
                        return <Button>{t("Loading")}</Button>
                    } else if (error) {
                        return t("LoadingError")
                    } else {

                        if (url) {
                            log.trace('url: ', url)

                            setUrl(url)
                        }
                        
                        if (blob) {
                            log.trace('blob is ready ', blob)
                            return (
                                <Button onClick={(e) => { onValidate(blob); e.preventDefault();}}>{t('Validate')}</Button>
                            )
                        }
                    }
                }}
            </PDFDownloadLink>
        )
    }

    useEffect(() => {
        PubSub.subscribe("CONTENT_UPLOADED", onSuccess)
    }, [])

    return (
        <>
            <div className="flex flex-row">
                <Button variant="ghost" className="h-screen w-[50px]" onClick={() => pageNumber > 1 && setPageNumber(pageNumber - 1)}>{Icons.prev}</Button>
                <div className="flex flex-col w-full items-center">
                    <div className="align-center text-sm">{t("Page")} {pageNumber} {t("Of")} {numPages ? numPages : "..."}</div>
                    {getDownloadLink()}
                    {url && <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                                <Page pageNumber={pageNumber} loading="..." />
                            </Document>}
                </div>
                <Button variant="ghost" className="h-screen w-[50px]" onClick={() => pageNumber < numPages && setPageNumber(pageNumber + 1)}>{Icons.next}</Button>
            </div>
        </>
    )
}
