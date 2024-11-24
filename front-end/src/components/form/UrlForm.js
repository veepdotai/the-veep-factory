import { useContext, useRef, useState, useEffect } from 'react';
import { Button, Col, Container, Modal, Row, Form } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';
import { t } from 'i18next';

import { UploadLib } from '../lib/util-upload-form.js';
import { pushState } from '../lib/utils-analytics.js';
import { Constants } from "src/constants/Constants";
import { VeepletContext } from 'src/context/VeepletProvider.js';
import { ContentIdContext } from 'src/context/ContentIdProvider';

//import QuestionsCell from "src/components/QuestionsCell/QuestionsCell.js";

var ex = null;
var blob;
var gveeplet = null;

export default function UrlForm( {...props} ) {
  const log = Logger.of(UrlForm.name);

  let conf = props.conf;

  const REQUIRED_CREDITS_MIN = 1;
  const MIN_LENGTH = 0;
  
  const [submitButtonIsEnabled, setSubmitButtonIsEnabled] = useState(true);
  const [submitButtonIsHidden, setSubmitButtonIsHidden] = useState(false);

  const inputRef = useRef(null);

  const { veeplet, setVeeplet } = useContext(VeepletContext);
  const { contentId, setContentId } = useContext(ContentIdContext);

  function handleSubmit() {
    let fd = new FormData();

    let current = inputRef?.current?.value;
    if (current !== "") {
        fd.append(
            "veepdotai-ai-input-url",
            current
        );
        log.trace("handleSubmit: inputRef: " + current);
    } else {
        log.trace("handleSubmit: no data provided.");
        return null;
    }
      
    PubSub.publish("URL_ADDED", fd)
    UploadLib.sendRecording(conf, fd, veeplet, setContentId);
    setSubmitButtonIsEnabled(false);
  }

  return (
    <>
      {
      veeplet ?
          <>
            <Container className='w-100 text-center'>

              <Form.Group className="mb-3" controlId="urlForm">
                <Form.Label>{t("EnterUrl")}</Form.Label>
                <Form.Control ref={inputRef} as="input" />
              </Form.Group>

              <Button className={'w-100 ' + (submitButtonIsHidden ? 'd-none' : '')} disabled={! submitButtonIsEnabled || props.credits < REQUIRED_CREDITS_MIN}
                  variant="primary"
                  onClick={handleSubmit}
                >
                    {t("EditorialCalendar.useThisRecord")}
              </Button>

            </Container>
          </>
          :
          <></>
      }
      </>
    );
};
