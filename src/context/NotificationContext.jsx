import React, { createContext, useContext, useState, useCallback } from 'react';
import { storage } from '@/lib/dataStore';
import { STORAGE_KEYS } from '@/lib/constants';

const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  removeNotification: () => {},
});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    return storage.get(STORAGE_KEYS.NOTIFICATIONS, []);
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const persist = (updated) => {
    setNotifications(updated);
    storage.set(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  const addNotification = useCallback((notification) => {
    const newNotification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    persist([newNotification, ...notifications]);
  }, [notifications]);

  const markAsRead = useCallback((id) => {
    persist(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  }, [notifications]);

  const markAllAsRead = useCallback(() => {
    persist(notifications.map(n => ({ ...n, read: true })));
  }, [notifications]);

  const removeNotification = useCallback((id) => {
    persist(notifications.filter(n => n.id !== id));
  }, [notifications]);

  return (
      <NotificationContext.Provider value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
      }}>
        {children}
      </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);