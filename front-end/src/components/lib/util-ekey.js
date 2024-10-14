import { Logger } from 'react-logger-lib';

const EKeyLib = {
    log: Logger.of("EKeyLib"),

	encode: function(value) {
		//return encodeURIComponent(btoa(JSON.stringify(value)))
		return btoa(value).replace(/=/g, "");
		//return punycode.encode(value).replace(/-/g, "_");
	},

	decode: function(value) {
		//return JSON.parse(atob(decodeURIComponent(value)))
		return atob(value);
		//return punycode.decode(value.replace(/_/g, "-"));
	}

}

export default EKeyLib;