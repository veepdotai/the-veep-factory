import { useContext, useEffect, useState } from 'react';
import { Button, Card, Container, Col, Dropdown, Modal, Row, Nav, Stack} from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';
import { t } from 'src/components/lib/utils'
import { IconPickerItem } from 'react-icons-picker'
import { useCookies } from 'react-cookie';
import TOML from '@iarna/toml';
import { toast } from 'react-hot-toast';

import { pushState } from '../lib/utils-analytics';

import styles from './AllCards.module.css';
import PromptActions from './PromptActions';
import PromptDetails from './PromptDetails';
import IDE from '../editor/IDE';
import PromptForm from '../ui/PromptForm';
import Veeplet from '../lib/class-veeplet.js';

import { Constants } from "src/constants/Constants";

import { VeepletContext } from 'src/context/VeepletProvider';

/**
 * 
 * @param {definition} param0 It's a shallow veeplet definition with only the
 * required information to display the catalog
 * @returns 
 */
export default function Prompt( { definition, setDisplay } ) {
    const log = Logger.of(Prompt.name);
    const [cookies] = useCookies(['JWT']);

    log.trace("Props: " + definition.name);

    const [editor, setEditor] = useState(false);
    const [info, setInfo] = useState({
        show: false,
        content: {}
    });
    const [viewForm, setViewForm] = useState(false);

    const [uiConfig, setUiConfig] = useState({
        header: {
            bgColor: "",
            bgImage: "",
            color: "",
        },
        body: {
            bgColor: "",
            bgImage: "",
            color: "",
        },

    });

    const [bgColor, setBgColor] = useState("#aaaaaa");
    const [bgImage, setBgImage] = useState("");

    const { veeplet, setVeeplet } = useContext(VeepletContext);
  
    function copy(definition) {
        let myVeeplet = new Veeplet(definition);
        myVeeplet.getDefinition().name += "-" + t("Duplicate");
        let veepNs;
        
        log.trace('Definition: ' + JSON.stringify(myVeeplet));
        veepNs = myVeeplet.getChainId();

        pushState(veepNs + "-form");

        log.trace("showPromptForm: veepNs: " + veepNs);
        setVeeplet(veepNs);
        setViewForm(true);    
    }

    function _copy(definition) {
        let veeplet = new Veeplet(definition);
        veeplet.getDefinition().name += " " + t("Duplicate");

        pushState(veepNs + "-editor");

        log.trace("copy: veepNs: " + veepNs);
        setVeeplet(veepNs);
        setEditor(true);
        if (definition.bgColor) {
            setBgColor(definition.bgColor);
        }
    }
    
    /**
     * In fact, it disables the veeplet and puts it in the trash category
     */
    function duplicateVeeplet(definition) {
        toast.promise(
            Veeplet.duplicate(cookies.JWT, new Veeplet(definition).getChainId()),
            {
              loading: 'Processing...',
              success: (data) => `Successfully duplicated.`,
              error: (err) => `This just happened: ${err.toString()}`,
            },
            {style: {minWidth: '250px'}, success: {duration: 5000, icon: '🔥'}}
        );
    }

    function closePromptEditor(topic, msg) {
        setEditor(false);
        PubSub.publish("PERSONAL_VEEPLET_CHANGED", veeplet);
    }

    function showPromptForm(definition) {
        let myVeeplet = new Veeplet(definition);
        let veepNs;
        
        log.trace('Definition: ' + JSON.stringify(myVeeplet));
        veepNs = myVeeplet.getChainId();

        pushState(veepNs + "-form");

        log.trace("showPromptForm: veepNs: " + veepNs);
        setVeeplet(veepNs);
        setViewForm(true);    
    }

    function showPromptEditor(definition, copy = false) {
        let myVeeplet = new Veeplet(definition);
        let veepNs;
        
        if (! copy) {
            veepNs = myVeeplet.getChainId();
        } else {
            log.trace('Definition: ' + JSON.stringify(myVeeplet));
            veepNs = myVeeplet.getChainId() + " " + t("Copy");
        }
        pushState(veepNs + "-editor");

        log.trace("showPromptEditor: veepNs: " + veepNs);
        setVeeplet(veepNs);
        setEditor(true);    
    }

    /**
     * In fact, it disables the veeplet and puts it in the trash category
     */
    function deleteVeeplet(definition) {
        toast.promise(
            Veeplet.delete(cookies.JWT, new Veeplet(definition).getChainId()),
            {
              loading: 'Processing...',
              success: (data) => `Successfully deleted.`,
              error: (err) => `This just happened: ${err.toString()}`,
            },
            {
              style: {minWidth: '250px'},
              success: { duration: 5000, icon: '🔥'},
            }
        );
    }

    function closeInfo(topic, msg) {
          setInfo({ show: false });
    }    
    
    function showInfo(definition) {
        let veepNs = (new Veeplet(definition)).getChainId();
        pushState(veepNs + "-info");
    
        setInfo({show: true, content: definition})
    }
    
    function showInputForm(definition) {
        let veepNs = (new Veeplet(definition)).getChainId();
        log.trace("showInputForm: veepNs: " + veepNs);

        pushState(veepNs);

        setDisplay(false);
        setVeeplet(veepNs);

        //setDisplay(false);
        //setCurrent(definition);
    
        PubSub.publish("SELECTED_DOCTYPE", definition);
    }
    
    function closeInputForm(e) {
        e?.preventDefault()
        
        setViewForm(false);
    }

    // Creates an object with elements indexed by name
    // Usable for little dictionary
    function byNames( directory ) {
        var byName = {};
        directory.forEach((row) => {
            //log.info("row name: " + row.name);
            byName[row.name] = row;
        })
        //log.info("byName[]: " + JSON.stringify(byName));

        return byName;
    }

    /*
    var props = null;
    if (_props.name) {
        //log.info("Props name: " + _props.name + ".");
        props = byNames( directory )[_props.name];
        //log.info("Props: " + JSON.stringify(props));
    } else {
        props = _props;
    }
    */
    //log.info(props);

    function getStyles(position, zIndex) {
        return {
            position: position,
            zIndex: zIndex,
            top: 0,
            width: "100%",
            height: Constants.CATALOG_CARD_HEIGHT + 'px'
        };
    }

    function updateUiConfig(topic, bgColor) {
        if (true) {
            setUiConfig({
                header: {
                    ...uiConfig.header,
                },
                body: {
                    ...uiConfig.body,
                }
            })
        }
    }

    function updateBgColor(topic, bgColor) {
        setBgColor(bgColor);
    }

    function updateBgImage(topic, iconName) {
        setBgImage(iconName);
    }

    useEffect(() => {
        PubSub.subscribe( "VEEPLET_COLOR_CHANGED_" + definition.name, updateBgColor);
        PubSub.subscribe( "VEEPLET_ICON_CHANGED_" + definition.name, updateBgImage);

        PubSub.subscribe( "UI_CHANGED_" + definition.name, updateUiConfig);

    }, [])


    return (
        <>
            {/*<Card style={{backgroundColor: definition.bodyBgColorFrom ?? "grey", width: Constants.CATALOG_PROMPT_WIDTH}} className={styles.card}>*/}
            <Card style={{backgroundImage: "linear-gradient(30deg, #f40076, #342711)", width: Constants.CATALOG_PROMPT_WIDTH}} className={styles.card}>
                <Card.Header className="pl-0" style={{backgroundColor: definition.headerBgColorFrom ?? "grey", width: Constants.CATALOG_PROMPT_HEADER_WIDTH}}>
                    <Stack direction="horizontal">
                        <Container style={{cursor: "pointer", "color": definition.headerColor ?? "white"}} className="mt-2 fs-8 text-underline text-truncate"
                        onClick={() => showInputForm(definition)}>
                            <Row>
                                {definition.heading}
                            </Row>
                            <Row style={{"fontSize": "0.650rem", "marginTop": "0px"}} xs={9}>
                                v{definition.version} - {definition.creationDate}
                            </Row>
                        </Container>
                        {/*copy={() => showPromptEditor(definition, true)}*/}
                        <PromptActions
                            definition={definition}
                            showInfo={() => showInfo(definition)}
                            showPromptForm={() => showPromptForm(definition)}
                            showPromptEditor={() => showPromptEditor(definition)}
                            copy={() => duplicateVeeplet(definition)}
                            remove={() => deleteVeeplet(definition)}
                        />
                    </Stack>
                </Card.Header>
                {/*<Card.Img variant="top" src={Constants.ROOT + props.image} />*/}
                <Card.Body style={{cursor: "pointer"}} onClick={() => showInputForm(definition)}>
                    <>
                        <div style={{position: "relative", height: "100px", color: "white"}}>
                            {/* Display icon
                            <div style={{...getStyles('relative', 1), textAlign: "right"}}>
                                <IconPickerItem value={definition?.bodyIconName} size={82} color="#000" />
                            </div>
                            */}
                            <div style={getStyles("absolute", 3)} className='mb-2 overflow-hidden /*overflow-scroll*/ text-overflow-ellipsis'> 
                                {definition.description}
                            </div>                            
                        </div>
                        {/*<Card.Img variant="top" src={Constants.ROOT + definition.image} />*/}

{/*
                        <Nav.Link onClick={ () => showInputForm(definition) }>
                            <Button className='w-100'>
                                {t("Go")} &rarr;
                            </Button>
                        </Nav.Link>
*/}                        
                    </>
                </Card.Body>
            </Card>

            <Modal show={viewForm} onHide={closeInputForm} fullscreen>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {t("VeepletConfiguration")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PromptForm className="d-block" definition={definition} handleClose={closeInputForm} />
                </Modal.Body>
            </Modal>
        
            <Modal show={info.show} onHide={closeInfo} size={'lg'}>
              <Modal.Header closeButton>
                  <Container className='fs-5'>{info.content?.category} / {info.content?.subCategory}</Container>
              </Modal.Header>
              <Modal.Body>
                  <PromptDetails { ...info.content } />
              </Modal.Body>
            </Modal>

            <Modal show={editor} onHide={closePromptEditor} size={'fullscreen'}>
              <Modal.Header closeButton>
                  <Container className='fs-5'>Editor</Container>
              </Modal.Header>
              <Modal.Body>
                  <IDE />
              </Modal.Body>
            </Modal>
        </>
    )    
}

