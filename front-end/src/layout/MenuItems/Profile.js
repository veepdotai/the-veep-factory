import { useState } from 'react';
import { Logger } from 'react-logger-lib';
import { Image } from 'react-bootstrap';
import { t } from 'src/components/lib/utils'

import { pushState } from "src/components/lib/utils-analytics"
import NavItemLinkIconText from "src/components/NavItemLinkIconText"

import { Icons, attr } from "src/constants/Icons"

export default function Profile( {className, avatarUrl, direction, handleShow, handleClose} ) {
  const log = Logger.of(Profile.name);

  const [myAvatarUrl, setAvatarUrl] = useState(avatarUrl);

  const menuItemKey = "profile";
  const menuItemLabel = t("Profile");

  function handleClick() {
    pushState("#" + menuItemKey);
    if (direction == "horizontal") {
      handleClose();
    }
  }

  return (
    <>
      <NavItemLinkIconText
        outerCN={attr.className + " " + (direction == "horizontal" ? "ms-auto" : "mt-auto mb-3")}
        itemKey="profile"
        title={t("Menu.Profile")}
        onClick={handleShow}
        alwaysVisible="true">
          { myAvatarUrl ?
                <Image className="d-inline" src={myAvatarUrl} width={24} roundedCircle />
              :
              <>
                {Icons.avatar}
              </>
          }
      </NavItemLinkIconText>

    </>
  );
}
