import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, ArrowRight } from '../icons';
import { formatINR } from '../../lib/constants';

export const RecentAlertsCard = ({ alerts = [], onNavigateToAlerts }) => {
  const triggeredAlerts = alerts.filter(
    (a) => a.lastTriggeredAt || a.status === 'triggered'
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Price Alerts</h3>
            <p className="text-xs text-slate-500">Triggered price conditions</p>
          </div>
        </div>

        <button
          onClick={onNavigateToAlerts}
          className="text-xs font-semibold text-[#9A6F20] hover:underline flex items-center gap-1"
        >
          Manage Alerts <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-4 divide-y divide-slate-100">
        {triggeredAlerts.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No alerts have been triggered recently. Your active alerts are monitoring live rates.
          </div>
        ) : (
          triggeredAlerts.slice(0, 3).map((alert) => (
            <div key={alert.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`p-1.5 rounded-lg shrink-0 ${
                    alert.condition === 'above'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {alert.condition === 'above' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {alert.metal === 'gold' ? `${alert.purity} Gold` : 'Fine Silver'}{' '}
                    <span className="font-normal text-slate-600">
                      {alert.condition === 'above' ? 'crossed above' : 'dropped below'}{' '}
                      <span className="font-semibold text-slate-900">
                        {formatINR(alert.targetPrice, alert.metal === 'silver')}
                      </span>
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Channels: {alert.channels?.join(' & ').toUpperCase()}
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Triggered
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
