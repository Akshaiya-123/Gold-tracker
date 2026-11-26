import { INITIAL_PRICES, INITIAL_ALERTS, INITIAL_NOTIFICATIONS, INITIAL_USER, INITIAL_WATCHLIST } from './mockData';

const STORAGE_KEYS = {
  PRICES: 'gold_tracker_prices',
  ALERTS: 'gold_tracker_alerts',
  NOTIFICATIONS: 'gold_tracker_notifications',
  USER: 'gold_tracker_user',
  WATCHLIST: 'gold_tracker_watchlist',
};

// Safe access to window.localStorage
const isClient = typeof window !== 'undefined';

export const getStoredPrices = () => {
  if (!isClient) return INITIAL_PRICES;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRICES);
    return data ? JSON.parse(data) : INITIAL_PRICES;
  } catch (e) {
    return INITIAL_PRICES;
  }
};

export const setStoredPrices = (prices) => {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.PRICES, JSON.stringify(prices));
  } catch (e) {
    console.error('Failed to store prices:', e);
  }
};

export const getStoredAlerts = () => {
  if (!isClient) return INITIAL_ALERTS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return data ? JSON.parse(data) : INITIAL_ALERTS;
  } catch (e) {
    return INITIAL_ALERTS;
  }
};

export const setStoredAlerts = (alerts) => {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  } catch (e) {
    console.error('Failed to store alerts:', e);
  }
};

export const getStoredNotifications = () => {
  if (!isClient) return INITIAL_NOTIFICATIONS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
};

export const setStoredNotifications = (notifications) => {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to store notifications:', e);
  }
};

export const getStoredUser = () => {
  if (!isClient) return INITIAL_USER;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : INITIAL_USER;
  } catch (e) {
    return INITIAL_USER;
  }
};

export const setStoredUser = (user) => {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to store user:', e);
  }
};

export const getStoredWatchlist = () => {
  if (!isClient) return INITIAL_WATCHLIST;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    return data ? JSON.parse(data) : INITIAL_WATCHLIST;
  } catch (e) {
    return INITIAL_WATCHLIST;
  }
};

export const setStoredWatchlist = (items) => {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to store watchlist:', e);
  }
};
