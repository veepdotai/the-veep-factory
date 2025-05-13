import { RestliClient } from 'linkedin-api-client';
import { Logger } from 'react-logger-lib'

const ME_RESOURCE = '/me';
const POSTS_RESOURCE = '/posts';
const API_VERSION = '202501';

const LinkedInLib = {
    log: (...args) => Logger.of("LinkedInLib").trace(args),

    createPost: async function(accessToken, commentary, media) {
        let log = (...args) => LinkedInLib.log("createPost:", args)
        log("parameters: accessToken:", accessToken, "commentary:", commentary)

        // Configure RestliClient
        const restliClient = new RestliClient();
        restliClient.setDebugParams({ enabled: true });
        
        // Get me.id
        const meResponse = await restliClient.get({
            resourcePath: ME_RESOURCE,
            accessToken
        });
        log("meResponse: ", meResponse.data);

        let id = meResponse.data.id;
        
        // Publish content
        const postsCreateResponse = await restliClient.create({
            resourcePath: POSTS_RESOURCE,
            entity: {
                author: `urn:li:person:${id}`,
                lifecycleState: 'PUBLISHED',
                visibility: 'PUBLIC',
                commentary: commentary,
                distribution: {
                    feedDistribution: 'MAIN_FEED',
                    targetEntities: [],
                    thirdPartyDistributionChannels: []
                }
            },
            accessToken,
            versionString: API_VERSION
        });
        log("postCreateResponse:", postsCreateResponse);
        log("postCreateResponse.createEntityId:", postsCreateResponse.createdEntityId);
    },

    createPostWithPoll: () => {

    },

    createPostWithPDFDocument: () => {

    },

}

export default LinkedInLib