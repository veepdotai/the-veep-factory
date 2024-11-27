import { Logger } from 'react-logger-lib'
import { contentSchema } from './utils-graphql-schema'

export const UtilsGraphQLVcontent = {
	log: Logger.of("UtilsGraphQLVcontent"),

	listOneBis: function(id) {

		let q = `query content {
					vcontents(where: {authorIn: "68", parent: ${id}}) {
						nodes {
							__typename
							content(format: RAW)
							date
							databaseId
							title
							uri
							veepdotaiTranscription
							veepdotaiPrompt
						}
					}
				}`
		return q;
	},

	listOne: function(id) {
		// children (where: {orderby: {field: DATE, order: ASC}}) {
		let q = `
			query contents {
				vcontents(where: {authorIn: "68", id: ${id}}) {
					nodes {
						author {
							node {
								firstName
								lastName
							}
						}
						__typename
						date
						databaseId
						content(format: RAW)
						title
						veepdotaiTranscription
						uri
						veepdotaiPrompt
						veepdotaiDomain
						veepdotaiCategory
						veepdotaiArtefactType
						veepdotaiMetadata
						children {
							edges {
								node {
									id
									__typename
									... on Vcontent {
										title
										content(format: RAW)
										veepdotaiDetails
										databaseId
									}
								}
							}
						}
					}
				}
			}
		`

		return q;
	},

	/**
	 * 
	 * @param {*} nodes
	 * @returns nodes corresponding to schema
	 */
	convert: function(nodes) {
		//contentSchema.parse();
		return (nodes);
	}

}