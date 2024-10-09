import { Logger } from 'react-logger-lib';

import { useEffect, useState } from 'react'
import useInterval from  "src/hooks/useInterval";

import PubSub from 'pubsub-js';

import { CountdownCircleTimer } from "react-countdown-circle-timer";
import ProgressBar from "react-bootstrap/ProgressBar";

export default function WaitForIt( { duration, max = 100, viewStep = 1, errorEvent = "_ERROR_", stopEvent = "_CONTENT_GENERATION_FINISHED_" } ) {
//export default function WaitForIt( { duration, max = 100, viewStep = 1, stopEvent = "_TRANSCRIPTION_FINISHED_" } ) {
    const log = Logger.of(WaitForIt.name);

  const [progress, setProgress] = useState(1);
  const [currentSteps, setCurrentSteps] = useState(0);
  const [delay, setDelay] = useState(duration / (max / viewStep) * 1000);
  
  log.info("Duration: " + duration)
  log.info("Max: " + max)
  log.info("viewStep: " + viewStep)
  log.info("errorEvent: " + errorEvent)
  log.info("stopEvent: " + stopEvent)

  log.info("Delay: " + delay);

  function format(progress) {
    if (progress < (max - viewStep) ) {
      return (
        new Intl.NumberFormat("fr", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(progress) + ' %'
      )
    } else {
      return 'Done!'
    }
  }

  function go() {
    if (progress < (max - viewStep) ) {
      
      const getBaseLog = (base, arg) => {
        return Math.log(arg) / Math.log(base);
      };
      //var newProgress = progress + viewStep;
      
      var newProgress = progress + delay / 1000;
      var stepsNb = max / viewStep;
      var newProgressLog = Math.round(getBaseLog(stepsNb, currentSteps) * 100);
      setCurrentSteps(currentSteps + 1)

      //log.info("New progress: " + newProgress);
      log.info("New progress: " + newProgress);
      log.info("New progress log: " + newProgressLog);
      setProgress(newProgressLog < 0 ? 1 : newProgressLog);
    } else {
      log.info("Progression feedback is finished.");
      setDelay(null);
    }
  }

  useInterval(go, delay);

  useEffect(() => {
    //var stepNb = max / viewStep;
    //var newDelay = (duration / stepNb) * 1000;
    //var newDelay = 100;
    //setDelay(newDelay);
    //PubSub.subscribe(passingEvent, (topic, message) => setDelay(null));
    PubSub.subscribe(errorEvent, (topic, message) => {
      setDelay(null);
      setProgress(max);
    });

    PubSub.subscribe(stopEvent, (topic, message) => {
      setDelay(null);
      setProgress(max);
    });

  },[]);

  return (
    <ProgressBar
      style={{height: "50px"}}
      className={'ms-1 w-100'}
      now={progress}
      label={format(progress)}
      animated={progress < max ? true : false}
      variant={progress < max ? 'primary' : 'success'}
    />
  )
}

/*  
export default function WaitForIt( {duration} ) {
    const renderTime = ({ remainingTime }) => {
        if (remainingTime === 0) {
          return <div className="timer">Too late...</div>;
        }
      
        return (
          <div className="timer">
            <div className="text">Remaining</div>
            <div className="value">{remainingTime}</div>
            <div className="text">seconds</div>
          </div>
        );
    };

    const children = ({ remainingTime }) => {
        return (
          <div className="text">{remainingTime} s.</div>
        )
    }

    return (
        <CountdownCircleTimer
            isPlaying
            size={75}
            duration={duration}
            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[duration, duration*.6, duration*.3, 0]}
            onComplete={() => ({ shouldRepeat: true, delay: 1 })}
        >
            { children }
        </CountdownCircleTimer>
    )
}
*/