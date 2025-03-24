/**
 * This component displays detailed view of a provided element through its id.
 * 
 * The details view is a composed view of all the following:
 * - the read form
 * - the create/update form
 * - the share/print/mail form?
 * 
 */
import { useState, useEffect } from 'react';
import { Logger } from 'react-logger-lib';

import { useCookies } from 'react-cookie';

import { ScrollArea, ScrollBar } from "src/components/ui/shadcn/scroll-area"

import { UtilsGraphQL } from 'src/api/utils-graphql.js'
import { Constants } from "src/constants/Constants";

export default function MyContentDetails( { id }) {
  const log = Logger.of(MyContentDetails.name);
  log.trace(`MyContentDetails: id: ${id}`);

  const [cookies] = useCookies(['JWT']);

  const [contentId, setContentId] = useState();
  const [data, setData] = useState(null);

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

  function getFormView(data, contentId) {
    return (
      <>
        Form:
        <p>data: {data}</p>
        <p>contentId : {contentId}</p>
      </>
    )
  }

  function getMainContent() {

    return (
      <>
        <ScrollArea className="w-100 whitespace-nowrap h-full">
          <ScrollBar orientation="vertical" />
          {getFormView(data, contentId)}                          
        </ScrollArea>
      </>
    )
  }

  useEffect(() => {
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
    <>
      {
        data && contentId && (
          <>
              {getMainContent()}
          </>
        )
      }
    </>
  );
}
