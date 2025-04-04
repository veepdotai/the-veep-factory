import { useState, useEffect } from 'react';
import { Logger } from 'react-logger-lib';
import { Container, Offcanvas } from 'react-bootstrap';

import { t } from 'i18next';

import { Utils } from "src/components/lib/utils";
import { Icons } from "src/constants/Icons"

import MenuItem from './MenuItems/MenuItem';
import { Button } from 'src/components/ui/shadcn/button';

export default function MenuMobile( props ) {
  const log = Logger.of(MenuMobile.name);
  log.trace("Menu: ", props);

  return (
    <>
        <OffCanvasMenu key='menu'
          {...{
                className: props.className,
                direction: props.direction,
                alwaysVisible: props.alwaysVisible,
                scroll: true,
                backdrop: true,
                placement: "start"
              }
          }
        />
    </>
  );
}

function OffCanvasMenu({ name, ...props }) {
  const log = Logger.of(OffCanvasMenu.name);
  log.trace("OffCanvasMenu: ", props);

  const [show, setShow] = useState(false);

  const direction = props.direction;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function menuItem({id, label = "", _alwaysVisible = true}) {
    return (
      <MenuItem
        key={id}
        alwaysVisible={_alwaysVisible}
        itemKey={id}
        itemLabel={label || t(Utils.camelize(id))}
        direction={direction}
        handleClose={handleClose} />
    )
  }

  useEffect(() => {
  }, [])
  
  let attr = {
    className: "mt-2 align-text-bottom",
    size: 24,
    onClick: handleShow
  }

  return (
    <>
      <Button variant={'link'} onClick={handleShow}>{Icons.menu}</Button>

      <Offcanvas style={{width: 300}} show={show} onHide={handleClose} {...props}>

        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t("MobileMenu")}</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>

          <Container>
              {menuItem({id: "home"})}
              {menuItem({id: "add-content"})}
              {menuItem({id: "contents"})}

              <div className="h-[25px]"/>

              {menuItem({id: "brand-voice", itemType: "form"})}
              {menuItem({id: "editorial-line", itemType: "form"})}
              {menuItem({id: "template", itemType: "form"})}
              
              {menuItem({id: "pdf-export", itemType: "form"})}
              {menuItem({id: "spreadsheet", itemType: "spreadsheet"})}

              <div className="h-[25px]"/>
          </Container>

        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}
