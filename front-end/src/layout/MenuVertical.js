import { useEffect, useState } from 'react';

import { Logger } from 'react-logger-lib'

import { Col, Nav, Stack } from 'react-bootstrap'

import { t } from 'src/components/lib/utils'

import { Utils } from 'src/components/lib/utils'

import MenuOptions from './MenuOptions'
import MenuItem from './MenuItems/MenuItem'
import LogoWithLink from "src/components/LogoWithLink"
import { getIcon } from '@/constants/Icons'

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"

export default function MenuVertical( {genericMenu, dataMenu, configurationMenu, direction, isManager, profile} ) {
    const log = (...args) => Logger.of(MenuVertical.name).trace(args)

    const [isNormalUser, setIsNormalUser] = useState(true) // beginner, normal, advanced

    const [view, setView] = useState('byDpt')
    
    function getMenuItem(key, label, direction = null) {
        return (
            <MenuItem key={key} itemKey={key} itemLabel={label} direction={direction} />
        )
    }

    function getMenu(view, menuDefinition) {
        log("getMenu: view: ", view, " / menuDefinition: ", menuDefinition)
        return(
            <>
                <Accordion type="multiple" className="ms-4">
                    {
                        menuDefinition.map((menu, i) => {
                            let menuItems = menu?.items?.map(row => row.id == "separator" ?
                                                                    <hr />
                                                                :
                                                                    <MenuItem
                                                                        key={menu.id}
                                                                        icon={row.icon}
                                                                        itemKey={row.id}
                                                                        itemLabel={row.label || t(Utils.camelize(row.id) + "Label2")}
                                                                        direction={direction} />
                            ) 
                            if (menu.title == "") { // No accordion
                                return menuItems
                            } else { // Accordion
                                return getAccordionItem(menu.id, menu.title, menuItems)
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
            <AccordionItem key={value} value={value}>
                <AccordionTrigger className="">
                    <div className="d-flex d-inline align-text-middle">
                        <div className="me-2">{getIcon(value)}</div>
                        <div className="text-left">{trigger}</div>
                    </div>
                </AccordionTrigger>
                <AccordionContent>{content}</AccordionContent>
            </AccordionItem>
        )
    }

    function selectUserLevel() {
        return (
            <div className="flex items-center space-x-2">
                <Label htmlFor="ui-mode">{getIcon("user-normal")}</Label>
                <Switch id="mode" onClick={() => setIsNormalUser(!isNormalUser)}/>
                <Label htmlFor="ui-mode">{getIcon("user-advanced")}</Label>
                <div className=''>{ isNormalUser ? t("NormalUser") : t("ExpertUser")}</div>
            </div>
        )
    }

    return (
        <Nav id="menu" className="min-vh-100 mt-2 text-black" variant={direction == "vertical" ? "pills" : "underline"}>
            <Stack direction={direction} gap={1} className="col-md-12 mx-auto">
                <div className='float-end'>
                    <LogoWithLink />
                    {/*<ComboboxWorkspaces />*/}
                </div>

                { isManager &&
                    <div className='mt-3'>
                        {selectUserLevel()}
                    </div>
                }

                <Accordion type="multiple" className="mt-3" defaultValue={["menu-home"]}>

                    {/*<MenuItem itemKey="add-content-wizard" itemLabel={t("AddContent")} innerCN=" bg-secondary text-white border border-2" outerCN="mb-2" direction={direction} />*/}

                    { 'byDpt' === view ?
                            <>{genericMenu?.length > 0 && <>{getMenu('byDpt', genericMenu)}</>}</>
                        :
                            <>
                                {getAccordionItem("home", getMenuTitle(t("Home")),
                                    <>
                                        {/*getMenuTitle(t("Teamspaces"))*/}
                                        <MenuItem itemKey="menu-home" itemLabel={t("Dashboard")} />                                                    
                                    </>
                                )}
                            </>
                    }

                    { 'byDpt' === view ?
                            <> 
                                {dataMenu?.length > 0 && getMenu('byDpt', dataMenu)}
                            </>
                        :
                            <>
                                {
                                    getAccordionItem("content", getMenuTitle(t("Creation")),
                                        <>
                                            <MenuItem key={"contents"} itemKey="contents" itemLabel={t("MyContents")} />
                                        </>
                                    )
                                }
                            </>
                    }

                    {configurationMenu?.length > 0 && getMenu('byDpt', configurationMenu)}

                    { ! isNormalUser ?
                            <>

                                {getAccordionItem("tools", getMenuTitle(t("Tools")),
                                    <>
                                        {/*<MenuItem itemKey="chat" itemLabel={t("Chat")} direction={direction} />*/}
                                        <div className='ps-4'>{getIcon("chat")}
                                            <a className="ps-2" target="_blank" href="https://chat.veep.ai">Chat</a>
                                        </div>
                                        <div className='pt-2 ps-4'>{getIcon("support")}
                                            <a className="ps-2" target="_blank" href="https://github.com/veepdotai/the-veep-factory">Support</a>
                                        </div>
                                    </>
                                )}

                                {getAccordionItem("configuration", getMenuTitle(t("Configuration")),
                                    <>
                                        <MenuItem key={"config-pdf"} icon="config-pdf" itemKey="config-pdf" itemLabel={t("PDFConfig")} direction={direction} />
                                        <MenuItem key={"config-post"} icon="config-post" itemKey="config-post" itemLabel={t("PostConfig")} direction={direction} />
                                    </>
                                )}
                            </>
                        :
                            <></>
                    }

                    { isManager ?
                        <>
                            {getAccordionItem("administration", getMenuTitle(t("Administration")),
                                <>
                                    <MenuItem key={"infos"} itemKey="infos" itemLabel={t("Infos")} direction={direction} />
                                    <MenuItem key={"editorial-calendar"} itemKey="editorial-calendar" itemLabel={t("EditorialCal")} direction={direction} />
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

