import { Button, Col, Container, Modal, Row, Form } from 'react-bootstrap';
import PubSub from 'pubsub-js';
import { t } from 'i18next';

import { MdFileUpload as File } from "react-icons/md";
import { MdMic as Microphone } from "react-icons/md";
import { MdLink as Url } from "react-icons/md";
import { MdTextFields as Text } from "react-icons/md";

export default function UploadSelector() {
  let size = 32;

  let style = {"cursor": "pointer"};
  let containerSACN = {style: {fontSize: "0.75rem"}, className: "p-0"};
  let inputs = {
    micro: <Microphone size={size} />,
    file:  <File size={size} />,
    text:  <Text size={size} />,
    url:   <Url size={size} />
  }

  function getInputWidget(inputType) {
    return (
      <Col style={style} className='text-center' xs={3} onClick={() => PubSub.publish("RESOURCE_SELECTED", inputType)}>
        {inputs[inputType]}
        <Container style={{fontSize: "0.75rem"}} className="p-0">{t(inputType)}</Container>
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