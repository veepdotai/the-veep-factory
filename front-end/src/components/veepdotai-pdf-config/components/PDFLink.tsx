import { useState } from 'react';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next'

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

export default function PDFLink({document, params}) {
    const [url, setUrl] = useState()
    const [pageNumber, setPageNumber] = useState(1)
    const [numPages, setNumPages] = useState<number>();

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <>
            <div className="flex flex-row">
                <Button variant="ghost" className="h-screen w-[50px]" onClick={() => pageNumber > 1 && setPageNumber(pageNumber - 1)}>{Icons.prev}</Button>
                <div className="flex flex-col w-full items-center">
                    <div className="align-center text-sm">{t("Page")} {pageNumber} {t("Of")} {numPages ? numPages : "..."}</div>
                    {url && <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                                <Page pageNumber={pageNumber} loading="..." />
                            </Document>}
                    <PDFDownloadLink document={document} fileName={params.title}>
                        {({ blob, url, loading, error }) => {
                            if (loading) {
                                return <Loading />
                            } else {
                                console.log('url: ', url)
                                setUrl(url)
                            }
                        }}
                    </PDFDownloadLink>
                </div>
                <Button variant="ghost" className="h-screen w-[50px]" onClick={() => pageNumber < numPages && setPageNumber(pageNumber + 1)}>{Icons.next}</Button>
            </div>
        </>
    )
}
