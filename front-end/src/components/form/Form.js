import { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';
import { t } from 'i18next';

import styles from './Form.module.css';

import { Constants } from "src/constants/Constants";
import { Icons } from "src/constants/Icons";

import UploadSelector from './UploadSelector';
import VocalForm from './VocalForm';
import UploadForm from './UploadForm';
import UploadRDU from './UploadRDU';
import TextForm from './TextForm';
import UrlForm from './UrlForm';

const dNone = 'd-none d-sm-none d-md-block ';

export default function Form( props ) {
    const log = Logger.of(Form.name);

    const [display, setDisplay] = useState(false);
    const [contentType, setContentType] = useState(props.contentType);

    function onSelectedDoctype(topic, msg) {
        log.info("Receiving SELECTED_DOCTYPE: onSelectedDoctype : " + topic + " / " + msg);
        setDisplay(true);
        setContentType(msg);
    }

    useEffect(() => {
        log.info('Subscribing to SELECTED_DOCTYPE');
        PubSub.subscribe( "SELECTED_DOCTYPE", onSelectedDoctype);
    }, [])

    return (
        <>
            {
                ! display ?
                    <ToggleForm contentType={contentType} credits={props.credits} />
                :
                    <></>
            }
        </>
    )
};

function ToggleForm( props ) {
    const log = Logger.of('ToggleForm');

    const [cookies, setCookie] = useCookies(['JWT']);
    const [disabled, setDisabled] = useState(false);
    const [uploadSelector, setUploadSelector] = useState(true);
    const [vocalForm, setVocalForm] = useState(false);
    const [uploadForm, setUploadForm] = useState(false);
    const [textForm, setTextForm] = useState(false);
    const [urlForm, setUrlForm] = useState(false);
    
    const conf = {
        service: Constants.WORDPRESS_REST_URL + "/?rest_route=/veepdotai_rest/v1/posts",
        'token': cookies.JWT
    }
        
    function disableForm(topic, msg) {
        log.info(topic + " msg received: " + JSON.stringify(msg));
        setDisabled(true);
        //setDisplay(true);
    }

    function goToForm(topic, msg) {
        setVocalForm(false);
        setUploadForm(false);
        setTextForm(false);
        setUrlForm(false);
        switch (msg) {
            case 'micro':
                setVocalForm(true);
                break;
            case 'file':
                setUploadForm(true);
                break;
            case 'text':
                setTextForm(true);
                break;
            case 'url':
                setUrlForm(true);
                break;
            default: ;
        }
    }

    useEffect(() => {
        log.info('Subscribing to PROCESSING_PID');
        PubSub.subscribe( "PROCESSING_PID", disableForm);

        PubSub.subscribe( "RESOURCE_SELECTED", goToForm);
    }, []);
  
    const onSubmit = data => log.info(data);

    return (
        <Card className={'h-100 rounded-4 overflow-auto '}>
            <Card.Title className={'border-bottom text-center p-2 '}>
                {Icons.volume}
                {t(props.contentType?.title)}
            </Card.Title>
            <Card.Body style={{"font-size": "0.875rem"}} className={'m-0 mb-3 ' + (disabled ? 'pt-0' : '')}>
                <form onSubmit={onSubmit}>
                    <Tips1 disabled={disabled} contentType={props.contentType} />
                    <div>
                        {
                            uploadSelector ?
                                <UploadSelector />
                                :
                                <></>
                        }
                        {
                            vocalForm ?
                                <VocalForm conf={conf} credits={props.credits} />
                            :
                                <></>
                        }
                        {
                            uploadForm ?
                                <UploadRDU conf={conf} credits={props.credits} />
                            :
                                <></>
                        }
                        {
                            textForm ?
                                <TextForm conf={conf} credits={props.credits} />
                            :
                                <></>
                        }
                        {
                            urlForm ?
                                <UrlForm conf={conf} credits={props.credits} />
                            :
                                <></>
                        }
                    </div>
                    <Tips2 disabled={disabled} contentType={props.contentType} />
                </form>

            </Card.Body>
        </Card>
    );
}

export function Tips1( {disabled, contentType}) {
    return (
        <div className={disabled ? dNone : ''}>
            {
                contentType && contentType.tips1 ?
                <p>{contentType.tips1}</p>
                :
                <></>
            }
            <label className={'fw-bold ' + (disabled ? 'd-none': '')}>{t("Form.Vocal")}</label>
        </div>
    )
}

export function Tips2( {disabled, contentType}) {
    return (
        <div className={disabled ? dNone : ''}>
            {
                contentType && contentType.tips2 ?
                <p className="mt-2">{contentType.tips2}</p>
                :
                <></>
            }
        </div>
    )
}