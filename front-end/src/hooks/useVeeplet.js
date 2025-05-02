import { useState, useEffect, useRef } from 'react';
import { Logger } from 'react-logger-lib';
import TOML from '@iarna/toml';

import axios from 'axios';

import {VeepletContext} from 'src/context/VeepletProvider';
import { Constants } from "src/constants/Constants";

import Veeplet from 'src/components/lib/class-veeplet';

const useVeeplet = (cookies, definition, setF) => {
    const log = Logger.of(useVeeplet.name);

  const promptPrefix = "ai-prompt-";
  //const {veeplet, setVeeplet} = useContext(VeepletContext);

  const conf = {
    service: Constants.WORDPRESS_REST_URL + "/?rest_route=/veepdotai_rest/v1/veeplets",
    'token': cookies.JWT
  }

  let veepletNS = getChainId(definition);

  function getChainId(definition) {
    let chainId = (("veeplet." 
                    + definition.organizationId
                    + "." + definition.category
                    + "." + definition.subCategory
                    + "." + definition.name
                  )).toLowerCase();

    log.trace("getChainId: " + chainId);
    return chainId.toLowerCase();
  }

  function getPrompt(res) {
    let optionName = Object.keys(res)[0] ;
    log.trace("option name: " + optionName);

    if (res[optionName]) {
        let result = res[optionName];
        result = (result + "").replace(/#EOL#/g, "\n");
        log.trace("res['" + optionName + "']: " + result);
        return result;
    }
  }
  
//  useEffect(() => {
      async function getPromptData(conf, optionName) {
        //const JWT = cookies.JWT;
        const config = {};
        const params = { params: { 'JWT': conf.token } };
        await axios.get(conf.service + "/" + optionName,
            params,
            config
        ).then(function (res) {
            let data = res.data;
            log.trace("Resultat GET: ", data);
    
            let promptString = getPrompt(data);
            log.trace("Prompt: " + promptString);

            let prompt = new Veeplet(TOML.parse(promptString));
            log.trace("Prompt JSON: ", prompt);

            const navbars = prompt.getSections();
            log.trace("navbars JSON: ", navbars);
            //alert("PromptData: " + JSON.stringify(data));
            setF(navbars);
    
            PubSub.publish("GET_PROMPT_OPTION_RESULT", data); 
        }).catch((err) => {
            log.error(err);
        });
      }
    getPromptData(conf, promptPrefix + veepletNS);
  //}, []);

}

export default useVeeplet;