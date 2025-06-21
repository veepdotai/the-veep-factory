import { Logger } from 'react-logger-lib'
import { contentSchema } from './utils-graphql-schema'

export const UtilsGraphQLMediaItems = {
	log: Logger.of("UtilsGraphQLMediaItems"),

	/**
	 * 
	 * @param {*} mimeType APPLICATION_... | AUDIO_... | IMAGE_... | VIDEO_... 
	 * @returns 
	 */
	listWordpress: function(orderby = true, mimeType = false) {
		// children (where: {orderby: {field: DATE, order: ASC}}) {
		let orderbyClause = orderby ? "orderby: {field: DATE, order: DESC}" : ""
		let mimeTypeClause =  mimeType ? `, mimeType: ${mimeType}` : ""

		let whereClause = `
			where: {
				${orderbyClause}
				${mimeTypeClause}
			}
		`

		let q = `
			query GetImages {
				mediaItems (first: 100, ${whereClause}) {
					edges {
						node {
							id
							databaseId
							sourceUrl
							mediaItemUrl
							mediaType
							mimeType
							fileSize
							date
							dateGmt
							mediaDetails {
								file
								height
								width
							}
						}
					}
				}
			}
		`
		UtilsGraphQLMediaItems.log.trace("listWordpress", q);
		return q;
	},

}