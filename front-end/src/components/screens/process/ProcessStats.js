import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

import { Logger } from 'react-logger-lib';
import { t } from 'src/components/lib/utils'

import PubSub from 'pubsub-js';

import { Icons } from "src/constants/Icons";

export default function ProcessStats() {
    const log = Logger.of(ProcessStats.name);

    const [content, setContent] = useState(null);

    function countWords(s) {
        s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude start and end white-space
        s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
        s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
        return s.split(' ').filter(function(str){return str!="";}).length;
    }

    function storeContent(topic, content) {
        setContent(content);
    }

    useEffect(() => {
        PubSub.subscribe("_CONTENT_", storeContent);
    }, [])

    return (
        <>
            { content ?
                <Container>{Icons.stats} {countWords(content)} / {content.length}</Container>
                :
                <></>
            }
        </>
    )
}