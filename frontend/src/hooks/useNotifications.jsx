import { createContext, useContext, useEffect, useState } from "react";
import { fetchUnreadNotificationCount } from "../services/api";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = async () => {
    try {
      const data = await fetchUnreadNotificationCount();
      setUnreadCount(data?.unreadCount ?? 0);
      return data?.unreadCount ?? 0;
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    void refreshUnreadCount();
  }, []);

  const markOneAsReadLocally = () => {
    setUnreadCount((current) => Math.max(0, current - 1));
  };

  const markAllAsReadLocally = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationsContext.Provider
      value={{
        unreadCount,
        refreshUnreadCount,
        markOneAsReadLocally,
        markAllAsReadLocally,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }

  return context;
}
