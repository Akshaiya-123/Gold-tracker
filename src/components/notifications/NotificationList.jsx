'use client';

import React, { useState } from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Check,
  Send,
  Info,
} from '../icons';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatINR } from '../../lib/constants';

export const NotificationList = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenTestModal,
}) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'gold' | 'silver'

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'gold') return notif.metal === 'gold';
    if (filter === 'silver') return notif.metal === 'silver';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: `All Logs (${notifications.length})` },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'gold', label: 'Gold Alerts' },
            { id: 'silver', label: 'Silver Alerts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" icon={Check} onClick={onMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
          <Button variant="gold" size="sm" icon={Send} onClick={onOpenTestModal}>
            Send Test Alert
          </Button>
        </div>
      </div>

      {/* Notifications Table / Cards */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No notifications</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            When your configured price alerts are triggered by live market rates, the dispatch records will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {filteredNotifications.map((n) => {
            const isAbove = n.condition === 'above';
            const dateStr = new Date(n.createdAt).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            });

            return (
              <div
                key={n.id}
                onClick={() => onMarkAsRead(n.id)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors cursor-pointer ${
                  !n.isRead ? 'bg-[#FFF9EB]/40 hover:bg-[#FFF9EB]/70' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  {/* Status Indicator Icon */}
                  <span
                    className={`mt-0.5 p-2 rounded-xl shrink-0 ${
                      isAbove
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {isAbove ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </span>

                  {/* Body Content */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#D6A84F]" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {n.message}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span>{dateStr}</span>
                      <span>•</span>
                      <span>Target: {formatINR(n.targetPrice, n.metal === 'silver')}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-600">
                        Triggered at: {formatINR(n.currentPrice, n.metal === 'silver')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Channel Badges */}
                <div className="flex sm:flex-col items-center sm:items-end gap-1.5 self-end sm:self-center shrink-0">
                  <div className="flex items-center gap-1.5">
                    {n.channels?.includes('email') && (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          n.deliveryStatus?.email === 'sent'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Mail className="w-3 h-3" /> Email Sent
                      </span>
                    )}

                    {n.channels?.includes('sms') && (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          n.deliveryStatus?.sms === 'sent'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Smartphone className="w-3 h-3" /> SMS Delivered
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DLT Indian Regulatory Compliance Notice */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-[#D6A84F] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">TRAI & Indian DLT SMS Compliance:</span>{' '}
          In India, SMS delivery follows Telecom Regulatory Authority of India (TRAI) guidelines. Automated price alert templates (DLT Principle Entity & Header ID registered) guarantee instant delivery without blocking by telecom operators.
        </div>
      </div>
    </div>
  );
};
