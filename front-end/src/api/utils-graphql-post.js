import { Logger } from 'react-logger-lib';

export const UtilsGraphQLPost = {
	log: Logger.of("UtilsGraphQLPost"),

	listOne: function(id) {
		function getGQL() {
			let r = "";
			for(let i = 0; i < 30; i++) {
				r += "veepdotaiPhase" + i + "Content" + "\n";
				r += "veepdotaiPhase" + i + "Details" + "\n";
			}
			return r;
		}

		let q = `query content {
					post(idType: DATABASE_ID, id: ${id}) {
						__typename
						content(format: RAW)
						date
						databaseId
						title
						uri
						veepdotaiTranscription
						veepdotaiPrompt
						${getGQL()}
					}
				}`

		return q;
	},

	convert: function(content) {
		return(content);
	}

}