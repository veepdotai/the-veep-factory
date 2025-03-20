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

import { getGenericData } from "src/api/service-fetch"
import { ProfileContext } from  "src/context/ProfileProvider"
import { Utils } from "src/components/lib/utils"

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
  const log = Logger.of(Index.name);

  const { profile } = useContext(ProfileContext);
  
  const DEFAULT_ACTIVE_KEY = "home"

  const [cookies] = useCookies(['JWT']);
  const [credits, setCredits] = useState();
  //const [current, setCurrent] = useState();
  const [current, setCurrent] = useState(DEFAULT_ACTIVE_KEY);
  const [isManager, setIsManager] = useState(false);

  const [activeTab, setActiveTab] = useState({})
  const [defaultActiveKey, setDefaultActiveKey] = useState({defaultActiveKey: DEFAULT_ACTIVE_KEY})

  const size = useBreakpoint();
  const [menuDirection, setMenuDirection] = useState();

  const { toast } = useToast()

  const menuStyle = {
//    backgroundColor: "#3663EA",
//    color: "white",
//    width: "217px"
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

  useEffect(() => {
    function computeMenuDirection() {
      if (["xxs", "xs", "sm"].includes(size)) {
        setMenuDirection('horizontal');
      } else {
        setMenuDirection('vertical');
      }

      log.trace("useEffect: selectMenuDirection: " + size);
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

    }
    
    initPageListeners();
  }, []);

  useEffect(() => {
    log.trace(`Index: current: ${current}`)
  }, [current]);

  useEffect(() => {
    getCredits();
    if (profile) {
      setIsManager(Utils.isManager(profile));
    }
  }, [profile]);

  //defaultActiveKey={"contents"}

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
                    <MenuVertical id="menu" direction={menuDirection} isManager={isManager} profile={profile}/>
                </Col>
                <Col style={{overflowY: "auto"}} className="vh-100 bg-white" md={9} xl={10}>
                  <div style={{height: "100%"}}>

                  {/*<Row><Header /></Row>*/}
                  <Row style={{height: "100%"}}>
                    <>
                      <Main credits={credits} current={current}/>
                    </>
                  </Row>
                  {/*<Row><Footer /></Row>*/}
                  </div>
                </Col>
              </>
            :
              <>
                <Col className="p-0" xs={12}>
                  <MenuHorizontal direction={menuDirection} isManager={isManager} profile={profile} />
                </Col>
                <Col className="p-0" xs={12}>
                  <Main credits={credits} current={current}/>
                </Col>
                <Footer />
              </>
          }
        </Row>
      </Tab.Container>

    </ThemeProvider>
  );
}
