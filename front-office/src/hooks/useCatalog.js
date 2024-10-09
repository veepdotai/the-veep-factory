import { Logger } from 'react-logger-lib';
import TOML from '@iarna/toml';

import axios from 'axios';

import { Constants } from "src/constants/Constants";

import Veeplet from 'src/components/lib/class-veeplet';

const useCatalog = (cookies, catalogType, setF) => {
  const log = Logger.of(useCatalog.name);

  const promptPrefix = "ai-prompt-";
  //const {veeplet, setVeeplet} = useContext(VeepletContext);

  const conf = {
    service: Constants.WORDPRESS_REST_URL + "/?rest_route=/veepdotai_rest/v1/catalog",
    'token': cookies.JWT
  }

  function getCatalog(veeplets) {

    let directory = veeplets.map((row) => {
      let veepletString = row.option_value;
      veepletString = (veepletString + "").replace(/#EOL#/g, "\n");

      let veeplet = new Veeplet(TOML.parse(veepletString));

      log.trace("getCatalog: veeplet: " + JSON.stringify(veeplet));

      return veeplet.getExtractForCatalog();
    })

    log.trace("getCatalog: directory before filter: " + JSON.stringify(directory));
    directory.map((row) => Object.keys(row) != "");
    log.trace("getCatalog: directory after filter: " + JSON.stringify(directory));

    return directory;
  }
  
//  useEffect(() => {
      async function getCatalogData(conf, catalogType, setF) {
        const config = {};
        const params = { params: { 'JWT': conf.token } };
        await axios.get(conf.service + "/" + catalogType,
            params,
            config
        ).then(function (res) {
            log.trace("getCatalogData: res: " + JSON.stringify(res));

            let catalog = res.data.catalog;
            log.trace("getCatalogData: data: " + JSON.stringify(catalog));

            let directory = getCatalog(catalog.veeplets);
            log.trace("getCatalogData: catalog: " + JSON.stringify(directory));
            
            setF(directory);
    
            //PubSub.publish("GET_PROMPT_OPTION_RESULT", data); 
        }).catch((err) => {
            log.error(err);
        });
      }
      
      getCatalogData(conf, catalogType, setF);
  //}, []);

}

export default useCatalog;