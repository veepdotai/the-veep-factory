import { useState } from "react";
import { Button, Card, Container, Col, Dropdown, Modal, Row, Nav} from 'react-bootstrap';
import { t } from 'i18next';
import { Logger } from 'react-logger-lib';

import { FaCopy } from "react-icons/fa6";
import { FcInfo } from "react-icons/fc";
import { FcEngineering } from "react-icons/fc";
import { HiDotsVertical } from "react-icons/hi";

export default function MyContentHeaderActions() {
    const log = Logger.of(MyContentHeaderActions.name);

    const [menuType, setMenuType] = useState("dropdown");


    return (
        <>
            {
                menuType == "dropdown" ?
                    <Col xs={2}>
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">{("Actions")}<HiDotsVertical /></Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={}><FcEngineering /> {t("OpenInApp")}</Dropdown.Item>
                                <Dropdown.Item onClick={}><FcInfo /> {t("OpenInWeb")}</Dropdown.Item>
                                <Dropdown.Item onClick={}><FaCopy /> {t("ReuseTheSource")}</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                :
                    <>
                    <Col xs={1}>
                        <Nav.Link className="text-align-right" onClick={ () => showPromptEditor(definition) }>
                            <Icon iconName='Terminal' size="18"/>
                        </Nav.Link>
                        </Col>
                        <Col xs={1}>
                        <Nav.Link className="text-align-right" onClick={ () => showInfo(definition) }>
                            <Icon iconName='InfoSquare' size="18"/>
                        </Nav.Link>
                        </Col>
                        <Col xs={1}>
                        <Nav.Link className="text-align-right" onClick={ () => showPromptEditor(definition, true) }>
                            <FaCopy />
                        </Nav.Link>
                    </Col>
                    </>
            }

        </>
    )

}
