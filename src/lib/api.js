import {
  getStoredPrices,
  setStoredPrices,
  getStoredAlerts,
  setStoredAlerts,
  getStoredNotifications,
  setStoredNotifications,
  getStoredUser,
  setStoredUser,
  getStoredWatchlist,
  setStoredWatchlist,
} from './storage';
import { generateChartData } from './mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Smart API client: attempts to query backend API first,
 * and seamlessly provides local mock/storage data if backend is offline or loading.
 */
export const api = {
  // Check if live backend server is reachable
  async checkBackendHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return { online: true, url: API_BASE_URL };
      }
    } catch (e) {
      // Backend is offline, graceful fallback
    }
    return { online: false, url: API_BASE_URL };
  },

  // 1. Current Prices
  async getCurrentPrices() {
    try {
      const res = await fetch(`${API_BASE_URL}/prices/current`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStoredPrices(json.data);
          return json.data;
        }
      }
    } catch (e) {
      // Return local cache / simulated live prices
    }
    return getStoredPrices();
  },

  // 2. Historical Chart Data
  async getHistoricalData(metal = 'gold', purity = '24K', timeframe = '30d') {
    try {
      const res = await fetch(`${API_BASE_URL}/prices/history?metal=${metal}&purity=${purity}&timeframe=${timeframe}`, {
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {
      // Generate chart points
    }
    return generateChartData(metal, purity, timeframe);
  },

  // 3. Alerts API
  async getAlerts() {
    try {
      const res = await fetch(`${API_BASE_URL}/alerts`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStoredAlerts(json.data);
          return json.data;
        }
      }
    } catch (e) {}
    return getStoredAlerts();
  },

  async createAlert(alertData) {
    const newAlert = {
      ...alertData,
      id: `alt-${Date.now()}`,
      isActive: true,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastTriggeredAt: null,
      lastPriceSeen: null,
    };
    try {
      const res = await fetch(`${API_BASE_URL}/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (e) {}

    const alerts = getStoredAlerts();
    const updated = [newAlert, ...alerts];
    setStoredAlerts(updated);
    return newAlert;
  },

  async updateAlert(id, updates) {
    const alerts = getStoredAlerts();
    const updated = alerts.map((a) => (a.id === id ? { ...a, ...updates } : a));
    setStoredAlerts(updated);
    return updated.find((a) => a.id === id);
  },

  async toggleAlert(id) {
    const alerts = getStoredAlerts();
    const alert = alerts.find((a) => a.id === id);
    if (!alert) return null;
    const updated = alerts.map((a) =>
      a.id === id
        ? {
            ...a,
            isActive: !a.isActive,
            status: !a.isActive ? 'active' : 'disabled',
          }
        : a
    );
    setStoredAlerts(updated);
    return updated.find((a) => a.id === id);
  },

  async deleteAlert(id) {
    const alerts = getStoredAlerts();
    const filtered = alerts.filter((a) => a.id !== id);
    setStoredAlerts(filtered);
    return { success: true };
  },

  async reactivateAlert(id) {
    const alerts = getStoredAlerts();
    const updated = alerts.map((a) =>
      a.id === id ? { ...a, isActive: true, status: 'active', lastTriggeredAt: null } : a
    );
    setStoredAlerts(updated);
    return updated.find((a) => a.id === id);
  },

  // 4. Notifications API
  async getNotifications() {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStoredNotifications(json.data);
          return json.data;
        }
      }
    } catch (e) {}
    return getStoredNotifications();
  },

  async markNotificationRead(id) {
    const notifs = getStoredNotifications();
    const updated = notifs.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setStoredNotifications(updated);
    return updated;
  },

  async markAllNotificationsRead() {
    const notifs = getStoredNotifications();
    const updated = notifs.map((n) => ({ ...n, isRead: true }));
    setStoredNotifications(updated);
    return updated;
  },

  async sendTestNotification(channel = 'email') {
    const notif = {
      id: `test-${Date.now()}`,
      alertId: null,
      title: 'Test Notification Delivered!',
      message: `Your ${channel.toUpperCase()} alerts are configured properly for Gold & Silver Tracker.`,
      metal: 'gold',
      purity: '24K',
      condition: 'test',
      currentPrice: 8050,
      targetPrice: 8050,
      unit: 'per_gram',
      channels: [channel],
      deliveryStatus: {
        email: channel === 'email' || channel === 'both' ? 'sent' : 'skipped',
        sms: channel === 'sms' || channel === 'both' ? 'sent' : 'skipped',
      },
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const notifs = getStoredNotifications();
    const updated = [notif, ...notifs];
    setStoredNotifications(updated);
    return { success: true, notification: notif };
  },

  // 5. User Profile & Preferences
  async getUserProfile() {
    return getStoredUser();
  },

  async updateUserProfile(userData) {
    const current = getStoredUser();
    const updated = { ...current, ...userData };
    setStoredUser(updated);
    return updated;
  },

  async updateUserPreferences(preferences) {
    const user = getStoredUser();
    const updated = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences,
      },
    };
    setStoredUser(updated);
    return updated;
  },

  // 6. Watchlist API
  async getWatchlist() {
    return getStoredWatchlist();
  },

  async addToWatchlist(item) {
    const items = getStoredWatchlist();
    const newItem = {
      ...item,
      id: `wl-${Date.now()}`,
      addedAt: new Date().toISOString(),
    };
    const updated = [newItem, ...items];
    setStoredWatchlist(updated);
    return newItem;
  },

  async removeFromWatchlist(id) {
    const items = getStoredWatchlist();
    const updated = items.filter((i) => i.id !== id);
    setStoredWatchlist(updated);
    return { success: true };
  },
};
