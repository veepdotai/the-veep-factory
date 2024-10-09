import { Logger } from 'react-logger-lib';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

export const UtilsFetch = {
	log: Logger.of("UtilsFetch"),

	client: function(uri, cookies = null) {
		return new ApolloClient({
			uri: uri,
			cache: new InMemoryCache(),
			//credentials: 'same-origin',
			credentials: 'include',
			mode: 'no-cors', // no-cors, *cors, same-origin
			//    withCredentials: false,
			headers: {
				'authorization': 'Bearer ' + (cookies?.JWT ? cookies.JWT : ''),  
				'client-name': 'Space Explorer [web]',
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
	}

}