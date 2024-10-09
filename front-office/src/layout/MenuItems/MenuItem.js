import { useEffect } from 'react';

import { Logger } from 'react-logger-lib';

import { pushState } from "src/components/lib/utils-analytics"
import NavItemLinkIconText from "src/components/NavItemLinkIconText"

import { Icons } from "src/constants/Icons"

export default function MenuItem( {id = '', innerCN, outerCN, itemKey, itemLabel, alwaysVisible = true, handleClose} ) {
  const log = Logger.of(MenuItem.name);

  function handleClick() {
    pushState("#" + itemKey);
//    if (direction == "horizontal") {
    if (true) {
        if (handleClose) {
        handleClose();
      }
    }
  }

  useEffect(() => {
    log.trace("alwaysVisible: " + alwaysVisible);
  }, [])

  return (
    <>
      <NavItemLinkIconText id={itemKey} innerCN={innerCN} outerCN={outerCN} itemKey={itemKey} eventKey={itemKey} title={itemLabel} alwaysVisible={alwaysVisible} onClick={handleClick}>
        {Icons[itemKey]}
      </NavItemLinkIconText>
    </>
  );
}
