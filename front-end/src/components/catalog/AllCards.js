import { useContext, useEffect, useState } from 'react';
import { Card, Col, Row, Nav} from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';
import { useCookies } from 'react-cookie';
import { t } from 'i18next';

import { Tabs, TabsList, TabsTrigger, TabsContent } from 'src/components/ui/shadcn/tabs'
import { ScrollArea, ScrollBar } from "src/components/ui/shadcn/scroll-area"

import useCatalog from  "src/hooks/useCatalog";

import { SharedCatalogContext } from 'src/context/catalog/SharedCatalogProvider';
import { PersonalCatalogContext } from 'src/context/catalog/PersonalCatalogProvider';
import { VeepletContext } from 'src/context/VeepletProvider';

import Prompt from './Prompt';
import { Constants } from "src/constants/Constants";
/**
 * 
 * @param {shared|personal} type shared is global for all users 
 * @param {Home instance} formScreen form shared instance
 * beetween the main create menu and the specific one to input data,
 * so only one creation screen may be available at a time
 * @param {String} cat category label to look for
 * @param {String} firstTab first tab id so select by default
 * @returns the available prompts for this type and the category if provided
 * or all the categories otherwise
 */
export default function AllCards( { type, id, title, formScreen = null, cat = null, firstTab = null }) {
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
  
  function getCategories(directory, category = null) {
    if (directory) {
      let categories = directory?.map((row) => {
        //log.trace(`AllCards: Domain/Category/SubCategory: ${JSON.stringify(row)}`)
        log.trace(`AllCards: Domain/Category/SubCategory: ${row.group}/${row.category}/${row.subCategory}`)
        let result = ""
        if (row.status === "active" && category) {
          result = row?.category === category ? category : ""
        } else {
          result = row?.category
        }
        return result 
      })
      return categories.filter(onlyUnique);
    } else {
      return [];
    }
  }

  function getFilteredCategories(directory, category = null) {
    if (directory) {
      let categories = directory?.map((row) => { return row.status === "active" && (category ? row?.category == category : row?.category)})
      return categories?.filter(onlyUnique);
    } else {
      return [];
    }
  }

  function getAIsByOneCategory(category) {
    return 
  }

  function getAIsByCategory(category) {
    return directory?.filter((row) => { return row.status === "active" && row.category === category});
  }

  function displayNav(categories, defaultEventKey) {
    let items = categories.map((cat, i) => {
      return (
          <TabsTrigger key={cat} value={i == 0 ? defaultEventKey : cat}>{cat}</TabsTrigger>
      )
    })

    return (
      <TabsList>
        {items}
      </TabsList>
    )
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
        <TabsContent key={cat} value={i == 0 ? defaultEventKey : cat}>
          <Row className='pt-0'>
            {
              getAIsByOneCategory(cat)
            }
          </Row>
        </TabsContent>
      )
    })

    return contents;
  }

  function showContentsByGrid(categories, defaultEventKey) {
    let contents = categories.map((cat, i) => {
      return (
        <TabsContent key={cat} value={i == 0 ? defaultEventKey : cat}>
          {/*<div className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2'>*/}
          <div className='flex w-max space-x-4 p-4'>
          {
              getAIsByCategory(cat).map((ai) => {
                log.trace("Category: " + cat + ", AI: " + ai.name);
                return (
                  <>
                    {/*<div {...config}>*/}
                    <Prompt key={cat + ai.name} definition={ai} setDisplay={() => PubSub.publish("HIDE_CATALOGS", null)} />
                  </>                  
                )
              })
            }
          </div>
        </TabsContent>
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
    log.trace("categories: ", categories);

    if (categories && categories != []) {
      log.trace('useEffect: categories: ', categories);
    }
  }, [categories]);

  useEffect(() => {
    // Create a function main() ?
    setCategories(getCategories(directory));
    log.trace("Categories: ", categories);

    
    //categories.forEach(
    //  (cat) => log.trace("Main.AIsByCategory: " + cat + " / ", getAIsByCategory(cat))
    //);
  }, [directory])
*/    
  useEffect(() => {
    log.trace("personalCatalog: ", personalCatalog);
    log.trace("sharedCatalog: ", sharedCatalog);
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
  

  //let categoriesByCat = 

  return (
    <>
      {
        display ? 
          <>
            <Card key={id} id={id} className='mt-2'>
              <Card.Header id={id + "-title"}>{title}</Card.Header>
              <Card.Body>
                { directory ?
                <>
                {/*
                    getAIsByOneCategory("Marketing")
                  
                */}
                  <Tabs defaultValue={defaultEventKey}>
                      <Row>
                        <Col className="pt">
                          <Nav variant="underline">
                            <ScrollArea className="w-full rounded-md border">
                              {displayNav(getCategories(directory, cat), defaultEventKey)}
                              <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                          </Nav>
                        </Col>
                      </Row>
                      <ScrollArea className="w-full rounded-md border">
                        <Row>
                          {showContents(getCategories(directory, cat), defaultEventKey)}
                        </Row>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                  </Tabs>
                  </>
                  :
                  <></>
                }
            </Card.Body>
            </Card>
          </>
        :
          <>
            { cat ?
                <div>A content is under construction</div>
              :
                <></>
            }
          </>
      }
    </>
  );
}
