import { Logger } from 'react-logger-lib';
import { useMediaQuery } from 'usehooks-ts';

import styles from '../styles/utils.module.css';

import { useState, useEffect } from 'react';
import { Badge, Nav, NavDropdown } from 'react-bootstrap';
import { TabsList, TabsTrigger } from "@/components/ui/tabs"

import PubSub from 'pubsub-js';

export default function DropdownOrNavItem( {layout = "horizontal", ...props} ) {
    const log = Logger.of(DropdownOrNavItem.name);

    const [isDataReady, setIsDataReady] = useState(false);

    const isDesktop = useMediaQuery("(min-width: 768px)")
    
    /*
    log.info("eventKey: " + props.eventKey);
    log.info("title: " + props.title);
    log.info("topic: " + props.topic);
    log.info("variant: " + props.variant);
    */

    useEffect(() => {
        PubSub.subscribe( props.topic, (topic, msg) => {
            setIsDataReady('true');
        });
    }, [])

    /*
    let link =  <Nav.Link eventKey={props.eventKey}>
                            {props.title}
                            {isDataReady ? <Badge className={styles.badge} bg={props.variant??'success'}> </Badge>:<></>}
                </Nav.Link>
    */
    let link =  <>
        {props.title}
        {isDataReady ? <Badge className={styles.badge} bg={props.variant??'success'}> </Badge>:<></>}
    </>

    {/*["xxs", "xs", "sm", "md"].includes(layout) */}
    return (
        <>
        <TabsTrigger value={props.eventKey}>

            {
                ! isDesktop ?
                    <NavDropdown.Item>{link}</NavDropdown.Item>
                :
                    <>
                        <Nav.Item>{link}</Nav.Item>
                    </>
            }
        </TabsTrigger>
        </>
    )
}