import { Nav, Stack } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next';

import MenuOptions from './MenuOptions';
import MenuItem from './MenuItems/MenuItem';

export default function MenuHorizontal( {direction, isManager, profile} ) {
    const log = Logger.of(MenuHorizontal.name);

    return (
        <Nav className="m-2 text-white" variant={direction == "vertical" ? "pills" : "underline"}>
            <Stack direction={direction} gap={3} className="col-12 mx-auto">
                
                <MenuItem alwaysVisible={false} itemKey="home" itemLabel={t("Dashboard")} direction={direction} />
                <MenuItem alwaysVisible={false} itemKey="contents" itemLabel={t("MyContents")} direction={direction} />
                <MenuItem className="ms-auto" alwaysVisible={false} itemKey="add-content" itemLabel={t("AddContent")} direction={direction} />
                { isManager ?
                <>
                    <MenuItem outerCN="mx-auto" alwaysVisible={false} itemKey="infos" itemLabel={t("Infos")} direction={direction} />
                    <MenuItem alwaysVisible={false} itemKey="editorial" itemLabel={t("EditorialCal")} direction={direction} />
                </>
                    :<></>}
                { profile ? <MenuOptions outerCN="ms-auto" alwaysVisible={false} direction={direction} /> : <></> }
            </Stack>
        </Nav>
    )
}
