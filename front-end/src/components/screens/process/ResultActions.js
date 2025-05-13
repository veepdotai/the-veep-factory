import { Logger } from 'react-logger-lib';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { t } from 'src/components/lib/utils'
import PubSub from 'pubsub-js';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import LinkedInOps from '../../common/linkedin/LinkedInOps';
import { getIcon } from "src/constants/Icons";
import ProcessStats from './ProcessStats';

export default function ResultActions( { content } ) {
    const log = Logger.of(ResultActions.name);

    function onCopy() {
        log.trace("CopyToClipBoard: Clicked.");
        PubSub.publish("CURRENT_ACTION", { headerTitle: null, body: t("ContentCopied")});
    }

    return (
        <Container>
            <Row><Col><ProcessStats /></Col></Row>
            <Row>
                <Col>
                    <CopyToClipboard
                        text={content}
                        onCopy={onCopy}
                        >
                            <Button variant='outline-info' className='p-2 btn btn-sm fs-6'>
                                {getIcon("clipboard")}
                            </Button>
                    </CopyToClipboard>
                </Col>
                <Col>
                    {/*<LinkedInOps content={content} />*/}
                    {/*
                    <Button variant='outline-info' className='p1 btn btn-sm fs-6'>
                        <Icon iconName="Share" size="12"/>
                        </Button>
                    */}
                </Col>
            </Row>
        </Container>
    )
}