import { useState, useEffect } from 'react';
import { Button, Card, Placeholder } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next';

import { useCookies } from 'react-cookie';
import parse from 'html-react-parser';
import Typewriter from 'typewriter-effect';

import PubSub from 'pubsub-js';

import { getService } from '../../../api/service-fetch';

import styles from '../../catalog/AllCards.module.css';
import ResultActions from './ResultActions';
import toast from 'react-hot-toast';

export default function Result( props ) {
    const log = Logger.of(Result.name);
    log.trace("Props: " + JSON.stringify(props));

    const option = props.option; //option could be multivalued
    const _topic = props.topic;
    //const current = props.current;
    const duration = props.duration || 60;

    const defaultValues = {
        state: {
            initialContent: '',
            content: '',
            copied: false,
        },
        waiting: false
    };

    function reset(topic, data) {
        setContent(defaultValues.state.content);
        setCopied(defaultValues.state.copied);
        setWaiting(defaultValues.waiting)
    }

    const elementId = option + "-progressiveContent";
    const [cookies] = useCookies('JWT');
    const [state, setState] = useState(defaultValues.state);

    const [content, setContent] = useState('');
    const [current, setCurrent] = useState(props.current);
    const [initialContent, setInitialContent] = useState('');
    const [copied, setCopied] = useState(false);
    const [waiting, setWaiting] = useState(true);

    const [resumeButton, setResumeButton] = useState(false);

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
                log.info("getDataFetch: Data: " + JSON.stringify(data));

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
                        //PubSub.publish("_CONTENT_GENERATION_FINISHED_", null);
                    } else if ( "ai-section-edcal0-transcription" == option) {
                        setInitialContent(content);
                        //setContent(content.replace(/(\\r\\n|\\n)/g, "<br />"));
                        //setContent(content.replace(/\.\s+([^0-9\.])/g, ".$1<br /><br />"));
                        setContent(content.replace(/(\.|\!|\?)\s+([A-Z])/g, "$1<br /><br />$2"));
                    } else {
                        setInitialContent(content);
                        setContent(content.replace(/(\r\n|\n)/g, "<br />"));
                    }
                    PubSub.publish("_CONTENT_", content);
                }

                if (resume) {
                    setResumeButton(true);
                }
            })
            .catch((e) => {
                log.trace(`Catched error: ${JSON.stringify(e)}`)
            })
    }

    function pause(topic, msg) {
        getData(topic, msg, true);
        // No need to tell it again
        //PubSub.publish( "_CONTENT_GENERATION_PAUSED", null);
    }

    /*
    function resume() {
        alert('Resume: Post continue');
        PubSub.publish( "_CONTENT_GENERATION_RESUMED_")
    }
    */
    function createHtmlContent() {
        return (
            <p>
            {content}
            </p>
        )
    }

    function wait(topic, data) {
        setWaiting(true);
    }

    useEffect(() => {
        log.info('Subscribing to RESET');
        PubSub.subscribe("RESET", reset);

        log.info('Subscribing to ' + _topic + "STARTED_");
        PubSub.subscribe(_topic + "STARTED_", wait);

        // When a step is finished, we get the data generated during this step
        log.info('Subscribing to ' + _topic + "FINISHED_");
        PubSub.subscribe(_topic + "FINISHED_", getData);

        // Step in pause is finished. It just means user must
        // give some information before continuing and resuming the step.
        log.info('Subscribing to ' + _topic + "PAUSED_");
        PubSub.subscribe(_topic + "PAUSED_", pause);

        log.info('Subscribing to ' + _topic + "ERROR_");
        PubSub.subscribe(_topic + "ERROR_", getData);

        //display( message, 'progressiveContent');
    }, [])

    return (
        <>
            <Card id="results" className='h-100 border-0 overflow-auto'>
                {/*<Card.Title>{current}</Card.Title>*/}
                <Card.Body className={styles.card}>
                    <div className='d-flex justify-content-end float-end'>
                        {resumeButton ?
                            <Button onClick={resume}>{t("Resume")}</Button>
                            :
                            <></>
                        }
                        <ResultActions content={initialContent} />
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
                                    {parse(content)}
                                    {/*<Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>*/}
                                </>
                        }
                    </div>
                </Card.Body>
            </Card>
        </>
    );
}