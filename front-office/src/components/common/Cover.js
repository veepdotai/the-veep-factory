import { useState, useEffect } from 'react';
import { Button, Container, Col, Modal, Row } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next';

import { Constants } from "src/constants/Constants";

import GettingStartedVideo from '../screens/documentation/GettingStartedVideo';
import Welcome from '../screens/documentation/Welcome';

export default function Cover( { displayOnFront = true } ) {
  const log = Logger.of(Cover.name);
  const [display, setDisplay] = useState(displayOnFront);
  const [coverUrl, setCoverUrl] = useState();

  function closeModal() {
    if (displayOnFront) {
      setDisplay(false);
    }
  }

  useEffect(() => {
    setCoverUrl(Constants.COVER_URL);
  },[]);

  return (
    <>
    {
      display ?
            <Modal show={displayOnFront} onHide={closeModal} size={'lg'}>
              <Modal.Header closeButton>
                <Modal.Title>{t("App.Welcome")}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <Container>
                <Row className="justify-content-md-center">
                  <Col md={12} lg={9}>
                    <Welcome />
                    <GettingStartedVideo />
                  </Col>
                </Row>
              </Container>
                {/*<iframe src={coverUrl} style={{width:'100%', height:'500px'}}/>*/}
              </Modal.Body>
            </Modal>
          :
            <>
            </>
        }
    </>
  )
}