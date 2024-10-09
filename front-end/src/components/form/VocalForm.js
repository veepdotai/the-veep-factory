import { useContext, useRef, useState, useEffect } from 'react';
import { Button, Col, Container, Modal, Row, Form } from 'react-bootstrap';

import { Logger } from 'react-logger-lib';
import axios from 'axios';
import PubSub from 'pubsub-js';
import AudioRecorderPolyfill from 'audio-recorder-polyfill-next';
import mpegEncoder from 'audio-recorder-polyfill/mpeg-encoder';

import { t } from 'i18next';

import { AudioRecorder, useAudioRecorder } from '../lib/react-audio-recorder/react-audio-voice-recorder.es.js';
import { pushState } from '../lib/utils-analytics';
import { UploadLib } from '../lib/util-upload-form';
import { Constants } from "src/constants/Constants";
import styles from './Vocal.module.css';

import { VeepletContext } from 'src/context/VeepletProvider';
import { ContentIdContext } from 'src/context/ContentIdProvider';

import { Icons } from "src/constants/Icons";

var ex = null;
var blob;
var gveeplet = null;

export default function Vocal( {...props} ) {
  const log = Logger.of(Vocal.name);

  let conf = props.conf;
  
  const REQUIRED_CREDITS_MIN = 1;
  const MIN_LENGTH = 0;
  
  const recorderControls = useAudioRecorder();

  const [displayMicro, setDisplayMicro] = useState(true);
  const [recordings, setRecordings] = useState([]);
  const [disabled, setDisabled] = useState();
  const [showAlert, setShowAlert] = useState();

  const { veeplet, setVeeplet } = useContext(VeepletContext);
  const { contentId, setContentId } = useContext(ContentIdContext);

  function selectVeeplet(topic, veepNs) {
    log.trace("veepNs (=> veeplet): " + veepNs);
    gveeplet = veepNs;
    setVeeplet(veepNs);
  }

  function addAudioElement(_blob) {
    blob = _blob;
    log.trace("Blob size: " + blob.size);
    let length = Math.round(blob.size / 15000); // 15Ko/s is approximately 128Kbps
    log.trace("Blob length: " + length);

    if (length < MIN_LENGTH) {
      setShowAlert({
        show: true,
        title: t("Vocal.Duration"),
        content: t("Vocal.MinLength", {length: length, min: 15})
      })
    } else {
        const url = URL.createObjectURL(_blob);
        const newRecordings = [...recordings, url];
        setRecordings(newRecordings);
        setDisplayMicro(false);
    }
  };

  function startRecording() {
    setDisplayMicro(false);
    recorderControls.startRecording();
  };
  
  function stopRecording() {
    recorderControls.stopRecording();
  };
  
  function handleRemove(index){
    pushState("removeRecording");
    setRecordings(recordings.filter((_, i) => i !== index));
    setDisabled(false);
    setDisplayMicro(true);
  }
  
  function handleSubmit() {
    let fd = new FormData();
    if (blob) {
      fd.append('veepdotai-ai-input-stream', blob, "record.wav");
    } else {
      return null;
    }

    UploadLib.sendRecording(conf, fd, veeplet, setContentId);
    setDisabled(true);
  }
  
  function handleClose() {
    setShowAlert({show:false});
  }

  useEffect(() => {
    let polyfill = AudioRecorderPolyfill();
    polyfill.encoder = mpegEncoder;
    polyfill.prototype.mimeType = 'audio/mpeg';
    window.MediaRecorder = polyfill;

    PubSub.subscribe("SELECTED_VEEPLET", selectVeeplet);
  },[])

  return (
    <>
    { veeplet ?
      <Container className={props.className + ' ' + (disabled ? 'mt-0 ' : 'mt-2')}>
          <Row className="justify-content-md-center mt-3">
            <Col className="align-center" md="auto">
              <>
                <Container id="audio-recorder" className={displayMicro ? 'flex-1':'d-none'}>
                  <AudioRecorder
                    onRecordingComplete={addAudioElement}
                    recorderControls={recorderControls}
                    audioTrackConstraints={{
                      noiseSuppression: true,
                      echoCancellation: true,
                    }}
                    downloadFileExtension='wav'
                    showVisualizer={true}
                    visualizer={{
                      width: '30',
                      height: '50',
                      barWidth: 2
                    }}
                    classes={{
                        AudioRecorderStatusClass: 'd-inline',
                        AudioRecorderClass: styles.recorderClass
                    }}
                  />
                </Container>
              </>
            </Col>
          </Row>

        <Row className="justify-content-md-center mt-2">
          <Col md="auto">

            {recordings.map((url, index) => (
              <Row key={index + "a"} className="justify-content-md-center">

                <Col key={index + "b"} className="d-flex align-self-center m-2" md="auto">
                  <audio key={index + "c"} src={url} controls className="rounded-2" />
                  &nbsp;

                  {/* Delete action */}
                  <Button className={disabled ? 'd-none': ''} key={index + "g"}
                    variant="danger"
                    onClick={() => handleRemove(index) }
                  >
                      {Icons.delete} {/* key={index + "h"} */}
                  </Button>
                  
                </Col>

                {/* Submit action */}
                <Col key={index + "d"} className={'w-100 ' + (disabled ? 'd-none': '')} md="auto">
                  <Button key={index + "e"} className={'w-100 '} disabled={disabled || props.credits < REQUIRED_CREDITS_MIN} variant="primary"
                    onClick={handleSubmit}
                  >
                    {t("EditorialCalendar.useThisRecord")}
                  </Button>
                </Col>

              </Row>
            ))}
          </Col>
        </Row>
      </Container>
      :
      <></>
      }
      {
        showAlert ?
          <Modal show={showAlert.show} onHide={handleClose} size={'md'}>
              <Modal.Header closeButton>
                  <Container className='fs-5'>{showAlert.title}</Container>
              </Modal.Header>
              <Modal.Body>
                  <Container>{showAlert.content}</Container>
              </Modal.Body>
          </Modal>
          :
          <></>
      }
    </>
  );
};
