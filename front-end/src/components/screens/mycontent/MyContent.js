import { useState, useEffect } from 'react';
import { Logger } from 'react-logger-lib';
import { Container, Modal, Button, Row, Col } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import PubSub from 'pubsub-js';
import { useMediaQuery } from 'usehooks-ts';
import toast from 'react-hot-toast';
import { t } from 'i18next';

import { setContext } from '@apollo/client/link/context';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, } from '@apollo/client';
import { gql, useQuery } from '@apollo/client'

import { Constants } from "src/constants/Constants";
import { UtilsGraphQL } from 'src/api/utils-graphql.js';
import { UtilsDataConverter } from 'src/components/lib/utils-data-converter.js'

import DataTableBase from '../../common/DataTableBase.js';
import MyContentDetails from './MyContentDetails.js';
import MyContentActions from './MyContentActions.js';

import MyContentPanel from './MyContentPanel.js'

export default function MyContent( {...props} ) {
  const log = Logger.of(MyContent.name);

  const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
  const [cookies] = useCookies(['JWT']);

  function initGraphQLClient() {

    const httpLink = createHttpLink({
      uri: graphqlURI,
      fetchOptions: {
        mode: 'cors', // no-cors|*cors|same-origin
        credentials: 'include', // 'omit|*same-origin|include'
      },
    });
  
    const authLink = setContext((_, { headers }) => {
      // get the authentication token from local storage if it exists
      //const token = localStorage.getItem('token');
      const token = cookies?.JWT ? cookies.JWT : ''
      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          'Authorization': token ? `Bearer ${token}` : "",
          'client-name': 'Veep.AI fetcher',
          'client-version': '1.0.0',
          }
      }
    });
  
    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      connectToDevTools: true,
      credentials: 'same-site', //'include',
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
        },
      },
    });

    return client
  
  }

  const client = initGraphQLClient()

  return (
    <ApolloProvider client={client}>
      <ReportData {...props} />
    </ApolloProvider>
  );
}

function ReportData( {...props} ) {
  const log = Logger.of(ReportData.name);

  let dtViewType = props?.dtViewType;
  let view = props?.view;

  log.trace("Constants: " + JSON.stringify(Constants));

  //const uri = Constants.WORDPRESS_GRAPHQL_ENDPOINT + '?JWT=' + cookies.JWT;
  //const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT// + "&JWT=" + cookies.JWT;
  const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
  const [cookies] = useCookies(['JWT']);

  const [datas, setDatas] = useState([]);
  const [pending, setPending] = useState(true);
  const [info, setInfo] = useState({});

  const handleClose = () => setInfo({ show: false });

  // The JWT contains the id of the current user and can be used to restrict posts:
  // posts: (where: {author: 1}) {
  // From a security point of view, the usage of a rest service which computes itself the 
  // author id, without relying on the client, would be a better a idea
  let payload = cookies.JWT.split('.')[1];
  log.trace('JWT payload: ' + payload);
  
  let jwt = JSON.parse(atob(payload));
  let authorId = jwt.data.user.id;
  log.trace('id: ' + authorId);

  //const isDesktop = useMediaQuery("(min-width: 768px)")

  UtilsGraphQL.log.info('URI (before client): ' + graphqlURI);
  const q = UtilsGraphQL.list(null, null, authorId, props)
  const { loading, error, data } = useQuery(gql`${q}`, { errorPolicy: "all" });

  function getData(topic = null, msg = null) {
    log.trace(`getData: topic: ${JSON.stringify(topic)}, msg: ${JSON.stringify(msg)}`)

    //let r = UtilsDataConverter.convertGqlVContentsToVO(msg)
    let r = UtilsDataConverter.convertGqlToVVO(data)
  
    setDatas(r)  
  }

  function getData2(topic = null, msg = null) {
    log.trace(`getData: topic: ${JSON.stringify(topic)}, msg: ${JSON.stringify(msg)}`)
  
    if (graphqlURI && cookies) {
      UtilsGraphQL
        .list(graphqlURI, cookies, authorId, props)
        .then((data) => {
          log.trace(`getData: data: ${JSON.stringify(data)}`)

          let r = UtilsDataConverter.convertGqlVContentsToVO(data)
          log.trace("data: " + JSON.stringify(r));
          
          setDatas(r)
        }).catch((e) => {
          log.trace(`getData: the following exception "${e}" has been raised while trying to get some data with the following parameters: authorId: ${authorId}, props: ${JSON.stringify(props)}`)
        })
    }
  }

  function datatable() {
    let operations = {
      "onShow": (row) => setInfo(MyContentActions.showDetails(row)),
      "onEdit": (row) => MyContentActions.renameContentTitleDialog(graphqlURI, cookies, row),
      "onDuplicate": null,
      "onFavorite": null,
      "onDelete": (row) => MyContentActions.moveToTrashConfirmationDialog(graphqlURI, cookies, row),
    }
    return (
      <DataTableBase
        dtViewType={dtViewType}
        title={view}
        //columns={columns}
        data={datas}
        progressPending={pending}
        operations={operations}
      />
    )
  }

  function details(id) {
    log.trace(`details: id: ${id}`)
    return (
      <MyContentDetails id={id}/>
    )
  }
  
  useEffect(() => {
//    const { loading, error, data } = useQuery(gql`${q}`, { errorPolicy: "all" });

    log.trace('data (before): ');
    log.trace('data: ' + JSON.stringify(data));
    log.trace('data (after): ');
    if (datas) {
      log.trace('Subscribing to ARTICLE_PUBLISHING_FINISHED');
      PubSub.subscribe("_CONTENT_GENERATION_FINISHED_", getData);
      PubSub.subscribe("CONTENT_ELEMENT_REMOVED", getData);
      PubSub.subscribe("CONTENT_ELEMENT_UPDATED", getData);

      PubSub.subscribe("CONTENTS_LIST_TO_REFRESH", getData);
    }

    if (data) {
      log.trace('data avantjck')
      //let r = UtilsDataConverter.convertGqlVContentsToVO(data)
      let r = UtilsDataConverter.convertGqlToVVO(data)
      log.trace('data aprèsjck')
    
      setDatas(r)  
    }
    //getData();
	}, [data]);

  /*
  useEffect(() => {
    log.trace('Subscribing to ARTICLE_PUBLISHING_FINISHED');
    PubSub.subscribe("_CONTENT_GENERATION_FINISHED_", getData);
    PubSub.subscribe("CONTENT_ELEMENT_REMOVED", getData);
    PubSub.subscribe("CONTENT_ELEMENT_UPDATED", getData);

    PubSub.subscribe("CONTENTS_LIST_TO_REFRESH", getData);
    getData();
	}, [graphqlURI, cookies]);
*/

  log.trace('data: ' + JSON.stringify(data))
/*
  if (data && datas.length == 0) {
    log.trace('datas before ok')
      //let r = UtilsDataConverter.convertGqlVContentsToVO(data)
      let r = UtilsDataConverter.convertGqlToVVO(data)
    log.trace('datas okk')
  
    setDatas(r)  
  }
*/
  return (
    <>
      { loading && <>Loading</> }
      { error && <>Error while fetching data.</> }
      { datas ?
        <MyContentPanel side={datatable} info={info} content={details} />
        :
        <>Building data</>
      }
    </>
);
}