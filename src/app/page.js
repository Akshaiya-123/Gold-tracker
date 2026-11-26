'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PriceCard } from '../components/dashboard/PriceCard';
import { InteractiveChart } from '../components/dashboard/InteractiveChart';
import { MarketSummary } from '../components/dashboard/MarketSummary';
import { RecentAlertsCard } from '../components/dashboard/RecentAlertsCard';
import { JewelleryCalculator } from '../components/dashboard/JewelleryCalculator';
import { AlertList } from '../components/alerts/AlertList';
import { AlertModal } from '../components/alerts/AlertModal';
import { NotificationList } from '../components/notifications/NotificationList';
import { TestNotificationModal } from '../components/notifications/TestNotificationModal';
import { PriceHistoryTable } from '../components/history/PriceHistoryTable';
import { WatchlistView } from '../components/watchlist/WatchlistView';
import { SettingsView } from '../components/settings/SettingsView';
import { ProfileView } from '../components/profile/ProfileView';
import { useToast } from '../components/ui/Toast';
import { api } from '../lib/api';
import { formatINR } from '../lib/constants';
import {
  Bell,
  RefreshCw,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
  Shield,
  Plus,
} from '../components/icons';
import { Button } from '../components/ui/Button';

export default function Home() {
  const { addToast } = useToast();

  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Data States
  const [prices, setPrices] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [user, setUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal States
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [alertInitialValues, setAlertInitialValues] = useState(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  // Selected metal for summary
  const [selectedSummaryMetal, setSelectedSummaryMetal] = useState('gold');
  const [selectedSummaryPurity, setSelectedSummaryPurity] = useState('24K');

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      const [currentPrices, currentAlerts, currentNotifs, currentUser, currentWatchlist] =
        await Promise.all([
          api.getCurrentPrices(),
          api.getAlerts(),
          api.getNotifications(),
          api.getUserProfile(),
          api.getWatchlist(),
        ]);

      setPrices(currentPrices);
      setAlerts(currentAlerts);
      setNotifications(currentNotifs);
      setUser(currentUser);
      setWatchlist(currentWatchlist);
    } catch (err) {
      console.error('Failed to load application data:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Periodic price monitor & smart alert checker (Simulates backend cron monitoring in frontend)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!prices || alerts.length === 0) return;

      // Check active alerts against current prices
      let updatedAlerts = [...alerts];
      let newDispatches = [];

      alerts.forEach((alert) => {
        if (!alert.isActive || alert.status === 'triggered') return;

        const currentPrice =
          alert.metal === 'gold'
            ? prices.gold?.[alert.purity]?.pricePerGram
            : prices.silver?.silver?.pricePerGram;

        if (!currentPrice) return;

        const isTriggered =
          alert.condition === 'above'
            ? currentPrice >= alert.targetPrice
            : currentPrice <= alert.targetPrice;

        if (isTriggered) {
          // Flag alert as triggered
          updatedAlerts = updatedAlerts.map((a) =>
            a.id === alert.id
              ? { ...a, status: 'triggered', lastTriggeredAt: new Date().toISOString() }
              : a
          );

          const notif = {
            id: `notif-${Date.now()}-${alert.id}`,
            alertId: alert.id,
            title: `${alert.metal === 'gold' ? `${alert.purity} Gold` : 'Silver'} Target Reached!`,
            message: `${alert.metal === 'gold' ? `${alert.purity} Gold` : 'Silver'} reached ${formatINR(
              currentPrice,
              alert.metal === 'silver'
            )}/g (target: ${formatINR(alert.targetPrice, alert.metal === 'silver')}/g).`,
            metal: alert.metal,
            purity: alert.purity,
            condition: alert.condition,
            currentPrice,
            targetPrice: alert.targetPrice,
            unit: alert.unit,
            channels: alert.channels,
            deliveryStatus: {
              email: alert.channels.includes('email') ? 'sent' : 'skipped',
              sms: alert.channels.includes('sms') ? 'sent' : 'skipped',
            },
            isRead: false,
            createdAt: new Date().toISOString(),
          };

          newDispatches.push(notif);

          // Trigger toast
          addToast({
            title: `Price Alert Reached!`,
            message: notif.message,
            type: alert.condition === 'above' ? 'success' : 'danger',
          });
        }
      });

      if (newDispatches.length > 0) {
        setAlerts(updatedAlerts);
        setNotifications((prev) => [...newDispatches, ...prev]);
      }
    }, 15000); // Check every 15s

    return () => clearInterval(interval);
  }, [prices, alerts, addToast]);

  // Refresh Prices handler
  const handleRefreshPrices = async () => {
    setIsRefreshing(true);
    try {
      const refreshedPrices = await api.getCurrentPrices();
      setPrices(refreshedPrices);
      addToast({
        title: 'Market Rates Updated',
        message: 'Loaded the latest IBJA benchmark and MCX spot prices.',
        type: 'success',
      });
    } catch (e) {
      addToast({
        title: 'Update Failed',
        message: 'Could not fetch live rates. Using cached prices.',
        type: 'danger',
      });
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  // Alert Actions
  const handleSaveAlert = async (alertData) => {
    try {
      if (alertData.id) {
        const updated = await api.updateAlert(alertData.id, alertData);
        setAlerts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        addToast({
          title: 'Alert Updated',
          message: 'Your price alert conditions have been updated successfully.',
          type: 'success',
        });
      } else {
        const created = await api.createAlert(alertData);
        setAlerts((prev) => [created, ...prev]);
        addToast({
          title: 'Alert Activated',
          message: `Monitoring ${alertData.metal.toUpperCase()} for ₹${alertData.targetPrice}. You will be notified automatically.`,
          type: 'success',
        });
      }
    } catch (e) {
      addToast({
        title: 'Action Failed',
        message: 'Unable to save alert. Please try again.',
        type: 'danger',
      });
    }
  };

  const handleDeleteAlert = async (id) => {
    await api.deleteAlert(id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    addToast({
      title: 'Alert Removed',
      message: 'The price alert has been deleted.',
      type: 'info',
    });
  };

  const handleToggleAlert = async (id) => {
    const updated = await api.toggleAlert(id);
    if (updated) {
      setAlerts((prev) => prev.map((a) => (a.id === id ? updated : a)));
      addToast({
        title: updated.isActive ? 'Alert Resumed' : 'Alert Paused',
        message: `Alert is now ${updated.isActive ? 'active and monitoring' : 'paused'}.`,
        type: 'info',
      });
    }
  };

  const handleReactivateAlert = async (id) => {
    const updated = await api.reactivateAlert(id);
    if (updated) {
      setAlerts((prev) => prev.map((a) => (a.id === id ? updated : a)));
      addToast({
        title: 'Alert Reactivated',
        message: 'The alert has been reset and is now monitoring prices again.',
        type: 'success',
      });
    }
  };

  const handleOpenAlertForMetal = ({ metal, purity, currentPrice }) => {
    setEditingAlert(null);
    setAlertInitialValues({ metal, purity, currentPrice });
    setIsAlertModalOpen(true);
  };

  // Notification Actions
  const handleMarkAsRead = async (id) => {
    const updated = await api.markNotificationRead(id);
    setNotifications(updated);
  };

  const handleMarkAllAsRead = async () => {
    const updated = await api.markAllNotificationsRead();
    setNotifications(updated);
    addToast({
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.',
      type: 'info',
    });
  };

  const handleSendTestNotification = async (channel) => {
    const res = await api.sendTestNotification(channel);
    if (res.success) {
      setNotifications((prev) => [res.notification, ...prev]);
      addToast({
        title: 'Test Notification Sent',
        message: `Simulated dispatch to ${channel.toUpperCase()} successfully.`,
        type: 'success',
      });
    }
  };

  // Watchlist Actions
  const handleAddToWatchlist = async (item) => {
    const newItem = await api.addToWatchlist(item);
    setWatchlist((prev) => [newItem, ...prev]);
    addToast({
      title: 'Added to Watchlist',
      message: `${item.note} added to your tracking goals.`,
      type: 'success',
    });
  };

  const handleRemoveFromWatchlist = async (id) => {
    await api.removeFromWatchlist(id);
    setWatchlist((prev) => prev.filter((i) => i.id !== id));
    addToast({
      title: 'Removed',
      message: 'Goal removed from watchlist.',
      type: 'info',
    });
  };

  // User Actions
  const handleUpdateProfile = async (userData) => {
    const updated = await api.updateUserProfile(userData);
    setUser(updated);
    addToast({
      title: 'Profile Updated',
      message: 'Your account details have been saved.',
      type: 'success',
    });
  };

  const handleUpdatePreferences = async (preferences) => {
    const updated = await api.updateUserPreferences(preferences);
    setUser(updated);
    addToast({
      title: 'Preferences Saved',
      message: 'Notification settings successfully updated.',
      type: 'success',
    });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadCount={unreadCount}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Header */}
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenCreateAlert={() => {
            setEditingAlert(null);
            setAlertInitialValues(null);
            setIsAlertModalOpen(true);
          }}
          unreadCount={unreadCount}
          notifications={notifications}
          onSelectTab={setActiveTab}
          onRefreshPrices={handleRefreshPrices}
          isRefreshing={isRefreshing}
          user={user}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* ============================================================== */}
          {/* TAB 1: DASHBOARD */}
          {/* ============================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Hero Banner / Market Status Overview */}
              <div className="navy-gradient rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D6A84F] text-xs font-semibold backdrop-blur-sm mb-3">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Live India Commodity & Bullion Index</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      India Gold & Silver Spot Rates
                    </h1>
                    <p className="text-slate-300 text-xs sm:text-sm max-w-xl mt-1.5 leading-relaxed">
                      Real-time market monitoring for 24K, 22K, 18K Gold and 999 Fine Silver with automated price alert notifications via SMS and Email.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="gold"
                      icon={Plus}
                      onClick={() => {
                        setEditingAlert(null);
                        setAlertInitialValues(null);
                        setIsAlertModalOpen(true);
                      }}
                    >
                      Set Price Alert
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      icon={RefreshCw}
                      onClick={handleRefreshPrices}
                      loading={isRefreshing}
                    >
                      Refresh Rates
                    </Button>
                  </div>
                </div>

                {/* Decorative background glow */}
                <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-[#D6A84F]/10 blur-3xl pointer-events-none" />
              </div>

              {/* B. Gold Price Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">
                      Gold Spot Prices (India)
                    </h2>
                    <p className="text-xs text-slate-500">Benchmark rates in INR per gram</p>
                  </div>
                  <span className="text-xs font-semibold text-[#9A6F20] bg-[#FAF4E6] px-2.5 py-1 rounded-full border border-[#E8D4A2]">
                    IBJA Hallmark Rates
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PriceCard
                    metal="gold"
                    purity="24K"
                    title="24K Pure Gold"
                    subtitle="99.9% Pure Bullion & Coins"
                    pricePerGram={prices?.gold?.['24K']?.pricePerGram || 8050}
                    priceUnitLabel="gram"
                    previousDayPrice={prices?.gold?.['24K']?.previousDayPrice || 7990}
                    priceChange={prices?.gold?.['24K']?.change || 60}
                    percentageChange={prices?.gold?.['24K']?.percentageChange || 0.75}
                    lastUpdated={prices?.gold?.['24K']?.lastUpdated}
                    onOpenAlertForMetal={handleOpenAlertForMetal}
                  />

                  <PriceCard
                    metal="gold"
                    purity="22K"
                    title="22K Standard Gold"
                    subtitle="91.6% Hallmark Jewellery Standard"
                    pricePerGram={prices?.gold?.['22K']?.pricePerGram || 7380}
                    priceUnitLabel="gram"
                    previousDayPrice={prices?.gold?.['22K']?.previousDayPrice || 7325}
                    priceChange={prices?.gold?.['22K']?.change || 55}
                    percentageChange={prices?.gold?.['22K']?.percentageChange || 0.75}
                    lastUpdated={prices?.gold?.['22K']?.lastUpdated}
                    onOpenAlertForMetal={handleOpenAlertForMetal}
                  />

                  <PriceCard
                    metal="gold"
                    purity="18K"
                    title="18K Fine Gold"
                    subtitle="75.0% Diamond Jewellery Standard"
                    pricePerGram={prices?.gold?.['18K']?.pricePerGram || 6040}
                    priceUnitLabel="gram"
                    previousDayPrice={prices?.gold?.['18K']?.previousDayPrice || 5995}
                    priceChange={prices?.gold?.['18K']?.change || 45}
                    percentageChange={prices?.gold?.['18K']?.percentageChange || 0.75}
                    lastUpdated={prices?.gold?.['18K']?.lastUpdated}
                    onOpenAlertForMetal={handleOpenAlertForMetal}
                  />
                </div>
              </div>

              {/* B. Silver Price Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">
                      Silver Spot Prices (India)
                    </h2>
                    <p className="text-xs text-slate-500">
                      999 Fine Silver rates across units
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    MCX Silver Benchmark
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PriceCard
                    metal="silver"
                    purity="silver"
                    title="Silver (1 Gram)"
                    subtitle="99.9% Fine Silver Spot"
                    pricePerGram={prices?.silver?.silver?.pricePerGram || 98.50}
                    priceUnitLabel="gram"
                    previousDayPrice={prices?.silver?.silver?.previousDayPrice || 99.80}
                    priceChange={prices?.silver?.silver?.change || -1.30}
                    percentageChange={prices?.silver?.silver?.percentageChange || -1.30}
                    lastUpdated={prices?.silver?.silver?.lastUpdated}
                    onOpenAlertForMetal={handleOpenAlertForMetal}
                  />

                  <PriceCard
                    metal="silver"
                    purity="silver"
                    title="Silver (10 Grams / 1 Tola)"
                    subtitle="Standard Retail Unit"
                    pricePerGram={prices?.silver?.silver?.price10Grams || 985.00}
                    priceUnitLabel="10 grams"
                    previousDayPrice={(prices?.silver?.silver?.previousDayPrice || 99.80) * 10}
                    priceChange={(prices?.silver?.silver?.change || -1.30) * 10}
                    percentageChange={prices?.silver?.silver?.percentageChange || -1.30}
                    lastUpdated={prices?.silver?.silver?.lastUpdated}
                    onOpenAlertForMetal={handleOpenAlertForMetal}
                  />

                  <PriceCard
                    metal="silver"
                    purity="silver"
                    title="Silver (1 Kilogram)"
                    subtitle="Industrial & Bullion Bar Unit"
                    pricePerGram={prices?.silver?.silver?.priceKg || 98500}
                    priceUnitLabel="kilogram"
                    previousDayPrice={(prices?.silver?.silver?.previousDayPrice || 99.80) * 1000}
                    priceChange={(prices?.silver?.silver?.change || -1.30) * 1000}
                    percentageChange={prices?.silver?.silver?.percentageChange || -1.30}
                    lastUpdated={prices?.silver?.silver?.lastUpdated}
                    onOpenAlertForMetal={handleOpenAlertForMetal}
                  />
                </div>
              </div>

              {/* C. Interactive Price Movement Chart */}
              <InteractiveChart
                initialMetal="gold"
                initialPurity="24K"
                onMetalChange={(m, p) => {
                  setSelectedSummaryMetal(m);
                  setSelectedSummaryPurity(p);
                }}
              />

              {/* D & E: Market Summary & Recent Alerts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <MarketSummary
                    metal={selectedSummaryMetal}
                    purity={selectedSummaryPurity}
                    data={
                      selectedSummaryMetal === 'gold'
                        ? prices?.gold?.[selectedSummaryPurity]
                        : prices?.silver?.silver
                    }
                  />
                </div>

                <div className="lg:col-span-1">
                  <RecentAlertsCard
                    alerts={alerts}
                    onNavigateToAlerts={() => setActiveTab('alerts')}
                  />
                </div>
              </div>

              {/* Consumer Utility: Jewellery Calculator */}
              <JewelleryCalculator prices={prices} />
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: PRICE HISTORY */}
          {/* ============================================================== */}
          {activeTab === 'history' && (
            <div className="animate-in fade-in duration-200 space-y-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Historical Price Movement
                </h1>
                <p className="text-xs text-slate-500">
                  Comprehensive audit logs and historical bullion price trends in India
                </p>
              </div>
              <PriceHistoryTable />
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: PRICE ALERTS */}
          {/* ============================================================== */}
          {activeTab === 'alerts' && (
            <div className="animate-in fade-in duration-200 space-y-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Price Alert Management
                </h1>
                <p className="text-xs text-slate-500">
                  Configure smart condition alerts for instant Email and SMS notification
                </p>
              </div>
              <AlertList
                alerts={alerts}
                currentPrices={prices}
                onOpenCreateAlert={() => {
                  setEditingAlert(null);
                  setAlertInitialValues(null);
                  setIsAlertModalOpen(true);
                }}
                onEditAlert={(alert) => {
                  setEditingAlert(alert);
                  setIsAlertModalOpen(true);
                }}
                onDeleteAlert={handleDeleteAlert}
                onToggleAlert={handleToggleAlert}
                onReactivateAlert={handleReactivateAlert}
              />
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: NOTIFICATIONS */}
          {/* ============================================================== */}
          {activeTab === 'notifications' && (
            <div className="animate-in fade-in duration-200 space-y-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Notification Center & Delivery Logs
                </h1>
                <p className="text-xs text-slate-500">
                  Audit trail of all triggered price conditions dispatched via Email & SMS
                </p>
              </div>
              <NotificationList
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onOpenTestModal={() => setIsTestModalOpen(true)}
              />
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: WATCHLIST */}
          {/* ============================================================== */}
          {activeTab === 'watchlist' && (
            <div className="animate-in fade-in duration-200 space-y-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Bullion Purchase Watchlist
                </h1>
                <p className="text-xs text-slate-500">
                  Track specific jewellery purchases, gold coins, and silver accumulation targets
                </p>
              </div>
              <WatchlistView
                watchlist={watchlist}
                currentPrices={prices}
                onAddToWatchlist={handleAddToWatchlist}
                onRemoveFromWatchlist={handleRemoveFromWatchlist}
                onOpenCreateAlert={handleOpenAlertForMetal}
              />
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 6: SETTINGS */}
          {/* ============================================================== */}
          {activeTab === 'settings' && (
            <div className="animate-in fade-in duration-200 space-y-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Application Settings
                </h1>
                <p className="text-xs text-slate-500">
                  Configure delivery preferences, polling intervals, and Indian DLT SMS details
                </p>
              </div>
              <SettingsView
                user={user}
                onUpdatePreferences={handleUpdatePreferences}
              />
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 7: PROFILE */}
          {/* ============================================================== */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in duration-200 space-y-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  My Profile & Credentials
                </h1>
                <p className="text-xs text-slate-500">
                  Manage personal information, phone verification, and account password
                </p>
              </div>
              <ProfileView
                user={user}
                onUpdateProfile={handleUpdateProfile}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Global Modals */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => {
          setIsAlertModalOpen(false);
          setEditingAlert(null);
          setAlertInitialValues(null);
        }}
        onSubmit={handleSaveAlert}
        editAlert={editingAlert}
        initialValues={alertInitialValues}
        currentPrices={prices}
      />

      <TestNotificationModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onSendTest={handleSendTestNotification}
      />
    </div>
  );
}
