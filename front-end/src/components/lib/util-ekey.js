import { Logger } from 'react-logger-lib';

/**
 * Available chars in base 64 are [0-9a-zA-Z+/] but + and / are not allowed
 * *in propertie name so it might give a bug.
 */
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