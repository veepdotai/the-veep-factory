import { useContext, useState, useEffect } from 'react';
import { Badge, Button,Container, Col, Row, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useCookies } from 'react-cookie';
import { t } from 'i18next';
import PubSub from 'pubsub-js';
import toast from 'react-hot-toast';

import { ContentIdContext } from "src/context/ContentIdProvider"

import { Constants } from "src/constants/Constants";
import { Icons } from "src/constants/Icons";
import styles from 'src/styles/Home.module.css';

import Form from './form/Form';
import Process from './screens/process/Process';
import Monitoring from './Monitoring';

import stylesUtils from 'src/styles/utils.module.css';
//import { Utils } from './lib/utils';
import { UploadLib } from './lib/util-upload-form';
import useBreakpoint from  "src/hooks/useBreakpoint";
import { useMediaQuery } from 'usehooks-ts';

export default function Home( props ) {
    const log = Logger.of(Home.name);

    const [cookies] = useCookies(['JWT']);

    const [display, setDisplay] = useState(false);
    const [showResultWindow, setShowResultWindow] = useState(false);
    const [contentType, setContentType] = useState();
    const [current, setCurrent] = useState("");
    
    //const size = useBreakpoint();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const { contentId, setContentId} = useContext(ContentIdContext);
    
    const conf = {
        service: Constants.WORDPRESS_REST_URL + "/?rest_route=/veepdotai_rest/v1/posts",
        'token': cookies.JWT
    }

    function showResult() {
        log.trace('showResult: ' + 'true');
        setShowResultWindow(true);

        /*
        toast((_t) => (
            <Row>
                <Col>
                    <button onClick={() => toast.dismiss(_t.id)}>{Icons.delete}</button>
                    <Markdown remarkPlugins={[remarkGfm]}>{t("GenerationSteps", { joinArrays: '\n\n'})}</Markdown>
                    <p>{t("Transcription")}<Badge className={stylesUtils.badge} bg={props.variant??'danger'}> </Badge>...</p>
                </Col>
            </Row>
        ));
        */
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

/*
    function backToSelection() {
        setDisplay(false);
        setShowResultWindow(false);

        log.trace('Publishing SELECT CONTENT on GO_TO_SELECT_SCREEN channel');
        PubSub.publish("GO_TO_SELECT_SCREEN", "SELECT_CONTENT");

        log.trace('Publishing RESET on RESET channel');
        PubSub.publish('RESET', 'RESET');
    }

    function cancelProcess() {
        setContentId(null);
        PubSub.publish('RESET', 'RESET');
    }
    
    function resume() {
        log.trace(`resume: contentId: ${contentId}.`);
        
        UploadLib.resumeSendRecording(conf, contentId);
    }
    
*/
    function reset(topic, msg) {
        setDisplay(false);
        setShowResultWindow(false);
        log.trace('Publishing SELECT CONTENT on GO_TO_SELECT_SCREEN channel');
        PubSub.publish("GO_TO_SELECT_SCREEN", "SELECT_CONTENT");
        PubSub.publish("SHOW_CATALOGS", true);
    }

    useEffect(() => {
        //log.trace(`useEffect: size: ${size}`);
        log.trace('useEffect: Subscribing to events.');

        PubSub.subscribe("SELECTED_DOCTYPE", showForm);
        PubSub.subscribe("RESET", reset);
        PubSub.subscribe("PROCESS_STARTED", showResult);
//        PubSub.subscribe("_TRANSCRIPTION_STARTED_", showResult);
        PubSub.subscribe("CURRENT_STEP", showCurrent);

        //PubSub.subscribe("_ERROR_", resetBackButton);
        
    //}, [size]);
    }, [isDesktop]);

    let s = {
        "result": {
            "nodesktop": {xs: 12, md: 12, className: 'mb-3'},
            "desktop": {
                "process": {lg: 10, xl: 10, className: 'mb-3'},
                "monitoring": {lg: 2, xl: 2, className: 'mb-3'},
            },
        },
        "noresult": {
            "nodesktop": {xs: 12, md: 12, className: 'mb-3'},
            "desktop": {lg: 2, xl: 4, className: 'mb-3'},
        }
    }

    return (
        <>
        {
            display ?
                <Container id="home" className={styles.container}>
                    <Row className="justify-content-md-center">
                        {
                            ! showResultWindow ?
                                <>
                                    { ! isDesktop ?
                                        <>
                                            <Col id="monitoring" {...s.noresult.nodesktop}><Monitoring /></Col>
                                            <Col id="generic-form" {...s.noresult.nodesktop}><Form contentType={contentType} credits={props.credits} /></Col>
                                        </>
                                    :
                                        <>
                                            <Col id="generic-form" {...s.noresult.desktop}><Form contentType={contentType} credits={props.credits} /></Col>
                                            <Col id="monitoring" {...s.noresult.desktop}><Monitoring /></Col>
                                        </>
                                    }
                                </>
                            :
                                <>
                                    { ! isDesktop ?
                                        <>
                                            <Col id="monitoring" {...s.result.nodesktop}><Monitoring /></Col>
                                            <Col id="processing" {...s.result.nodesktop}><Process contentType={contentType} current={current}/></Col>
                                        </>
                                    :
                                        <>
                                            <Col id="processing" {...s.result.desktop.process}><Process contentType={contentType} current={current}/></Col>
                                            <Col id="monitoring" {...s.result.desktop.monitoring}><Monitoring /></Col>
                                        </>
                                    }
                                </>
                        }
                    </Row>
                </Container>
                :
                <></>
        }
        </>
    )
}
