import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

const PushNotificationManager = () => {
  const { addNotification } = useApp();
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && permission === 'default') {
      Notification.requestPermission().then((result) => {
        setPermission(result);
      });
    }

    // Listen for push notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
          addNotification({
            id: Date.now(),
            title: event.data.title,
            body: event.data.body,
            timestamp: new Date()
          });
        }
      });
    }
  }, [addNotification, permission]);

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('The Hungry Drop', {
        body: 'Your order is being prepared!',
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png'
      });
    }
  };

  // This would typically be triggered by server events
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate order updates
      if (Math.random() > 0.95 && permission === 'granted') {
        sendTestNotification();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [permission]);

  return null; // This component doesn't render anything
};

export default PushNotificationManager;