import { Container, Col, Row, Tabs, Tab } from 'react-bootstrap';
import styles from '../styles/Home.module.css'

import Form from './form/Form';
import Transcription from './form/Transcription';
import ReportData from './ReportData';
import Logs from './Logs';
import CircularProgressionCounter from './CircularProgressionCounter';

export default function Main() {
    let showResultWindow = true;
    return (
        <Tabs
        defaultActiveKey="home"
        id="uncontrolled-tab-example"
        className="mb-3"
        >
            <Tab eventKey="home" title="Home">
                <Container className={styles.container}>
                    <Row className="justify-content-md-center">

                    <Col xs={12} md={4} className=''>
                        <Form />
                    </Col>
                    { showResultWindow ?
                    <Col xs={12} md={6} className=''>
                        <Transcription />
                    </Col>
                    : <></>}
                    </Row>
                    {/*
                    <Row>
                    <Logs />
                    </Row>
                    */}
                </Container>
            </Tab>

            <Tab eventKey="dashboard" title="Dashboard">
                <ReportData />
            </Tab>      

            <Tab eventKey="logs" title="Logs">
                <Logs />
                <CircularProgressionCounter />
            </Tab>      
        </Tabs>
    )
}