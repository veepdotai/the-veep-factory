import { useContext, useEffect, useState } from 'react';
import { Button, Card, Container, Col, Modal, Row, Nav, Tab, Tabs} from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';
import { useCookies } from 'react-cookie';
import { t } from 'i18next';

import useCatalog from  "src/hooks/useCatalog";

import { SharedCatalogContext } from 'src/context/catalog/SharedCatalogProvider';
import { PersonalCatalogContext } from 'src/context/catalog/PersonalCatalogProvider';
import { VeepletContext } from 'src/context/VeepletProvider';

import Prompt from './Prompt';
import { Constants } from "src/constants/Constants";

export default function AllCards( { type, title, firstTab = null }) {
  const log = Logger.of(AllCards.name);

  let defaultEventKey = type + "-first";
  //const config = { className: 'pb-2', xs: 12, md: 6, lg: 2, xl: 2};
  const config = Constants.CATALOG_CARD_WIDTH;
  
  const [cookies] = useCookies(['JWT']);
  const [display, setDisplay] = useState(true);
  const [current, setCurrent] = useState({});
  const [directory, setDirectory] = useState(false);
  const [categories, setCategories] = useState(false);
  
  const { sharedCatalog, setSharedCatalog } = useContext(SharedCatalogContext);
  const { personalCatalog, setPersonalCatalog } = useContext(PersonalCatalogContext);
  const { veeplet, setVeeplet } = useContext(VeepletContext);
  
  function showAllCards(topic, msg) {
    log.info("showAllCards: Receiving: " + topic + " / " + msg);
  }

  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }
  
  function getCategories(directory) {
    if (directory) {
      let categories = directory.map((row) => { return row.status === "active" && row.category })
      return categories.filter(onlyUnique);
    } else {
      return [];
    }
  }

  function getAIsByCategory(category) {
    return directory.filter((row) => { return row.status === "active" && row.category === category});
  }

  function displayNav(categories, defaultEventKey) {
    let items = categories.map((cat, i) => {
      return (
        <Nav.Item>
          <Nav.Link eventKey={i == 0 ? defaultEventKey : cat}>{cat}</Nav.Link>
        </Nav.Item>
      )
    })

    return items;
  }

  function hideCatalogs() {
    setDisplay(false);
  }

  function showCatalogs() {
    setDisplay(true);
  }

  function showContentsByRow(categories, defaultEventKey) {
    let contents = categories.map((cat, i) => {
      return (
        <Tab.Pane eventKey={i == 0 ? defaultEventKey : cat}>
          <Row className='pt-0'>
            {
              getAIsByCategory(cat).map((ai) => {
                log.trace("Category: " + cat + ", AI: " + ai.name);
                return (
                  <Col {...config}>
                    <Prompt definition={ai} setDisplay={() => PubSub.publish("HIDE_CATALOGS", null)} />
                  </Col>                  
                )
              })
            }
          </Row>
        </Tab.Pane>
      )
    })

    return contents;
  }

  function showContentsByGrid(categories, defaultEventKey) {
    let contents = categories.map((cat, i) => {
      return (
        <Tab.Pane eventKey={i == 0 ? defaultEventKey : cat}>
          <div className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2'>
            {
              getAIsByCategory(cat).map((ai) => {
                log.trace("Category: " + cat + ", AI: " + ai.name);
                return (
                  <>
                    {/*<div {...config}>*/}
                    <Prompt definition={ai} setDisplay={() => PubSub.publish("HIDE_CATALOGS", null)} />
                  </>                  
                )
              })
            }
          </div>
        </Tab.Pane>
      )
    })

    return contents;
  }

  function showContents(categories, defaultEventKey) {
    return showContentsByGrid(categories, defaultEventKey);
  }

  function updatePersonalCatalog(topic = null, message = null) {
    useCatalog(cookies, "personal", setPersonalCatalog);
  }

  function updateSharedCatalog(topic = null, message = null) {
    useCatalog(cookies, "public", setSharedCatalog);
  }
/*
  useEffect(() => {
    // Create a function main() ?
    setCategories(getCategories(directory));
    log.trace("categories: " + JSON.stringify(categories));

    if (categories && categories != []) {
      log.trace('useEffect: categories: ' + JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    // Create a function main() ?
    setCategories(getCategories(directory));
    log.trace("Categories: " + JSON.stringify(categories));

    
    //categories.forEach(
    //  (cat) => log.trace("Main.AIsByCategory: " + cat + " / " + JSON.stringify(getAIsByCategory(cat)))
    //);
  }, [directory])
*/    
  useEffect(() => {
    log.trace("personalCatalog: " + JSON.stringify(personalCatalog));
    log.trace("sharedCatalog: " + JSON.stringify(sharedCatalog));
    if ("shared" == type) {
      setDirectory([...sharedCatalog]);
    } else {
      setDirectory([...personalCatalog]);
    }

  }, [personalCatalog, sharedCatalog])

  useEffect(() => {
    log.trace("UseEffect[Catalog].");
    if ("shared" == type) {
      updateSharedCatalog();
    } else {
      updatePersonalCatalog();
    }
  }, [veeplet])

  useEffect(() => {
    log.info("GO_TO_SELECT_SCREEN");
    PubSub.subscribe("GO_TO_SELECT_SCREEN", showAllCards);
    PubSub.subscribe("PERSONAL_VEEPLET_CHANGED", updatePersonalCatalog);
    PubSub.subscribe("SHARED_VEEPLET_CHANGED", updateSharedCatalog);

    PubSub.subscribe("HIDE_CATALOGS", hideCatalogs);
    PubSub.subscribe("SHOW_CATALOGS", showCatalogs);

    //    PubSub.subscribe("SHOW_AI_DETAILS", showInfoModal);
  }, [])
  

  return (
    <>
      {
        display ? 
          <>
            <Card className='mt-2'>
              <Card.Header>{title}</Card.Header>
              <Card.Body>
                { directory ?
                  <Tab.Container defaultActiveKey={defaultEventKey}>
                      <Row>
                        <Col className="pt">
                          <Nav variant="underline">
                            {displayNav(getCategories(directory), defaultEventKey)}
                          </Nav>
                        </Col>
                      </Row>
                      <Row>
                        <Tab.Content>
                          {showContents(getCategories(directory), defaultEventKey)}
                        </Tab.Content>
                      </Row>
                  </Tab.Container>
                  :
                  <></>
                }
            </Card.Body>
            </Card>
          </>
        :
          <>
          </>
      }
    </>
  );
}
