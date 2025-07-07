import { Logger } from 'react-logger-lib'
import PubSub from 'pubsub-js'
import { UtilsGraphQL } from 'src/api/utils-graphql.js'
import { gql } from '@apollo/client'
import { Utils } from '@/components/lib/utils'

export const UtilsGraphQLConfiguration = {
	log: (...args) => Logger.of("UtilsGraphQLConfiguration").trace(args),
	//log: (...args) => console.log("UtilsGraphQLConfiguration: ", args),

		/**
	 * 
	 * @param {*} mimeType APPLICATION_... | AUDIO_... | IMAGE_... | VIDEO_... 
	 * @returns 
	 */
	listConfiguration: function(graphqlURI, cookies, type, id = null) {
		const log = (...args) => UtilsGraphQLConfiguration.log("listConfiguration:", args)

		function getQuery(type, id) {
			let typeClause = type && `type: "${type}"`
			let idClause = id && id !== "" ? `, id: "${id}"` : ""
			log("typeClause:", typeClause, "idClause:", idClause)

			let q = `
				mutation listConfiguration {
					listConfiguration(input: {${typeClause} ${idClause}}) {
						clientMutationId
						result
					}
				}
			`
			alert('query: ' + q)
			log("query:", q)
			return q
		}

		let _type = Utils.camelize(type)
		log("type:", type, "Type (camelized):", _type)

		let query = getQuery(_type, id)
		log("query:", query)

		/*
		if (id) {
			_type = _type + "-" + id
			log("type + id:", _type)
		}
		*/
		
		return UtilsGraphQL
			.client(graphqlURI, cookies)
			.mutate({
				mutation: gql`${query}`
			}).then((raw) => {
				log("type:", _type, "id", id)
				log("raw:", raw)
				//PubSub.publish("CONFIGURATION_ELEMENT_RETRIEVED", type, id, result);
				return JSON.parse(raw.data.listConfiguration.result)
			}).then((result) => {
				log("result:", result)
				return result?.items.map((row) => {
					let obj = JSON.parse(Utils.normalize(row?.value))
					log("row:", row, "obj:", obj)
					return obj
					return {
						"group": obj?.group,
						"name": obj?.name,
						"description": obj?.description,
						"status": obj?.status,
						"id": obj?.objectId,
						"value": row.value,
					}
				})
			}).catch((e) => {
				log(`type: ${_type} has not been retrieved. Exception: ${e}`);
				return {
					"status": 500,
					"type": type,
					"msg": `Exception while selecting content ${type}: ${e}`
				}
			})
	},

	/**
	 * 
	 * @param {*} mimeType APPLICATION_... | AUDIO_... | IMAGE_... | VIDEO_... 
	 * @returns 
	 */
	getConfiguration: function(graphqlURI, cookies, type, id) {
		const log = (...args) => UtilsGraphQLConfiguration.log("getConfiguration:", args)

		function getQuery(type, id) {
			let q = `
				mutation getConfiguration {
					getConfiguration(input: {id: "${id}", type: "${type}"}) {
						clientMutationId
						result
					}
				}
			`
			log("getQuery:", q)
			return q
		}

		log("type:", type, "id:", id)
		
		return UtilsGraphQL
			.client(graphqlURI, cookies)
			.mutate({
				mutation: gql`${getQuery(type, id)}`
			}).then((result) => {
				log("type:", type, "id:", id, "result:", result)
				//PubSub.publish("CONFIGURATION_ELEMENT_RETRIEVED", type, id, result);
				return {
					"status": 200,
					"result": result
				}
			}).catch((e) => {
				log(`row: ${row.id} has not been retrieved. Exception: ${e}`);
				PubSub.publish("ERROR", { status: "error", data: row });
				return {
					"status": 500,
					"row": row,
					"msg": `Exception while removing content ${row.id}: ${e}`
				}
			})
	},

	deleteConfiguration: function(graphqlURI, cookies, type, id) {
		const log = (...args) => UtilsGraphQLConfiguration.log("deleteConfiguration:", args)

		function getQuery(type, id) {
			let q = `
				mutation deleteConfiguration {
					deleteConfiguration(input: {id: "${id}", type: "${type}"}) {
						clientMutationId
						result
					}
				}
			`
			log("getQuery:", q)
			return q
		}

		log("type:", type, "id:", id)
		
		return UtilsGraphQL
			.client(graphqlURI, cookies)
			.mutate({
				mutation: gql`${getQuery(type, id)}`
			}).then((result) => {
				log("type:", type, "id:", id, "result:", result)
				PubSub.publish(`CONFIGURATION_ELEMENT_REMOVED_${type}`, {objectId: id});
				return {
					"status": 200,
					"result": result
				}
			}).catch((e) => {
				log(`row: ${row.id} has not been retrieved. Exception: ${e}`);
				PubSub.publish("CONFIGURATION_ELEMENT_REMOVED", { status: "error", data: row });
				return {
					"status": 500,
					"row": row,
					"msg": `Exception while removing content ${row.id}: ${e}`
				}
			})
	}


}
