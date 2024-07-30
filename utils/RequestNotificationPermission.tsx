"use client";

import React, { useEffect } from 'react';

const RequestNotificationPermission = () => {
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }
  }, []);

  return null;
};

export default RequestNotificationPermission;
