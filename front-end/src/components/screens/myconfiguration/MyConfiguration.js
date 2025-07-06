import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';

import { Constants } from "src/constants/Constants";
import { UtilsGraphQLConfiguration } from 'src/api/utils-graphql-configuration.js'
import { Utils } from 'src/components/lib/utils'

import { Button } from "@/components/ui/button"
import DataTableBase from 'src/components/common/DataTableBase.js';
import ContentPanel from 'src/components/content-panel/ContentPanel.js'

import MyConfigurationDetails from './MyConfigurationDetails.js';
import MyConfigurationActions from './MyConfigurationActions.js';

//import { z } from "zod"
import getColumns from "src/data-model/datatable/configuration/columns"
import DynamicForm from '../forms/DynamicForm'

function getData(props) {
  return props.data
  //return z.array(schema).parse(data)
}

export default function MyConfiguration( {...props} ) {
  const log = Logger.of(MyConfiguration.name);


  let dtViewType = props?.dtViewType
  let view = props?.view
  let type = props?.type
  let cType = Utils.camelize(type) // camelizedType ;-)

  const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
  const [cookies] = useCookies(['JWT']);

  const [displayType, setDisplayType] = useState(props?.displayType || "side-main");
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);
  const [info, setInfo] = useState({});

  const handleClose = () => setInfo({ show: false });

  function getData(topic = null, msg = null) {
    log.trace("getData: topic: ", topic, " msg: ", msg)

    UtilsGraphQLConfiguration.listConfiguration(graphqlURI, cookies, type)
      .then((data) => {
        log.trace("listConfiguration: data: ", data)
        setData(data)
        //return JSON.parse(data)
      })
      .catch((e) => {
        log.trace(`listConfiguration: the following exception "${e}" has been raised while trying to get some data with the following parameters: authorId: ${authorId}, props: ${JSON.stringify(props)}`)
      });


    /*
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
        */
  }

  function datatable() {
    let operations = {
      "onShow": (row) => PubSub.publish("SHOW_" + cType, {...row}),
      "onEdit": (row) => PubSub.publish("SHOW_" + cType, {...row}),
      "onDuplicate": null,
      "onFavorite": null,
      "onDelete": (row) => UtilsGraphQLConfiguration.deleteConfiguration(graphqlURI, cookies, cType, row.objectId),
    }
    return (
      <DataTableBase
        dtViewType={dtViewType}
        type={type}
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
      <MyConfigurationDetails id={id}/>
    )
  }
  
  useEffect(() => {
    log.trace('Subscribing to CONTENT*');
    //PubSub.subscribe("_CONTENT_GENERATION_FINISHED_", getData);
    PubSub.subscribe("_CONTENT_GENERATION_FINISHED_" + cType, getData);
    PubSub.subscribe("CONTENT_ELEMENT_REMOVED_" + cType, getData);
    PubSub.subscribe("CONTENT_ELEMENT_UPDATED_" + cType, getData);

    PubSub.subscribe("REFRESH_CONTENT_" + cType, getData);
    PubSub.subscribe("CONFIGURATION_ELEMENT_REMOVED_" + cType, getData)

    getData();
	}, [graphqlURI, cookies]);

  let form = <DynamicForm type={type} />

  /**
   * 
   */
  return (
    <>
      <div className="flex flex-row gap-2">
        <Button onClick={() => setDisplayType("sheet")}>Sheet</Button>
        <Button onClick={() => setDisplayType("side-main")}>Side Main</Button>
        <Button onClick={() => setDisplayType("main")}>Main</Button>
      </div>
      <ContentPanel side={datatable} info={info} content={form} displayType={displayType} />
    </>
);
}