import { Constants } from 'src/constants/Constants';
import { Logger } from 'react-logger-lib';
//import { createPlateEditor } from '@udecode/plate/react';
import { createPlateEditor } from '@udecode/plate/react';
import { MarkdownPlugin } from '@udecode/plate-markdown';
import { t as _t } from 'i18next'
import PubSub from 'pubsub-js'

export const Utils = {
	log: (...args) => Logger.of("Utils").trace(args),

	isObject: (item) => {
		return (item && typeof item === 'object' && !Array.isArray(item));
	},
	
	getUserValue: (name, defaultValue = null) => {
		let component = name.replace(/^([a-zA-Z0-9]+)_.*/, "$1")
		let param = name.replace(/^[a-zA-Z0-9]+_(.*)/, "$1")
		Utils.log("getUserValue: component:", component, "param:", param, "defaultValue:", defaultValue)

		let userApp = "DEFAULT_USER_APP_CONFIG"
		let userValue = ""
		try {
			userValue = Constants[userApp][component][param] 
			Utils.log(`getUserValue: Constants[${userApp}][${component}][${param}]:`, userValue)

			return userValue
		} catch(e) {
			Utils.log(`getUserValue: Constants[${userApp}][${component}][${param}] not found:`, e)
			if (Utils.isObject(defaultValue)) {
				userValue = defaultValue[param]
			} else {
				userValue = defaultValue
			}
			Utils.log(`getUserValue: userValue:`, userValue)
			return userValue
	  	}			
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

	capitalize: function(str, justFirstOne = false) {
		if (justFirstOne) {
			return str.charAt(0).toUpperCase() + str.slice(1);
		} else {
			return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
		}
	},

	hasPromptSourceEditorPrivilege: function(profile) {
		if (Utils.isManager(profile)
			|| profile?.roles?.includes("veepdotai_role_advanced_user")
			|| "demo@veep.ai" === profile?.user_email ) {
			return true
		} else {
			return false
		}
	},

	isManager: function(profile) {
		try {
			return JSON.stringify(profile?.roles)?.indexOf('veepdotai_role_admin') != -1;
		} catch (e) {
			return false;
		}
	},
	
	getRoles: function(JWT) {
		let log = (...args) => Utils.log("getRoles", args)
		let payload64 = JWT.replace(/.*\.(.*)\..*/, "$1");
		log('payload64:', payload64);
		if (payload64) {
		  let payload = JSON.parse(atob(payload64));
		  log("data: ", payload);
		  if (payload.data.user.email === Constants.ADMIN_EMAIL) {
			log('data.data.user.email: ', payload.data.user.email, ' is manager');
			//setRoles(["Manager"]);
			return true;
		  }
		} else {
		  //setRoles([]);
		  return false;
		}
	},
	
	getPayload: function(JWT) {
		let log = (...args) => Utils.log("getPayload", args)

		let payload64 = null;
		let payload = null;
		log('JWT:', JWT);
		if (JWT && JWT != "undefined") {
			payload64 = JWT.replace(/.*\.(.*)\..*/, "$1");
			payload = JSON.parse(atob(payload64));
			return payload;
		} else {
			return null;
		}
	},

	isCookieValid: function(JWT) {
		let log = (...args) => Utils.log("isCookieValid", args)
		let payload = this.getPayload(JWT);
		// Date.now() is in milliseconds while exp is in sec.
		if (Math.round(Date.now() / 1000) < payload?.exp) {
			log('JWT Payload (true):', payload.exp);
			return true;
		} else {
			log('JWT Payload (false):', payload?.exp);
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
		let log = (...args) => Utils.log("format:", args)
		if (_content && "" !== _content) {
		  if (! _parse) {
			let r = _content?.replace(/\n/g, "<br />")
			log("parse: false | content:", r)
			return r
		  } else {
			//let r = parse(_content.replace(/\n/g, "<br />"))
			let r = _content?.replace(/(<br\s+\/>)+/g, "\n\n")			
			log("parse: true | content:", r)
			return r 
		  }
		} else {
		  return "";
		}
	  },

	  convertCrtToMarkdown(content) {
		let log = (...args) => Utils.log("convertCrtToMarkdown:", args)

		if (content?.startsWith('[{')) {
			// It is a json string
			log("Content is in CRT format: ", content[0])
			content = Utils.convertDoubleQuotesToQuotesInJSON(content)
			log("content after \" replacement with ': content: ", content);
	  
			let content_o = []
			try {
				content_o = JSON.parse(content)
			} catch (e) {
				log("Exception: Can't convert json_string in js object:", e)
				content_o = [{"children":[{"text":t("ErrorWhileSavingMainContent")}],"type":"p"}]
			}
			const editor = createPlateEditor({ value: content_o, plugins: [MarkdownPlugin] });      
			content = editor.api.markdown.serialize();      
		}
		// else it is text, assuming it is markdown
	  
		return content
	  },

	  /**
	   * normalize before using it in the application 
	   */
	  normalize(source) {
		let log = (...args) => Utils.log("normalize", args)

		if (! source || "" === source) {
			return ""
		} else {
			let r = source
						.replace(/_G_/g, '"')	// fix() to mange '"'
						.replace(/_EOL_/g, "\n") // fix() to manage '\n'
						.replace(/_AS_/g, "\\")	// fix() to manage '\"'
			log("normalize: source: ", r)

			return r
		}
	  },

	  /**
	   * denormalize before saving it in the database
	   */
	denormalize(source) {
		let log = (...args) => Utils.log("denormalize:", args)

		if (! source || "" === source) {
			return ""
		} else {
			let layoutSource = source
			if ("object" === typeof source) {
				layoutSource = JSON.stringify(source)
			}
			let r = layoutSource
						.replace(/"/g, "_G_")	// fix() to mange '"'
						.replace(/\n/g, "_EOL_") // fix() to manage '\n'
						.replace(/\\/g, "_AS_")	// fix() to manage '\"'
			log("denormalize: source: ", source)

			return r
		}
	},

	notify({title, description}) {
		PubSub.publish("TOAST", {
			title: title,
			description: description
		})
	},

	notifyError(msg) {
		PubSub.publish("ERROR", {
			title: t("Error"),
			description: msg
		})
	},

	convert2json(source, throwError = true) {
		let log = (...args) => Utils.log("convert2json", args)

		if (! source || source === "") {
			log("source is empty but it can't. It must contain a valid JSON string that can be parsed into a json object")
			if (throwError) {
				throw new Error("Source can't be empty or undefined or null. It must contain a valid JSON string that can be parsed into a json object.")
			}
		} else {
			let jsonSource = null
			try {
				jsonSource = JSON.parse(source)
				//log("jsonSource: ", jsonSource)
				return jsonSource
			} catch (e) {
				log("Exception: ", e, "source can't be parsed as an json object: ", source)
				if (throwError) {
					throw new Error("source must contain a valid JSON string that can be parsed into a json object")
				}
			}
		}
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

export function guv(pref, app) {
	return Utils.getUserValue(pref, app)
}
