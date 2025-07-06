import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';

import { Constants } from "src/constants/Constants";
import { UtilsGraphQL } from 'src/api/utils-graphql.js';
import { UtilsDataConverter } from 'src/components/lib/utils-data-converter.js'
import DataTableBase from 'src/components/common/DataTableBase.js';
import ContentPanel from 'src/components/content-panel/ContentPanel.js'

import MyContentDetails from './MyContentDetails.js';
import MyContentActions from './MyContentActions.js';

//import { z } from "zod"
import getColumns from "src/data-model/datatable/vcontents/columns"

function getData(props) {
  return props.data
  //return z.array(schema).parse(data)
}

export default function MyContent( {...props} ) {
  const log = Logger.of(MyContent.name);

  let dtViewType = props?.dtViewType;
  let view = props?.view;

  const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
  const [cookies] = useCookies(['JWT']);

  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);
  const [info, setInfo] = useState({});

  const handleClose = () => setInfo({ show: false });

  // The JWT contains the id of the current user and is used to restrict posts:
  // posts: (where: {author: 1})
  // The JWT can't be created by the user
  let payload = cookies.JWT.split('.')[1];
  log.trace('JWT payload: ', payload);
  
  let jwt = JSON.parse(atob(payload));
  let authorId = jwt.data.user.id;
  log.trace('id: ', authorId);

  function getData(topic = null, msg = null) {
    log.trace("getData: topic: ", topic, " msg: ", msg)

    if (graphqlURI && cookies) {
      UtilsGraphQL
        .list(graphqlURI, cookies, authorId, props)
        .then((data) => {
          log.trace("getData: data: ", data)

          let r = UtilsDataConverter.convertGqlVContentsToVO(data)
          log.trace("data: ", r);
          
          setData(r)
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
        type="vcontent"
        title={view}
        columns={getColumns}
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
    log.trace('Subscribing to CONTENT*');
    PubSub.subscribe("_CONTENT_GENERATION_FINISHED_", getData);
    PubSub.subscribe("CONTENT_ELEMENT_REMOVED", getData);
    PubSub.subscribe("CONTENT_ELEMENT_UPDATED", getData);

    PubSub.subscribe("REFRESH_CONTENT_Vcontent", getData);

    getData();
	}, [graphqlURI, cookies]);

  return (
      <ContentPanel side={datatable} info={info} content={details} />
);
}