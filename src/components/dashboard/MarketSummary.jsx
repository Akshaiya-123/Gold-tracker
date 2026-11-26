import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from '../icons';
import { formatINR, formatPercentage } from '../../lib/constants';

export const MarketSummary = ({
  metal = 'gold',
  purity = '24K',
  data,
}) => {
  if (!data) return null;

  const isPositive = (data.change || 0) >= 0;
  const currentPrice = data.pricePerGram || 8050;
  const highToday = data.highToday || currentPrice * 1.005;
  const lowToday = data.lowToday || currentPrice * 0.995;
  const openingPrice = data.openingPrice || data.previousDayPrice || currentPrice;
  const fiftyTwoWeekHigh = data.fiftyTwoWeekHigh || currentPrice * 1.05;
  const fiftyTwoWeekLow = data.fiftyTwoWeekLow || currentPrice * 0.8;

  // Calculate day's price range progress percentage
  const dayRange = highToday - lowToday;
  const dayProgress = dayRange > 0 ? ((currentPrice - lowToday) / dayRange) * 100 : 50;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Today&apos;s Market Summary</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key opening, high, low, and benchmark metrics for {metal === 'gold' ? `${purity} Gold` : 'Silver'}
          </p>
        </div>
        <div
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
            isPositive
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          <span>{formatPercentage(data.percentageChange)} Overall Change</span>
        </div>
      </div>

      {/* 4 Metric Columns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Opening Price</span>
          <p className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            {formatINR(openingPrice, metal === 'silver')}
          </p>
          <span className="text-[10px] text-slate-400">At 09:00 AM IST</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Today&apos;s High</span>
          <p className="text-base sm:text-lg font-bold text-emerald-700 mt-1">
            {formatINR(highToday, metal === 'silver')}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">Day peak</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Today&apos;s Low</span>
          <p className="text-base sm:text-lg font-bold text-rose-700 mt-1">
            {formatINR(lowToday, metal === 'silver')}
          </p>
          <span className="text-[10px] text-rose-600 font-medium">Day floor</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Current Price</span>
          <p className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            {formatINR(currentPrice, metal === 'silver')}
          </p>
          <span className="text-[10px] text-[#9A6F20] font-semibold">Live Spot Rate</span>
        </div>
      </div>

      {/* Intraday Range Bar */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>Low: {formatINR(lowToday, metal === 'silver')}</span>
          <span className="font-semibold text-slate-700">Intraday Range</span>
          <span>High: {formatINR(highToday, metal === 'silver')}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 rounded-full"
            style={{ width: '100%' }}
          />
          <div
            className="absolute top-0 bottom-0 w-2.5 bg-slate-950 rounded-full -ml-1 border border-white shadow-sm"
            style={{ left: `${Math.min(Math.max(dayProgress, 5), 95)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
