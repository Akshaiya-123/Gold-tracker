'use client';

import React from 'react';
import {
  LayoutDashboard,
  Clock,
  Bell,
  Eye,
  Sliders,
  User,
  Shield,
  IndianRupee,
  RefreshCw,
} from '../icons';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'history', label: 'Price History', icon: Clock },
  { id: 'alerts', label: 'Price Alerts', icon: Bell },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: true },
  { id: 'watchlist', label: 'Watchlist', icon: Eye },
  { id: 'settings', label: 'Settings', icon: Sliders },
  { id: 'profile', label: 'Profile', icon: User },
];

export const Sidebar = ({ activeTab, onSelectTab, unreadCount = 0, isMobileOpen = false, onCloseMobile }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#101828] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl gold-badge flex items-center justify-center text-slate-950 font-black shadow-md shadow-[#D6A84F]/20">
            <span className="text-xl">Au</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-base tracking-tight leading-none">
              Gold & Silver
            </span>
            <span className="text-[11px] text-[#D6A84F] font-medium tracking-wider uppercase mt-1">
              Tracker India
            </span>
          </div>
        </div>

        {/* Live Market Status Pill */}
        <div className="mx-4 my-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Market Status</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-subtle" />
              MCX Live
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">IBJA Benchmark Rates</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-[#D6A84F] text-slate-950 font-semibold shadow-sm shadow-[#D6A84F]/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && unreadCount > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-slate-950 text-[#D6A84F]'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Trust & Security Banner */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-[#D6A84F]" />
            <span>Bank-grade 256-bit encryption</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Official India Bullion Reference</p>
        </div>
      </aside>
    </>
  );
};
