import { Logger } from 'react-logger-lib'
import { ApolloClient, InMemoryCache, gql, useMutation } from '@apollo/client';
import createUploadLink from "src/mjs/createUploadLink"
import PubSub from 'pubsub-js'
import { Constants } from '@/constants/Constants';

export const UploadLib = {
    log: Logger.of("UploadLib"),

    client: function(cookies) {

        const link = createUploadLink({
            //uri: 'https://8001-veepdotai-voice2post-jy1dot3bmal.ws-eu118.gitpod.io/graphql' + '?JWT=' + JWT,
            uri: Constants.WORDPRESS_GRAPHQL_ENDPOINT + '?JWT=' + cookies.JWT,
            credentials: "include"
        })

        const client = new ApolloClient({
            cache: new InMemoryCache(),
            link
        })

        return client
    },

    query: function(cookies) {
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
      
        let client = UploadLib.client(cookies)
        UploadLib.log.trace("client: ", client) 
        return client.query({
            query: GET_USER,
            variables: { id: '2' },
        })
        .then((res) => console.log(res.data))
        .catch((error) => console.error(error))

    },

    upload: function(cookies, myfile, topic, form) {
        UploadLib.log.trace("upload: file: ", myfile) 
        const UPLOAD = gql`
            mutation Upload($input: UploadInput!) {
                upload(input: $input) {
                    status
                }
            }
        `;

        let client = UploadLib.client(cookies)
        UploadLib.log.trace("client: ", client) 
        return client.mutate({
            mutation: UPLOAD,
            variables: { "input": { "file": myfile } },
        })
        .then((res) => {
            UploadLib.log.trace("upload: success: res: ", res)
            let data = JSON.parse(res.data.upload.status)
            UploadLib.log.trace("upload: success: data: ", data)
            UploadLib.log.trace("upload: success: topic: ", topic)
            PubSub.publish(topic, {form: form, data: data})
            //PubSub.publish(topic, data)
        })
        .catch((error) => {
            UploadLib.log.trace("upload: error: ", error)
            PubSub.publish("ERROR", error)
        })

    }

}
