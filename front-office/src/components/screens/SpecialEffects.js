import { Logger } from 'react-logger-lib';
import { useState, useEffect } from 'react';
import { StyleSheet, css } from "aphrodite";

// https://animate.style/
import {Animated} from "react-animated-css";
import 'animate.css';

import { animated, useSpring } from '@react-spring/web'


// React magic
import { swap } from "react-magic";

export default function Profile() {
  const log = Logger.of(Profile.name);

  const [isVisible, setIsVisible] = useState(false);

  function toggleAnimation() {
    log.info("isVisible: " + isVisible);
    setIsVisible(!isVisible);
  }

  const styles = StyleSheet.create({
    magic: {
      animationName: swap,
      animationDuration: "3s",
    },
  });

  const FadeIn = ({ isVisible2, children }) => {
    const styles = useSpring({
      opacity: isVisible2 ? 1 : 0,
      y: isVisible2 ? 0 : 24,
    })

    return <animated.div style={styles}>{children}</animated.div>
  }

  return (
    <div>
        <div>
            <h2>Profile</h2>
            <Animated
              animationIn="animate__tada"
              animationOut="animate__rollIn"
              animationInDuration={1000}
              animationOutDuration={1000}
              isVisible={isVisible}>
              <h2>Animate.css</h2>
            </Animated>
            <button onClick={toggleAnimation}>Animate</button>
        </div>
        <div>
          <div className={css(styles.magic)}>
            <h2>React-magic</h2>
          </div>
        </div>
        <FadeIn isVisible={true}>
          <h2>React-spring</h2>
        </FadeIn>
    </div>
  )
}

 
/*
      <Animate
      enter="bounceIn" // on Enter animation
      leave="bounceOut" // on Leave animation
      appear="fadeInRight" // on element Appear animation (onMount)
      change="flipInX" // on element Change animation (onUpdate)
      durationAppear={1000}
      durationEnter={1000}
      durationLeave={1000}
      durationChange={1000}
      animate={true} // turn off/on animation, true by default
      animateChangeIf={true} // turn off/on Change only animation, true by default
      component="ul">

      {state.items.map(item => <li key={item.id}>{item.name}</li>)}

      </Animate>
*/