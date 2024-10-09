import { useContext, useState, useEffect } from 'react';
import { Badge, Button,Container, Col, Row } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';

import { t } from 'i18next';
import PubSub from 'pubsub-js';

import { ContentIdContext } from "src/context/ContentIdProvider"
import { Constants } from "src/constants/Constants";

import WaitForIt from './common/WaitForIt';

import { UploadLib } from './lib/util-upload-form';

import flash from 'src/styles/css.flash.css';

export default function Monitoring( props ) {
    const log = Logger.of(Monitoring.name);

    const [cookies] = useCookies(['JWT']);
    
    const [backDisabled, setBackDisabled] = useState(false);
    const [timer, setTimer] = useState(false);
    const [backText, setBackText] = useState(t('Menu.Back'));
    const [duration, setDuration] = useState(Constants.INITIAL_PROCESS_DURATION);

    const [content, setContent] = useState();

    const { contentId, setContentId} = useContext(ContentIdContext);

    const [resumeButton, setResumeButton] = useState(true);
    
    const conf = {
        service: Constants.WORDPRESS_REST_URL + "/?rest_route=/veepdotai_rest/v1/posts",
        'token': cookies.JWT
    }

    function showResult() {
        setBackDisabled(true);
        setTimer(true);
    }

    function showTimer(topic, msg) {
        setTimer(true);
    }

    function backToSelection() {
        setTimer(false);
        setBackText(t('Menu.Back'));
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

    function storeContent(topic, content) {
        setContent(content);
    }

    function resume() {
        log.trace(`resume: contentId: ${contentId}.`);

        const LIMIT = 128000;
        const COEFF = 0.66;
        if (content && content.length > (COEFF * LIMIT) ){
            confirmAlert({
                title: t("PleaseConfirm"), message: t("ContextLengthMaybeExceeded"),
                buttons: [{
                    label: t("Yes"),
                    onClick: () => UploadLib.resumeSendRecording(conf, contentId)
                }, {label: t("Cancel")}],
            });
        } else {
            UploadLib.resumeSendRecording(conf, contentId);
        }
    }

    function resetBackButton(topic, msg) {
        setBackDisabled(false);
        setBackText(t('Menu.Back'));
        setTimer(true);
    }

    function displayErrorMsg(topic, msg) {
        setBackDisabled(false);
        setBackText(t('Menu.Back'));
        setTimer(false);
    }

    function showResumeButton(topic, msg) {
        //alert("coucou");
        setBackDisabled(true);
        setResumeButton(true);
        setTimer(false);
    }

    function reset(topic, msg) {
        setTimer(false);
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

    useEffect(() => {
        log.trace('Subscribing to events.');

        PubSub.subscribe("PROCESS_STARTED", showTimer);

        PubSub.subscribe("_ARTICLE_PUBLISHING_FINISHED_", resetBackButton);
        PubSub.subscribe("_CONTENT_GENERATION_FINISHED_", resetBackButton);
        PubSub.subscribe("_CONTENT_GENERATION_PAUSED_", showResumeButton);
        PubSub.subscribe("_CONTENT_GENERATION_RESUMED_", disableResumeButton);

        PubSub.subscribe("_ERROR_TRANSCRIPTION_IS_EMPTY", displayErrorMsg);
        PubSub.subscribe("_CONTENT_", storeContent);

        PubSub.subscribe("PROMPTS_CHAIN", guessDuration);
        
    }, []);

    return (
        <Row>
            <Col className="w-100 h-100 text-align-end" xs={6} md={6} lg={6} xl={6}>
                { timer ?
                    <WaitForIt duration={duration} viewStep={0.1}/>
                    :
                    <></>
                }
            </Col>

            {
                <Col className="text-align-start" xs={12} md={12} lg={12} xl={12}>
                    
                    {
                        ! backDisabled ?
                            <>
                                {/* New button */}
                                <Button className={'w-100 m-1'} variant='outline-primary' onClick={backToSelection} disabled={backDisabled}>
                                    {backText}
                                </Button>
                            </>
                        :
                            <>
                                {/* Cancel button */}
                                <Button className={"w-100 " + (!backDisabled ? 'd-none' :'m-1')} variant='outline-danger' onClick={cancelProcess} disabled={!backDisabled}>
                                    {t("Menu.Cancel")}
                                </Button>
                                { resumeButton && contentId ?
                                        <>
                                            <Button className="flash w-100 m-1" onClick={resume}>
                                                {t("Resume")}
                                            </Button>
                                            <Container style={{fontSize: "0.75rem"}}>{t("SystemPaused")}</Container>
                                        </>
                                    :
                                    <></>
                                }
                            </>
                    }
                </Col>
            }
        </Row>
    )
}

