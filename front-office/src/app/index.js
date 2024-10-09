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

//export default function App() {
export default function Index() {
  const log = Logger.of(Index.name);

  const { profile } = useContext(ProfileContext);

  const [cookies] = useCookies(['JWT']);
  const [credits, setCredits] = useState();
  const [current, setCurrent] = useState();
  const [isManager, setIsManager] = useState(false);

  const size = useBreakpoint();
  const [menuDirection, setMenuDirection] = useState();

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
      /* What's currently happening? */
      PubSub.subscribe("CURRENT_STEP", (topic, message) => {
          setCurrent(message);
      });
    
      PubSub.subscribe("_TRANSCRIPTION_STARTED_", (topic, message) => {    
      //PubSub.subscribe("_TRANSCRIPTION_FINISHED_", (topic, message) => {
          getCredits();
      });
    }
    
    initPageListeners();
  }, []);

  useEffect(() => {
    getCredits();
    if (profile) {
      setIsManager(Utils.isManager(profile));
    }
  }, [profile]);

  return (
      <ThemeProvider data-bs-theme="dark">

        <Toaster
          position="bottom-right"
          reverseOrder={false}
        />
        <ShadcnToaster />
        <PromptDialog />
        <VeepToast />
        <Cover />
        
        <Tab.Container
          defaultActiveKey="contents"
          id="controlled-tab-home"
          style={menuStyle} 
          className="mb-3 container"
        >
        {/*<Row style={{backgroundColor: "#3663EA"}} className="bg-light p-4 pt-0">*/}
        {/*<Row style={menuStyle} className="mw-100 pt-0">*/}
        <Row style={menuStyle} className="m-0 p-0">
          {
            menuDirection == 'vertical' ?
              <>
                {/*<Col style={{backgroundColor: "#3663EA"}} className="vh-100" md={3} xl={2}>*/}
                <Col style={{height: "100%", overflowY: "auto"}} className="bg-light vh-100 border-end" md={3} xl={2}>
                  {/*<div style={{position: "fixed", height: "100%", overflowY: "auto"}}>*/}
                    <MenuVertical id="menu" direction={menuDirection} isManager={isManager} profile={profile}/>
                  {/*</div>*/}
                </Col>
                <Col style={{overflowY: "auto"}} className="vh-100 bg-white" md={9} xl={10}>
                  <div style={{height: "100%"}}>

                  {/*<Row><Header /></Row>*/}
                  <Row style={{height: "100%"}}>
                    <Main credits={credits} current={current}/>
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
