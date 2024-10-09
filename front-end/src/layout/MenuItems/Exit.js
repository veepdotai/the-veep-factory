import { Logger } from 'react-logger-lib';
import { useCookies } from 'react-cookie';
import { t } from 'i18next';

import { Constants } from "src/constants/Constants"
import { Icons } from "src/constants/Icons"
//import { pushState } from "src/components/lib/utils-analytics";
import NavItemLinkIconText from "src/components/NavItemLinkIconText"

export default function Exit( props ) {
  const log = Logger.of(Exit.name);

  const direction = props.direction;
  const handleClose = props.handleClose;

  const [cookie, setCookie, removeCookie] = useCookies(['JWT']);

  const menuItemKey = "exit";
  const menuItemLabel = t("Exit");

  function handleClick() {
    let url = Constants.WORDPRESS_REST_URL
              + "/wp-json/veepdotai_rest/v1/mywp/logout_url?JWT="
              + cookie.JWT;
    log.trace("Url: " + url);

    let exitHref = Constants.WORDPRESS_REST_URL + "/wp-login.php?action=logout&JWT=" + cookie.JWT + "&redirect_to=" + Constants.WORDPRESS_URL;
    window.onbeforeunload = null;
    window.onpagehide = null;

    // Removing the cookie prevents logout and redirection in BO
    // The cookie will be removed a few seconds after the redirection.
    setCookie('JWT', cookie.JWT, {
      path: '/',
      maxAge: 10
    });

    window.location = exitHref;

  }

  return (
    <>
      <NavItemLinkIconText itemKey={menuItemKey} title={menuItemLabel} alwaysVisible="true" onClick={handleClick}>
        {Icons['exit']}
      </NavItemLinkIconText>
    </>
  );
}
