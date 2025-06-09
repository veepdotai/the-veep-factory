/**
 * When arriving on this screen, the veeplet is not defined yet, only the short
 * definition required by the catalog to display veeplets summary view.
 * 
 * It is only when the user clicks on a veeplet to configure or use it that it is
 * selected.
 */
import { useContext, useEffect, useState } from 'react'
import { Form, FloatingLabel, Button, Container, Nav, NavDropdown, Row, Col, Stack, Tab, Tabs, Dropdown } from 'react-bootstrap'
import { Logger } from 'react-logger-lib'
import { t } from 'src/components/lib/utils'
import { useCookies } from 'react-cookie'
import TOML from '@iarna/toml';
import IconPicker from 'react-icons-picker'
import toast from 'react-hot-toast';

//import ColorPicker, { useColorPicker } from 'react-best-gradient-color-picker'

import { Constants } from "src/constants/Constants";
import { Icons } from "src/constants/Icons";
import Veeplet from '../lib/class-veeplet';
import EKeyLib from '../lib/util-ekey';
import { UtilsForm } from '../lib/utils-form';

import { VeepletContext } from  "src/context/VeepletProvider"
import { ProfileContext } from  "src/context/ProfileProvider"

import SuspenseClick from '../common/SuspenseClick'
import Loading from '../common/Loading';
import { LayoutSidebarInsetReverse } from 'react-bootstrap-icons'
import DropdownOrNavItem from './PromptForm-DropdownOrNavItem'
import { useMediaQuery } from 'usehooks-ts'

export default function PromptForm({definition, handleClose}) {
  const log = Logger.of(PromptForm.name);
  const [cookies] = useCookies(['JWT']);

  let promptPrefix = "ai-prompt-";

  const [veepletObject, setVeepletObject] = useState();
  const { veeplet, setVeeplet } = useContext(VeepletContext);
  const { profile } = useContext(ProfileContext);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [activePromptKey, setActivePromptKey] = useState("");

  const [iconNames, setIconNames] = useState({
    header: "",
    body: ""
  });

  const [disabledSaveButton, setDisabledSaveButton] = useState(true);
  const [saving, setSaving] = useState(false);

//  const [color, setColor] = useState('linear-gradient(90deg, rgba(96,93,93,1) 0%, rgba(255,255,255,1) 100%)');
//  const { setSolid, setGradient } = useColorPicker(color, setColor);

  function updateSaveButtonListener(topic, data) {
    setSaving(false);
    if (data.result) {
      setDisabledSaveButton(true);
    } else {
      alert('There was a problem while saving.')
    }
  }

  function handleChange(e) {

    // There was an update that didn't trigger an event. Still needs to enable save button.
    if (! e) {
        setDisabledSaveButton(false);
        return;
    }

    let id = e.target.id;
    let value = e.target.value;

    let previousKey = id.replace(/prompts\.(.*)\.label/, "$1");
    log.trace("handleChange: previousKey " + previousKey);
    let key = EKeyLib.encode(value);

    if (/prompts\..*\.label/.test(id) && previousKey != key) {
      if (veepletObject.prompts[key]) {
        toast.error("That prompt name already exists.");
        document.getElementById(id).value = veepletObject.prompts[previousKey].label;
        //document.getElementById(id).focus(); // doesn't work :-(
        return;
      }

      let form = document.getElementById("prompt-editor-form");
      let inputFields = [...form.getElementsByTagName("input")];
      let textareaFields = [...form.getElementsByTagName("textarea")];
      let selectFields = [...form.getElementsByTagName("select")];
  
      let tomlSource = "";
      inputFields.map((row) => {return tomlSource += `${row.id} = "${row.value.replace(/"/g, "'").trim()}"\n`})
      textareaFields.map((row) => {return tomlSource += `${row.id} = '''${row.value.replace(/"/g, "'")}'''\n`})
      selectFields.map((row) => {return tomlSource += `${row.id} = "${row.value.replace(/"/g, "'")}"\n`})
      log.trace("handleSave: tomlSource" + tomlSource);
  
      let prev = TOML.parse(tomlSource);
      let copy = TOML.parse(tomlSource);
      copy.prompts = {};

      Object.keys(prev.prompts).map((row,i) => {
        if (row == previousKey) {
          copy.prompts[key] = prev.prompts[previousKey];
          copy.prompts[key]["label"] = value;
        } else {
          copy.prompts[row] = prev.prompts[row]
        }
      })

      //delete copy.prompts[previousKey];
      log.trace("handleChange: copy: " + JSON.stringify(copy))
      setVeepletObject(copy);
      setActivePromptKey(key);
      setDisabledSaveButton(false);

    } else {
      setDisabledSaveButton(false);
    }

  }

  // Should be refactored with the one in CodeEditor
  const conf = {
    service: Constants.WORDPRESS_REST_URL + "/?rest_route=/veepdotai_rest/v1/options",
    'token': cookies.JWT,
    'prefix': promptPrefix
  }

  function handleSave() {
    let form = document.getElementById("prompt-editor-form");
    let inputFields = [...form.getElementsByTagName("input")];
    let textareaFields = [...form.getElementsByTagName("textarea")];
    let selectFields = [...form.getElementsByTagName("select")];

    let tomlSource = "";
    inputFields.map((row) => {return tomlSource += `${row.id} = "${row.value.replace(/"/g, "'").trim()}"\n`})
    textareaFields.map((row) => {return tomlSource += `${row.id} = '''${row.value.replace(/"/g, "'")}'''\n`})
    selectFields.map((row) => {return tomlSource += `${row.id} = "${row.value.replace(/"/g, "'")}"\n`})
    log.trace("handleSave: tomlSource" + tomlSource);

    //let oldName = previous.getChainId();
    let previousName = new Veeplet(veepletObject).getChainId();
    setSaving(true);
    Veeplet.saveFromToml(cookies.JWT, tomlSource, profile.user_login, previousName);
    //setVeepletObject(veepletJson);
  }

  function storeFieldData(value, varName) {
    let node = document.getElementById(varName);
    node.value = value;
  }

  function getInput(name, varName, params) {
    let outerStyle = params?.outerStyle || "";
    let innerStyle = params?.innerStyle || "";
    return (
      <Row {...outerStyle}>
        <Col {...innerStyle}>{UtilsForm.getValue(name, varName, params, veepletObject, handleChange, storeFieldData, iconNames, setIconNames, setDisabledSaveButton)}</Col>
      </Row>
    )
  }

  function getPrompts() {
    return veepletObject.prompts;
  }

  function setVeepletDef(data) {
    log.trace("setVeepletDef: " + JSON.stringify(data));
    
    let optionName = Object.keys(data)[0] ;
    log.trace("setVeepletDef: optionName: " + optionName);
    let source = data[optionName];
    log.trace("setVeepletDef: source: " + source);
    
    source = (source + "").replace(/#EOL#/g, "\n");
    let veepletJson = TOML.parse(source);
    log.trace("setVeepletDefJson: " + Object.keys(veepletJson));

    log.trace("setVeepletDefo: " + veepletJson.metadata.name);
    setVeepletObject(veepletJson);
  }

  function looknfeel(type) {
    return (
      <>
        {getInput(t("IconName"), `details.ui.${type}IconName`, {field: "icon", type: type})}
        {getInput(t("FontColor"), `details.ui.${type}Color`, {field: "color", defaultValue: "white"})}
        {/*
        <div>
          <button onClick={setSolid}>Solid</button>
          <button onClick={setGradient}>Gradient</button>
          <ColorPicker value={color} onChange={setColor} />
        </div>
        */}
        {getInput(t("BgColorFrom"), `details.ui.${type}BgColorFrom`, {field: "color", defaultValue: "black"})}
        {/*
        {getInput(t("BgColorTo"), `details.ui.${type}BgColorTo`, {field: "color"})}
        {getInput(t("BgColorAngle"), `details.ui.${type}BgColorAngle`)}
        */}
      </>
    )
  }

  function getTextareaStyle(height) {
    let textareaStyleDocumentation = {
      field: "textarea",
      style: {
        height: height ?? "250px"
      }
    }

    return textareaStyleDocumentation;
  }

  function removeOnePrompt(row) {
    let copy = JSON.parse(JSON.stringify(veepletObject));
    delete copy.prompts[row];
    log.trace("removeOnePromt: veepletObject: " + JSON.stringify(copy));
    setVeepletObject(copy);
  }

  function duplicatePrompt(row) {
    let name = EKeyLib.decode(row);
    let newName = `${name} (${t("aCopy")})`;
    let newEncodedName = EKeyLib.encode(newName);
    log.trace(`duplicatePrompt: ${name}/${newName}/${newEncodedName}`);

    let copy = JSON.parse(JSON.stringify(veepletObject));
    copy.prompts[newEncodedName] = JSON.parse(JSON.stringify(copy.prompts[row]));
    copy.prompts[newEncodedName].label = newName;
    log.trace("duplicatePrompt: veepletObject: " + JSON.stringify(copy));
    setVeepletObject(copy);
  }

  function addOnePrompt() {
    let copy = JSON.parse(JSON.stringify(veepletObject));
    copy.prompts["TmV3"] = {"label": "New"};
    log.trace("addOnePromt: veepletObject: " + JSON.stringify(copy));
    setVeepletObject(copy);
  }

  /**
   * Layout + looknfeel
   */
  function getInfoLinks() {
    return (
      <>
        <DropdownOrNavItem eventKey="general" title={t("Menu.General")} />
        <DropdownOrNavItem eventKey="looknfeel" title={t("Colors")} />
        <DropdownOrNavItem eventKey="system" title={t("System")} />
      </>
    )
  }

  function getDocLinks() {
    return (
      <>
        <DropdownOrNavItem eventKey="userManual" title={t("UserManual")} />
        <DropdownOrNavItem eventKey="adminManual" title={t("AdminManual")} />
        <DropdownOrNavItem eventKey="devManual" title={t("DevManual")} />
        <DropdownOrNavItem eventKey="faq" title={t("FAQ")} />
        <DropdownOrNavItem eventKey="changelog" title={t("Changelog")} />
      </>
    )
  }

  let hPrompts = ! isDesktop ? {
    height: "150px",
    flexWrap: "nowrap",
    overflowY: "scroll",
    border: "4px solid silver",
    borderRadius: "5px",
    padding: "5px",
    margin: "10px 0px 10px 0"
  } : {}

  let hInfos = {
    display: "flex",
    flexDirection: "row",
    overflow: "auto",
    flexWrap: "nowrap",
    textOverflow: "clip",
    whiteSpace: "nowrap"
  }

  useEffect(() => {
    //setHeaderIconName(veepletObject.details.ui.headerIconName);
    //setBodyIconName(veepletObject.details.ui.bodyIconName);
    if (veepletObject) {
      setIconNames({
        "header": veepletObject.details?.ui?.headerIconName ?? "",
        "body": veepletObject.details?.ui?.bodyIconName ?? ""
      })
      
      if (! activePromptKey) {
        setActivePromptKey(Object.keys(getPrompts())[1]);
      }
   }

  }, [veepletObject]);

  useEffect(() => {
    PubSub.subscribe( "POST_PROMPT_OPTION_RESULT", updateSaveButtonListener);

    if (veeplet) {
      Veeplet.load(conf, promptPrefix + veeplet, setVeepletDef);
    }

    log.trace("useEffect: definition: " + JSON.stringify(veeplet));
  }, [veeplet]);

  return (
    <>
      { veepletObject && activePromptKey ?
          <>
          <Container id="prompt-editor-form">
            <Form>
              <Tabs
                variant='underline'
                defaultActiveKey="informations"
                id="promptform-menu"
                style={hInfos}
                className="mb-3"
              >
                <Tab id="promptform-menu-informations" eventKey="informations" title={t("Informations")}>
                  <Tab.Container 
                      id="infos-menu"
                      defaultActiveKey="general"
                      className="mb-3">
                    <Row>
                      <Col xs={12} md={3}>
                        <Nav variant="pills" className="clearfix flex-column">
                          { isDesktop ? getInfoLinks()
                                    : <NavDropdown className="w-100" title={t("Select")}>
                                        {getInfoLinks()}
                                      </NavDropdown>        
                          }
                        </Nav>
                      </Col>
                      <Col>
                        <Tab.Content>
                          <Tab.Pane id="general" eventKey="general">
                            <Row>
                              <Col xs="12" md="6">
                                {getInput(t("Heading"), 'details.presentation.heading')}
                                {getInput(t("Name"), 'metadata.name')}
                                {getInput(t("Status"), 'metadata.publication.status', {
                                  field: 'select:active|inactive|draft|trash'
                                })}
                                {getInput(t("Summary"), 'metadata.summary')}
                              </Col>
                              <Col xs="12" md="6">
                                {getInput(t("Group"), 'metadata.classification.group')}
                                {getInput(t("Category"), 'metadata.classification.category')}
                                {getInput(t("SubCategory"), 'metadata.classification.subCategory')}
                              </Col>
                            </Row>
                            {getInput(t("Tips1"), 'details.presentation.tips1', {field: 'textarea'})}
                            {getInput(t("Tips2"), 'details.presentation.tips2', {field: 'textarea'})}
                          </Tab.Pane>
{/*
                          <Tab.Pane eventKey="classification">
                            {getInput(t("Group"), 'metadata.classification.group')}
                            {getInput(t("Category"), 'metadata.classification.category')}
                            {getInput(t("SubCategory"), 'metadata.classification.subCategory')}
                          </Tab.Pane>
*/}
                          <Tab.Pane id="looknfeel" eventKey="looknfeel" title={t("Colors")}>
                            <Row>
                              <Col xs={12} md={6} className='fs-6'>
                                <Container>
                                  {t("Header")}
                                  {getInput(t("FontColor"), `details.ui.HeaderColor`, {field: "color", defaultValue: "white"})}
                                  {getInput(t("BgColorFrom"), `details.ui.HeaderBgColorFrom`, {field: "color", defaultValue: "black"})}
                                </Container>
                              </Col>
                              <Col xs={12} md={6} className='fs-6'>
                                <Container>
                                  {t("Body")}
                                  {looknfeel("body", definition)}
                                </Container>
                              </Col>
                            </Row>

{/*
                            <Tab.Container
                              defaultActiveKey="header"
                              id="looknfeel-tab"
                              className="mb-3"
                              >
                              <Row>
                                <Col xs={3}>
                                  <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                      <Nav.Link eventKey="header">{t("Header")}</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                      <Nav.Link eventKey="body">{t("Body")}</Nav.Link>
                                    </Nav.Item>
                                  </Nav>
                                </Col>
                                <Col>
                                  <Tab.Content>
                                    <Tab.Pane eventKey="header">
                                      {looknfeel("header", definition)}
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="body">
                                      {looknfeel("body", definition)}
                                    </Tab.Pane>
                                  </Tab.Content>
                                </Col>
                              </Row>
                            </Tab.Container>
*/}
                          </Tab.Pane>
                          <Tab.Pane id="system" eventKey="system">
                            {getInput(t("Version"), 'metadata.version')}
                            {getInput(t("CreationDate"), 'owner.creationDate')}
                            {getInput(t("Reviews"), 'metadata.reviews')}
                            {getInput(t("Effort"), 'metadata.effort')}
                            {getInput(t("authorId"), 'owner.authorId')}
                            {getInput(t("OrgId"), 'owner.orgId')}
                            {getInput(t("Scope"), 'metadata.publication.scope', {
                              field: 'select:public|personal|private'
                            })}
                            {getInput(t("Schema"), 'metadata.schema')}
                          </Tab.Pane>
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Tab.Container>
                </Tab>
                <Tab id="chain" eventKey="chain" title={t("PromptsChain")}>
                  {/*<FormRepeater />*/}
                  {getInput(t("PromptsChain"), 'prompts.chain', {required: true})}
                  {getInput(t("PromptsOutput"), 'prompts.output', {required: false})}
                  <Tab.Container
                    //defaultActiveKey={veepletObject.prompts.g1.label}
                    //defaultActiveKey="__prompt__FiRsT__"
                    //defaultActiveKey={Object.keys(getPrompts())[1]}
                    activeKey={activePromptKey}
                    onSelect={(k) => setActivePromptKey(k)}
                    //defaultActiveKey="__prompt__FiRsT__"
                    id="prompt-tab"
                    className="mb-3"
                  >
                    <Row>
                      <Col xs={12} lg={3}>
                        <Nav style={hPrompts} variant="pills" className="flex-column">
                        {
                          Object.keys(getPrompts()).map((row, i) => {
                            log.trace("render: row tabname: " + row + ", i: " + i);
                            //let eventKey = i;
                            let eventKey = i == 1 ? row : row;
                            //let eventKey = i == 1 ? "__prompt__FiRsT__" : row;
                            //let eventKey = i == 1 ? "__prompt__FiRsT__" : "rowIs" + i;
                            if (! ["chain", "output"].includes(row)) { // i == 0 => prompts.chain
                              return (
                                <Stack key={eventKey} direction="horizontal" gap={3}>
                                  <Nav.Item className="w-100">
                                    <Nav.Link eventKey={eventKey}>
                                          <div>{veepletObject.prompts[row].label}</div>
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Button variant="outline-primary" className="ms-auto" onClick={(e) => duplicatePrompt(row)}>
                                    {Icons.copy}
                                  </Button>
                                  <Button variant="outline-primary" className="ms-auto" onClick={(e) => removeOnePrompt(row)}>
                                    {Icons.delete}
                                  </Button>
                                </Stack>
                              )
                            }
                        })}
                            <Stack direction="horizontal" gap={3}>
                              <div>{t("AddPrompt")}</div>
                              <Button variant="outline-primary" className="ms-auto" onClick={(e) => addOnePrompt()}>
                                    {Icons['add-content']}
                              </Button>
                            </Stack>
                        </Nav>
                      </Col>
                      <Col>
                        <Tab.Content>
                          {
                            Object.keys(getPrompts()).map((row, i) => {
                              log.trace("render: row tab: " + row + ", i: " + i);
                              //let eventKey = i;
                              let eventKey = i == 1 ? row : row;
                              //let eventKey = i == 1 ? "__prompt__FiRsT__" : row;
                              //let eventKey = i == 1 ? "__prompt__FiRsT__" : "rowIs" + i;
                            if (! ["chain", "output"].includes(row)) { // i > 0 => ! prompts.chain && ! prompts.output
                                return (
                                  <Tab.Pane key={eventKey} eventKey={eventKey}>
                                    <Row>
                                      <Col xs={12} lg={3}>
                                        {getInput(t("Label"), `prompts.${row}.label`, {required: true})}
                                        {getInput(t("Role"), `prompts.${row}.role`, {
                                          field: 'textarea', style: {
                                            height: '200px'
                                          }
                                        })}
                                      </Col>
                                      <Col xs={12} lg={6}>
                                        {getInput(t("Prompt"), `prompts.${row}.prompt`, getTextareaStyle("300px"))}
                                      </Col>
                                      <Col xs={12} lg={3}>
                                        {getInput(t("LLM"), `prompts.${row}.llm`, {field: 'select:'
                                          + 'openai-gpt-4|openai-gpt-4-0125-preview|openai-gpt-4-1106-preview'
                                          + '|mistral-mistral-tiny|mistral-mistral-small|mistral-mistral-medium'
                                        })}
                                        <Row>
                                          <Col>{getInput(t("TopP"), `prompts.${row}.top_p`)}</Col>
                                          <Col>{getInput(t("Temperature"), `prompts.${row}.temperature`)}</Col>
                                        </Row>
                                        <Row>
                                          <Col>{getInput(t("FrequencyPenalty"), `prompts.${row}.frequency_penalty`)}</Col>
                                          <Col>{getInput(t("PresencePenalty"), `prompts.${row}.presence_penalty`)}</Col>
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Tab.Pane>
                                  )                              
                                }
                              })
                          }
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Tab.Container>

                  {/*getInput(t("PromptsChain"), "promptsChain", {field: 'textarea'})*/}
                </Tab>
                <Tab eventKey="documentation" title={t("Documentation")}>
                  <Tab.Container
                      defaultActiveKey="userManual"
                      id="documentation-tab"
                      className="mb-3"
                      >
                      <Row>
                        <Col xs={12} md={3}>
                          <Nav variant="pills" className="flex-column">
                              { isDesktop ? getDocLinks()
                                    : <NavDropdown className="w-100" title={t("Select")}>
                                        {getDocLinks()}
                                      </NavDropdown>        
                              }
                          </Nav>
                        </Col>
                        <Col>
                          <Tab.Content>
                            <Tab.Pane eventKey="userManual">
                              {getInput(t("UserManual"), "details.info.userManual", getTextareaStyle("300px"))}
                            </Tab.Pane>
                            <Tab.Pane eventKey="adminManual">
                              {getInput(t("AdminManual"), "details.info.adminManual", getTextareaStyle("300px"))}
                            </Tab.Pane>
                            <Tab.Pane eventKey="devManual">
                              {getInput(t("DevManual"), "details.info.devManual", getTextareaStyle("300px"))}
                            </Tab.Pane>
                            <Tab.Pane eventKey="faq">
                              {getInput(t("FAQ"), "details.info.faq", getTextareaStyle("300px"))}
                            </Tab.Pane>
                            <Tab.Pane eventKey="changelog">
                              {getInput(t("ChangeLog"), "details.info.changelog", getTextareaStyle("300px"))}
                            </Tab.Pane>
                          </Tab.Content>
                        </Col>
                      </Row>
                    </Tab.Container>
                </Tab>
              </Tabs>
              <Container className="text-end">
                <Button className="m-2" onClick={handleClose}>{t("Menu.Cancel")}</Button>
                {/*<Button onClick={handleSave}>{t("Save")}</Button>*/}
                <SuspenseClick waiting={saving} disabled={disabledSaveButton} handleAction={handleSave} label={t("Menu.Save")} />
              </Container>
            </Form>
          </Container>
        </>
      :
      <Container style={{height: "300px"}}>
        <Loading />
      </Container>
    }
    </>
  )
}

