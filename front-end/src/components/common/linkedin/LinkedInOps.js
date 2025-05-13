import { useContext, useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib'
import PubSub from 'pubsub-js'
import { FaLinkedin } from "react-icons/fa"

import SuspenseClick from '../SuspenseClick'
import LinkedInLib from './LinkedInLib'

export default function LinkedInOps({accessToken, content}) {
    const log = Logger.of("LinkedInOps")

    //const { thirdPartiesData } = useContext(ThirdPartiesDataContext);

    const [waiting, setWaiting] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [publishedStatus, setPublishedStatus] = useState(false);
    
    
    function publish() {
        setWaiting(true)
        setDisabled(true)
    
        LinkedInLib.createPost({accessToken: accessToken, commentary: content})
            .then(() => {
                log.trace('Completed')
                setPublishedStatus(true)
            })
            .catch((error) => {
                log.trace(`Error encountered: ${error.message}`)
                alert("Error: " + JSON.stringify(error))
            })
            .finally(() => {
                setWaiting(false)
                setDisabled(false)
            }
        )
    }

    function updateActions(topic, message) {
        if (waiting) {
            // The user is publishing its post and its access token was bad.
            // Redirect the user to login.
        }
    }

    useEffect(() => {
//        PubSub.subscribe("LINKEDIN_ACCESS_TOKEN", updateAccessToken);
//        PubSub.subscribe("LINKEDIN_SIGNIN_RESULT", updateActions);
    }, [])

    return (
        <>
            <SuspenseClick waiting={waiting} disabled={disabled} handleAction={publish} >
                <FaLinkedin />
            </SuspenseClick>
            <div>Result: {publishedStatus}</div>
        </>
    )    
}
