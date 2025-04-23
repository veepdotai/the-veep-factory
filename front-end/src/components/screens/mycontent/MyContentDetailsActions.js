import { useState } from "react";
import { Button, Card, Container, Col, Dropdown, Modal, Row, Nav} from 'react-bootstrap';
import { t } from 'src/components/lib/utils'
import { Logger } from 'react-logger-lib';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "src/components/ui/shadcn/dropdown-menu"

import { getIcon } from "src/constants/Icons";

export default function MyContentDetailsActions( { showPromptEditor, showInfo, publish, regenerate, copy}) {
    const log = Logger.of(MyContentDetailsActions.name);

    const [menuType, setMenuType] = useState("dropdown");

    return (
        <>
        {
            menuType == "dropdown" ?
                <>
                    <DropdownMenu className="v-center float-end">
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">{getIcon("moreVertical")}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={copy}>
                                    {getIcon("copy")} {t("Copy")}
                                    <DropdownMenuShortcut>P</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={publish}>{getIcon("share")} {t("Publish")}</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={regenerate} disabled>{getIcon("delete")} {t("Regenerate")}</DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            :
                <>
                    <Col xs={1}>
                        <Nav.Link className="text-align-right" onClick={ () => showPromptEditor() }>
                            <FaCopy />
                        </Nav.Link>
                    </Col>
                </>
        }
        </>
    )

}
