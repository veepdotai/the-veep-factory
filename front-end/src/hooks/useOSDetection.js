import { useState, useEffect } from 'react';

const useOSDetection = () => {
  const [device, setDevice] = useState('');

  useEffect(() => {
    const handleOSDetection = () => {
      const userAgent = navigator.userAgent.toLowerCase();

      if (/mac/i.test(userAgent)) {
        setDevice('Mac');
      } else if (/inux/i.test(userAgent)) {
        setDevice('Linux');
      } else {
        setDevice('Windows');
      }
    };

    handleOSDetection();
    window.addEventListener('resize', handleOSDetection);

    return () => {
      window.removeEventListener('resize', handleOSDetection);
    };
  }, []);

  return device;
};

export { useOSDetection}