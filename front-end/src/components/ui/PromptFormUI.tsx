/**
 * When arriving on this screen, the veeplet is not defined yet, only the short
 * definition required by the catalog to display veeplets summary view.
 * 
 * It is only when the user clicks on a veeplet to configure or use it that it
 * is selected.
 */
import { useContext, useEffect, useState } from 'react'
import { Form, FloatingLabel, Container, NavDropdown, Row, Col, Stack, Dropdown } from 'react-bootstrap'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
import DropdownOrNavItem from '../DropdownOrNavItem'
import { useMediaQuery } from 'usehooks-ts'
import { VeepletModel } from '../screens/forms/DataModel'

export default function PromptForm({definition, handleClose}) {
  const log = Logger.of(PromptForm.name);
  const [cookies] = useCookies(['JWT']);

  let promptPrefix = "ai-prompt-";

  // Should be refactored with the one in CodeEditor
  const conf = {
    service: Constants.WORDPRESS_REST_URL + "/?rest_route=/veepdotai_rest/v1/options",
    'token': cookies.JWT,
    'prefix': promptPrefix
  }
  
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

  let  model = VeepletModel(veepletObject)
  let form = model.form

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

  function onSubmit(data) {
    // Merge export form data and params
    log.trace(`onSubmit.`)
    log.trace(`onSubmit: data: ${JSON.stringify(data)}`)

    //let newParams = {cid: cid, ...data, ...params}
    //log.trace(`onSubmit: newParams: ${JSON.stringify(newParams)}`)
    //PubSub.publish("INFOS_PANEL_UPDATED", newParams)
    //return UFC.onSubmitMetadata(graphqlURI, cookies, cid, data, topic, toast)
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

  function handleSave(e) {
    e?.preventDefault()
    
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
        {/*<Col {...innerStyle}>{UtilsForm.getValue(name, varName, params, veepletObject, handleChange, storeFieldData, iconNames, setIconNames, setDisabledSaveButton)}</Col>*/}
        <Col {...innerStyle}>{UtilsForm.getValueRHF(form, name, varName, params, veepletObject, handleChange, storeFieldData, iconNames, setIconNames, setDisabledSaveButton)}</Col>
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

  function removeOnePrompt(row, e) {
    e.preventDefault()

    let copy = JSON.parse(JSON.stringify(veepletObject));
    delete copy.prompts[row];
    log.trace("removeOnePromt: veepletObject: " + JSON.stringify(copy));
    setVeepletObject(copy);
  }

  function duplicatePrompt(row, e) {
    e.preventDefault()

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

  function addOnePrompt(e) {
    e.preventDefault()

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

  function getInformationTabContent() {
    return (
      <Tabs 
      id="infos-menu"
      defaultValue="general"
      className="mb-3">
              <TabsList className='grid grid-cols-3'>
                { isDesktop ? getInfoLinks()
                          : <NavDropdown className="w-100" title={t("Select")}>
                              {getInfoLinks()}
                            </NavDropdown>        
                }
              </TabsList>
            {/*<Tab.Content>*/}
              <TabsContent id="general" value="general">
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
              </TabsContent>
    {/*
              <TabsContent value="classification">
                {getInput(t("Group"), 'metadata.classification.group')}
                {getInput(t("Category"), 'metadata.classification.category')}
                {getInput(t("SubCategory"), 'metadata.classification.subCategory')}
              </TabsContent>
    */}
              <TabsContent id="looknfeel" value="looknfeel" title={t("Colors")}>
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

              </TabsContent>
              <TabsContent value="system">
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
              </TabsContent>
            {/*</Tab.Content>*/}
      </Tabs>
    )
  }

  function getChainTabContent() {
    return (
      <>
        {/*<FormRepeater />*/}
        {getInput(t("PromptsChain"), 'prompts.chain', {required: true})}
        {getInput(t("PromptsOutput"), 'prompts.output', {required: false})}
        <Tabs
          //defaultActiveKey={veepletObject.prompts.g1.label}
          //defaultActiveKey="__prompt__FiRsT__"
          //defaultActiveKey={Object.keys(getPrompts())[1]}
          defaultValue={activePromptKey}
          onSelect={(k) => setActivePromptKey(k)}
          //defaultActiveKey="__prompt__FiRsT__"
          id="prompt-tab"
          className="mb-3"
        >
          <Row>
            <Col xs={12} lg={3}>
                <TabsList className="bg-transparent flex-col">
              {
                Object.keys(getPrompts()).map((row, i) => {
                  log.trace("render: row tabname: " + row + ", i: " + i);
                  //let eventKey = i;
                  let eventKey = i == 1 ? row : row;
                  //let eventKey = i == 1 ? "__prompt__FiRsT__" : row;
                  //let eventKey = i == 1 ? "__prompt__FiRsT__" : "rowIs" + i;
                  if (i > 0) { // i == 0 => prompts.chain
                    return (
                      <Stack key={eventKey} direction="horizontal" gap={3}>
                        <TabsTrigger className="m-0" value={eventKey}>
                            <div className="w-[200px] text-left flex-1 inline-block align-middle">{veepletObject.prompts[row].label}</div>
                            <Button variant="secondary" className="ms-auto bg-transparent inline-block align-middle" onClick={(e) => duplicatePrompt(row, e)}>
                              {Icons.copy}
                            </Button>
                            <Button variant="secondary" className="ms-auto bg-transparent inline-block align-middle" onClick={(e) => removeOnePrompt(row, e)}>
                              {Icons.delete}
                            </Button>
                        </TabsTrigger>
                      </Stack>
                    )
                  }
              })}
                    <Stack direction="horizontal" gap={3}>
                      <div className="m-0">
                        <div className="w-[200px] text-left flex-1 inline-block align-middle">{t("AddPrompt")}</div>
                        <Button variant="secondary" className="bg-transparent ms-auto inline-block align-middle" onClick={(e) => { addOnePrompt(e)}}>
                          {Icons['add-content']}
                        </Button>
                      </div>
                    </Stack>
                  </TabsList>
            </Col>
            <Col>
              {/*<Tab.Content>*/}
                {
                  Object.keys(getPrompts()).map((row, i) => {
                    log.trace("render: row tab: " + row + ", i: " + i);
                    //let eventKey = i;
                    let eventKey = i == 1 ? row : row;
                    //let eventKey = i == 1 ? "__prompt__FiRsT__" : row;
                    //let eventKey = i == 1 ? "__prompt__FiRsT__" : "rowIs" + i;
                    if (i > 0) {
                      return (
                        <TabsContent key={eventKey} value={eventKey}>
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
                        </TabsContent>
                        )                              
                      }
                    })
                }
              {/*</Tab.Content>*/}
            </Col>
          </Row>
        </Tabs>
      </>
    )
  }

  function getDocumentationTabContent() {
    return (
      <Tabs
      orientation="vertical"
      defaultValue="userManual"
      id="documentation-tab"
      className="mb-3"
      >
              <TabsList className='grid grid-cols-5'>
                { isDesktop ? getDocLinks()
                      : <NavDropdown className="w-100" title={t("Select")}>
                          {getDocLinks()}
                        </NavDropdown>        
                }
              </TabsList>
            {/*<Tab.Content>*/}
              <TabsContent value="userManual">
                {getInput(t("UserManual"), "details.info.userManual", getTextareaStyle("300px"))}
              </TabsContent>
              <TabsContent value="adminManual">
                {getInput(t("AdminManual"), "details.info.adminManual", getTextareaStyle("300px"))}
              </TabsContent>
              <TabsContent value="devManual">
                {getInput(t("DevManual"), "details.info.devManual", getTextareaStyle("300px"))}
              </TabsContent>
              <TabsContent value="faq">
                {getInput(t("FAQ"), "details.info.faq", getTextareaStyle("300px"))}
              </TabsContent>
              <TabsContent value="changelog">
                {getInput(t("ChangeLog"), "details.info.changelog", getTextareaStyle("300px"))}
              </TabsContent>
            {/*</Tab.Content>*/}
      </Tabs>
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
    /*
    display: "flex",
    flexDirection: "row",
    overflow: "auto",
    flexWrap: "nowrap",
    textOverflow: "clip",
    whiteSpace: "nowrap"
    */
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mx-3">
                  <Tabs
                    variant='underline'
                    defaultValue="informations"
                    id="promptform-menu"
                    style={hInfos}
                    className="mb-3"
                  >
                    <TabsList className='grid grid-cols-3'>
                      <TabsTrigger value="informations">{t("Informations")}</TabsTrigger>
                      <TabsTrigger value="chain">{t("PromptsChain")}</TabsTrigger>
                      <TabsTrigger value="documentation">{t("Documentation")}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="informations" title={t("Informations")}>
                      {getInformationTabContent()}
                    </TabsContent>
                    <TabsContent value="chain" title={t("PromptsChain")}>
                      {getChainTabContent()}
                      {/*getInput(t("PromptsChain"), "promptsChain", {field: 'textarea'})*/}
                    </TabsContent>
                    <TabsContent value="documentation" title={t("Documentation")}>
                      {getDocumentationTabContent()}
                    </TabsContent>
                  </Tabs>
                  <Container className="text-end">
                    <Button className="m-2" onClick={(e) => handleClose(e)}>{t("Menu.Cancel")}</Button>
                    {/*<Button onClick={handleSave}>{t("Save")}</Button>*/}
                    <SuspenseClick waiting={saving} disabled={disabledSaveButton} handleAction={handleSave} label={t("Menu.Save")} />
                  </Container>
                </form>
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

