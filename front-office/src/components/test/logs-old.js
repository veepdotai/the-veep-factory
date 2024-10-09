import './Constants.js';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import dynamic from 'next/dynamic';

const LazyLog = dynamic(() => import('react-lazylog').then((mod) => mod.LazyLog), {
  ssr: false,
});
const Line = dynamic(() => import('react-lazylog').then((mod) => mod.Line), {
  ssr: false,
});

/*const IntervalExample = () => {

  useEffect(() => {
    const interval = setInterval(() => {
      getLogs();
    }, duration);
    return () => clearInterval(interval);
  }, []);

};

*/

const Logs = () => {
    const url = process.env.LOGS_URL;
    return (
        <div style={{ height: 250, width: 'auto' }}>
            <LazyLog extraLines={1} enableSearch url={url} caseInsensitive>
              <Line
                /* onRowClick="" */
              />
            </LazyLog>
        </div>
    )
};

export default Logs;
