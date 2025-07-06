import { Logger } from 'react-logger-lib'
import { gql } from '@apollo/client'
import PubSub from 'pubsub-js'

import { UtilsGraphQL } from './utils-graphql'
import { Utils, t } from 'src/components/lib/utils'

export const UtilsGraphQLObject = {
	log: (...args) => Logger.of("UtilsGraphQLObject").trace(args),

	/**
	 * When data is retrieved, its content is published on the provided topic
	 * so listening parts can be updated
	 */
	listOne: function(graphqlURI, cookies, name, topics, cardinality = "single") {
		let log = (...args) => UtilsGraphQLObject.log("listOne: ", args)
		let q = `
			mutation list {
				listData(input: { option: "${name}" ${"single" === cardinality ? "" : `, cardinality="${cardinality}"`} }) {
					result
				}
			}
		`;
	
		log("query: ", q)	
		if (! cookies) {
			log("not executed because no cookies: ", cookies)
			return null
		}
	
		return UtilsGraphQL
			.client(graphqlURI, cookies)
			.mutate({
				mutation: gql`${q}`
			}).then((result) => {
				log("listData: result: ", result)
				let data = result?.data?.listData?.result
				log("listData: result: ", data)
				let r = {
					"status": 200,
					"result": data
				}
				topics.map((topic) => PubSub.publish(topic, r))
				return r
			}).catch((e) => {
				log(`list: error while fetching option value for ${name}. Exception: ${e}`);
				let r = { "status": 500, "error": e, "msg": `Exception while creating ${name}: ${e}`}
				topics.map((topic) => PubSub.publish(topic, r))
				return r
			})

	},

	/**
	 * 
	 * @param {*} graphqlURI 
	 * @param {*} cookies 
	 * @param {*} name The option to set 
	 * @param {*} value Its value
	 * @param {*} oldName The name of the old option in case of a rename
	 * @returns 
	 */
	create: function({graphqlURI, cookies, name, value, topics, oldName = null, objectId = null}) {
		let log = UtilsGraphQLObject.log
		//saveData(input: { option: "${name}", value: "${value}" ${oldName ? `, "oldName": "${oldName}"`: "" }) {
		//log.trace(`create: before: query: ${q}`)
		
		function paramIfNotNull(paramName, paramValue) {
			return paramValue ? `, ${paramName}: "${paramValue}"` : ""
		}

		let q = `
			mutation create {
				saveData(input: { option: "${name}", value: "${value}" ${paramIfNotNull("objectId", objectId)} }) {
					result
				}
			}
		`;
	
		log(`create: after: query: ${q}`)

		return UtilsGraphQL
			.client(graphqlURI, cookies)
			.mutate({
				mutation: gql`${q}`
			}).then((result) => {
				log("create: ", result);
				PubSub.publish("TOAST", {
					"title": t("Status"),
					"description": <div className="mt-2 w-[500px] rounded-md">{t("DataSaved")}</div>
				})

				let data = result.data.saveData.result
				let r = {
					"status": 200,
					"result": data
				}
				log("create: publishing on topics", topics)
				topics?.map((topic) => {
					log("create: publishing topic:", topic, "with r:", r)
					PubSub.publish(topic, r)
				})
				return r
			}).catch((e) => {
				log("create: error while creating data. Exception:", e)
				let r = { "status": 500, "error": e, "msg": `Exception while creating ${name}: ${e}`}
				//topics.map((topic) => PubSub.publish(topic, r))
				return r
			})
	
	},

	/**
	 * 
	 * @param {*} graphqlURI 
	 * @param {*} cookies 
	 * @param {*} contentId 
	 * @param {*} title 
	 * @param {*} metadata 
	 * @param {*} topics may be one topic (string) or a topic (string) array 
	 * @returns 
	 */
	saveMetadata: function({graphqlURI, cookies, contentId, title = null, metadata = null, topics = null, name = null, value = null}) {
		let log = UtilsGraphQLObject.log

		let metadataString = metadata ? JSON.stringify(metadata) : null
		metadataString = Utils.denormalize(metadataString)

		let getClause = (name, value) => name && value ? `${name}: "${value}",` : ""
		let q = `
			mutation update {
				saveMetadata(input: {
					contentId: "${contentId}",
					${getClause("title", title)}
					${getClause("metadata", metadataString)}
					${getClause("name", name)}
					${getClause("value", value)}
				}) {
					result
				}
			}
		`;
	
		log.trace(`update: query: ${q}`)

		return UtilsGraphQL
			.client(graphqlURI, cookies)
			.mutate({
				mutation: gql`${q}`
			}).then((result) => {
				log.trace(`update: `, result);
				let data = result.data.saveMetadata.result
				let r = {
					"status": 200,
					"result": data,
					"original": metadata
				}
				if (Array.isArray(topics)) {
					topics.map((topic) => PubSub.publish(topic, r))	
				} else if (topics) {
					PubSub.publish(topics, r)
				}

				return r
			}).catch((e) => {
				log.trace(`create: error while updating data and metadata. Exception: ${e}`);
				let r = { "status": 500, "error": e, "msg": `Exception while updating title '${title}' and metadata '${metadata}' : ${e}`}
				//PubSub.publish(topic, r);
				return r
			})
	}
}