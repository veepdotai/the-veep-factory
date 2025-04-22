import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';
import { Logger } from 'react-logger-lib';
import { t } from 'src/components/lib/utils'
import PubSub from 'pubsub-js';
import { Fireworks } from '@fireworks-js/react';
import { toast } from 'react-hot-toast';
import { Constants } from "src/constants/Constants";
import EKeyLib from '../lib/util-ekey';
import { Utils } from '../lib/utils';

//import Notifier from 'react-desktop-notification';

export default function VeepToast() {
  const log = Logger.of('VeepToast');

  const [show, setShow] = useState(false);
  const [message, setMessage] = useState({});

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  function displayCurrentActionToast(topic, data) {
    log.trace('Receiving CURRENT_ACTION message: ' + topic + " / " + JSON.stringify(data));
    setMessage({
      imageSrc: Constants.ROOT + '/assets/images/veep.ai-wnb.png',
      headerTitle: data.headerTitle,
      body: data.body,
    })

    toast.success(data.headerTitle);

  }

  function displayToast(topic, data) {
    log.trace('Receiving from CURRENT_STEP message: ' + topic + " / " + JSON.stringify(data));
    if (topic.match(/_ARTICLE_PUBLISHING_FINISHED_/)) {
        Notifier.start(
          "Veep.AI transformation process is over.",
          "Your vocal has been processed and the content is available for further action.",
          "",
          Constants.ROOT + '/assets/images/veep.ai-wnb.png'
        );
    }
    setMessage({
      imageSrc: Constants.ROOT + '/assets/images/veep.ai-wnb.png',
      headerTitle: Utils.capitalize(data.replace(/.*\s_([^\s]*_(STARTED|FINISHED))_.*/, "$1").replace(/_/g," ")),
      //headerSubtitle: data.replace(/.*_(STARTED|FINISHED)_.*/, "$1"),
      //headerSubtitle: t("Process.NewContentReady"),
      body: t("Process.NewContentReady"),
      //body: data,
    });
    setShow(true);

    //msg = data.replace(/.*\s_([^\s]*_(STARTED|FINISHED))_.*/, "$1").replace(/_/g," ");
    let msg = data.replace(/.*\s_([^\s]*_(STARTED|FINISHED|PAUSED|RESUMED))/, "$1");
    log.trace(`displayToast: msg after replace: ${msg}`)
    if (msg) {
      if (/PHASE/.test(msg)) {
        let encodedKey = msg.replace(/PHASE([^_]*).*/, "$1");
        let key = EKeyLib.decode(encodedKey);
        msg = "Phase " + key + " " + (msg.replace(/PHASE[^_]*(.*)/, "$1")).toLowerCase();
        log.trace(`displayToast: msg after decoding phase/key: ${msg}/${key}`);
      } else {
        msg = capitalize(msg);        
      }

      msg = msg.replace(/_/g, " ");

      toast.success(msg);
    } else {
      toast.error(data);
    }

  }

  
  useEffect(() => {
    log.trace('Subscribing to CURRENT_STEP message.');
    PubSub.subscribe('CURRENT_STEP', displayToast);

    PubSub.subscribe('CURRENT_ACTION', displayCurrentActionToast);
  }, [])
  
  return (
    <>
      { true ?
          <>
          </>
        :
          <ToastContainer position='middle-center'>
            <Toast bg='primary' onClose={() => setShow(false)} show={show} delay={3000} autohide>
              {message.headerTitle ?
                <Toast.Header>
                  <img
                    src={message.imageSrc}
                    className="rounded me-2"
                    alt=""
                    width="40px"
                  />
                  <strong className="me-auto">{message.headerTitle}</strong>
                </Toast.Header>
                :
                <></>
              }
              {message.body ?
                <Toast.Body className="text-white">
                  {message.body}
                </Toast.Body>
                :
                <></>
              }
            </Toast>
          </ToastContainer>
      }
    </>
  );
}
