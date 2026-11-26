import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Sparkles,
} from '../icons';
import { formatINR, formatPercentage } from '../../lib/constants';

export const PriceCard = ({
  metal = 'gold', // 'gold' | 'silver'
  purity = '24K', // '24K' | '22K' | '18K' | 'silver'
  title = '24K Pure Gold',
  subtitle = '99.9% Hallmark Bullion',
  pricePerGram,
  priceUnitLabel = 'per gram',
  previousDayPrice,
  priceChange,
  percentageChange,
  lastUpdated,
  onOpenAlertForMetal,
}) => {
  const isPositive = priceChange >= 0;
  const isGold = metal === 'gold';

  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : 'Just now';

  return (
    <div
      className={`relative bg-white rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        isGold
          ? 'border-[#D6A84F]/30 hover:border-[#D6A84F]/60'
          : 'border-[#AEB7C2]/30 hover:border-[#AEB7C2]/60'
      }`}
    >
      {/* Top Header: Badge, Metal type, Up/Down pill */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ${
              isGold
                ? 'gold-badge text-slate-950 shadow-[#D6A84F]/20'
                : 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-800 shadow-slate-300/30'
            }`}
          >
            {isGold ? purity : 'Ag'}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm tracking-tight">{title}</h4>
            <p className="text-[11px] text-slate-500">{subtitle}</p>
          </div>
        </div>

        {/* Upward / Downward Indicator Pill */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            isPositive
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
              : 'bg-rose-50 text-rose-700 border border-rose-200/80'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
          )}
          <span>{formatPercentage(percentageChange)}</span>
        </div>
      </div>

      {/* Main Price Display */}
      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatINR(pricePerGram, metal === 'silver' && priceUnitLabel === 'per gram')}
          </span>
          <span className="text-xs font-semibold text-slate-500 uppercase">
            /{priceUnitLabel}
          </span>
        </div>

        {/* Price Difference Indicator & Clear User Explanation */}
        <div className="flex items-center gap-2 mt-1.5 text-xs">
          <span
            className={`font-semibold flex items-center gap-0.5 ${
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isPositive ? '+' : ''}
            {formatINR(priceChange, metal === 'silver' && priceUnitLabel === 'per gram')}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">
            {isPositive ? 'Price increased' : 'Price decreased'} from yesterday (
            {formatINR(previousDayPrice, metal === 'silver' && priceUnitLabel === 'per gram')})
          </span>
        </div>
      </div>

      {/* Footer Info & Quick Set Alert */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          Updated {formattedTime}
        </span>

        {onOpenAlertForMetal && (
          <button
            onClick={() => onOpenAlertForMetal({ metal, purity, currentPrice: pricePerGram })}
            className="font-semibold text-[#9A6F20] hover:text-[#D6A84F] hover:underline"
          >
            Set Alert →
          </button>
        )}
      </div>
    </div>
  );
};
