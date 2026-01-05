import { create } from 'zustand';

type View = 'pipeline' | 'list' | 'calendar';

interface UIStore {
  // State
  sidebarOpen: boolean;
  currentView: View;
  showAIAssistant: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: string;
  }>;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: View) => void;
  toggleAIAssistant: () => void;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state
  sidebarOpen: true,
  currentView: 'pipeline',
  showAIAssistant: false,
  notifications: [],
  
  // Toggle sidebar
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
  
  // Set sidebar state
  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },
  
  // Set current view
  setCurrentView: (view) => {
    set({ currentView: view });
  },
  
  // Toggle AI assistant
  toggleAIAssistant: () => {
    set((state) => ({ showAIAssistant: !state.showAIAssistant }));
  },
  
  // Add notification
  addNotification: (type, message) => {
    const notification = {
      id: `notif-${Date.now()}`,
      type,
      message,
      timestamp: new Date().toISOString(),
    };
    
    set((state) => ({
      notifications: [...state.notifications, notification],
    }));
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(notification.id);
    }, 5000);
  },
  
  // Remove notification
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },
  
  // Clear all notifications
  clearNotifications: () => {
    set({ notifications: [] });
  },
}));