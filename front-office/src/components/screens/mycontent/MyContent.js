import { useState, useEffect } from 'react';
import { Logger } from 'react-logger-lib';
import { Container, Modal, Button, Row, Col } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import PubSub from 'pubsub-js';
import TOML from '@iarna/toml';
import { useMediaQuery } from 'usehooks-ts';
import toast from 'react-hot-toast';
import { t } from 'i18next';

import { Constants } from "src/constants/Constants";
import { UtilsGraphQL } from 'src/api/utils-graphql.js';

import DataTableBase from '../../common/DataTableBase.js';
import MyContentDetails from './MyContentDetails.js';
import MyContentActions from './MyContentActions.js';

import MyContentPanel from './MyContentPanel.js'

export default function MyContent( {...props} ) {
  const log = Logger.of(MyContent.name);

  return (
    <ReportData {...props} />
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

  const [data, setData] = useState([]);
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

  function getData(topic = null, msg = null) {
    log.trace(`getData: topic: ${JSON.stringify(topic)}, msg: ${JSON.stringify(msg)}`)

    UtilsGraphQL
      .list(graphqlURI, cookies, authorId, props)
      .then((data) => {
        log.trace(`getData: data: ${JSON.stringify(data)}`)
        let r = data.map((o) => {
          log.trace(`getData: data.map: o: ${JSON.stringify(o)}`)

          let ps = TOML.parse(o.veepdotaiPrompt?.replace(/#EOL#/g, "\n"));

          let r = {}
          /*
          {
            "id": o.postId || o.databaseId,
            "test": "jck",
            "date": o.date ? o.date.replace(/T/, " ").replace(/\.*$/, "") : "",
        //          "author": o.author.node.firstName,
            "title": o.title,
            "uri": o.uri,
            "type": ps?.metadata?.name + ' v' + ps?.metadata?.version
          }
            */

          //r = o
          r.id = o.postId || o.databaseId
          //r.date = o.date?.replace(/T/, " ").replace(/\.*$/, "") ?? ""
          r.date = o.date ? o.date.replace(/T/, " ").replace(/\.*$/, "") : ""
          r.givenName = o.author ? o.author?.node?.firstName + " " + o.author?.node?.lastName : ""
            //o.test = "bonjour"
          r.title = o.title
          r.uri = o.uri
          //r.status = o.categories.edges[0].node.name
          //r.status = o.categories?.edges[0].node.name
          r.type = ps?.metadata?.name + ' v' + ps?.metadata?.version

          return r

        })
        log.trace("data: " + JSON.stringify(r));
        setData(r)
      }).catch((e) => {
        log.trace(`getData: the following exception "${e}" has been raised while trying to get some data with the following parameters: authorId: ${authorId}, props: ${JSON.stringify(props)}`)
      })
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
        data={data}
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
    log.trace('Subscribing to ARTICLE_PUBLISHING_FINISHED');
    PubSub.subscribe("_CONTENT_GENERATION_FINISHED_", getData);
    PubSub.subscribe("CONTENT_ELEMENT_REMOVED", getData);
    PubSub.subscribe("CONTENT_ELEMENT_UPDATED", getData);

    PubSub.subscribe("CONTENTS_LIST_TO_REFRESH", getData);

    getData();
	}, []);

  return (
      <MyContentPanel side={datatable} info={info} content={details} />
);
}