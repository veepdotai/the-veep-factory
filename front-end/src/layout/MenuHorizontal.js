import { Nav, Stack } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next';

import MenuOptions from './MenuOptions';
import MenuMobile from './MenuMobile';
import MenuItem from './MenuItems/MenuItem';

export default function MenuHorizontal( {direction, isManager, profile} ) {
    const log = Logger.of(MenuHorizontal.name);

    const viewType = 'options'  // @TODO: manage it as conf param (cf issue#150)
    return (
        <Nav className="m-2 text-white" variant={direction == "vertical" ? "pills" : "underline"}>
            <Stack direction={direction} gap={3} className="col-12 mx-auto">
                
                { 'options' === viewType ?
                        <MenuMobile outerCN="ms-auto" alwaysVisible={false} direction={direction} />
                    :
                        <>
                            <MenuItem itemKey="home" itemLabel={t("Dashboard")} direction={direction} />
                            <MenuItem className="ms-auto" itemKey="add-content" itemLabel={t("AddContent")} direction={direction} />
                            <MenuItem itemKey="contents" itemLabel={t("MyContents")} direction={direction} />
                            { isManager ?
                                    <>
                                        <MenuItem outerCN="mx-auto" alwaysVisible={false} itemKey="infos" itemLabel={t("Infos")} direction={direction} />
                                        <MenuItem alwaysVisible={false} itemKey="editorial" itemLabel={t("EditorialCal")} direction={direction} />
                                    </>
                                :
                                    <></>
                            }
                        </>
                }

                { profile ? <MenuOptions outerCN="ms-auto" alwaysVisible={false} direction={direction} /> : <></> }
            </Stack>
        </Nav>
    )
}
