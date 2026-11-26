'use client';

import React, { useState } from 'react';
import {
  Clock,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
} from '../icons';
import { Button } from '../ui/Button';
import { formatINR, formatPercentage } from '../../lib/constants';
import { generateChartData } from '../../lib/mockData';

export const PriceHistoryTable = () => {
  const [metal, setMetal] = useState('gold');
  const [purity, setPurity] = useState('24K');
  const [timeframe, setTimeframe] = useState('30d');

  const historyData = generateChartData(metal, purity, timeframe);

  // Calculate day-over-day changes
  const tableRows = historyData.map((item, index) => {
    const prevItem = index > 0 ? historyData[index - 1] : item;
    const diff = item.price - prevItem.price;
    const pct = prevItem.price ? (diff / prevItem.price) * 100 : 0;
    return {
      ...item,
      diff,
      pct,
      price10g: item.price * 10,
      priceKg: item.price * 1000,
    };
  }).reverse(); // Latest date first

  const handleExportCSV = () => {
    const headers = 'Date,Metal,Purity,Price Per Gram (INR),Price 10 Grams (INR),Price 1 Kg (INR),Change (INR),Change (%)\n';
    const rows = tableRows.map((r) =>
      `"${r.dateFormatted}","${metal.toUpperCase()}","${purity}",${r.price},${r.price10g},${r.priceKg},${r.diff.toFixed(2)},${r.pct.toFixed(2)}%`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metal}_${purity}_price_history_${timeframe}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Export Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Metal & Purity selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => {
                setMetal('gold');
                setPurity('24K');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                metal === 'gold' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Gold
            </button>
            <button
              onClick={() => {
                setMetal('silver');
                setPurity('silver');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                metal === 'silver' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Silver
            </button>
          </div>

          {metal === 'gold' && (
            <div className="flex items-center p-1 bg-slate-100 rounded-xl">
              {['24K', '22K', '18K'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPurity(p)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    purity === p ? 'bg-[#D6A84F] text-slate-950 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Timeframe range */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            {[
              { id: '7d', label: 'Past 7 Days' },
              { id: '30d', label: 'Past 30 Days' },
              { id: '6m', label: 'Past 6 Months' },
              { id: '1y', label: 'Past 1 Year' },
            ].map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeframe === tf.id ? 'bg-[#101828] text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Export CSV button */}
        <Button variant="outline" size="sm" icon={Download} onClick={handleExportCSV}>
          Export CSV
        </Button>
      </div>

      {/* Historical Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-4">Commodity / Purity</th>
                <th className="py-3.5 px-4 text-right">Price / Gram</th>
                <th className="py-3.5 px-4 text-right">Price / 10g (Tola)</th>
                <th className="py-3.5 px-4 text-right">Price / Kilogram</th>
                <th className="py-3.5 px-4 text-right">Day Difference</th>
                <th className="py-3.5 px-5 text-right">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {tableRows.map((row, idx) => {
                const isPositive = row.diff >= 0;
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-900 whitespace-nowrap">
                      {row.dateFormatted}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      <span className="font-bold">{metal === 'gold' ? `${purity} Gold` : 'Silver'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                      {formatINR(row.price, metal === 'silver')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-700 whitespace-nowrap">
                      {formatINR(row.price10g, metal === 'silver')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-700 whitespace-nowrap">
                      {formatINR(row.priceKg)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          isPositive ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {isPositive ? '+' : ''}
                        {formatINR(row.diff, metal === 'silver')} ({formatPercentage(row.pct)})
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right text-slate-400 text-[11px] whitespace-nowrap">
                      IBJA Spot
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
