import React, { useState, useEffect, useRef } from 'react';

/**
 * Usage
 * function Counter() {
 * let [count, setCount] = useState(0);
 *
 * useInterval(() => {
 *     setCount(count + 5);
 * }, 5000);
 *
 * return <h1>{count}</h1>;
 * }
 */

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;