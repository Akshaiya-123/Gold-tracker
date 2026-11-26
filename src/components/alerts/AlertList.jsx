'use client';

import React, { useState } from 'react';
import {
  Bell,
  Trash2,
  Edit3,
  RefreshCw,
  Mail,
  Smartphone,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
} from '../icons';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { formatINR, UNIT_LABELS } from '../../lib/constants';

export const AlertList = ({
  alerts = [],
  currentPrices,
  onOpenCreateAlert,
  onEditAlert,
  onDeleteAlert,
  onToggleAlert,
  onReactivateAlert,
}) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'triggered' | 'disabled'
  const [deleteAlertId, setDeleteAlertId] = useState(null);

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'active') return alert.isActive && alert.status !== 'triggered';
    if (filter === 'triggered') return alert.status === 'triggered' || alert.lastTriggeredAt;
    if (filter === 'disabled') return !alert.isActive;
    return true;
  });

  const confirmDelete = () => {
    if (deleteAlertId) {
      onDeleteAlert(deleteAlertId);
      setDeleteAlertId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar: Filters + New Alert */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: `All Alerts (${alerts.length})` },
            { id: 'active', label: `Active (${alerts.filter((a) => a.isActive && a.status !== 'triggered').length})` },
            { id: 'triggered', label: `Triggered (${alerts.filter((a) => a.status === 'triggered' || a.lastTriggeredAt).length})` },
            { id: 'disabled', label: `Disabled (${alerts.filter((a) => !a.isActive).length})` },
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

        <Button variant="gold" icon={Plus} onClick={onOpenCreateAlert}>
          Create New Alert
        </Button>
      </div>

      {/* Alert Cards Grid / Empty State */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D6A84F] flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No alerts found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {filter === 'all'
              ? 'You have not set up any price alerts yet. Configure alerts to receive instant notifications via SMS & Email.'
              : `No alerts currently match the "${filter}" filter.`}
          </p>
          <div className="mt-5">
            <Button variant="gold" size="sm" icon={Plus} onClick={onOpenCreateAlert}>
              Create Price Alert
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAlerts.map((alert) => {
            const isGold = alert.metal === 'gold';
            const currentSpotPrice = isGold
              ? currentPrices?.gold?.[alert.purity]?.pricePerGram || 8050
              : currentPrices?.silver?.silver?.pricePerGram || 98.50;

            const priceDiff = Math.abs(currentSpotPrice - alert.targetPrice);
            const isTriggered = alert.status === 'triggered' || !!alert.lastTriggeredAt;
            const isConditionMet =
              alert.condition === 'above'
                ? currentSpotPrice >= alert.targetPrice
                : currentSpotPrice <= alert.targetPrice;

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-sm ${
                  isTriggered
                    ? 'border-amber-300/80 bg-amber-50/20'
                    : alert.isActive
                    ? 'border-slate-200 hover:border-slate-300'
                    : 'border-slate-200/60 opacity-70 bg-slate-50/50'
                }`}
              >
                {/* Header row: Metal badge, condition tag, Toggle switch */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isGold ? 'gold-badge text-slate-950' : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {isGold ? alert.purity : 'Ag'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {isGold ? `${alert.purity} Gold` : '999 Fine Silver'}
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        {UNIT_LABELS[alert.unit] || 'Per Gram'}
                      </span>
                    </div>
                  </div>

                  {/* Active Toggle Switch */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-500">
                      {alert.isActive ? 'Active' : 'Paused'}
                    </span>
                    <button
                      onClick={() => onToggleAlert(alert.id)}
                      className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                        alert.isActive ? 'bg-[#D6A84F] justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </button>
                  </div>
                </div>

                {/* Target Condition Banner */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Target Threshold
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {alert.condition === 'above' ? 'Crosses Above ' : 'Drops Below '}
                      {formatINR(alert.targetPrice, alert.metal === 'silver')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-medium text-slate-500 block">
                      Current Spot Rate
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {formatINR(currentSpotPrice, alert.metal === 'silver')}
                    </span>
                  </div>
                </div>

                {/* Status indicator & channels */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
                  {/* Channels Badge */}
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span className="text-[11px]">Channels:</span>
                    {alert.channels?.includes('email') && (
                      <span className="p-1 rounded bg-slate-100 text-slate-700" title="Email Alert">
                        <Mail className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {alert.channels?.includes('sms') && (
                      <span className="p-1 rounded bg-slate-100 text-slate-700" title="SMS Alert">
                        <Smartphone className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  {isTriggered ? (
                    <Badge variant="warning" size="xs">
                      Triggered {alert.lastTriggeredAt ? 'Recently' : ''}
                    </Badge>
                  ) : alert.isActive ? (
                    <Badge variant="success" size="xs">
                      Monitoring Live
                    </Badge>
                  ) : (
                    <Badge variant="neutral" size="xs">
                      Disabled
                    </Badge>
                  )}
                </div>

                {/* Card Actions: Reactivate (if triggered), Edit, Delete */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  {isTriggered ? (
                    <button
                      onClick={() => onReactivateAlert(alert.id)}
                      className="text-xs font-bold text-[#9A6F20] hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Reactivate Alert
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      Created on {new Date(alert.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditAlert(alert)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Alert"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteAlertId(alert.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Destructive Action Confirmation Dialog */}
      <Modal
        isOpen={!!deleteAlertId}
        onClose={() => setDeleteAlertId(null)}
        title="Delete Price Alert?"
        subtitle="This action will permanently stop price monitoring for this condition."
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to delete this alert? You will no longer receive automated email or SMS notifications when this price condition is reached.
          </p>
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteAlertId(null)}>
              Keep Alert
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
