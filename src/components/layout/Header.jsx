'use client';

import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  User,
  Settings,
  ChevronDown,
} from '../icons';
import { Button } from '../ui/Button';

export const Header = ({
  onOpenMobileMenu,
  onOpenCreateAlert,
  unreadCount = 0,
  notifications = [],
  onSelectTab,
  onRefreshPrices,
  isRefreshing = false,
  user,
}) => {
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const todayDateFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Date */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Indian Bullion Market
          </span>
          <span className="text-sm font-bold text-slate-900">{todayDateFormatted}</span>
        </div>
      </div>

      {/* Right: Actions, Refresh, Notification Popover, User Profile */}
      <div className="flex items-center gap-3">
        {/* Refresh Market Rates Button */}
        <button
          onClick={onRefreshPrices}
          disabled={isRefreshing}
          title="Refresh Live Bullion Rates"
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#D6A84F]' : ''}`} />
        </button>

        {/* Quick Create Alert Button */}
        <Button
          variant="gold"
          size="sm"
          icon={Plus}
          onClick={onOpenCreateAlert}
          className="hidden sm:inline-flex"
        >
          New Alert
        </Button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotificationsDropdown(!showNotificationsDropdown);
              setShowUserDropdown(false);
            }}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotificationsDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recent Alerts ({unreadCount} unread)
                </span>
                <button
                  onClick={() => {
                    setShowNotificationsDropdown(false);
                    onSelectTab('notifications');
                  }}
                  className="text-xs font-semibold text-[#9A6F20] hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No recent notifications
                  </div>
                ) : (
                  notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setShowNotificationsDropdown(false);
                        onSelectTab('notifications');
                      }}
                      className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                        !n.isRead ? 'bg-[#FFF9EB]/40' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 p-1 rounded-md shrink-0 ${
                            n.condition === 'above'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {n.condition === 'above' ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotificationsDropdown(false);
            }}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-full bg-[#101828] text-[#D6A84F] font-bold flex items-center justify-center text-xs">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold leading-tight">
                Verified Account
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 py-1 animate-in fade-in zoom-in-95">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onSelectTab('profile');
                }}
                className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onSelectTab('settings');
                }}
                className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Notification Settings</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
