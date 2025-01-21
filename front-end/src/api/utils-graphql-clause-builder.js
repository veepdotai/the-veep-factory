import { Logger } from 'react-logger-lib'
import { UtilsGraphQL } from './utils-graphql'

// 'vcontent'|'post'
let CONTENT_TYPE = 'vcontent'

//let cb = UtilsGraphQLClauseBuilder;
export const UtilsGraphQLClauseBuilder = {
	log: Logger.of("UtilsGraphQLClauseBuilder"),

	buildClauseQuery: function (authorId, _props, contentType = "vcontent") {
		let log = (msg) => UtilsGraphQLClauseBuilder.log.trace("UtilsGraphQLClauseBuilder: " + msg)
		//  let authorId = props.authorId;
		let view = _props?.view
		let author = _props?.author
		let search = _props?.search
		let status = _props?.status
		let date = _props?.date
		let afterOrBefore = _props?.afterOrBefore
		let interval = {after: _props?.interval}
		log(`date: ${JSON.stringify(date)}`)

		let category = _props?.category;
		let meta = _props?.meta;
	
		// authorId = 1;
		// authorIn = [1, 2]
		if (! author) author = {}
		if (authorId) {
			author.id = authorId
			author.in = `"${authorId}"`
		}

		let authorQuery = UtilsGraphQLClauseBuilder.buildAuthorQuery(author);
		log(`${view}: authorQuery: ${authorQuery}`);    
	
		let statusQueryTpl = (status = null) => status ? `, status: ${status}` : "";
		let statusQuery = statusQueryTpl(status);
		log(`${view}: statusQuery: ${statusQuery}`);    
	
		let searchQueryTpl = (search = null) => search ? `, search: "${search}"` : "";
		let searchQuery = searchQueryTpl(search);
		log(`${view}: searchQuery: ${searchQuery}`);
		
		let dateQuery = UtilsGraphQLClauseBuilder.buildDateQuery(date, afterOrBefore);

		let intervalQuery = UtilsGraphQLClauseBuilder.buildIntervalQueryTpl(interval);
		log(`${view}: intervalQuery: ${intervalQuery}`);
	
		let categoryQuery = UtilsGraphQLClauseBuilder.buildCategoryQuery(category);
		log(`${view}: categoryQuery: ${categoryQuery}`);
	
		let metaQuery = UtilsGraphQLClauseBuilder.buildMetaQuery(meta);
		log(`${view}: metaQuery: ${metaQuery}`);
	
		let query = `
			${authorQuery}
			${statusQuery}
			${searchQuery}
			${dateQuery}
			${intervalQuery}
			${categoryQuery}
			${metaQuery}
		`;


		if (contentType === 'vcontent') {
			query = query + ", parent: 0"
		}
		
		log(`query: ${query}`);
	
		let contentTypes = contentType + 's';
		let q = `query contents {
			${contentTypes} (first: 100, where: {${query}}) {
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
				content
				title
				uri
				veepdotaiPrompt

				veepdotaiDomain
				veepdotaiSubDomain
				veepdotaiCategory
				veepdotaiSubCategory
				veepdotaiArtefactType

				tvfDomain
				tvfSubDomain
				tvfCategory
				tvfSubCategory
				tvfArtefactType
				tvfMetadata
			  }
			}
		  }
		`

		log(`${view}: graphqlQuery: q: ${q}`);

		return q;
	},

	buildAuthorQuery: function (author = null) {
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
	},

	buildDateQuery: function(date = null, afterOrBefore = "after") {
		if (date) {
		  UtilsGraphQLClauseBuilder.log.trace(`buildClauseQuery: date: ${date}`);
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
	},

	buildIntervalQueryTpl: function(interval) {
		let dateQueryTpl = UtilsGraphQLClauseBuilder.buildDateQuery
		UtilsGraphQLClauseBuilder.log.trace(`buildClauseQuery: intervalQuery: date: ${JSON.stringify(interval)}`);
		let after = interval?.after
		let before = interval?.before
		if (interval && (after || before)) {
		  return `dateQuery: {
			  ${after ? dateQueryTpl(after) : ""}
			  ${before ? dateQueryTpl(before, ", before") : ""} 
		  }`
		} else {
		  return "";
		}
	},

	buildCategoryQuery: function(category) {
		return`
			${category?.id ?    ', categoryId: ' + category.id : ''}
			${category?.name ?  ', categoryName: "' + category.name + '"' : ''}
			${category?.in ?    ', categoryIn: "' + category.in + '"' : ''}
			${category?.notIn ? ', categoryNotIn: "' + category.notIn + '"' : ''}
		`;
	},

	buildMetaQuery: function(meta) {
		UtilsGraphQLClauseBuilder.log.trace(`buildClauseQuery: metaQuery: meta: ${JSON.stringify(meta)}`);
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
	},

}