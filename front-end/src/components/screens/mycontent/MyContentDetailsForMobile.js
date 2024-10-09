import { Nav, NavDropdown } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next';

import MyContentDetailsUtils from './MyContentDetailsUtils'
import PDF from '../../export/pdf/PDF.js';

import EKeyLib from '../../lib/util-ekey';

import Veeplet from '../../lib/class-veeplet'
import Content from './Content';

export default class MyContentDetailsForMobile {
  static log = Logger.of(MyContentDetailsForMobile.name);

  static mobileMenu(prompt) {
    return (
      <Nav id="details-content" activeKey="content">
        <NavDropdown title="Contents">
          <NavDropdown.Item id="details-content" eventKey="content">{t("MainContent")}</NavDropdown.Item>
          <NavDropdown.Item id="details-sideBySide-content" eventKey="sideBySide-content">{t("SideBySideView")}</NavDropdown.Item>
          {
            Veeplet.getChainAsArray(prompt.prompts.chain).map((_promptId) => {
              if (_promptId == "STOP") return (<></>);
              let promptId = EKeyLib.encode(_promptId);
              //Object.keys(prompt.prompts.chain).map((promptId, i) => {
              //log.trace("render: row: " + row + ", i: " + i);
              let instructions = prompt.prompts[promptId];
              //let eventKey = i == 1 ? "__prompt__FiRsT__" : row;
              let eventKey = instructions?.label ?? t("UnknownLabel");
              return (
                <NavDropdown.Item eventKey={eventKey}>{`${t("Edit")} ${instructions?.label}`}</NavDropdown.Item>
              )
            })
          }
          <NavDropdown.Item id="metadata" eventKey="metadata">{t("Metadata")}</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    )
  }

  static mobileContent(selectedFormat, prompt, data, contentId) {
    return (
      <>
        {MyContentDetailsUtils.getFormatSelectors(["Texte", "PDF"], )}
        {selectedFormat == "PDF" ?
            <PDF content={ MyContentDetailsUtils.getMainContent(prompt, data, contentId, true) }/>
          :
            MyContentDetailsUtils.getMainContent(prompt, data, contentId)
        }
      </>
    )
  }

}
