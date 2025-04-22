import { useContext, useState } from "react";
import { Col, Dropdown, Nav} from 'react-bootstrap';
import { t } from 'src/components/lib/utils'
import { Logger } from 'react-logger-lib';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { Icons } from "src/constants/Icons";
import { md5 } from "js-md5";
import { ProfileContext } from "src/context/ProfileProvider";
import { Constants } from "src/constants/Constants";
import { Utils } from "../lib/utils";

export default function PromptActions( { definition, showPromptForm, showPromptEditor, showInfo, copy, remove}) {
    const log = Logger.of(PromptActions.name)

    const [menuType, setMenuType] = useState("dropdown");
    const { profile } = useContext(ProfileContext)
    log.trace("profile: " + JSON.stringify(profile));

    let defaultUser = Constants.DEFAULT_USER;
    let re = new RegExp(defaultUser);
    let scope = definition.scope;
    let shared = scope == "public" && ! re.test(profile?.user_email);
    log.trace('main: scope / shared: ' + scope + "/" + shared);

    function confirm( msg, applyIfConfirmed) {
        confirmAlert({
            title: t("PleaseConfirm"), message: msg,
            buttons: [{label: t("Yes"), onClick: () => applyIfConfirmed() }, {label: t("Cancel")}],
        });
    }

    return (
        <>
        {
            menuType == "dropdown" ?
                <Col xs={2}>
                    <Dropdown>
                        <Dropdown.Toggle variant="outline-warning" id="dropdown-basic"></Dropdown.Toggle>

                        <Dropdown.Menu>
                            {! shared ?
                                <>
                                    <Dropdown.Item onClick={() => showPromptForm()}>{Icons.config} {t("Configure")}</Dropdown.Item>
                                    { Utils.isManager(profile) && (
                                        <Dropdown.Item onClick={() => showPromptEditor()}>{Icons.editor} {t("Source")}</Dropdown.Item>
                                    )}
                                    <Dropdown.Item onClick={() => showInfo()}>{Icons.infos} {t("Infos")}</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={() => copy()}>{Icons.copy} {t("Duplicate")}</Dropdown.Item>
                                    <Dropdown.Item disabled onClick={() => share()}>{Icons.share} {t("Share")}</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={() => confirm(t("AreYouSureToRemove"), remove)}>{Icons.delete} {t("Delete")}</Dropdown.Item>
                                </>
                            :
                                <>
                                    <Dropdown.Item onClick={() => confirm(t("CustomizingPrompt"), showPromptForm)}>{Icons.config} {t("Customize")}</Dropdown.Item>
                                    {/*<Dropdown.Item onClick={() => showPromptForm()}>{Icons.config} {t("Customize")}</Dropdown.Item>*/}
                                    <Dropdown.Item onClick={() => showInfo()}>{Icons.infos} {t("Infos")}</Dropdown.Item>
                                </>
                            }

                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            :
                <Col xs={3}>
                    <Nav.Link className="text-align-right" onClick={ () => showPromptEditor() }>
                        {Icons.config}
                    </Nav.Link>
                    <Nav.Link className="text-align-right" onClick={ () => showInfo() }>
                        {Icons.infos}
                    </Nav.Link>
                    <Nav.Link className="text-align-right" onClick={ () => copy() }>
                        {Icons.copy}
                    </Nav.Link>
                    <Nav.Link className="text-align-right" onClick={ () => copy() }>
                        {Icons.delete}
                    </Nav.Link>
                </Col>
        }
        </>
    )

}
