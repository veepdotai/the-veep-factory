import { useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Logger } from 'react-logger-lib';
import { Container, Offcanvas } from 'react-bootstrap';

import * as Icon from 'react-bootstrap-icons';

import { t } from 'i18next';

import { pushState } from "src/components/lib/utils-analytics";
import Profile from './MenuItems/Profile';

import { ProfileContext } from '../context/ProfileProvider';
import { Utils } from "src/components/lib/utils";

import MenuItem from './MenuItems/MenuItem';
import Exit from './MenuItems/Exit';

export default function MenuOptions( props ) {
  const log = Logger.of(MenuOptions.name);
  log.trace("Menu: " + JSON.stringify(props));

  const { profile } = useContext(ProfileContext);

  return (
    <>
      {/*
          <OffCanvasMenu profile={profile}  key='menu'
              direction={props.direction}
              alwaysVisible={props.alwaysVisible}
              scroll={true}
              backdrop={true}
              placement={props.direction == "horizontal" ? "end" : "start"}
        />
      */}

        <OffCanvasMenu profile={profile}  key='menu'
          {...{
              className: props.className,
              direction: props.direction,
              alwaysVisible: props.alwaysVisible,
              scroll: true,
              backdrop: true,
              placement: props.direction == "horizontal" ? "end" : "start"}
          }
        />
    </>
  );
}

function OffCanvasMenu({ name, ...props }) {
  const log = Logger.of(OffCanvasMenu.name);
  log.trace("OffCanvasMenu: " + JSON.stringify(props));

  const [show, setShow] = useState(false);

  const direction = props.direction;

  const { profile } = useContext(ProfileContext);
  const [isManager, setIsManager] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    log.trace("Profile: " + JSON.stringify(profile));
    log.trace("Avatar url: " + profile.veepdotai_avatar_url);

    setIsManager(Utils.isManager(profile));
  }, [profile])
  
  let attr = {
    className: "mt-2 align-text-bottom",
    size: 24,
    onClick: handleShow
  }

  return (
    <>
    {profile ?
      <Profile className="my-auto" direction={direction} avatarUrl={profile.veepdotai_avatar_url} handleShow={handleShow} />
      :
      <></>
    }

      <Offcanvas style={{width: 300}} show={show} onHide={handleClose} {...props}>

        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t("OptionsMenu")}</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>


            { direction == "horizontal" ? // smartphone
                <Container>
                    <MenuItem key={"credits"} alwaysVisible={true} itemKey="credits" itemLabel={t("Credits")} direction={direction} handleClose={handleClose} />

                    <MenuItem key={"userPreferences"}  alwaysVisible={true} itemKey="userPreferences" itemLabel={t("UserPreferences")} direction={direction} handleClose={handleClose} />
                    { isManager ? <MenuItem key={"appPreferences"}  alwaysVisible={true} itemKey="appPreferences" itemLabel={t("AppPreferences")} direction={direction} handleClose={handleClose} />:<></>}
                    <MenuItem key={"add-content"}  alwaysVisible={true} itemKey="add-content" itemLabel={t("AddContent")} direction={direction} handleClose={handleClose} />
                    <MenuItem key={"support"}  alwaysVisible={true} itemKey="support" itemLabel={t("Support")} direction={direction} handleClose={handleClose} />
                    <MenuItem key={"about"}  alwaysVisible={true} itemKey="about" itemLabel={t("About")} direction={direction} handleClose={handleClose} />
                    <Exit alwaysVisible={true} direction={direction} handleClose={handleClose} />            
                </Container>
              :
                <Container className="gap-5">
                    <MenuItem key={"credits"}  alwaysVisible={true} itemKey="credits" itemLabel={t("Credits")} direction={direction} handleClose={handleClose} />
                    <MenuItem key={"userPreferences"}  alwaysVisible={true} itemKey="userPreferences" itemLabel={t("UserPreferences")} direction={direction} handleClose={handleClose} />
                    { isManager ? <MenuItem key={"appPreferences"}  alwaysVisible={true} itemKey="appPreferences" itemLabel={t("AppPreferences")} direction={direction} handleClose={handleClose} />:<></>}
                    <MenuItem key={"about"}  alwaysVisible={true} itemKey="about" itemLabel={t("About")} direction={direction} handleClose={handleClose} />
                    <Exit alwaysVisible={true} direction={direction} handleClose={handleClose} />            
                </Container>
            }

        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
