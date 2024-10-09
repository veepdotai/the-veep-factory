import { Logger } from 'react-logger-lib';
import { Accordion } from 'react-bootstrap';
import { t } from 'i18next';

import UserPreferences from './preferences/UserPreferences';
import LinkedIn from '../common/linkedin/LinkedIn';
import LinkedInStatus from '../common/linkedin/LinkedInStatus';

export default function UserParameters() {
    const log = Logger.of(UserParameters.name);

    return (
        <Accordion id="user-parameters" defaultActiveKey="0">
            <Accordion.Item eventKey="0">
                <Accordion.Header>{t("UserPreferences")}</Accordion.Header>
                <Accordion.Body>
                    <UserPreferences />
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>{t("SocialNetworks")}</Accordion.Header>
                <Accordion.Body>
                    <LinkedIn />
                    <LinkedInStatus />
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}
