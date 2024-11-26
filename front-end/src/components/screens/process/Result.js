import { useState, useEffect } from 'react';
import { Button, Card, Placeholder } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next';

import { useCookies } from 'react-cookie';
import parse from 'html-react-parser';
import Typewriter from 'typewriter-effect';
import toast from 'react-hot-toast';

import PubSub from 'pubsub-js';

import { getService } from '../../../api/service-fetch';
import { Utils } from 'src/components/lib/utils'
import styles from '../../catalog/AllCards.module.css';
import Content from '../../screens/mycontent/Content';
import ResultActions from './ResultActions';
import { PlateEditor } from '../../../components/screens/PlateEditor'
import MergedContent from '../mycontent/parts/MergedContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Result( props ) {
    const log = Logger.of(Result.name);
    log.trace("Props: " + JSON.stringify(props));

    const option = props.option; //option could be multivalued
    const name = props.name; //option could be multivalued
    const _topic = props.topic;
    //const current = props.current;
    const duration = props.duration || 60;
    const [contentId, setContentId] = useState()

    const defaultValues = {
        state: {
            initialContent: '',
            content: '',
            copied: false,
        },
        waiting: false
    };

    const elementId = option + "-progressiveContent"
    const [cookies] = useCookies('JWT')
    const [state, setState] = useState(defaultValues.state)

    const [content, setContent] = useState('')
    const [current, setCurrent] = useState(props.current)
    const [labelEncoded, setLabelEncoded] = useState(null)
    const [initialContent, setInitialContent] = useState('')
    const [copied, setCopied] = useState(false)
    const [waiting, setWaiting] = useState(true)

    const [resumeButton, setResumeButton] = useState(false)

    /**
     * Gets the data from the server each time a certain type of message is received.
     * @param {*} topic 
     * @param {*} msg 
     */
    const getData = (topic, msg, resume = false) => {
        log.trace("getData: topic: " + topic + " / msg: " + JSON.stringify(msg));
        let conf = getService(cookies, 'options', option)
        log.trace("getData: getService: " + JSON.stringify(conf));

        fetch(conf.service, {...conf.options, "mode": "cors"})
            .then((res) => res.json())
            .then((data) => {
                log.info("getData: fetch: Data: " + JSON.stringify(data));
                log.info("getData: fetch: Current: " + current);

                let content = "";
                if (option.match(/^prefix:/)) {
                    // It's a mixed option which means resulting data contains various values
                    content = data.map((row) => {
                        let optionName = row.name.replace(/.*-([^-]*)/, "$1");
                        let optionValue = row.value;
                        let style = "fs-6 fw-bold text-capitalize"; // Could be a preference or a prompt parameter
                        let result = "<div class='" + row.name + " " + optionName + "'>"
                                        + "<div class='" + style + " option " + optionName + "'>" + optionName + ":</div>"
                                        + "<div class='value'>" + optionValue + "</div>"
                                    + "</div>";

                        let result2 = "## " + optionName + "\n"
                                        + optionValue + "\n";

                        log.trace("getData: fetch: mixed options: " + result);
                        return result + "";
                    });
                    log.trace("getData: fetch: mixed options: content: " + content);
                    log.trace("getData: fetch: mixed options: JSON.stringify(content): " + JSON.stringify(content));
                    let finalContent = content.join("\n");
                    log.trace("getData: fetch: mixed options: final content: " + finalContent);
                    log.trace("getData: fetch: mixed options: final content type: " + typeof finalContent);
                    setInitialContent(finalContent);
                    setContent((finalContent + "").replace(/(\r\n|\n)/g, "<br />"));
                } else {
                    content = data[option]; 
                    if ( "ai-section-edcal0-transcription" == option
                            && content == "") {
                        PubSub.publish("_ERROR_TRANSCRIPTION_IS_EMPTY", null);
                        setContent(t("TranscriptionIsEmpty"));
                        toast.error(t("TranscriptionIsEmpty."), {id: "emptyTranscription"});
                    } else if ( "ai-section-edcal0-transcription" == option) {
                        setInitialContent(content);
                        setContent(content.replace(/(\.|\!|\?)\s+([A-Z])/g, "$1<br /><br />$2"));
                        setLabelEncoded("transcription")
                    } else {
                        // It is another generation step
                        setInitialContent(content);
                        setContent(content.replace(/(\r\n|\n)/g, "<br />"));
                        let labelEncoded = topic.replace(/.*PHASE([0-9a-zA-Z+/]*)_.*/, "$1")
                        log.trace("getData: fetch: labelEncoded: " + labelEncoded);
                        setLabelEncoded(labelEncoded)
                    }
                    PubSub.publish("_CONTENT_", content);
                }

                if (resume) {
                    setResumeButton(true);
                }
            }).catch((e) => {
                log.trace(`Catched error: ${JSON.stringify(e)}`)
            })
    }

    function reset(topic, data) {
        setContent(defaultValues.state.content);
        setCopied(defaultValues.state.copied);
        setWaiting(defaultValues.waiting)
    }

    function started(topic, msg) {
        log.trace(`started: ${JSON.stringify(msg)}`)

        return wait(topic, msg)
    }

    function finished(topic, msg) {
        log.trace(`finished: topic: ${topic} / ${JSON.stringify(msg)}`)
        updateContentId(msg)

        return getData(topic, msg)
    }

    function continued(topic, msg) {
        log.trace(`continued: ${JSON.stringify(msg)}`)
        updateContentId(msg)
    }

    function paused(topic, msg) {
        log.trace(`paused: ${JSON.stringify(msg)}`)

        updateContentId(msg)
        getData(topic, msg, true);
    }

    function updateContentId(msg) {
        log.trace(`updateContentId: msg: ${msg}`)
        let cid = msg.replace(/.*_cid:(\d*)$/, "$1")
        log.trace(`updateContentId: cid: ${cid}`)
        setContentId(cid)
        return cid
    }

    function wait(topic, data) {
        setWaiting(true);
    }


    function createHtmlContent() {
        return (
            <p>
            {content}
            </p>
        )
    }

    useEffect(() => {
        log.info('Subscribing to RESET');
        PubSub.subscribe("RESET", reset);

        log.info('Subscribing to ' + _topic + "STARTED_");
        PubSub.subscribe(_topic + "STARTED_", started);

        // When a step is finished, we get the data generated during this step
        log.info('Subscribing to ' + _topic + "FINISHED_");
        PubSub.subscribe(_topic + "FINISHED_", finished);

        // Step in pause is continued. It just means generation continues
        log.info('Subscribing to ' + _topic + "CONTINUED_");
        PubSub.subscribe(_topic + "CONTINUED_", continued);

        // Step in pause is finished. It just means user must
        // give some information before continuing and resuming the step.
        log.info('Subscribing to ' + _topic + "PAUSED_");
        PubSub.subscribe(_topic + "PAUSED_", paused);

        log.info('Subscribing to ' + _topic + "ERROR_");
        PubSub.subscribe(_topic + "ERROR_", getData);

        //display( message, 'progressiveContent');
    }, [])

    return (
        <TabsContent id={`process-contents-${name}`} value={name}>
            <Card id="results" className='h-100 border-0 overflow-auto'>
                {/*<Card.Title>{current}</Card.Title>*/}
                <Card.Body className={styles.card}>
                    <div className='d-flex justify-content-end float-end'>
                        {resumeButton ?
                            <Button onClick={resume}>{t("Resume")}</Button>
                            :
                            <></>
                        }
                        {/*<ResultActions content={initialContent} />*/}
                    </div>
                    <div id={elementId}>
                        {content == "" ?
                            <div id="result-placeholder">
                                {/* <WaitForIt duration={duration}/> */}

                                <Placeholder as={Card.Title} animation="glow">
                                    <Placeholder xs={6} />
                                </Placeholder>
                                <Placeholder as={Card.Text} animation="glow">
                                    <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                                    <Placeholder xs={6} /> <Placeholder xs={8} />
                                </Placeholder>
                            </div>
                        :
                            /*! copied */ false ? 
                                <Typewriter
                                    options={{
                                        strings: content,
                                        autoStart: true,
                                        loop: false,
                                        delay: 0,
                                    }}
                                />
                            :
                                <>
                                { true ?
                                        <Content
                                            className="h-full"
                                            contentId={contentId}
                                            attrName="post_content"
                                            title=""
                                            content=""
                                        >
                              
                                            <div className="p-0 w-full">
                                                <PlateEditor
                                                    custom={labelEncoded ? `labelEncoded:${labelEncoded}` : ""}
                                                    view="Basic" className="p-0" attrName="post_content" contentId={contentId} input={Utils.format(content, true)} cn="w-full">
                                                </PlateEditor>
                                            </div>      
                                        </Content>
                                    :
                                        <>
                                            {parse(content)}
                                            {/*<Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>*/}
                                        </>

                                }
                                </>
                        }
                    </div>
                </Card.Body>
            </Card>
        </TabsContent>
    );
}