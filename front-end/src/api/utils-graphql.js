import { Logger } from 'react-logger-lib'
import { gql } from '@apollo/client'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { UtilsGraphQLPost } from './utils-graphql-post'
import { UtilsGraphQLVcontent } from './utils-graphql-vcontent'
import { UtilsGraphQLClauseBuilder } from './utils-graphql-clause-builder'
import toast from 'react-hot-toast';
import { Constants } from '../constants/Constants'
import { UtilsDataConverter } from '../components/lib/utils-data-converter'

// 'vcontent'|'post'
let CONTENT_TYPE = 'vcontent'

export const UtilsGraphQL = {
	log: Logger.of("UtilsGraphQL"),

	client: function(graphqlURI, cookies = null) {
		return new ApolloClient({
			uri: graphqlURI,
			cache: new InMemoryCache(),
			//credentials: 'same-origin',
			credentials: 'include',
			mode: 'no-cors', // no-cors, *cors, same-origin
			//    withCredentials: false,
			headers: {
				'authorization': 'Bearer ' + (cookies?.JWT ? cookies.JWT : ''),  
				'client-name': 'Veep.AI fetcher',
				'client-version': '1.0.0',
			},
			fetchOptions: {
				mode: 'cors', // no-cors, *cors, same-origin
				credentials: 'include',
			},
			defaultOptions: {
				watchQuery: {
					fetchPolicy: 'cache_first', // network-only
				},
			},
		})
	},

	list: function(graphqlURI, cookies, authorId, props, topic = null, msg = null) {

		let q = UtilsGraphQLClauseBuilder.buildClauseQuery(authorId, props);

		UtilsGraphQL.log.info('URI (before client): ' + graphqlURI);
	
		return UtilsGraphQL
			.client(graphqlURI, cookies)
			.query({
				query: gql`${q}`
			}).then((data) => {
				UtilsGraphQL.log.info('URI (after client): ' + graphqlURI);
				UtilsGraphQL.log.trace(`list: data: ${JSON.stringify(data)}`)

				let nodes = UtilsDataConverter.convertGqlToGqlVContents(data)
				UtilsGraphQL.log.trace(`list: data: ${JSON.stringify(nodes)}`)
				return nodes
			}).catch((e) => {
				UtilsGraphQL.log.error('list: error: ' + e);
			})
	},

	remove: function(graphqlURI, cookies, row) {
		let q = `
		  mutation DELETE_POST {
			deleteVcontentParentAndDirectChildren(input: {
			  clientMutationId: "deleteVcontentParentAndDirectChildren",
			  forceDelete: false,
			  id:"${row.id}"
			}) {
			  ids
			}
		  }    
		`;
	/*
		let REMOVE_CONTENT = gql`${q}`;
		const [removeContent, { data, loading, error }] = useMutation(REMOVE_CONTENT);
	*/
	
		return UtilsGraphQL
			.client(graphqlURI, cookies)
			.mutate({
				mutation: gql`${q}`
			}).then((result) => {
				UtilsGraphQL.log.trace(`removeContent: row: ${row.id} deleted with its direct children too.`);
				PubSub.publish("CONTENT_ELEMENT_REMOVED", row);
				return {
					"status": 200,
					"row": row
				}
			}).catch((e) => {
				UtilsGraphQL.log.trace(`removeContent: row: ${row.id} has not been deleted. Exception: ${e}`);
				PubSub.publish("CONTENT_ELEMENT_REMOVED", { status: "error", data: row });
				return {
					"status": 500,
					"row": row,
					"msg": `Exception while removing content ${row.id}: ${e}`
				}
			})
	
	},

	rename: function(graphqlURI, cookies, row, title) {
		return UtilsGraphQL
				.update(graphqlURI, cookies, row, "title", `"${title}"`)
				.then((data) => toast.success(`${row.id} element has been renamed.`))
				.catch((e) => {
					UtilsGraphQL.log.trace(`renameContentTitle: the following exception "${e}" has been raised while trying to remove the content with the following parameter: id: ${row.id}`)
					toast.error(`${row.id} element has not been renamed with '${title}' because of the following exception: ${e}.`)
				});
	},

	moveToTrash: function(graphqlURI, cookies, row) {
		return UtilsGraphQL
					.update(graphqlURI, cookies, row, "status", "TRASH")
					.then((data) => toast.success(`${row.id} element has been moved to the trash.`))
					.catch((e) => {
						UtilsGraphQL.log.trace(`moveContentToTrash: the following exception "${e}" has been raised while trying to move the content to trash with the following parameter: id: ${id}`)
						toast.error(`${row.id} element has not been deleted because of the following problem: ${e}.`)
					});
  
	},

	update: function(graphqlURI, cookies, row, attrName, attrValue) {
		let log = UtilsGraphQL.log
		let attrWithValue = `${attrName}: ${attrValue}` 
		let q = `
		  mutation UPDATE_VCONTENT {
			updateVcontent(input: {
			  clientMutationId: "UpdateVcontent",
			  id:"${row.id}",
			  ${attrWithValue}
			}) {
			  vcontent {
				id
			  }
			}
		  }    
		`;
	
		log.trace(`update: id: ${row.id}, ${attrWithValue}, query: ${q}`)
		return UtilsGraphQL
			.client(graphqlURI, cookies)
			.mutate({
				mutation: gql`${q}`
			}).then((result) => {
				log.trace(`renameContent: row: ${row.id}`);
				PubSub.publish("CONTENT_ELEMENT_UPDATED", row);
				return {
					"status": 200,
					"row": row
				}
			}).catch((e) => {
				log.trace(`renameContent: row: ${row.id} has not been renamed to ${title}. Exception: ${e}`);
				PubSub.publish("CONTENT_ELEMENT_UPDATED", { status: "error", data: row });
				return {
					"status": 500,
					"row": row,
					"msg": `Exception while renaming content ${row.id}: ${e}`
				}
			})
	
	},

	listOne: function(graphqlURI, cookies, id, contentType = "vcontent") {
		let log = UtilsGraphQL.log
		let q = '';
		if (contentType === 'post') {
			q = UtilsGraphQLPost.listOne(id);
		} else {
			q = UtilsGraphQLVcontent.listOne(id);
		}

		log.trace(`listOne: q: ${q}`);

		return UtilsGraphQL
				.client(graphqlURI, cookies)
				.query({
					query: gql`${q}`
				}).then((data) => {
					log.info('URI: ' + graphqlURI);
					let content = data.data.post || data.data.vcontents;
					log.trace("UtilsGraphQL: listOne: data: before sorting: " + JSON.stringify(content));

					let res = JSON.parse(JSON.stringify(content));
					let edges = res.nodes[0].children.edges // edges is a reference
					log.trace("UtilsGraphQL: before sorting")
					edges.forEach((edge) => log.trace("UtilsGraphQL: edge.node.databaseId: " + edge.node.databaseId));
					edges.sort((a, b) => {
						
						return a.node.databaseId - b.node.databaseId;
					})

					log.trace("UtilsGraphQL: after sorting")
					edges.forEach((edge) => log.trace("UtilsGraphQL: edge.node.databaseId: " + edge.node.databaseId));
					log.trace("UtilsGraphQL: listOne: data: after sorting: " + JSON.stringify(res));

					return UtilsGraphQL.convert(res);
				}).catch((e) => {
					log.error('Error: ' + e);
				})

	},

	convert: function(content) {
		UtilsGraphQL.log.trace(`convert: content: ${JSON.stringify(content)}`);

	  	let result = null;
		if (content?.__typename.toLowerCase() === 'post') {
			return UtilsGraphQLPost.convert(content);
		} else {
			return UtilsGraphQLVcontent.convert(content);
		}
	},

	getUsageData: function(graphqlURI, cookies) {
		let log = UtilsGraphQL.log
		let q = `
			mutation Monitoring {
				getUsageData(input: {}) {
					clientMutationId
					usage_data
				}
			}
		`;
	
		log.trace(`getUsageData: query: ${q}`)
		return UtilsGraphQL
			.client(graphqlURI, cookies)
			.mutate({
				mutation: gql`${q}`
			}).then((result) => {
				log.trace(`getUsageData: ` + JSON.stringify(result));
				let data = result.data.getUsageData.usage_data
				let r = {
					"status": 200,
					"usage_data": data
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