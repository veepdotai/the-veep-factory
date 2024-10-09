import { Logger } from 'react-logger-lib'
import { UtilsGraphQL } from './utils-graphql';

export const UtilsGraphQLMonitoring = {
	log: Logger.of("UtilsGraphQLMonitoring"),

	getUsageData: function(graphqlURI, cookies) {
		let log = UtilsGraphQLMonitoring.log
		let q = `
			mutation Monitoring {
				getUsageData(input: {}) {
					clientMutationId
					usage_data
				}
			}
		`;
	
		log.trace(`get_usage_data: query: ${q}`)
		return UtilsGraphQL
			.client(graphqlURI, cookies)
			.mutate({
				mutation: gql`${q}`
			}).then((result) => {
				log.trace(`getUsageData:`);
				let r = {
					"status": 200,
					"usage_data": result
				}
				PubSub.publish("USAGE_DATA_UPDATED", r);
				return r
			}).catch((e) => {
				log.trace(`getUsageData: error while fetching data. Exception: ${e}`);
				let r = { "status": 500, "error": e, "msg": `Exception while fetching user data: ${e}`}
				PubSub.publish("USAGE_DATA_UPDATED", r);
				return r
			})
	
	}

}