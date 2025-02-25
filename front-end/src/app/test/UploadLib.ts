import { Logger } from 'react-logger-lib'
import { ApolloClient, InMemoryCache, gql, useMutation } from '@apollo/client';
import createUploadLink from "src/mjs/createUploadLink"

//const JWT = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDAzOTY5MDgsImlzcyI6Imh0dHBzOlwvXC84MDAxLXZlZXBkb3RhaS12b2ljZTJwb3N0LWp5MWRvdDNibWFsLndzLWV1MTE3LmdpdHBvZC5pbyIsImV4cCI6MTc0MTAwMTcwOCwiZGF0YSI6eyJ1c2VyIjp7ImVtYWlsIjoiYWRtaW5AdmVlcC5haSIsImlkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicGljdHVyZSI6bnVsbH19fQ.PIJ3yY1DGTZJGLa1SgzRp0tcQxMbkGACFwSENwTJRDI"
const JWT = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDA0NzY5NTUsImlzcyI6Imh0dHBzOlwvXC84MDAxLXZlZXBkb3RhaS12b2ljZTJwb3N0LWp5MWRvdDNibWFsLndzLWV1MTE4LmdpdHBvZC5pbyIsImV4cCI6MTc0MTA4MTc1NSwiZGF0YSI6eyJ1c2VyIjp7ImVtYWlsIjoiamNrZXJtYWdvcmV0QGdtYWlsLmNvbSIsImlkIjoyLCJ1c2VybmFtZSI6Impja2VybWFnb3JldCIsInBpY3R1cmUiOm51bGx9fX0.p0EsyOyfC7YBfDa7NRWbmZpWD4IWp57BUbVI9TpFhEU"

export const UploadLib = {

    log: Logger.of("UploadLib"),

    client: function() {

        const link = createUploadLink({
            uri: 'https://8001-veepdotai-voice2post-jy1dot3bmal.ws-eu118.gitpod.io/graphql'
                    + '?JWT=' + JWT,
            credentials: "include"
        })

        const client = new ApolloClient({
            cache: new InMemoryCache(),
            link
        })

        return client
    },

    client2: function() {
        let config = {
            uri: 'https://8001-veepdotai-voice2post-jy1dot3bmal.ws-eu117.gitpod.io/graphql'
                    + '?JWT=' + JWT,
            cache: new InMemoryCache(),
            //credentials: 'same-origin',
            credentials: 'include',
            /// mode: 'no-cors', // no-cors, *cors, same-origin
            //    withCredentials: false,
            headers: {
                //'authorization': 'Bearer ' + JWT,  
                'client-name': 'Space Explorer [web]',
                'client-version': '1.0.0',
            },  
            /// fetchOptions: {
            //options: {
            //    mode: 'cors', // no-cors, *cors, same-origin
            //    credentials: 'include',
            //},  
            defaultOptions: {
                watchQuery: {
                    fetchPolicy: 'network-only',
                },  
            },  
        }
        UploadLib.log.trace("config: ", config)

        return new ApolloClient(config)
    },

    query: function() {
        const GET_USER = gql`
            query GetUser {
                users {
                    edges {
                        node {
                            id
                            nicename
                            nickname
                        }
                    }
                }
            }
        `;
      
        let client = UploadLib.client()
        UploadLib.log.trace("client: ", client) 
        return client.query({
            query: GET_USER,
            variables: { id: '2' },
        })
        .then((res) => console.log(res.data))
        .catch((error) => console.error(error))

    },

    test: function(msg) {
        UploadLib.log.trace("file2: ", msg) 
        /*
            mutation MyTest($input: TestInput = {file: $file}) {
                test(input: $input) {
                    clientMutationId
                    text
                }
            }
        */
        const TEST = gql`
            mutation MyMutation($input: TestInput!) {
                test(input: $input) {
                    clientMutationId
                    text
                }
            }
       `;
      
        let client = UploadLib.client()
        UploadLib.log.trace("client: ", client) 

        return client.mutate({
            mutation: TEST,
            variables: { "input": { "file": "Hello2" } },
        })
        .then((res) => console.log(res.data))
        .catch((error) => {
            console.error(error)
        })

    },

    upload: function(myfile) {
        UploadLib.log.trace("file: ", myfile) 
        UploadLib.log.trace(`file metadata: ${myfile.name} / ${myfile.type}` ) 
        const UPLOAD = gql`
            mutation Upload($input: UploadInput!) {
                upload(input: $input) {
                    status
                }
            }
        `;

        let client = UploadLib.client()
        UploadLib.log.trace("client: ", client) 
        return client.mutate({
            mutation: UPLOAD,
            variables: { "input": { "file": myfile } },
        })
        .then((res) => console.log(res.data))
        .catch((error) => {
            console.error(error)
        })

    }

}
