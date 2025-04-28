import VeepTree from "./VeepTree";
import VeepletCodeEditor from './VeepletCodeEditor';
import { Container, Col, Row } from 'react-bootstrap';
import { t } from 'src/components/lib/utils'

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
                    <VeepletCodeEditor />
                </Col>
            </Row>
        </>
    )
}