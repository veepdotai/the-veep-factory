import VeepTree from "./VeepTree";
import CodeEditor from './CodeEditor';
import { Container, Col, Row } from 'react-bootstrap';
import { t } from 'i18next';

export default function IDE() {

    return (
        <>
            <Row>
                {/*
                    <Col className="" xs={12} md={2}>
                    <VeepTree />
                    </Col>
                */}
                <Col xs={12} md={12}>
                    <Container className="mb-3">
                        {t("WriteYourOwnPrompt")}
                    </Container>
                    <CodeEditor />
                </Col>
            </Row>
        </>
    )
}