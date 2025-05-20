import { Logger } from 'react-logger-lib'
import { gql } from '@apollo/client'

import { UtilsGraphQL } from './utils-graphql'

export const UtilsGraphQLPublish = {
	log: (...args) => Logger.of("UtilsGraphQLPublish").trace($args),

	publishOnLinkedIn: function({graphqlURI, cookies, content_id, lifecycleState = "DRAFT", topics = []}) {

		let q = `mutation MyMutation {
			publishOnLinkedIn(input: {contentId: "${content_id}", lifecycleState: "${lifecycleState}"}) {
				clientMutationId
				result
			}
		}`

		return UtilsGraphQL
			.client(graphqlURI, cookies)
			.mutate({
				mutation: gql`${q}`
			}).then((result) => {
				log.trace(`publishOnLinkedIn: `, result);
				let data = result.data.publishOnLinkedIn.result
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
				log.trace(`create: error while publishing on LinkedIn. Exception: ${e}`);
				let r = { "status": 500, "error": e, "msg": `Exception while publishing '${content_id}': ${e}`}
				//PubSub.publish(topic, r);
				return r
			})

	}

}