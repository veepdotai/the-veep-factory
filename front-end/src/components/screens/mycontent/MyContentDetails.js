/**
 * This component displays details view of a provided element through its id.
 * 
 * The details view is a composed view of all the following:
 * - main part (merged one)
 * - pdf resulting of the previous part. According the chosen format and the corresponding css configuration, the result may strongly vary
 * - comparison view, useful for generation of the same type
 * - each generated part
 * - transcription
 * - veeplet (set of prompts)
 * 
 * According the content type (and the veep client version), the structure is different. The code reflects these versions and more and more will happen except if a migration is done at each time.
 *  
 */
import { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';

import { t } from 'i18next';

import TOML from '@iarna/toml';
import { useCookies } from 'react-cookie';
import { useMediaQuery } from 'usehooks-ts';
import useBreakpoint from  "src/hooks/useBreakpoint.js";

import { Tabs, TabsContent } from "src/components/ui/shadcn/tabs"

import MyContentDetailsUtils from './MyContentDetailsUtils';
import MyContentDetailsForDesktop from './MyContentDetailsForDesktop';
import MyContentDetailsForMobile from './MyContentDetailsForMobile';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup, } from "src/components/ui/shadcn/resizable"
import { ScrollArea, ScrollBar } from "src/components/ui/shadcn/scroll-area"

import { UtilsGraphQL } from 'src/api/utils-graphql.js'
import { Constants } from "src/constants/Constants";

export default function MyContentDetails( { id }) {
  const log = Logger.of(MyContentDetails.name);
  log.trace(`MyContentDetails: id: ${id}`);

  const [cookies] = useCookies(['JWT']);

  const size = useBreakpoint();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Stores all the information related to the veeplet processing
  const [mainNode, setMainNode] = useState();
  const [contentId, setContentId] = useState();
  const [data, setData] = useState(null);
  const [width, setWidth] = useState(4);
  const [prompt, setPrompt] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState("PDF");

  const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;

  function init(id) {
    log.trace(`init: id: ${id}`);
  
    UtilsGraphQL
      .listOne(graphqlURI, cookies, id)
      .then(
        (data) => {
          log.trace("init: data: " + JSON.stringify(data));
          setData(data);
      })
  }

  useEffect(() => {
    try{

      log.trace(`useEffect[data] for ${id}`);
      log.trace("...useEffect[data]: node __typename: " + JSON.stringify(data.__typename));
      let node = null;
      if (data?.__typename.toLowerCase() === 'post') {
        node = data
      } else if (data?.__typename.toLowerCase() === 'RootQueryToVcontentConnection'.toLowerCase()) {
        // __typename === 'vcontent' for example
        node = data.nodes[0]       
      }
      setMainNode(node)
      log.trace("...useEffect[data]: node: " + JSON.stringify(node));
      log.trace("...useEffect[data]: node databaseId: " + JSON.stringify(node?.databaseId));
      if (node.veepdotaiPrompt) {
        log.trace("useEffect[data]: prompt: " + node.veepdotaiPrompt);
        let promptObj = TOML.parse(node.veepdotaiPrompt.replace(/#EOL#/g, "\n"));
        log.trace("useEffect[data]: prompt.metadata.name: " + promptObj.metadata.name);
        log.trace("useEffect[data]: prompt.prompts.chain[0]: " + promptObj.prompts.chain[0]);
        log.trace("useEffect[data]: prompt.prompts.chain.length: " + promptObj.prompts.chain.length);
        setPrompt(promptObj);
      }
    } catch (e) {
      log.trace("Exception: e: " + JSON.stringify(e))
    }
  }, [data]);

  useEffect(() => {
    log.trace(`useEffect[contentId]: ${contentId}`)
    if (contentId) {
      init(contentId);
    }
    
  }, [contentId]);

  useEffect(() => {
    log.trace(`useEffect[]: ${id}`)
    setContentId(id)
  }, [id]);

  useEffect(() => {
    //PubSub.subscribe("");
  }, []);

  return (
    <Container className='mw-100 h-100 m-0 p-0'>
      {
        data && prompt && contentId && (
            <>
              { ! isDesktop ?
                <>
                  {MyContentDetailsForMobile.mobileMenu(prompt)}
                  <TabsContent id="details-content" className="h-100" value="content">
                    {MyContentDetailsForMobile.mobileContent()}
                  </TabsContent>
                </>
              :
                <>
                  <ResizablePanelGroup direction="horizontal" className="h-full">
                    <ResizablePanel className="h-full" style={{borderRight: "1px solid #eeefff"}} defaultSize={25}>
                      <Tabs className="justify-start h-full" id="mycontent-chat" defaultValue="conversation">
                        <ScrollArea className="w-100 whitespace-nowrap h-full">
                          <ScrollBar orientation="vertical" />

                          {MyContentDetailsForDesktop.desktopMenu(prompt, "side")}

                          <TabsContent id="details-chat-conversation" className="h-full" value="conversation">
                            {MyContentDetailsUtils.getAllStepsOneByOne(prompt, data, contentId)}
                          </TabsContent>
                          <TabsContent id="details-chat-prompt" className="h-full" value="metadata">
                            {MyContentDetailsUtils.getPromptContent(contentId, mainNode)}
                          </TabsContent>
                          <TabsContent id="details-chat-transcription" className="h-full" value="transcription">
                            {MyContentDetailsUtils.getTranscriptionContent(contentId, mainNode)}
                          </TabsContent>
                        </ScrollArea>
                      </Tabs>
                    </ResizablePanel>
                    <ResizableHandle withHandle withHandleStyle={{ marginLeft: "-1px"}} withHandleClassName="bg-light" />
                    <ResizablePanel defaultSize={74} className='h-full'>
                      <Tabs className="justify-start h-full" id="mycontent-main" defaultValue="content">

                        {MyContentDetailsForDesktop.desktopMenu(prompt, "main")}

                        <TabsContent id="details-content-main" className="h-full" value="content">
                          {MyContentDetailsForDesktop.desktopMarkdownContent(selectedFormat, prompt, data, contentId)}
                        </TabsContent>
                        <TabsContent id="details-content-pdf" className="h-full" value="pdf-merged-content">
                          {MyContentDetailsForDesktop.desktopPDFContent(selectedFormat, prompt, data, contentId)}
                        </TabsContent>
                        <TabsContent id="details-sideBySide-content" value="sideBySide-content">
                          {MyContentDetailsUtils.getColumnsSelectors([1, 2, 3, 4, 6], setWidth)}
                          <Row className="px-4">
                            {MyContentDetailsUtils.getSideBySideView(prompt, data, contentId, width)}                          
                          </Row>
                        </TabsContent>
                      </Tabs>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </>
              }

              {/*
              <TabsContent id="details-sideBySide-content" value="sideBySide-content">
                <Row>
                  { MyContentDetailsUtils.getColumnsSelectors([1, 2, 3, 4, 6], setWidth) }
                </Row>
              </TabsContent>
              */}

              {/*
              <Row>
                  {MyContentDetailsUtils.getAllStepsOneByOne(prompt, data, contentId)}
              </Row>
              */}
            {/*
            <Col className='' xs={12} lg={2} xl={2}>
              {getInput(t("SharedWithUsers"), 'users')}
              {getInput(t("SharedWithGroups"), 'groups')}
              <Button onClick={alert('NYI')}>{t("Save")}</Button>
            </Col>
            */}
          </>
        )
      }
    </Container>
  );
}
