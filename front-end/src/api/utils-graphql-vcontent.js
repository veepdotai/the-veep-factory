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
						title
						content(format: RAW)
						uri

						veepdotaiTranscription
						veepdotaiPrompt

						veepdotaiDomain
						veepdotaiSubDomain
						veepdotaiCategory
						veepdotaiSubCategory
						veepdotaiArtefactType
						veepdotaiMetadata

						tvfSubtitle
						tvfDomain
						tvfSubDomain
						tvfCategory
						tvfSubCategory
						tvfArtefactType
						tvfMetadata
						tvfStatus
						tvfPubDate
						tvfUp
						tvfDown
						tvfTemplate
						tvfGeneratedAttachment

						children {
							edges {
								node {
									id
									__typename
									... on Vcontent {
										databaseId
										title
										content(format: RAW)
										
										veepdotaiDetails

										veepdotaiDomain
										veepdotaiSubDomain
										veepdotaiCategory
										veepdotaiSubCategory
										veepdotaiArtefactType
										veepdotaiMetadata

										tvfSubtitle
										tvfDomain
										tvfSubDomain
										tvfCategory
										tvfSubCategory
										tvfArtefactType
										tvfMetadata
										tvfStatus
										tvfPubDate
										tvfUp
										tvfDown
										tvfTemplate
										tvfGeneratedAttachment
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