import React from 'react';
import { Button, Col, Container, Row, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import styles from '../styles/Home.module.css';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { t } from 'i18next';

import IntervalExample from './logs.js';


const Question = () => {

    const recorderControls = useAudioRecorder();
    const [recordings, setRecordings] = useState([]);
  
    const addAudioElement = (blob) => {
      const url = URL.createObjectURL(blob);
      const newRecordings = [...recordings, url];
      setRecordings(newRecordings);
    };
  
    const sendRecording = (url) => {
      log.info(url);
      alert('coucou');
    };
  
    const stopRecording = () => {
      recorderControls.stopRecording();
    };
  
    const handleTeamSelect = (e) => {
      e.preventDefault();
      setTeamId(e.target.value);
      setEdCalendarId(null);
    }
  
    const handleCalendarSelect = (e) => {
      e.preventDefault();
      setEdCalendarId(e.target.value);
    }
  
    return (    
        <Container className='mt-2'>
            {/* Bouton pour enregistrer la question */}
            <Row className="justify-content-md-center mt-3">
            <Col md="auto">
            <AudioRecorder
                onRecordingComplete={addAudioElement}
                recorderControls={recorderControls}
                downloadFileExtension='wav'
                audioTrackConstraints={{
                noiseSuppression: true,
                echoCancellation: true,
                }}
            />
            </Col>
            </Row>

            {/* Affichage des enregistrements avec bouton valider et croix pour supprimer */}
            <Row className="justify-content-md-center mt-2">
            <Col md="auto">

                {recordings.map((url, index) => (
                // all key must be unique
                <Row key={index+"a"} className="justify-content-md-center">

                    {/* Affichage de l'enregistrement */}
                    <Col key={index+"b"} md="auto">
                    <audio key={index+"c"} src={url} controls className="mb-2" />
                    </Col>

                    {/* Bouton valider pour envoyer l'enregistrement */}
                    <Col key={index+"d"} md="auto">
                    <Button key={index+"e"} variant="success" onClick={() => sendRecording(url)} >
                    {t("EditorialCalendar.useThisRecord")}
                    </Button>
                    </Col>

                    {/* Croix pour supprimer l'enregistrement */}
                    <Col key={index+"f"} md="auto">
                    <Button 
                    key={index+"g"}
                    variant="link" 
                    style={{color: '#f00'}} 
                    onClick={() => setRecordings(recordings.filter((_, i) => i !== index))}
                    >
                        <FontAwesomeIcon key={index+"h"} icon={faXmark} size="xs" />
                    </Button>
                    </Col>
                </Row>
                ))}
            </Col>
            </Row>
        </Container>
    );
  };

export default Question;