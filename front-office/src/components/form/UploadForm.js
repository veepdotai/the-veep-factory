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

export default function UploadForm( {...props} ) {
  const log = Logger.of(UploadForm.name);

  let conf = props.conf;

  const REQUIRED_CREDITS_MIN = 1;
  const MIN_LENGTH = 0;
  
  const [selectedFile, setSelectedFile] = useState();

  const [submitButtonIsEnabled, setSubmitButtonIsEnabled] = useState(false);
  const [submitButtonIsHidden, setSubmitButtonIsHidden] = useState(true);

  const inputRef = useRef(null);

  const { veeplet, setVeeplet } = useContext(VeepletContext);
  const { contentId, setContentId } = useContext(ContentIdContext);

  function onFileChange(event) {
    inputRef.current?.files &&
      setSelectedFile(inputRef.current.files[0]);
      setSubmitButtonIsHidden(false);
      setSubmitButtonIsEnabled(true);
  };

  function onFileUpload(formData) {
    // Update the formData object
  };
  
  function handleClick(e) {
    e.preventDefault();
    inputRef.current?.click();
  }
  
  function handleSubmit(e) {
    let fd = new FormData();

    if (selectedFile) {
        fd.append(
            "veepdotai-ai-input-file",
            selectedFile,
            selectedFile.name
        );
        log.trace("onFileUpload: selectedFile: " + selectedFile.name);
    } else {
        log.trace("onFileUpload: no uploaded file from widget.");
        return null;
    }
      
    UploadLib.sendRecording(conf, fd, veeplet, setContentId);
    setSubmitButtonIsEnabled(false);
  }

  return (
    <>
      {
      veeplet ?
          <>
            <Container className='w-100 text-center'>
              <Button className='m-2 w-100' variant='outline-success'
                  onClick={handleClick}
              >
                {selectedFile ? selectedFile.name : "Upload"}
              </Button>

              <Form.Group controlId="veepdotai-ai-input-file" className="mb-3 d-none">
                <Form.Control ref={inputRef} type="file" onChange={onFileChange} />
              </Form.Group>

              <Button className={'m-2 w-100 ' + (submitButtonIsHidden ? 'd-none' : '')} disabled={! submitButtonIsEnabled || props.credits < REQUIRED_CREDITS_MIN}
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
