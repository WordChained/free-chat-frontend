import React, { useState, useEffect } from 'react';
import { eventBusService } from '../services/eventBusService';
export const UserMsg = () => {
  const [show, setShow] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  useEffect(() => {
    eventBusService.on('userMsg', ({ msg, time = 2000 }) => {
      setUserMsg(msg);
      setShow(true);
      setTimeout(() => {
        setShow(false);
        setTimeout(() => {
          setUserMsg('');
        }, time + 1000);
      }, time);
    });
    return () => {};
  }, []);

  return (
    <div className={`general-user-msg ${show ? 'show' : ''}`}>
      <p>{userMsg}</p>
    </div>
  );
};
