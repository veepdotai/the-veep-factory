import { Logger } from 'react-logger-lib';
import { pushState } from './lib/utils-analytics';

import styles from '../styles/utils.module.css';

import { useState, useEffect } from 'react';
import { Badge, Nav } from 'react-bootstrap';

export default function NavItemLinkIconText( props ) {
    const log = Logger.of(NavItemLinkIconText.name);

    const [display, setDisplay] = useState(false);
    const [badge, setBadge] = useState(false);

    const eventKey = props.itemKey || null;

    function onClick(e) {
        if (props.onClick) {
            props.onClick(e);
        }  else {
            log.trace("onClick: " + eventKey + ".");
            pushState(eventKey);
        }
    }

    useEffect(() => {
        log.trace("onClick: " + eventKey + ".");

        if (props.alwaysVisible) {
            log.trace("alwaysVisible: true? " + props.alwaysVisible + ".");
            setDisplay(true);
        } else {
            log.trace("alwaysVisible: false? " + props.alwaysVisible + ".");
            setDisplay(false);
        }
    }, [])

    return (
        <Nav.Item id={props.id ?? (props.eventKey ?? '')} className={props.outerCN ?? ''}>
            <Nav.Link className={"d-flex align-items-center " + props.innerCN} eventKey={props.eventKey} href={props.href??''} target={props.target??''} onClick={onClick}>
                {props.children}
                {
                    display ?
                        <span className={styles.menuTitle}>{props.title}</span>
                    :
                        <>
                            <span className={styles.menuTitle + ' ' + styles.hideMenuTitle}>{props.title}</span>
                        </>
                }
                {props.badgeValue?
                    <Badge pill className={styles.badgeCredits} bg={props.badgeBg??'secondary'}>
                        <span>{props.badgeValue}</span>
                    </Badge>:<></>
                }
            </Nav.Link>
        </Nav.Item>
    )
}