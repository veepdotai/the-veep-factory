import { useState } from 'react';

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

    const [view, setView] = useState('byDpt')

    function getMenuItem(key, label, direction = null) {
        return (
            <MenuItem itemKey={key} itemLabel={label} direction={direction} />
        )
    }

    function getMenu(view) {
        let menuDefinition = [
            {
                id: "common",
                title: "",
                items: [
                    {id: 'contents', label: t("MyContents")},
                    {id: 'assistant', label: t("CreateAssistant")},
                    {id: 'add-content', label: t("CreateContent")},
                    {id: 'digitalTwin', label: t("MyDigitalTwin")},
                    {id: 'separator', label: ""},        
                ]
            },
            {
                id: "function-sales",
                title: t("SalesFunction"),
                items: [
                    {id: 'dpt-communication', label: t('Communication')},
                    {id: 'dpt-marketing', label: t('Marketing')},
                    {id: 'dpt-sales', label: t('Sales')},
                ]
            },
            {
                id: "function-production",
                title: t("ProductionConsultingFunction"),
                items: [
                    {id: 'dpt-management', label: t('Management')},
                    {id: 'dpt-production', label: t('Production')},
                    {id: 'dpt-consulting', label: t('Consulting')},
                    {id: 'dpt-quality', label: t('Quality')},
                    {id: 'dpt-randr', label: t('RandD')},
                ]
            },
            {
                id: "function-support",
                title: t("SupportFunction"),
                items: [
                    {id: 'dpt-finance', label: t('Finance')},
                    {id: 'dpt-hr', label: t('HR')},
                    {id: 'dpt-it', label: t('IT')},
                    {id: 'dpt-logistics', label: t('Logistics')},
                    {id: 'dpt-procurement', label: t('Procurement')},
                ]
            },
        ]

        return(
            <>
                <Accordion type="single" collapsible className="ms-4">
                    {
                        menuDefinition.map((menu) => {
                            if (menu.title == "") {
                                return menu.items.map(row => row.id == "separator" ? <hr /> : <MenuItem itemKey={row.id} itemLabel={row.label} direction={direction} /> )
                            } else {
                                return getAccordionItem(menu.id, menu.title,
                                    <>
                                        {menu.items.map(row => row.id == "separator" ? <hr /> : <MenuItem itemKey={row.id} itemLabel={row.label} direction={direction} /> )}
                                    </>
                                )       
                            }
                        })
                    }
                </Accordion>
            </>
        )
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

                <Accordion defaultValue="first">

                    {/*<MenuItem itemKey="add-content-wizard" itemLabel={t("AddContent")} innerCN=" bg-secondary text-white border border-2" outerCN="mb-2" direction={direction} />*/}
                    {/*<MenuItem itemKey="add-content" itemLabel={t("AddContent")} innerCN="border border-2" outerCN="mb-2" direction={direction} />*/}

                    {getAccordionItem("first", "Home",
                        <>
                            {getMenuTitle(t("Teamspaces"))}
                            <ComboboxWorkspaces />
                            <MenuItem itemKey="home" itemLabel={t("Dashboard")} />                                                    
                        </>
                    )}

                    {getAccordionItem("context", getMenuTitle(t("Context")),
                        <>
                            <MenuItem itemKey="brand-voice" itemLabel={t("BrandVoice")} direction={direction} />
                            <MenuItem itemKey="editorial-line" itemLabel={t("EditorialLine")} direction={direction} />
                            <MenuItem itemKey="pdf-export" itemLabel={t("PDFExport")} direction={direction} />
                        </>
                    )}

                    { 'byDpt' === view ?
                            <>
                                {getAccordionItem("content", getMenuTitle(t("AIAssistants")),
                                    getMenu('byDpt')
                                )}
                            </>
                        :
                            <>
                                {getAccordionItem("content", getMenuTitle(t("Creation")),
                                    <>
                                        <MenuItem itemKey="contents" itemLabel={t("MyContents")} />
                                        {/*<MenuItem itemKey="add-content" itemLabel={t("DocModels")} direction={direction} />*/}
                                        <MenuItem itemKey="add-content" itemLabel={t("AddContent")} direction={direction} />
                                    </>
                                )}
                            </>
                    }

                    {getAccordionItem("tools", getMenuTitle(t("Tools")),
                        <>
                            {/*<MenuItem itemKey="chat" itemLabel={t("Chat")} direction={direction} />*/}
                            <div className='ps-4'>{Icons.chat}
                                <a className="ps-2" target="_blank" href="https://chat.veep.ai">Chat</a>
                            </div>
                            <div className='pt-2 ps-4'>{Icons.support}
                                <a className="ps-2" target="_blank" href="https://github.com/veepdotai/the-veep-factory">Support</a>
                            </div>
                        </>
                    )}

                    {getAccordionItem("configuration", getMenuTitle(t("Configuration")),
                        <>
                            <MenuItem itemKey="config-pdf" itemLabel={t("PDFConfig")} direction={direction} />
                            {/*<MenuItem itemKey="support" itemLabel={t("Support")} direction={direction} />*/}
                        </>
                    )}

                    { isManager ?
                        <>
                            {getAccordionItem("administration", getMenuTitle(t("Administration")),
                                <>
                                    <MenuItem itemKey="infos" itemLabel={t("Infos")} direction={direction} />
                                </>
                            )}
                        </>
                        :
                        <></>
                    }
                </Accordion>

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

