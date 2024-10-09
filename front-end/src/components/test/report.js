import React, { useState, useEffect, useRef } from 'react';
import useInterval from  "src/hooks/useInterval";

function Counter() {
  let [count, setCount] = useState(0);

  useInterval(() => {
        setCount(count + 5);
  }, 5000);

    return <h1>{count}</h1>;
}

function getData() {

  //  http://localhost/?rest_route=/veepdotai_rest/v1/posts&JWT=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2OTY0Mjk4NDMsImlzcyI6Imh0dHA6XC9cL2xvY2FsaG9zdCIsImRhdGEiOnsidXNlciI6eyJlbWFpbCI6bnVsbCwiaWQiOjcsInVzZXJuYW1lIjpudWxsfX19.nGPLemNmcKqDq_YGrbTZ8qQHRPM986iMPaPsdIxe-7Q
};

const Report = () => {

    return (
        <>
            <h1>Test</h1>
            {Counter()}
        </>
    )
}

export default Report;