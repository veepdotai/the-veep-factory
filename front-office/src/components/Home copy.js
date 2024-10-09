import { useContext, useState, useEffect } from 'react';
import { Logger } from 'react-logger-lib';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useCookies } from 'react-cookie';

import { Badge, Button,Container, Col, Row, Toast, ToastContainer, Spinner } from 'react-bootstrap';

import { t } from 'i18next';
import PubSub from 'pubsub-js';

import { VeepletContext } from 'context/VeepletProvider';
import { ContentIdContext } from 'context/ContentIdProvider';

import useVeeplet from  "src/hooks/useVeeplet";

import { Constants } from "src/constants/Constants";
import styles from '../styles/Home.module.css';

import Form from './form/Form';
import Process from './screens/process/Process';
import WaitForIt from './common/WaitForIt';

import stylesUtils from '../styles/utils.module.css';
//import { Utils } from './lib/utils';
import { UploadLib } from './lib/util-upload-form';

export default function Home( props ) {
    const log = Logger.of(Home.name);

    const [cookies] = useCookies(['JWT']);
    
//    const {veeplet, setVeeplet} = useContext(VeepletContext);

    const [display, setDisplay] = useState(false);
    const [backDisabled, setBackDisabled] = useState(false);
    const [showResultWindow, setShowResultWindow] = useState(false);
    const [contentType, setContentType] = useState();
    const [timer, setTimer] = useState(false);
    const [show, setShow] = useState(true);
    const [backText, setBackText] = useState(t('Menu.Back'));
    const [current, setCurrent] = useState("");
    const [duration, setDuration] = useState(Constants.INITIAL_PROCESS_DURATION);

    const { contentId, setContentId} = useContext(ContentIdContext);

    const [resumeButton, setResumeButton] = useState(true);
    
    const conf = {
        service: Constants.WORDPRESS_REST_URL + "/?rest_route=/veepdotai_rest/v1/posts",
        'token': cookies.JWT
    }

    function showResult() {
        log.trace('showResult: ' + 'true');
        setShowResultWindow(true);
        setShow(true);
        setBackDisabled(true);
        setTimer(true);
    }

    function showTimer(topic, msg) {
        setTimer(true);
    }

    /**
     * Processes the provided definition to extract from the db the main
     * prompt sections which display the intermediate results to the user
     * @param {*} topic 
     * @param {*} msg 
     */
    function showForm(topic, msg) {
        setDisplay(true);
        setContentType(msg);
    }

    function showCurrent(topic, msg) {
        setCurrent(msg);
    }

    function backToSelection() {
        setDisplay(false);
        //setTimer(false);
        //setShowResultWindow(false);
        //setBackText(t('Menu.Back'));
        log.trace('Publishing SELECT CONTENT on GO_TO_SELECT_SCREEN channel');
        PubSub.publish("GO_TO_SELECT_SCREEN", "SELECT_CONTENT");

        log.trace('Publishing RESET on RESET channel');
        PubSub.publish('RESET', 'RESET');
    }

    function cancelProcess() {
        var res = confirm(t('Alert.Confirm'));
        if ( res ) {
            log.trace('Starts cancelation.')
            resetBackButton();
            setContentId(null);
            PubSub.publish('RESET', 'RESET');
        } else {
            log.trace('Cancelation has been canceled!')
        }
    }

    function resume() {
        log.trace(`resume: contentId: ${contentId}.`);

        UploadLib.resumeSendRecording(conf, contentId);
    }

    function resetBackButton(topic, msg) {
        setBackDisabled(false);
        setBackText(t('Menu.Back'));
        setTimer(true);
    }

    function showResumeButton(topic, msg) {
        setResumeButton(true);
        setTimer(false);
    }

    function reset(topic, msg) {
        setDisplay(false);
        setTimer(false);
        setShowResultWindow(false);
        log.trace('Publishing SELECT CONTENT on GO_TO_SELECT_SCREEN channel');
        PubSub.publish("GO_TO_SELECT_SCREEN", "SELECT_CONTENT");
        PubSub.publish("SHOW_CATALOGS", true);
    }

    function disableResumeButton(topic, msg) {
        setResumeButton(false);
    }

    function guessDuration(topic, msg) {
        //setDuration(240);
    }

    //function setContent(topic, id) {
    //    log.trace("setContentId: " + id + ". Setting data received from the server.");
    //    setContentId(id);
    //}

    useEffect(() => {
        log.trace('Subscribing to events.');

        PubSub.subscribe("SELECTED_DOCTYPE", showForm);
        PubSub.subscribe("RESET", reset);
        PubSub.subscribe("PROCESS_STARTED", showTimer);
        PubSub.subscribe("PROCESS_STARTED", showResult);
//        PubSub.subscribe("_TRANSCRIPTION_STARTED_", showResult);
        PubSub.subscribe("CURRENT_STEP", showCurrent);
        PubSub.subscribe("_ARTICLE_PUBLISHING_FINISHED_", resetBackButton);
        PubSub.subscribe("_CONTENT_GENERATION_FINISHED_", resetBackButton);

        //PubSub.subscribe("CONTENT_ID", setContent);

        PubSub.subscribe("_CONTENT_GENERATION_PAUSED_", showResumeButton);
        PubSub.subscribe("_CONTENT_GENERATION_RESUMED_", disableResumeButton);

        PubSub.subscribe("_ERROR_", resetBackButton);

        PubSub.subscribe("PROMPTS_CHAIN", guessDuration);
        
    }, []);

    function handleClose() {
        setShow(false);
    }

    return (
        <>
        {
            display ?
                <Container className={styles.container}>
                    <Row className="justify-content-md-center1">
                        <Col className='mb-3 justify-content-md-center1' xs={0} md={3} lg={3} xl={3}>
                        </Col>
                        <Col className='mb-3' xs={12} md={6} lg={6} xl={6}>
                            <Row>
                            {
                                <Col className="text-align-start" xs={12} md={12} lg={12} xl={12}>
                                    {
                                        ! backDisabled ?
                                        <>
                                            {/* New button */}
                                            <Button className={'m-1'} variant='outline-primary' onClick={backToSelection} disabled={backDisabled}>
                                                {backText}
                                            </Button>
                                        </>
                                    :
                                        <>
                                            {/* Cancel button */}
                                            <Button className={!backDisabled ? 'd-none' :'m-1'} variant='outline-danger' onClick={cancelProcess} disabled={!backDisabled}>
                                                {t("Menu.Cancel")}
                                            </Button>
                                            { resumeButton && contentId ?
                                                <Button onClick={resume}>{t("Resume")}</Button>
                                                :
                                                <></>
                                            }
                                        </>
                                    }
                                </Col>
                            }
                                <Col className="text-align-end" xs={6} md={6} lg={6} xl={6}>
                                    { timer ?
                                        <WaitForIt duration={duration} viewStep={0.1}/>
                                        :
                                        <></>
                                    }
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col xs={12} md={6} lg={5} xl={4} className='mb-3 '>
                            <Form contentType={contentType} credits={props.credits} />
                        </Col>
                        {
                            showResultWindow ?
                                <>
                                    <Col xs={12} md={6} lg={6} xl={5} className='mb-3'>
                                        <Process contentType={contentType} current={current}/>
                                    </Col>

                                    <ToastContainer position='middle-center'>
                                        <Toast className="bg-white" onClose={() => setShow(false)} show={show} delay={8000} autohide>
                                        <Toast.Header>
                                            <img
                                            src={Constants.ROOT + '/assets/images/veep.ai-wnb.png'}
                                            className="rounded me-2"
                                            alt=""
                                            width="40px"
                                            />
                                            <strong className="me-auto">{t("ContentGeneration")}</strong>
                                        </Toast.Header>
                                        <Toast.Body className="text-black">
                                            <Markdown remarkPlugins={[remarkGfm]}>{t("GenerationSteps", { joinArrays: '\n\n'})}</Markdown>
                                            <p>{t("Transcription")}<Badge className={stylesUtils.badge} bg={props.variant??'danger'}> </Badge>...</p>
                                        </Toast.Body>
                                        </Toast>
                                    </ToastContainer>
                                </>
                            :
                                <></>
                        }
                    </Row>
                </Container>
                :
                <></>
        }
        </>
    )
}
