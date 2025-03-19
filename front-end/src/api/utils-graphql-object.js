import { Logger } from 'react-logger-lib'
import { gql } from '@apollo/client'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { UtilsGraphQL } from './utils-graphql'

import toast from 'react-hot-toast';

export const UtilsGraphQLObject = {
	log: Logger.of("UtilsGraphQLObject"),

	/**
	 * When data is retrieved, its content is published on the provided topic
	 * so listening parts can be updated
	 */
	listOne: function(graphqlURI, cookies, name, topic) {
		let log = UtilsGraphQLObject.log
		let q = `
			mutation list {
				listData(input: { option: "${name}" }) {
					result
				}
			}
		`;
	
		log.trace(`listOne: query: ${q}`)	
	
		return UtilsGraphQL
			.client(graphqlURI, cookies)
			.mutate({
				mutation: gql`${q}`
			}).then((result) => {
				log.trace(`listData: ` + JSON.stringify(result));
				let data = result.data.listData.result
				log.trace(`listData: ` + JSON.stringify(data));
				let r = {
					"status": 200,
					"result": data
				}
				PubSub.publish(topic, r);
				return r
			}).catch((e) => {
				log.trace(`list: error while fetching option value for ${name}. Exception: ${e}`);
				let r = { "status": 500, "error": e, "msg": `Exception while creating ${name}: ${e}`}
				PubSub.publish(topic, r);
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
	create: function(graphqlURI, cookies, name, value, topic, oldName = null) {
		let log = UtilsGraphQLObject.log
		//saveData(input: { option: "${name}", value: "${value}" ${oldName ? `, "oldName": "${oldName}"`: "" }) {
		//log.trace(`create: before: query: ${q}`)
		let q = `
			mutation create {
				saveData(input: { option: "${name}", value: "${value}" }) {
					result
				}
			}
		`;
	
		log.trace(`create: after: query: ${q}`)

		return UtilsGraphQL
			.client(graphqlURI, cookies)
			.mutate({
				mutation: gql`${q}`
			}).then((result) => {
				log.trace(`create: ` + JSON.stringify(result));
				let data = result.data.saveData.result
				let r = {
					"status": 200,
					"result": data
				}
				PubSub.publish(topic, r);
				return r
			}).catch((e) => {
				log.trace(`create: error while creating data. Exception: ${e}`);
				let r = { "status": 500, "error": e, "msg": `Exception while creating ${name}: ${e}`}
				PubSub.publish(topic, r);
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
	saveMetadata: function(graphqlURI, cookies, contentId, title, metadata, topics = null, name = null, value = null) {
		let log = UtilsGraphQLObject.log

		let metadataString = metadata ? JSON.stringify(metadata) : null
		metadataString = metadataString?.replace(/"/g, "_G_").replace(/\n/g, "_EOL_")

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
				log.trace(`update: ` + JSON.stringify(result));
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