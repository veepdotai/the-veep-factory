import { Col, Nav, Stack } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next';

import MenuOptions from './MenuOptions';
import MenuItem from './MenuItems/MenuItem';
import LogoWithLink from "src/components/LogoWithLink";
import ComboboxWorkspaces from "src/components/ui/ComboboxWorkspaces";
import { Icons } from '@/constants/Icons';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"

export default function MenuVertical( {direction, isManager, profile} ) {
    const log = Logger.of(MenuVertical.name);

    function getMenuItem(key, label, direction = null) {
        return (
            <MenuItem itemKey={key} itemLabel={label} direction={direction} />
        )
    }

    function getMenu(view) {
        let commonMenuDefinition = [
            ['contents', t("MyContents")],
            ['assistant', t("CreateAssistant")],
            ['add-content', t("CreateContent")],
            ['digitalTwin', t("MyDigitalTwin")],
        ]
        let salesMenuDefinition = [
            ['dpt-communication', t('Communication')],
            ['dpt-marketing', t('Marketing')],
            ['dpt-sales', t('Sales')],
        ]
        let productionMenuDefinition = [
            ['dpt-management', t('Management')],
            ['dpt-production', t('Production')],
            ['dpt-quality', t('Quality')],
            ['dpt-RandD', t('RandD')],
            ['', t('')],
        ]
        let supportMenuDefinition = [
            ['dpt-finance', t('Finance')],
            ['dpt-HR', t('HR')],
            ['dpt-IT', t('IT')],
            ['dpt-logistics', t('Logistics')],
            ['dpt-procurement', t('Procurement')],
        ]

        if('byDpt' === view) {
            return(
                <>
                    {getMenuTitle(t("AIAssistants"))}
                    {commonMenuDefinition.map(row => <MenuItem itemKey={row[0]} itemLabel={row[1]} direction={direction} /> )}
                    <Accordion type="single" collapsible className="ms-4">
                    {getAccordionItem("function-support", t("SupportFunction"),
                        <>
                            {salesMenuDefinition.map(row => <MenuItem itemKey={row[0]} itemLabel={row[1]} direction={direction} /> )}
                        </>
                    )}
                    {getAccordionItem("function-production", t("ProductionFunction"),
                        <>
                            {productionMenuDefinition.map(row => <MenuItem itemKey={row[0]} itemLabel={row[1]} direction={direction} /> )}
                        </>
                    )}
                    {getAccordionItem("function-sales", t("SalesFunction"),
                        <>
                            {supportMenuDefinition.map(row => <MenuItem itemKey={row[0]} itemLabel={row[1]} direction={direction} /> )}
                        </>
                    )}
    
                    </Accordion>
                </>
            )
        } else {
            return(
                <>
                    {getMenuTitle(t("Creation"))}
                    <MenuItem itemKey="contents" itemLabel={t("MyContents")} />
                    {/*<MenuItem itemKey="add-content" itemLabel={t("DocModels")} direction={direction} />*/}
                    <MenuItem itemKey="add-content" itemLabel={t("AddContent")} direction={direction} />
                </>
            )
        }
    }
    
    function getMenuTitle(title) {
        return (
            <div className='d-inline fw-bold'>
                {title}
            </div>
        )
    }
       
    function getAccordionItem(value, trigger, content) {
        return (
            <AccordionItem value={value}>
                <AccordionTrigger className="">
                    <div className="d-flex d-inline align-text-middle">
                        <div className="me-2">{Icons[value]}</div>
                        <div className="text-left">{trigger}</div>
                    </div>
                </AccordionTrigger>
                <AccordionContent>{content}</AccordionContent>
            </AccordionItem>
        )
    }

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
                <MenuItem itemKey="pdf-export" itemLabel={t("PDFExport")} direction={direction} />

                {getMenu('byDpt')}

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

