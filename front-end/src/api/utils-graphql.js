import { Logger } from 'react-logger-lib'
import { gql } from '@apollo/client'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { UtilsGraphQLPost } from './utils-graphql-post'
import { UtilsGraphQLVcontent } from './utils-graphql-vcontent'
import toast from 'react-hot-toast';
import { Constants } from '../constants/Constants'

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
					fetchPolicy: 'network-only',
				},
			},
		})
	},

	list: function(graphqlURI, cookies, authorId, props, topic = null, msg = null) {

		let q = UtilsGraphQL.buildClauseQuery(authorId, props);
	
		return UtilsGraphQL
			.client(graphqlURI, cookies)
			.query({
				query: gql`${q}`
			}).then((data) => {
				UtilsGraphQL.log.info('URI: ' + graphqlURI);
				UtilsGraphQL.log.trace(`list: data: ${JSON.stringify(data)}`)
		
				// code should auto adapt to contents
				let contents = data.data.posts ? data.data.posts : data.data.vcontents;
				let nodes = contents.nodes;
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

	
	buildClauseQuery: function (authorId, _props, contentType = "vcontent") {
		let log = UtilsGraphQL.log

		//let nbMax = Constants.NB_MAX;
		let nbMax = 100

		//  let authorId = props.authorId;
		let view = _props?.view;
		let author = _props?.author;
		let search = _props?.search;
		let status = _props?.status;
		let date = _props?.date;
		log.trace(`buildClauseQuery: date: ${JSON.stringify(date)}`);
		let category = _props?.category;
		let meta = _props?.meta;
	
		// authorId = 1;
		// authorIn = [1, 2]
		if (author && ! author.id) {
		  author.id = authorId;
		};
		
		if (! author) {
		  author = {id: authorId};
		}

		//author = {id: 67};

		let authorQueryTpl = (author = null) => {
		  if (author && author.id) {
			return `
				${author?.id ?    `, author: ${author.id}` : ""}
				${author?.name ?  `, authorName: ${author.name}` : ""}
				${author?.in ?    `, authorIn: ${author.in}` : ""}
				${author?.notIn ? `, authorNotIn: ${author.notIn}` : ""}
			`;
		  } else {
			return "";
		  }
		}
		let authorQuery = authorQueryTpl(author);
		log.trace(`${view}: buildClauseQuery: authorQuery: ${authorQuery}`);    
	
		let statusQueryTpl = (status = null) => status ? `, status: ${status}` : "";
		let statusQuery = statusQueryTpl(status);
		log.trace(`${view}: buildClauseQuery: statusQuery: ${statusQuery}`);    
	
		let searchQueryTpl = (search = null) => search ? `, search: "${search}"` : "";
		let searchQuery = searchQueryTpl(search);
		log.trace(`${view}: buildClauseQuery: searchQuery: ${searchQuery}`);
		
		let dateQueryTpl = (date = null, afterOrBefore = "after") => {
		  if (date) {
			log.trace(`${view}: buildClauseQuery: dateQueryTpl: date: ${date}`);
			try {
			  let _date = {
				year: date.replace(/^(\d{4}).*/,"$1"),
				month: date.replace(/^\d{4}-(\d{2}).*/,"$1").replace(/^0/,""),
				day: date.replace(/.*(\d{2})$/,"$1").replace(/^0/, ""),
			  };
			  return `,
				  ${afterOrBefore}: {
					${"day: " + _date.day}
					${", month: " + _date.month}
					${", year: " + _date.year}
				  }
			  `;
			} catch (e) {
			  return "";
			}
		  } else {
			return "";
		  }
		};
		let intervalQueryTpl = (date) => {
		  log.trace(`${view}: buildClauseQuery: intervalQuery: date: ${JSON.stringify(date)}`);
		  if (date && (date.after || date.before)) {
			return `dateQuery: {
				${date.after ? dateQueryTpl(date.after) : ""}
				${date.before ? dateQueryTpl(date.before, ", before") : ""} 
			}`
		  } else {
			return "";
		  }
		};
		let intervalQuery = intervalQueryTpl(date);
		log.trace(`${view}: buildClauseQuery: intervalQuery: ${intervalQuery}`);
	
		let categoryQueryTpl = (category) => `
		  ${category?.id ?    ', categoryId: ' + category.id : ''}
		  ${category?.name ?  ', categoryName: "' + category.name + '"' : ''}
		  ${category?.in ?    ', categoryIn: "' + category.in + '"' : ''}
		  ${category?.notIn ? ', categoryNotIn: "' + category.notIn + '"' : ''}
		`;
		let categoryQuery = categoryQueryTpl(category);
		log.trace(`${view}: buildClauseQuery: categoryQuery: ${categoryQuery}`);
	
		let metaQueryTpl = (meta) => {
		  log.trace(`${view}: buildClauseQuery: metaQuery: meta: ${JSON.stringify(meta)}`);
		  if (meta) {
			return `metaQuery: {
					  metaArray: {
						compare: ${meta.compare},
						key: "${meta.key}",
						value: "${meta.value}"
					  }
			}`
		  } else {
			return "";
		  }
		};
		let metaQuery = metaQueryTpl(meta);
		log.trace(`${view}: buildClauseQuery: metaQuery: ${metaQuery}`);
	
		let query = `
		  ${authorQuery}
		  ${statusQuery}
		  ${searchQuery}
		  ${categoryQuery}
		  ${intervalQuery}
		  ${metaQuery}
		`;

		if (contentType === 'vcontent') {
			query = query + ", parent: 0"
		}
		
		log.trace(`buildClauseQuery: query: ${query}`);
	
		let contentTypes = contentType + 's';
		let q = `query contents {
			${contentTypes} (first: ${nbMax}, where: {${query}}) {
			  nodes {
				author {
				  node {
					firstName
					lastName
				  }
				}
				categories {
					edges {
						node {
						name
						}
					}
				}
				__typename
				date
				databaseId
				content
				title
				uri
				veepdotaiPrompt
			  }
			}
		  }
		`

		log.trace(`${view}: buildClauseQuery: graphqlQuery: q: ${q}`);

		return q;
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