import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const TaskReminder = ({ userId, setNotifications }) => {
    useEffect(() => {
        if (!userId) return;

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:9090/ws'),
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/notifications/${userId}`, (message) => {
                    const notification = JSON.parse(message.body);
                    setNotifications(prev => [...prev, notification]);
                });
            }
        });

        client.activate();
        return () => client.deactivate();
    }, [userId, setNotifications]);

    return null;
};

export default TaskReminder;