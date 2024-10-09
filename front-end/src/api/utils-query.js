import { Logger } from 'react-logger-lib';

export const UtilsQuery = {
	log: Logger.of("UtilsQuery"),

	clauseBuilder: function (authorId, _props) {
		//  let authorId = props.authorId;
		let view = _props?.view;
		let author = _props?.author;
		let search = _props?.search;
		let status = _props?.status;
		let date = _props?.date;
		UtilsQuery.log.trace(`queryClauseBuilder: date: ${JSON.stringify(date)}`);
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
		UtilsQuery.log.trace(`${view}: queryClauseBuilder: authorQuery: ${authorQuery}`);    
	
		let statusQueryTpl = (status = null) => status ? `, status: ${status}` : "";
		let statusQuery = statusQueryTpl(status);
		UtilsQuery.log.trace(`${view}: queryClauseBuilder: statusQuery: ${statusQuery}`);    
	
		let searchQueryTpl = (search = null) => search ? `, search: "${search}"` : "";
		let searchQuery = searchQueryTpl(search);
		UtilsQuery.log.trace(`${view}: queryClauseBuilder: searchQuery: ${searchQuery}`);
		
		let dateQueryTpl = (date = null, afterOrBefore = "after") => {
		  if (date) {
			UtilsQuery.log.trace(`${view}: queryClauseBuilder: dateQueryTpl: date: ${date}`);
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
		  UtilsQuery.log.trace(`${view}: queryClauseBuilder: intervalQuery: date: ${JSON.stringify(date)}`);
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
		UtilsQuery.log.trace(`${view}: queryClauseBuilder: intervalQuery: ${intervalQuery}`);
	
		let categoryQueryTpl = (category) => `
		  ${category?.id ?    ', categoryId: ' + category.id : ''}
		  ${category?.name ?  ', categoryName: "' + category.name + '"' : ''}
		  ${category?.in ?    ', categoryIn: "' + category.in + '"' : ''}
		  ${category?.notIn ? ', categoryNotIn: "' + category.notIn + '"' : ''}
		`;
		let categoryQuery = categoryQueryTpl(category);
		UtilsQuery.log.trace(`${view}: queryClauseBuilder: categoryQuery: ${categoryQuery}`);
	
		let metaQueryTpl = (meta) => {
		  UtilsQuery.log.trace(`${view}: queryClauseBuilder: metaQuery: meta: ${JSON.stringify(meta)}`);
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
		UtilsQuery.log.trace(`${view}: queryClauseBuilder: metaQuery: ${metaQuery}`);
	
		let query = `
		  ${authorQuery}
		  ${statusQuery}
		  ${searchQuery}
		  ${categoryQuery}
		  ${intervalQuery}
		  ${metaQuery}
		`;
		UtilsQuery.log.trace(`queryClauseBuilder: query: ${query}`);
	
		let q = `query posts {
			posts (first: 100, where: {${query}}) {
			  nodes {
				author {
				  node {
					firstName
					lastName
				  }
				}
				date
				postId
				content
				title
				uri
				veepdotaiPrompt
			  }
			}
		  }
		`
		UtilsQuery.log.trace(`${view}: queryClauseBuilder: graphqlQuery: q: ${q}`);
		return q;
	  }

}