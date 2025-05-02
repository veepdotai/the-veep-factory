import { Logger } from 'react-logger-lib'
import axios from 'axios'
import PubSub from 'pubsub-js'
import { Constants } from "src/constants/Constants";
import TOML from '@iarna/toml';
import md5 from 'js-md5';

import EKeyLib from './util-ekey';

/**
 * 
 */
export default class Veeplet {
    static log = Logger.of("Veeplet");
    static conf = {
        "service": Constants.WORDPRESS_REST_URL + "/?rest_route=/veepdotai_rest/v1/veeplets",
        "prefix": "ai-prompt-"
    }    

    constructor (def) {
        //Veeplet.log = Logger.of("Veeplet");
        /*
        Veeplet.log = {
            trace: function(msg) {
                //console.log(msg);
            },
            info: function(msg) {
                console.log(msg);
            },
        }
        */
        Veeplet.log.trace("Definition: Constructor.");
        Veeplet.log.trace("typeof definition: " + typeof def);
        if (typeof def === "string") {
            Veeplet.log.trace("Definition is a string. Parse it.");
            this.definition = JSON.parse(def);
        } else {
            Veeplet.log.trace("Definition isn't a string, maybe an object. Don't parse it.");
            this.definition = def;
        }
        this.prefix = "ai-section-edcal1-";
        Veeplet.log.trace("Definition: ", this.definition);
    }

    /**
     * Historically, veep uses 2 different ways to describe prompts chain:
     * - array: ["g0", "g1", "g2"]
     * - string "g0, g1, g2"
     * But, at the end, we need to provide an array so everything is compliant.
     * 
     * @param {*} prompt (a json prompt object - not a Veeplet instance)
     * @returns an array
     */
    static getChainAsArray(prompt) {
        Veeplet.log.trace("static getChain: prompt: ", prompt);
        if (Array.isArray(prompt)) {
            let pWithoutStop = prompt.filter((value) => /STOP/.test(value) ? false : true)
            Veeplet.log.trace("static getChain: prompt is an array");
            Veeplet.log.trace("static getChain: prompt is now an array without STOP: ", pWithoutStop);
            return pWithoutStop;
        } else if (typeof prompt == "string") {
            Veeplet.log.trace("static getChain: prompt is a string");
            let pWithoutStop = prompt.replaceAll(/,\s*STOP\s*/g, "")
            Veeplet.log.trace("static getChain: prompt is now an array without STOP: ", pWithoutStop);
            return pWithoutStop.split(/\s*,\s*/);
        }
    }

    /**
     * @deprecated
     */ 
    static getChainAsArrayBak(prompt) {
        Veeplet.log.trace("static getChain: prompt: ", prompt);
        if (Array.isArray(prompt)) {
            Veeplet.log.trace("static getChain: prompt is an array");
            return prompt;
        } else if (typeof prompt == "string") {
            Veeplet.log.trace("static getChain: prompt is a string");
            return prompt.split(/\s*,\s*/);
        }
    }

    getChainAsArray() {
        return Veeplet.getChainAsArray(this.definition.prompts.chain);
    }

    static async load(conf, optionName, updateData) {
        const config = {};
        const params = { params: { 'JWT': conf.token } };
        await axios.get(conf.service + "/" + optionName,
            params,
            config
        ).then(function (res) {
            let data = res.data;
            //Veeplet.log.trace("getPromptData GET: ", data);
            Veeplet.log.trace("getPromptData GET: ", data);
            updateData(data);
    
            PubSub.publish("GET_PROMPT_OPTION_RESULT", data); 
        }).catch((e) => {
            //Veeplet.log.trace(err);
            Veeplet.log.trace(e)
        });
    }

    //static async delete(formData, token, newName) {
    //    Veeplet.save(formData, {...Veeplet.conf, "token": token}, newName);
    //}

    static saveFromToml(token, tomlSource, email, previousName) {
        Veeplet.log.trace(`saveFromToml: token: ${token}`);
        Veeplet.log.trace(`saveFromToml: tomlSource: ${tomlSource}`);
        Veeplet.log.trace(`saveFromToml: email: ${email}`);
        Veeplet.log.trace(`saveFromToml: previousName: ${previousName}`);

        let veepletJson = TOML.parse(tomlSource);
    
        // default values
        Veeplet.log.trace("handleSave: veepletJson1: ", veepletJson);
        veepletJson.owner.orgId = md5(email);

        Veeplet.log.trace("handleSave: veepletJson2: ", veepletJson);
        
        let source = TOML.stringify(veepletJson).replace(/\n/g, "#EOL#");
        Veeplet.log.trace("handleSave: veepletJson(text): " + source);
    
        // Let's prepare and save
        let fd = new FormData();
        fd.append("value", source);
    
        let current = new Veeplet(veepletJson);
        let name = current.getChainId();
        Veeplet.log.trace("handleSave: name: " + name);
    
        if (previousName != current.getChainId()) {
          // it is a renaming: oldOption must be deleted
          Veeplet.log.trace(`handleSave: name has changed: oldName: ${previousName}`);
          fd.append("oldName", previousName);
        }
    
        Veeplet.save(fd, {token: token}, name);
    }

    static async duplicate(token, name) {
        const config = {headers: {'content-type': 'multipart/form-data',}}
        const params = {};
        
        let url = Veeplet.conf.service + "/" + name + "&JWT=" + token;
        Veeplet.log.trace("duplicate: url: " + url);
        let fd = new FormData();
        fd.append("action", "duplicate");
        await axios.post(url,
            fd,
            params,
            config
        ).then(function (res) {
            let data = res.data;
            Veeplet.log.trace("duplicate: data: ", data);
            PubSub.publish("POST_PROMPT_OPTION_RESULT", data);
            PubSub.publish("PERSONAL_VEEPLET_CHANGED", null);
            PubSub.publish("SHARED_VEEPLET_CHANGED", null);
            return data;
        }).catch((e) => {
            Veeplet.log.trace(e);
        });
    }

    static async delete(token, name) {
        const config = {headers: {'content-type': 'multipart/form-data',}}
        const params = {};
        
        let url = Veeplet.conf.service + "/" + name + "&JWT=" + token;
        Veeplet.log.trace("delete: url: " + url);
        await axios.delete(url,
            new FormData(),
            params,
            config
        ).then(function (res) {
            let data = res.data;
            Veeplet.log.trace("delete: data: ", data);
            PubSub.publish("DELETE_PROMPT_OPTION_RESULT", data);
            PubSub.publish("PERSONAL_VEEPLET_CHANGED", null);
            PubSub.publish("SHARED_VEEPLET_CHANGED", null);
            return data;
        }).catch((e) => {
            Veeplet.log.trace(e);
        });
    }

    static async save(formData, conf, newName) {
        const config = {
            headers: {'content-type': 'multipart/form-data'}
        }
        const params = { params: { 'JWT': conf.token } };
        
        let url = Veeplet.conf.service + "/" + Veeplet.conf.prefix + newName;
        Veeplet.log.trace("save: url: " + url);
        await axios.post(url,
            formData,
            params,
            config
        ).then(function (res) {
            let data = res.data;
            //Veeplet.log.trace("Resultat POST: ", data);
            Veeplet.log.trace("save: data: ", data);
            PubSub.publish("POST_PROMPT_OPTION_RESULT", data);
            PubSub.publish("PERSONAL_VEEPLET_CHANGED", null);
            PubSub.publish("SHARED_VEEPLET_CHANGED", null);
        }).catch((e) => {
            //Veeplet.log.trace(e);
            Veeplet.log.trace(e);
        });
    }

    getDefinition() {
        return this.definition;
    }

    setDefinition(definition) {
        if (typeof definition === "string") {
            this.definition = JSON.parse(definition);
        } else {
            this.definition = definition;
        }
    }

    getSections() {
        let prompts = this.getDefinition().prompts;
        //let chain = prompts.chain.split(/\s*,\s*/);
        let chain = this.getChainAsArray();
        Veeplet.log.trace("getSections: prompts: ", prompts);
        Veeplet.log.trace("getSections: chain/typeof: " + JSON.stringify(chain) + "/" + typeof chain);

        let defaultTranscriptionPhase = {
            name: "transcription",
            title: "Transcription",
            topic: "_TRANSCRIPTION_FINISHED_",
            option: "ai-section-edcal0-transcription",
            contentListeners: "_TRANSCRIPTION_"
        };

        let i = 0;
        let result = chain.map((_promptId) => {
            let promptId = EKeyLib.encode(_promptId);
            Veeplet.log.trace(`getSections: promptId: ${promptId}`);

            let prompt = prompts[promptId];
            Veeplet.log.trace(`getSections: prompt: ${prompt}`);
            //let _topic = (prompt.topic || "_" + prompt.name.toUpperCase());
            //let _topic = (prompt.topic || "_PHASE" + i + "_GENERATION_");
            let _topic = (prompt?.topic || `_PHASE${promptId}_GENERATION_`);
            Veeplet.log.trace(`getSections: _topic: ${_topic}`);
            //let key = "phase" + i;
            let key = `phase${promptId}`;
            i++;
            return {
                name: prompt.label,
                title: prompt.label == "STOP" ? "🛑" : prompt.label, // ⛔
                topic: _topic + "FINISHED_",
                option: this.prefix + key,
                contentListeners: _topic
            }
        });

        Veeplet.log.trace("result: ", result);

        return [
            defaultTranscriptionPhase,
            ...result
        ];
    }

    /**
     *     {
        "status": "active",
        "authorId": "jck",
        "organizationId": "kermaprojects",
        "category": "Marketing",
        "subCategory": "Social_Network",
        "name": "metadata",
        "heading": "Métadonnées",
        "reviews": "5",
        "title": "Titre, hashtags, keywords",
        "icon": "Heading",
        "image": "/assets/images/linkedin.jpg",
        "description": "Les titres, mots-clés, hastags permettent d'attirer le regard des visiteurs et d'améliorer le référencement de vos contenus.",
        "tips1": "Idéalement, c'est le même contexte que pour un post ou un article de blog",
        "tips2": ""
    },
    */
    getExtractForCatalog() {
        Veeplet.log.trace("ExtractForCatalog: ", this.getDefinition());
        let result = null;
        try {
            result = {
                status: this.getDefinition().metadata?.publication?.status ?? "inactive",
                scope: this.getDefinition().metadata?.publication?.scope,
                authorId: this.getDefinition()?.owner.authorId,
                organizationId: this.getDefinition()?.owner.orgId,
                creationDate: this.getDefinition()?.owner.creationDate,
                group: this.getDefinition().metadata.classification.group,
                category: this.getDefinition().metadata.classification.category,
                subCategory: this.getDefinition().metadata.classification.subCategory,
                name: this.getDefinition().metadata.name,
                heading: this.getDefinition().details.presentation.heading,
                reviews: this.getDefinition().metadata.reviews,
                version: this.getDefinition().metadata.version,
                title: this.getDefinition().details.presentation.heading,
                headerIconName: this.getDefinition().details?.ui?.headerIconName ?? "",
                headerColor: this.getDefinition().details?.ui?.headerColor ?? "white",
                headerBgColorFrom: this.getDefinition().details?.ui?.headerBgColorFrom ?? "black",
                headerBgColorTo: this.getDefinition().details?.ui?.headerBgColorTo ?? "",
                headerBgColorAngle: this.getDefinition().details?.ui?.headerBgColorAngle ?? "",
                bodyIconName: this.getDefinition().details?.ui?.bodyIconName ?? "FcEngineering",
                bodyColor: this.getDefinition().details?.ui?.bodyColor ?? "black",
                bodyBgColorFrom: this.getDefinition().details?.ui?.bodyBgColorFrom ?? "white",
                bodyBgColorTo: this.getDefinition().details?.ui?.bodyBgColorTo ?? "",
                bodyBgColorAngle: this.getDefinition().details?.ui?.bodyBgColorAngle ?? "",
                icon: this.getDefinition().details?.presentation?.icon,
                image: this.getDefinition().details?.presentation?.image,
                description: this.getDefinition().details.presentation.description
                ?? this.getDefinition().metadata.summary,
                tips1: this.getDefinition().details.presentation.tips1,
                tips2: this.getDefinition().details.presentation.tips2,
            }
            
        } catch (e) {
            Veeplet.log.trace(`getExtractForCatalog: The ${this.getDefinition().metadata.name} contains error: ${e}`)
            return {};
        }
            
        return result;
    }

    getChainId() {
        let chainId = "";
        if (this.getDefinition().owner) {
            Veeplet.log.trace("getChainId: It is a true Veeplet definition.");
            chainId = "veeplet" 
                            + "." + this.getDefinition().owner.orgId
                            + "." + this.getDefinition().metadata.classification.category
                            + "." + this.getDefinition().metadata.classification.subCategory
                            + "." + this.getDefinition().metadata.name;
        } else {
            Veeplet.log.trace("getChainId: It is a summary Veeplet definition.");
            chainId = "veeplet" 
                            + "." + this.getDefinition().organizationId
                            + "." + this.getDefinition().category
                            + "." + this.getDefinition().subCategory
                            + "." + this.getDefinition().name;
        }
    
        chainId = chainId.toLowerCase();
        Veeplet.log.trace("getChainId: " + chainId);
        return chainId;
    }

}