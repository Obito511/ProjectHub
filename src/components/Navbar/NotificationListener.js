import React, { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const NotificationListener = ({ userId, setNotifications }) => {
  const stompClientRef = useRef(null);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!userId) return;

    const connectWebSocket = () => {
      const socket = new SockJS('http://localhost:9090/ws');
      const client = Stomp.over(socket);
      stompClientRef.current = client;

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      client.connect(headers, (frame) => {
        console.log('Connected:', frame);
        connectedRef.current = true;

        // Subscribe to user-specific notification topic
        client.subscribe(`/user/${userId}/notifications`, (message) => {
          try {
            const notification = JSON.parse(message.body);
            // Update notifications state with new notification
            setNotifications((prev) => [...prev, notification]);
          } catch (e) {
            console.error('Error parsing notification:', e);
          }
        });
      }, (error) => {
        console.error('Connection error:', error);
        connectedRef.current = false;
      });
    };

    const loadNotifications = () => {
      const token = localStorage.getItem('token');

      fetch(`http://localhost:9090/api/notifications/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch notifications');
          }
          console.log(response.data);
          return response.json();
        })
        .then((data) => {
          // Ensure data is an array and map to expected format if needed
          setNotifications(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          console.error('Error loading notifications:', error);
        });
    };

    // Connect to WebSocket and load initial notifications
    connectWebSocket();
    loadNotifications();

    // Cleanup on unmount
    return () => {
      if (stompClientRef.current && connectedRef.current) {
        stompClientRef.current.disconnect();
        connectedRef.current = false;
        console.log('Disconnected from WebSocket');
      }
    };
  }, [userId, setNotifications]);

  return null;
};

export default NotificationListener;