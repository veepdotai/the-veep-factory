import { Col, Nav, Stack } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next';

import MenuOptions from './MenuOptions';
import MenuItem from './MenuItems/MenuItem';
import LogoWithLink from "src/components/LogoWithLink";
import ComboboxWorkspaces from "src/components/ui/ComboboxWorkspaces";
import { Icons } from '@/constants/Icons';

export default function MenuVertical( {direction, isManager, profile} ) {
    const log = Logger.of(MenuVertical.name);

    return (
        <Nav id="menu" className="min-vh-100 mt-2 text-white" variant={direction == "vertical" ? "pills" : "underline"}>
            <Stack direction={direction} gap={1} className="col-md-12 mx-auto">
                <div className='float-end'>
                    <LogoWithLink />
                </div>

                {/*<MenuItem itemKey="add-content-wizard" itemLabel={t("AddContent")} innerCN=" bg-secondary text-white border border-2" outerCN="mb-2" direction={direction} />*/}
                {/*<MenuItem itemKey="add-content" itemLabel={t("AddContent")} innerCN="border border-2" outerCN="mb-2" direction={direction} />*/}

                {getMenuTitle(t("Teamspaces"))}
                <ComboboxWorkspaces />
                <MenuItem itemKey="home" itemLabel={t("Dashboard")} />

                {getMenuTitle(t("Context"))}
                <MenuItem itemKey="brand-voice" itemLabel={t("BrandVoice")} direction={direction} />
                <MenuItem itemKey="editorial-line" itemLabel={t("EditorialLine")} direction={direction} />

                {getMenuTitle(t("Assistants"))}
                {/*<MenuItem itemKey="add-content" itemLabel={t("DocModels")} direction={direction} />*/}
                <MenuItem itemKey="add-content" itemLabel={t("AddContent")} direction={direction} />

                {getMenuTitle(t("Contents"))}
                <MenuItem itemKey="contents" itemLabel={t("MyContents")} />

                {/*
                {getMenuTitle(t("Publication"))}
                <MenuItem itemKey="editorial-calendar" itemLabel={t("EditorialCal")} direction={direction} />
                <MenuItem itemKey="pub-target" itemLabel={t("PubTarget")} direction={direction} />
                */}

                {getMenuTitle(t("Tools"))}
                {/*<MenuItem itemKey="chat" itemLabel={t("Chat")} direction={direction} />*/}
                <div className='ps-4'>{Icons.chat}
                    <a className="ps-2" target="_blank" href="https://chat.veep.ai">Chat</a>
                </div>
                <div className='pt-2 ps-4'>{Icons.support}
                    <a className="ps-2" target="_blank" href="https://github.com/veepdotai/the-veep-factory">Support</a>
                </div>

                {getMenuTitle(t("Configuration"))}
                <MenuItem itemKey="config-pdf" itemLabel={t("PDFConfig")} direction={direction} />

                {/*
                    <MenuItem itemKey="support" itemLabel={t("Support")} direction={direction} />
                */}

                { isManager ?
                    <>
                        {getMenuTitle(t("Administration"))}
                        <MenuItem itemKey="infos" itemLabel={t("Infos")} direction={direction} />
                    </>
                    :
                    <></>
                }

                { profile ?
                    <>
                        <MenuOptions innerCN="my-auto" outerCN="my-auto" direction={direction} />
                    </>
                    :
                    <></>
                }
            </Stack>
        </Nav>
    )
}

function getMenuTitle(title) {
    return (
        <div className='d-inline fw-bold'>
            {title}
        </div>
    )
}
