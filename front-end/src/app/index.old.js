'use client';

import { useContext, useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib';
import { useCookies, CookiesProvider } from "react-cookie";
import { Toaster } from 'react-hot-toast';
import { Toaster as ShadcnToaster } from "@/components/ui/toaster"    

import { ThemeProvider, Col, Row, Tab } from 'react-bootstrap';

import "../components/lib/i18n"

import useBreakpoint from "src/hooks/useBreakpoint"
import Cover from "src/components/common/Cover"
import VeepToast from "src/components/common/VeepToast"
import PromptDialog from "src/components/common/PromptDialog"

import { Button } from "src/components/ui/shadcn/button"

import { getGenericData } from "src/api/service-fetch"
import { ProfileContext } from  "src/context/ProfileProvider"
import { Utils } from "src/components/lib/utils"
import { UtilsMenu } from 'src/components/lib/utils-menu'
import { UtilsGraphQLConfiguration } from '@/api/utils-graphql-configuration'

import { Constants } from '@/constants/Constants';

/* Default menus */
import startMenuDefinition from 'src/config/menu-definitions/utils-menu-start-definition.json'
import dataMenuDefinition from 'src/config/menu-definitions/utils-menu-data-definition.json'
import configurationMenuDefinition from 'src/config/menu-definitions/utils-menu-configuration-definition.json'
import configurationMenuDefinitionForUser from 'src/config/menu-definitions/utils-menu-configuration-definition-user.json'
import configurationMenuDefinitionForAdmin from 'src/config/menu-definitions/utils-menu-configuration-definition-admin.json'

/* Layout */
import Header from "src/layout/Header"
import MenuVertical from "src/layout/MenuVertical"
import MenuHorizontal from "src/layout/MenuHorizontal"
import Main from "src/layout/Main"
import Footer from "src/layout/Footer"
import CalendarView from '../components/screens/CalendarView'
//import { useToast } from '@/hooks/use-toast';
import { useToast } from "src/components/ui/shadcn/hooks/use-toast"

//export default function App() {
export default function Index() {
  const log = (...args) => Logger.of(Index.name).trace(args)

  const { profile } = useContext(ProfileContext);
  
  const DEFAULT_ACTIVE_KEY = "home"

  const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
  const [cookies] = useCookies(['JWT']);
  const [credits, setCredits] = useState();
  //const [current, setCurrent] = useState();
  const [current, setCurrent] = useState(DEFAULT_ACTIVE_KEY);
  const [isManager, setIsManager] = useState(false);

  const [staticMenus, setStaticMenus] = useState(true);

  const [activeTab, setActiveTab] = useState({})
  const [defaultActiveKey, setDefaultActiveKey] = useState({defaultActiveKey: DEFAULT_ACTIVE_KEY})

  const size = useBreakpoint();
  const [menuDirection, setMenuDirection] = useState();

  const { toast } = useToast()

  const [genericMenu, setGenericMenu] = useState(null)
  const [dataMenu, setDataMenu] = useState(null)
  const [configurationMenu, setConfigurationMenu] = useState(null)

  const menuStyle = {
//    backgroundColor: "#3663EA",
//    color: "white",
//    width: "217px"
  }

  /**
   * Based on DynamicForm.getDefinitionFromType
   * @param {*} type 
   * @param {*} definitions 
   * @returns 
   */
  function getDefinitionFromType(type, definitions) {
      log("getDefinitionFromType:", type)
      let definition = definitions?.find((def) => {
          log("menu type:", type, "definition:", def)
          return type === def.name
      })?.definition

      return definition
  }
  
  // Get credits
  function getCredits() {
    return getGenericData({
      "topic": "CREDITS", "cookies": cookies, "ns": "billing", "service": "credits", "setData": setCredits, "key": "credits"
    });
  }

  function handleToast(topic, message) {
    toast(message)
  }

  function resetMenu() {
    setGenericMenu(null)
    setDataMenu(null)
    setConfigurationMenu(null)
  }

  useEffect(() => {
    function computeMenuDirection() {
      if (["xxs", "xs", "sm"].includes(size)) {
        setMenuDirection('horizontal');
      } else {
        setMenuDirection('vertical');
      }

      log("useEffect: selectMenuDirection: ", size)
    }

    computeMenuDirection();  
  }, [size]);

  useEffect(() => {
    function initPageListeners() {

      PubSub.subscribe("TAB_CLICKED", (topic, itemKey) => {    
          //setActiveTab(itemKey);
          if ("add-content" === itemKey) {
            setActiveTab({activeKey: itemKey});
          } else if (activeTab) {
            // We were on add-content because it is the only reason to set activeTab
            setActiveTab({});
            setDefaultActiveKey({defaultActiveKey: itemKey})
          }
      });

      /* What's currently happening? */
      PubSub.subscribe("CURRENT_STEP", (topic, message) => {
          setCurrent(message);
      });
    
      PubSub.subscribe("_TRANSCRIPTION_STARTED_", (topic, message) => {    
      //PubSub.subscribe("_TRANSCRIPTION_FINISHED_", (topic, message) => {
          getCredits();
      });

      PubSub.subscribe("SELECTED_DOCTYPE", (topic, message) => setActiveTab({activeKey: "add-content"}));

      PubSub.subscribe("TOAST", (topic, message) => handleToast(topic, message))
      PubSub.subscribe("ERROR", (topic, message) => handleToast(topic, message))

    }
    
    initPageListeners();
  }, []);

  useEffect(() => {
    log("Index: current:", current)
  }, [current]);

  useEffect(() => {
    getCredits();
    if (profile) {
      setIsManager(Utils.isManager(profile));
    }
  }, [profile]);

  /**
   * Based on DynamicForm.initForm()
   * @param {*} type  It's about menu type 
   * @param {*} setMenu 
   * @param {*} defaultDefinitions 
   */
  function initMenu(type, cType, setDefinition, defaultDefinitions) {
      let def = null
      UtilsGraphQLConfiguration.
          listConfiguration(graphqlURI, cookies, "Menu", cType)
          .then((data) => {
              log("useEffect: menu type:", type, "data from db: data:", data)
              let ldefinition = data?.length > 0 && data[0]?.definition 
              if (ldefinition) {

                  let defString = Utils.normalize(ldefinition)
                  log("useEffect: menu type:", type, "normalized data.definition: def: ", defString)

                  def = JSON.parse(defString)
                  log("useEffect: menu type:", type, "json data.definition: def: ", def)

                  if (! def) {
                      def = getDefinitionFromType(type, defaultDefinitions)
                      log("useEffect: menu type:", type, "default definition because can't convert data.definition from db: def: ", def)
                  }
              } else {
                  def = getDefinitionFromType(type, defaultDefinitions)
                  log("useEffect: menu type:", type, "default definition: def: ", def)
              }

              /**
               * Type is inknown. Provide a default basic definition.
               */
              if (! def) {
                  def = getDefinitionFromType(type, defaultDefinitions)
                  log("useEffect: type:", type, "default menu definition because nothing else has been provided: def: ", def)
              }

              setDefinition(UtilsMenu.processMenu(def))
          })
          .catch((e) => {
              alert("ERROR: useEffect: type:", type, "getDefinition: e: " + JSON.stringify(e))
              log("ERROR: useEffect: type:", type, "getDefinition: e: ", e)

              def = getDefinitionFromType(type, defaultDefinitions)
              log("useEffect: type:", type, "default definition because an exception has been raised: def: ", def)

              setDefinition(UtilsMenu.processMenu(def))
          })
  }

  useEffect(() => {
      if (! genericMenu) {
        staticMenus ?
          setGenericMenu(UtilsMenu.processMenu(getDefinitionFromType("generic", defaultDefinitions)))
          : initMenu("generic", "genericMenu", setGenericMenu, defaultDefinitions)
      }
      if (! dataMenu) {
        staticMenus ?
          setDataMenu(UtilsMenu.processMenu(getDefinitionFromType("data", defaultDefinitions)))
          : initMenu("data", "dataMenu", setDataMenu, defaultDefinitions)
      }
      if (! configurationMenu) {
        staticMenus ?
          setConfigurationMenu(UtilsMenu.processMenu(getDefinitionFromType("configuration", defaultDefinitions)))
          : initMenu("configurationForAdmin", "configurationMenu", setConfigurationMenu, defaultDefinitions)
      }
  }, [genericMenu, dataMenu, configurationMenu])

  //defaultActiveKey={"contents"}

  const defaultDefinitions = [
      { name: "generic", definition: startMenuDefinition },
      { name: "data", definition: dataMenuDefinition },
      { name: "configuration", definition: configurationMenuDefinition },
      { name: "configurationForAdmin", definition: configurationMenuDefinitionForAdmin },
      { name: "configurationForUser", definition: configurationMenuDefinitionForUser },
  ]
    
  let menus = () => { return {
    genericMenu: genericMenu,
    dataMenu: dataMenu,
    configurationMenu: configurationMenu
  }}

  return (
      <ThemeProvider data-bs-theme="dark">

        <Toaster
          position="bottom-left"
          reverseOrder={false}
        />
        <ShadcnToaster />
        <PromptDialog />
        <VeepToast />
        <Cover />
        {/*<CalendarView />*/}
        
        <Tab.Container
          {...defaultActiveKey}
          {...activeTab}
          id="controlled-tab-home"
          style={menuStyle} 
          className="mb-3 container"
        >
        <Row style={menuStyle} className="m-0 p-0">
          {
            menuDirection == 'vertical' ?
              <>
                <Col style={{height: "100%", overflowY: "auto"}} className="bg-light vh-100 border-end" md={3} xl={2}>
                    <MenuVertical id="menu" {...menus()} direction={menuDirection} isManager={isManager} profile={profile}/>
                </Col>
                <Col style={{overflowY: "auto"}} className="vh-100 bg-white" md={9} xl={10}>
                  <div style={{height: "100%"}}>

                  {/*<Row><Header /></Row>*/}
                  <Row style={{height: "100%"}}>
                    <>
                      <Main {...menus()} credits={credits} current={current} />
                    </>
                  </Row>
                  {/*<Row><Footer /></Row>*/}
                  </div>
                </Col>
              </>
            :
              <>
                <Col className="p-0" xs={12}>
                  <MenuHorizontal {...menus()} direction={menuDirection} isManager={isManager} profile={profile} />
                </Col>
                <Col className="p-0" xs={12}>
                  <Main {...menus()} credits={credits} current={current}/>
                </Col>
                <Footer />
              </>
          }
        </Row>
      </Tab.Container>

    </ThemeProvider>
  );
}
