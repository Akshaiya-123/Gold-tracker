'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Mail,
  Smartphone,
  Bell,
  Shield,
  RefreshCw,
  CheckCircle2,
  Info,
} from '../icons';
import { Button } from '../ui/Button';

export const SettingsView = ({ user, onUpdatePreferences }) => {
  const [preferences, setPreferences] = useState({
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    smsNotifications: user?.preferences?.smsNotifications ?? true,
    inAppNotifications: user?.preferences?.inAppNotifications ?? true,
    priceIncreaseAlerts: user?.preferences?.priceIncreaseAlerts ?? true,
    priceDecreaseAlerts: user?.preferences?.priceDecreaseAlerts ?? true,
    dailyMarketSummary: user?.preferences?.dailyMarketSummary ?? false,
    refreshInterval: 30, // seconds
    providerSource: 'ibja', // 'ibja' | 'goldapi' | 'metalsapi'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onUpdatePreferences(preferences);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-base font-bold text-slate-900">Notification & System Preferences</h3>
        <p className="text-xs text-slate-500">Configure how and when you receive automated price monitoring alerts</p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your preferences have been saved successfully!</span>
        </div>
      )}

      {/* 1. Notification Channels */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#D6A84F]" />
          <span>Automated Delivery Channels</span>
        </h4>

        <div className="divide-y divide-slate-100">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Email Notifications</span>
                <span className="text-[11px] text-slate-500">Receive rich HTML alerts with charts and price changes</span>
              </div>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                preferences.emailNotifications ? 'bg-[#D6A84F] justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">SMS Notifications</span>
                <span className="text-[11px] text-slate-500">Instant mobile SMS delivery via registered TRAI DLT gateways</span>
              </div>
            </div>
            <button
              onClick={() => handleToggle('smsNotifications')}
              className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                preferences.smsNotifications ? 'bg-[#D6A84F] justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">In-App Popups & Alerts</span>
                <span className="text-[11px] text-slate-500">Show notification badge and banner in dashboard</span>
              </div>
            </div>
            <button
              onClick={() => handleToggle('inAppNotifications')}
              className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                preferences.inAppNotifications ? 'bg-[#D6A84F] justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Alert Triggers */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#D6A84F]" />
          <span>Trigger Conditions</span>
        </h4>

        <div className="divide-y divide-slate-100">
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Price Dip Alerts (Going Below Target)</span>
              <span className="text-[11px] text-slate-500">Recommended for jewel buyers accumulating gold</span>
            </div>
            <button
              onClick={() => handleToggle('priceDecreaseAlerts')}
              className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                preferences.priceDecreaseAlerts ? 'bg-[#D6A84F] justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Price Surge Alerts (Going Above Target)</span>
              <span className="text-[11px] text-slate-500">Useful for profit taking or milestone tracking</span>
            </div>
            <button
              onClick={() => handleToggle('priceIncreaseAlerts')}
              className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                preferences.priceIncreaseAlerts ? 'bg-[#D6A84F] justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Daily Evening Market Recap</span>
              <span className="text-[11px] text-slate-500">Summary email of MCX & IBJA closing rates at 06:00 PM IST</span>
            </div>
            <button
              onClick={() => handleToggle('dailyMarketSummary')}
              className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                preferences.dailyMarketSummary ? 'bg-[#D6A84F] justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Market Feed & Polling Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-[#D6A84F]" />
          <span>Market Polling & API Integration</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Live Polling Frequency
            </label>
            <select
              value={preferences.refreshInterval}
              onChange={(e) => setPreferences({ ...preferences, refreshInterval: Number(e.target.value) })}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
            >
              <option value={15}>Every 15 Seconds (Ultra Live)</option>
              <option value={30}>Every 30 Seconds (Default Recommended)</option>
              <option value={60}>Every 1 Minute</option>
              <option value={300}>Every 5 Minutes (Low Bandwidth)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Benchmark Source Provider
            </label>
            <select
              value={preferences.providerSource}
              onChange={(e) => setPreferences({ ...preferences, providerSource: e.target.value })}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
            >
              <option value="ibja">IBJA Benchmark & MCX Spot India</option>
              <option value="goldapi">GoldAPI.io (Live Bullion Feed)</option>
              <option value="metalsapi">Metals-API (Multi-provider Spot)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="gold" onClick={handleSave}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
};
