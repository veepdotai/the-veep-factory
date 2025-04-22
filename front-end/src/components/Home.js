import { useContext, useState, useEffect } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import { useCookies } from 'react-cookie';
import { t } from 'src/components/lib/utils'
import PubSub from 'pubsub-js';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup, } from "src/components/ui/shadcn/resizable"
import { ScrollArea, ScrollBar } from "src/components/ui/shadcn/scroll-area"

import { ContentIdContext } from "src/context/ContentIdProvider"

import { Constants } from "src/constants/Constants";
import styles from 'src/styles/Home.module.css';

import Form from './form/Form';
import Sources from './form/Sources';
import Process from './screens/process/Process';
import Monitoring from './Monitoring';

import { UtilsMenu } from './lib/utils-menu'

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

    let s = {
        "result": {
            "nodesktop": {xs: 12, md: 12, className: 'mb-3'},
            "desktop": {
                "sources": {lg: 2, xl: 2, className: 'mb-3'},
                "process": {lg: 8, xl: 8, className: 'mb-3'},
                "monitoring": {lg: 2, xl: 2, className: 'mb-3'},
            },
        },
        "noresult": {
            "nodesktop": {xs: 12, md: 12, className: 'mb-3'},
            "desktop": {
                "sources": {lg: 2, xl: 2, className: 'mb-3'},
                "process": {lg: 8, xl: 8, className: 'mb-3'},
                "monitoring": {lg: 2, xl: 2, className: 'mb-3'},
            }
        }
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
    function reset(topic = null, msg = null) {
        setDisplay(false);
        setShowResultWindow(false);
        log.trace('Publishing SELECT CONTENT on GO_TO_SELECT_SCREEN channel');
        PubSub.publish("GO_TO_SELECT_SCREEN", "SELECT_CONTENT");
        PubSub.publish("SHOW_CATALOGS", true);
    }

    function getFormInSheet(form) {
        return UtilsMenu.getSheetForm(form)
    }
    
    function getCreationPanel(params, sources, state, monitoring) {
        let view = "Resizable"
        if ("cols" === view) {
            return creationPanelWithCols(params, sources, state, monitoring)
        } else {
            return creationPanelWithResizableArea(params, sources, state, monitoring)
        }
    }

    function creationPanelWithCols(params, sources, state, monitoring) {
        return (
            <>
                <Col id="sources" {...params.sources}><Sources /></Col>
                <Col id="processing" {...params.process}><Process contentType={contentType} current={current}/></Col>
                <Col id="monitoring" {...params.monitoring}><Monitoring /></Col>
            </>
        )
    }

    function creationPanelWithResizableArea(params, sources, state, monitoring) {
        let buttonsPosition = "top"
        let menuPosition = "right"

        let menu = <ResizablePanel className="h-full p-5" style={{borderRight: "1px solid #eeefff"}} defaultSize={25}>
            <ScrollArea className="w-100 whitespace-nowrap h-full">
                <ScrollBar orientation="vertical" />
                { "top" == buttonsPosition ?
                        <>
                            {monitoring}
                            {sources}
                        </>
                    :
                        <>
                            {sources}
                            {monitoring}
                        </>
                }
            </ScrollArea>
        </ResizablePanel>

        let content = <ResizablePanel defaultSize={74} className='h-full'>
                <ScrollArea className="w-100 whitespace-nowrap h-full">
                <ScrollBar orientation="vertical" />

                {state}
                </ScrollArea>
        </ResizablePanel>

        return (
            <>
                <ResizablePanelGroup direction="horizontal" className="h-full">
                {"left" == menuPosition ? menu : content}
                <ResizableHandle withHandle withHandleStyle={{ marginLeft: "-1px"}} withHandleClassName="bg-light" />
                {"left" == menuPosition ? content : menu}
                </ResizablePanelGroup>            
            </>
        )
    }

    function getFormInStaticScreen() {
        return (
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
                                        {getCreationPanel(
                                            s.noresult.desktop,
                                            <Sources />,
                                            <Form contentType={contentType} credits={props.credits} />,
                                            <Monitoring />
                                        )}
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
                                        {getCreationPanel(
                                            s.result.desktop,
                                            <Sources />,
                                            <Process contentType={contentType} current={current}/>,
                                            <Monitoring />
                                        )}
                                    </>
                                }
                            </>
                    }
                </Row>
            </Container>
        )
    }

    /**
     * Only nosheet display works
     * 
     * @param {*} open 
     * @returns 
     */
    function getForm(open) {
        let viewType = "nosheet"

        let form = getFormInStaticScreen()
        if ( "sheet" === viewType) {
            // Does not work !!!
            //return getFormInSheet(form, open, setDisplay)
            return <>Doesn't work!!!</>
        } else {
            return form
        }
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

    useEffect(() => {
        log.trace(`Home: display: ${display}`)
    }, [display])

    return (
        <>
        {
            display ?
                <> 
                    {getForm(display)}
                </>
                :
                <></>
        }
        </>
    )
}
