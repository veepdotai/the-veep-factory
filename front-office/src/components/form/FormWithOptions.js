import { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next';

import PubSub from 'pubsub-js';

import styles from './Form.module.css';

import { getService } from '../lib/service-fetch'

import VocalForm from './VocalForm';
import UploadForm from './UploadForm';

import { Icons } from "src/constants/Icons";

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
    const [questions, setQuestions] = useState([]);
    const [field1, setField1] = useState();
    const [field2, setField2] = useState();
    const [disabled, setDisabled] = useState(false);

    function SubOptions({option}){
        for(let i=0; i < questions.length; i++){
            if(option === questions[i].name){
                return (
                    <>
                        {questions[i].suboptions.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </>
                )
            }
        }
    }
    
    function disableForm(topic, msg) {
        log.info(topic + " msg received: " + JSON.stringify(msg));
        setDisabled(true);
        //setDisplay(true);
    }

    function getQuestionsListMarkup() {
        return (
            <>
                <label className='fw-bold'>Type</label>
                <select className={styles.select} name="select1" value={field1} onChange={handleChange1}>
                    {questions.map(o => (
                        <option key={o.name} value={o.name}>{o.name}</option>
                        ))}
                </select>

                <label className='fw-bold'>Catégorie</label>
                <select className={styles.select} name="select2" value={field2} onChange={handleChange2}>
                    <SubOptions option={field1}/>
                </select>
            </>
        )
    }

    useEffect(() => {
        let conf = getService(cookies, 'options', 'ai-section-edstrat0-strategy')
            
        async function getQuestionsList(conf) {
            let options = [];
            fetch(conf.service, conf.options)
                .then((res) => res.json())
                .then((questionsCSV) => {
                    let questions = questionsCSV['ai-section-edstrat0-strategy'].split( "\n" );
                    //log.info(JSON.stringify(questionsCSV));
                    let i = 0;
                    questions.map((row) => {
                        //log.info("Row:" + row + ".");
                        if (row === "\r" ) return;
                        if (! row.match(/^->/)) {
                            i = options.push({
                                name: row,
                                suboptions: []
                            })
                        } else {
                            options[i-1].suboptions.push(row.replace(/^\s*->(.*)/, "$1"))
                        }
                    })
                    setQuestions(options);
                    setField1(options[0].name);
                })
        }
        
        getQuestionsList(conf);
        
        log.info('Subscribing to PROCESSING_PID');
        PubSub.subscribe( "PROCESSING_PID", disableForm);
    }, []);
  
    function handleChange1(data){
        setField1(data.target.value);
        log.info(data.target.value);
    }

    function handleChange2(data){
        setField2(data.target.value);
        log.info(data.target.value);
    }

    const onSubmit = data => log.info(data);

    return (
        <Card className={'h-100 rounded-4 overflow-auto '}>
            {/* disabled ? 'border-0' : 'h-100 rounded-4 overflow-auto ' */}
            <Card.Title className={'border-bottom text-center p-2 '}>
                {Icons.volume} {/* size={36} */}
                {t(props.contentType?.title)}
            </Card.Title>
            <Card.Body style={{"font-size": "0.875rem"}} className={disabled ? 'pt-0' : ''}>
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
                                <VocalForm className="m-1" credits={props.credits} />
                            :
                                <></>
                        }
                        {
                            uploadForm ?
                                <UploadForm className="m-1" credits={props.credits} />
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
                <>
                        {getQuestionsListMarkup()}
                </>
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