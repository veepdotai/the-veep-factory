import { useState, useEffect } from 'react'
import { Logger } from 'react-logger-lib'
import PubSub from 'pubsub-js'
import { t } from 'src/components/lib/utils'
import { md5 } from "js-md5"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import { Icons } from '@/constants/Icons'

export default function Sources( props ) {
    const log = Logger.of(Sources.name);

    const [files, setFiles] = useState([])
    const [texts, setTexts] = useState([])
    const [urls, setUrls] = useState([])
    const [streams, setStreams] = useState([])

    let TITLE_LENGTH = 40
    const extractTitle = (text) => text?.substring(0, TITLE_LENGTH - 3) + "..."

    function addStream(topic, fd) {
        log.trace("addStream: " + topic + " fd: " + JSON.stringify(fd))
        let stream = fd?.get("veepdotai-ai-input-stream"); // should work for direct video input too
        setStreams([
            ...streams,
            {id: md5(stream), icon: "micro", type: "STREAM", title: t("StreamNotYetTranscribed"), content: t("StreamNotYetTranscribed")}
        ])
    }

    function addUrl(topic, fd) {
        log.trace("addUrl: " + topic + " fd: " + JSON.stringify(fd))
        let url = fd?.get("veepdotai-ai-input-url");
        setUrls([
            ...urls,
            {id: md5(url), icon: "url", type: "URL", title: extractTitle(url), content: t("UrlNotYetExtracted")}
        ])
    }

    function addFile(topic, fd) {
        log.trace("addFile: " + topic + " fd: " + JSON.stringify(fd))
        let file = fd?.get("veepdotai-ai-input-file");
        setFiles([
            ...files,
            {id: md5(file.blob), icon: "file", type: "FILE", title: extractTitle(file.name), content: t("FileNotYetConverted")}
        ])
    }

    function addFreeText(topic, fd) {
        log.trace("addFreeText: " + topic + " fd: " + JSON.stringify(fd))
        let text = fd?.get("veepdotai-ai-input-text");
        if (text) {
            setTexts([
                ...texts,
                {id: md5(text), icon: "text", type: "TEXT", title: extractTitle(text), content: text}
            ])
        }
    }

    function format(contents) {
        return (
            <ul>
                {contents.map((row, i) => <li key={i}>{row.content}</li>)}
            </ul>
        )
    }

    function displaySource(source) {
        let output = <div> 
            {
                Array.isArray(source?.contents) ?
                    <AccordionItem value={source.label}>
                        <AccordionTrigger><div className='fw-bold text-sm'>{source.label}</div></AccordionTrigger>
                        <AccordionContent>
                            {
                                source.contents.length > 0 ?
                                    <ul>
                                        {source.contents.map((item) => <li key={item.title} >{Icons[item.icon]} {item.title}</li>)}
                                    </ul>
                                :
                                    <div className="text-center text-slate-500">{t("NotAvailableData")}</div>
                            }
                        </AccordionContent>
                    </AccordionItem>
                :
                    <div className="text-center">{t("NotAvailableData")}</div>
            }
        </div>
        return output
    }

    useEffect(() => {
        log.trace("useEffect: subscribing to STREAM_ADDED")
        PubSub.subscribe("STREAM_ADDED", addStream)

        log.trace("useEffect: subscribing to FILE_ADDED")
        PubSub.subscribe("FILE_ADDED", addFile)

        log.trace("useEffect: subscribing to URL_ADDED")
        PubSub.subscribe("URL_ADDED", addUrl)

        log.trace("useEffect: subscribing to FREETEXT_ADDED")
        PubSub.subscribe("FREETEXT_ADDED", addFreeText)

        log.trace('Sources initialization');
    }, []);
  
    return (
        <div className="mt-3">
            <div className='fw-bold'>Sources</div>
            {
                !streams && !files && !urls && !texts ?
                    <>
                        {t("PlzCreateSource")}
                    </>  
                :
                    <Accordion type="multiple" defaultValue={[t("Streams"), t("Texts"), t("Files"), t("Urls")]}>
                        {displaySource({label: t("Streams"), type: "STREAMS", contents: streams})}
                        {displaySource({label: t("Texts"), type: "TEXTS", contents: texts})}
                        {displaySource({label: t("Files"), type: "FILES", contents: files})}
                        {displaySource({label: t("Urls"), type: "URLS", contents: urls})}
                    </Accordion>
            }
        </div>
    );
}
