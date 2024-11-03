import { Logger } from 'react-logger-lib'
import { gql } from '@apollo/client'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { UtilsGraphQL } from './utils-graphql'

import toast from 'react-hot-toast';

export const UtilsGraphQLObject = {
	log: Logger.of("UtilsGraphQLObject"),

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
				log.trace(`list: error while fetching data. Exception: ${e}`);
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
	
	}
}