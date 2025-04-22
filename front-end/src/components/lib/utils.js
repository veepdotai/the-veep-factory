import { Constants } from 'src/constants/Constants';
import { Logger } from 'react-logger-lib';
//import { createPlateEditor } from '@udecode/plate/react';
import { createPlateEditor } from '@udecode/plate/react';
import { MarkdownPlugin } from '@udecode/plate-markdown';
import { t as _t } from 'i18next'

export const Utils = {
	log: Logger.of("Utils"),

	isObject: (item) => {
		return (item && typeof item === 'object' && !Array.isArray(item));
	},
	
	mergeDeep: (target, ...sources) => {
		if (!sources.length) return target;
		const source = sources.shift();if (Utils.isObject(target) && Utils.isObject(source)) {
		  for (const key in source) {
			if (Utils.isObject(source[key])) {
			  if (!target[key]) Object.assign(target, {
				[key]: {}
			  });
			  mergeDeep(target[key], source[key]);
			} else {
			  Object.assign(target, {
				[key]: source[key]
			  });
			}
		  }
		}  return mergeDeep(target, ...sources);
	},
	
	camelize: function(str) {
		if (! str) {
			return ""
		}
		
		if (str?.match(/-/)) {
			return str.match(/([^-]+)/g).map((part) => Utils.capitalize(part)).join("")
		} else {
			return Utils.capitalize(str)
		}
	},

	capitalize: function(str) {
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	},

	isManager: function(profile) {
		try {
			return JSON.stringify(profile.roles)?.indexOf('veepdotai_role_admin') != -1;
		} catch (e) {
			return false;
		}
	},
	
	getRoles: function(JWT) {
		let payload64 = JWT.replace(/.*\.(.*)\..*/, "$1");
		log.trace('payload64: ' + payload64);
		if (payload64) {
		  let payload = JSON.parse(atob(payload64));
		  log.trace("data: " + JSON.stringify(payload));
		  if (payload.data.user.email === Constants.ADMIN_EMAIL) {
			log.trace('data.data.user.email: ' + payload.data.user.email + ' is manager');
			//setRoles(["Manager"]);
			return true;
		  }
		} else {
		  //setRoles([]);
		  return false;
		}
	},
	
	getPayload: function(JWT) {
		let payload64 = null;
		let payload = null;
		this.log.trace('JWT: ' + JWT);
		if (JWT && JWT != "undefined") {
			payload64 = JWT.replace(/.*\.(.*)\..*/, "$1");
			payload = JSON.parse(atob(payload64));
			return payload;
		} else {
			return null;
		}
	},

	isCookieValid: function(JWT) {
		let payload = this.getPayload(JWT);
		// Date.now() is in milliseconds while exp is in sec.
		if (Math.round(Date.now() / 1000) < payload?.exp) {
			this.log.trace('JWT Payload (true): ' + payload.exp);
			return true;
		} else {
			this.log.trace('JWT Payload (false): ' + payload?.exp);
			return false;
		}
	},

	/**
	 * jsonString may be malformed.
	 */
	convertDoubleQuotesToQuotesInJSON: function(jsonString) {
		return jsonString.replace(/(?<![:\[,{])\\*"(?!\s*[,:\]}])/g, "'")
	},

	format(_content, _parse = false) {
		let log = (msg) => Utils.log.trace(`format: ${msg}`)
		if (_content) {
		  if (! _parse) {
			let r = _content.replace(/\n/g, "<br />")
			log("parse: false | content: " + r)
			return r
		  } else {
			//let r = parse(_content.replace(/\n/g, "<br />"))
			let r = _content.replace(/(<br\s+\/>)+/g, "\n\n")
			//r = "Trois\nDeux\nUn\n" 
			
			log("parse: true | content: " + r)
			return r 
		  }
		} else {
		  return "";
		}
	  },

	  convertCrtToMarkdown(content) {
		let log = (msg) => Utils.log.trace(`convertCrtToMarkdown: ${msg}`)

		if (content?.startsWith('[{')) {
			// It is a json string
			log("Content is in CRT format: " + content[0])
			content = Utils.convertDoubleQuotesToQuotesInJSON(content)
			log("content after \" replacement with ': content: " + content);
	  
			let content_o = []
			try {
				content_o = JSON.parse(content)
			} catch (e) {
				log(e)
				log("Can't convert json_string in js object")
				content_o = [{"children":[{"text":t("ErrorWhileSavingMainContent")}],"type":"p"}]
			}
			const editor = createPlateEditor({ value: content_o, plugins: [MarkdownPlugin] });      
			content = editor.api.markdown.serialize();      
		}
		// else it is text, assumong it is markdown
	  
		return content
	  }
}

export function t(msg) {
	let msgTranslated = _t(msg)  
	if (! msgTranslated || msgTranslated === "") {
		return msg
	} else {
		return msgTranslated
	}	
}
