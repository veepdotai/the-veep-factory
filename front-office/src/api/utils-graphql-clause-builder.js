import { Logger } from 'react-logger-lib'

// 'vcontent'|'post'
let CONTENT_TYPE = 'vcontent'

//let cb = UtilsGraphQLClauseBuilder;
export const UtilsGraphQLClauseBuilder = {
	log: Logger.of("UtilsGraphQL"),

	buildClauseQuery: function (authorId, _props, contentType = "vcontent") {
		//  let authorId = props.authorId;
		let view = _props?.view;
		let author = _props?.author;
		let search = _props?.search;
		let status = _props?.status;
		let date = _props?.date;
		UtilsGraphQL.log.trace(`buildClauseQuery: date: ${JSON.stringify(date)}`);
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
	
		let authorQuery = buildAuthorQuery(author);
		UtilsGraphQL.log.trace(`${view}: buildClauseQuery: authorQuery: ${authorQuery}`);    
	
		let statusQueryTpl = (status = null) => status ? `, status: ${status}` : "";
		let statusQuery = statusQueryTpl(status);
		UtilsGraphQL.log.trace(`${view}: buildClauseQuery: statusQuery: ${statusQuery}`);    
	
		let searchQueryTpl = (search = null) => search ? `, search: "${search}"` : "";
		let searchQuery = searchQueryTpl(search);
		UtilsGraphQL.log.trace(`${view}: buildClauseQuery: searchQuery: ${searchQuery}`);
		
		let dateQuery = buildDateQuery();

		let intervalQuery = buildIntervalQuery(date);
		UtilsGraphQL.log.trace(`${view}: buildClauseQuery: intervalQuery: ${intervalQuery}`);
	
		let categoryQuery = buildCategoryQuery(category);
		UtilsGraphQL.log.trace(`${view}: buildClauseQuery: categoryQuery: ${categoryQuery}`);
	
		let metaQuery = buildMetaQuery(meta);
		UtilsGraphQL.log.trace(`${view}: buildClauseQuery: metaQuery: ${metaQuery}`);
	
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
		
		UtilsGraphQL.log.trace(`buildClauseQuery: query: ${query}`);
	
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
			  }
			}
		  }
		`

		UtilsGraphQL.log.trace(`${view}: buildClauseQuery: graphqlQuery: q: ${q}`);

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
		  UtilsGraphQL.log.trace(`${view}: buildClauseQuery: dateQueryTpl: date: ${date}`);
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

	buildIntervalQueryTpl: function(date) {
		UtilsGraphQL.log.trace(`${view}: buildClauseQuery: intervalQuery: date: ${JSON.stringify(date)}`);
		if (date && (date.after || date.before)) {
		  return `dateQuery: {
			  ${date.after ? dateQueryTpl(date.after) : ""}
			  ${date.before ? dateQueryTpl(date.before, ", before") : ""} 
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
		UtilsGraphQL.log.trace(`${view}: buildClauseQuery: metaQuery: meta: ${JSON.stringify(meta)}`);
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