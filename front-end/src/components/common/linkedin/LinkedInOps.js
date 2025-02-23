import { useContext, useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';
import { RestliClient } from 'linkedin-api-client';
import { FaLinkedin } from "react-icons/fa";

import SuspenseClick from '../SuspenseClick';
import { ThirdPartiesDataContext } from 'src/context/ThirdPartiesDataProvider';

export default function LinkedInOps({content}) {
    const log = Logger.of("LinkedInOps");

    const { thirdPartiesData } = useContext(ThirdPartiesDataContext);

    const [waiting, setWaiting] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [accessToken, setAccessToken] = useState();
    
    async function publishContent(accessToken, commentary, media) {
        log.trace("publishContent: " + accessToken);
        setWaiting(true);
        setDisabled(true);

        const ME_RESOURCE = '/me';
        const POSTS_RESOURCE = '/posts';
        const API_VERSION = '202501';
    
        // Configure RestliClient
        const restliClient = new RestliClient();
        restliClient.setDebugParams({ enabled: true });
        
        // Get me.id
        const meResponse = await restliClient.get({
            resourcePath: ME_RESOURCE,
            accessToken
        });
        log.trace("meResponse: " + JSON.stringify(meResponse.data));
    /*
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
        log.trace(postsCreateResponse.createdEntityId);
        */
        setWaiting(false);
        setDisabled(false);
    }

    function publish() {
        publishContent(accessToken, content)
            .then(() => {
                log.trace('Completed');
            })
            .catch((error) => {
                log.trace(`Error encountered: ${error.message}`);
            });
    }

    function updateAccessToken(topic, message) {
        setAccessToken(message);
    }

    function updateActions(topic, message) {
        if (waiting) {
            // The user is publishing its post and its access token was bad.
            // Redirect the user to login.
        }
    }

    useEffect(() => {
        setAccessToken(thirdPartiesData.linkedin?.access_token)
    }, [thirdPartiesData])

    useEffect(() => {
        PubSub.subscribe("LINKEDIN_ACCESS_TOKEN", updateAccessToken);
        PubSub.subscribe("LINKEDIN_SIGNIN_RESULT", updateActions);
    }, [])

    return (
        <>
            {accessToken ?
                <SuspenseClick waiting={waiting} disabled={disabled} handleAction={publish} >
                    <FaLinkedin />
                </SuspenseClick>
            :
                <>
                    {/* To be done... */}
                    {/*
                    <SuspenseClick waiting={waiting} disabled={disabled} handleAction={publish} label={t("Publish")}>
                        <FaLinkedin />
                    </SuspenseClick>
                    */}
                </>
            }
        </>
    )    
}
