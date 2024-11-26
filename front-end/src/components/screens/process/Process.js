import { useState, useEffect, useContext } from 'react';
import { Nav, NavDropdown, /*Tab*/ } from 'react-bootstrap';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { t } from 'i18next';

import { Logger } from 'react-logger-lib';
import { useCookies } from 'react-cookie';
import PubSub from 'pubsub-js';

import Result from './Result';
import DropdownOrNavItem from '../../DropdownOrNavItem';

import { VeepletContext } from 'src/context/VeepletProvider';

//import {useVeeplet} from  "src/hooks/useVeeplet";

import { Fireworks } from '@fireworks-js/react'
import useVeeplet from  "src/hooks/useVeeplet";
import useBreakpoint from  "src/hooks/useBreakpoint";
import { useMediaQuery } from 'usehooks-ts';

export default function Process( props ) {
    const log = Logger.of(Process.name);
    log.trace("Props: " + JSON.stringify(props));

    /**
     * Contains the current phase, where xxx is a base64 encoded string that
     * corresponds to P.1 and P.2. For example:
     * - "_PHASEUC4x_GENERATION_STARTED_"
     * - "_PHASEUC4y_GENERATION_FINISHED_"
     */
    let current = props.current;
    let partialDef = props.contentType;

    // Fake value just to be true and store an object after that
    const [newContent, setNewContent] = useState({exists: true});
    const [navbars, setNavbars] = useState(false);
    const [links, setLinks] = useState();
    const [cookies] = useCookies(['JWT']);

    const size = useBreakpoint();
    const isDesktop = useMediaQuery("(min-width: 764px");

    function buildNavBars(topic, message) {
        log.trace("buildNavBars: " + JSON.stringify(message));
        alert("Message: " + JSON.stringify(message));
    }

    useEffect(() => {
        if (navbars) {
            setLinks(
                navbars.map((item) => {
                    return (
                        <DropdownOrNavItem
                            id={`process-menu-${item.name}`}
                            layout={size}
                            eventKey={item.name}
                            variant='danger'
                            title={item.title}
                            topic={item.topic}
                            current={current}
                        />
                    )    
            }));
        }
    }, [navbars])

    useEffect(() => {
        //log.trace("UseEffect[veeplet]: " + veeplet);
        log.trace("UseEffect[].");

        const v = useVeeplet(cookies, partialDef, setNavbars);

        //PubSub.subscribe("GET_PROMPT_OPTION_RESULT", buildNavBars); 

        /*
        navbars.map((item) => {
            PubSub.subscribe( item.topic, (topic, msg) => {
                log.trace("useEffect: topic: " + topic + " / msg: " + JSON.stringify(msg));
                setNewContent({...topic, ...msg})
            })
        });
        */
//    },[veeplet])
    }, [])

    /**
     * The process window is composed of:
     * - Headers, based on prompt names
     * - Content
     * 
     * If there is new content, we update:
     * - the tab headers with a badge to alert the user
     * - the tab body with the new content
     */
    return (
        <Tabs className="container" defaultValue="transcription">
            <TabsList>
            {
                navbars && links ? /* Tab headers update */
                    <>
                    {/*<Nav variant="underline" className="">*/}
                        {
                            ! isDesktop ?
                                <NavDropdown className="w-100" id="process-menu-contents" title="Generated contents" activeKey="Dropdown-generated-contents">
                                    {links}
                                </NavDropdown>
                            :
                                <>
                                    {links}
                                </>
                        }
                    {/*</Nav>*/}
                    </>
                    :
                    <></>
            }
            </TabsList>
            
            <div id="process-contents" className="mb-3">
                {
                    navbars ? /* Tab body update */
                            navbars.map((item) => {
                                return (
                                        <Result
                                            name={item.name}
                                            option={item.option}
                                            title={item.title}
                                            topic={item.contentListeners}
                                            current={current}/>
                                )
                            })
                        :
                            <></>
                }
            </div>
        </Tabs>
    )

}
