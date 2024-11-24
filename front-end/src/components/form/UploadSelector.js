import { Button, Col, Container, Modal, Row, Form } from 'react-bootstrap';
import PubSub from 'pubsub-js';
import { t } from 'i18next';

import { Icons } from '@/src/constants/Icons';

export default function UploadSelector() {
  let size = 32;

  let style = {"cursor": "pointer"};

  function getInputWidget(inputType) {
    return (
      <Col style={style} className='text-center' xs={3} onClick={() => PubSub.publish("RESOURCE_SELECTED", inputType)}>
        <div>{Icons[inputType]}</div>
        <div className="">{t(inputType)}</div>
      </Col>
    )
  }
  return (
    <Container className=''>
      <Row className='m-3 ms-0 me-0'>
        {getInputWidget("micro")}
        {getInputWidget("file")}
        {getInputWidget("text")}
        {getInputWidget("url")}
      </Row>
    </Container>
  )
}