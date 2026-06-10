import { create } from "zustand";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
}

interface NotificationState {
  notifications: AppNotification[];
  addNotification: (title: string, body: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: "welcome",
      title: "Welcome to WanderLanka! 🌴",
      body: "Start planning your dream trip to Sri Lanka. Bookmark spots and check out nearby plans on the map!",
      timestamp: Date.now(),
      read: false,
    }
  ],
  addNotification: (title, body) => set((state) => {
    // Avoid duplicates for identical recent notifications (e.g. within 5 seconds)
    const exists = state.notifications.some(
      (n) => n.title === title && n.body === body && Math.abs(Date.now() - n.timestamp) < 5000
    );
    if (exists) return state;

    return {
      notifications: [
        {
          id: Math.random().toString(),
          title,
          body,
          timestamp: Date.now(),
          read: false,
        },
        ...state.notifications
      ]
    };
  }),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true }))
  })),
  clearAll: () => set({ notifications: [] }),
}));
