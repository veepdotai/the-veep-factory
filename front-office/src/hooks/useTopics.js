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

export default function useTopics = ( cookies, _title, _option, _topic) => {
  const option = _option;
  const getData = (topic, data) => {
      let conf = getService(cookies, option)
      fetch(conf.service, conf.options)
          .then((res) => {
              return res.json()
          }).then((data) => {
              console.log(JSON.stringify(data));
              setState({
                  content: data[option],
                  copied: false
              })
          })
  }

  const wait = (topic, data) => {
      setWaiting(true);
  }

  useEffect(() => {
      console.log('Subscribing to ' + _topic + "STARTED_");
      PubSub.subscribe(_topic + "STARTED_", wait);

      console.log('Subscribing to ' + _topic + "FINISHED_");
      PubSub.subscribe(_topic + "FINISHED_", getData);
      //display( message, 'progressiveContent');
  }, [])
*/

}

