import { useContext, useState } from "react";
import { Col, Dropdown, Nav} from 'react-bootstrap';
import { t } from 'src/components/lib/utils'
import { Logger } from 'react-logger-lib';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { getIcon } from "src/constants/Icons";
import { md5 } from "js-md5";
import { ProfileContext } from "src/context/ProfileProvider";
import { Constants } from "src/constants/Constants";
import { Utils } from "../lib/utils";

export default function PromptActions( { definition, showPromptForm, showPromptEditor, showInfo, copy, remove}) {
    const log = Logger.of(PromptActions.name)

    const [menuType, setMenuType] = useState("dropdown");
    const { profile } = useContext(ProfileContext)
    log.trace("profile: ", profile);

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
                                    <Dropdown.Item onClick={() => showPromptForm()}>{getIcon("config")} {t("Configure")}</Dropdown.Item>
                                    { Utils.hasPromptSourceEditorPrivilege(profile) && (
                                        <Dropdown.Item onClick={() => showPromptEditor()}>{getIcon("editor")} {t("Source")}</Dropdown.Item>
                                    )}
                                    <Dropdown.Item onClick={() => showInfo()}>{getIcon("infos")} {t("Infos")}</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={() => copy()}>{getIcon("copy")} {t("Duplicate")}</Dropdown.Item>
                                    <Dropdown.Item disabled onClick={() => share()}>{getIcon("share")} {t("Share")}</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={() => confirm(t("AreYouSureToRemove"), remove)}>{getIcon("delete")} {t("Delete")}</Dropdown.Item>
                                </>
                            :
                                <>
                                    <Dropdown.Item onClick={() => confirm(t("CustomizingPrompt"), showPromptForm)}>{getIcon("config")} {t("Customize")}</Dropdown.Item>
                                    {/*<Dropdown.Item onClick={() => showPromptForm()}>{getIcon("config")} {t("Customize")}</Dropdown.Item>*/}
                                    <Dropdown.Item onClick={() => showInfo()}>{getIcon("infos")} {t("Infos")}</Dropdown.Item>
                                </>
                            }

                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            :
                <Col xs={3}>
                    <Nav.Link className="text-align-right" onClick={ () => showPromptEditor() }>
                        {getIcon("config")}
                    </Nav.Link>
                    <Nav.Link className="text-align-right" onClick={ () => showInfo() }>
                        {getIcon("infos")}
                    </Nav.Link>
                    <Nav.Link className="text-align-right" onClick={ () => copy() }>
                        {getIcon("copy")}
                    </Nav.Link>
                    <Nav.Link className="text-align-right" onClick={ () => copy() }>
                        {getIcon("delete")}
                    </Nav.Link>
                </Col>
        }
        </>
    )

}
