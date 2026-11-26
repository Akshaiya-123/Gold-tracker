'use client';

import React, { useState } from 'react';
import { Scale, IndianRupee, Sparkles, Info } from '../icons';
import { formatINR, calculateJewelleryPrice } from '../../lib/constants';

export const JewelleryCalculator = ({ prices }) => {
  const [selectedPurity, setSelectedPurity] = useState('22K');
  const [weight, setWeight] = useState(10); // grams
  const [makingChargePercent, setMakingChargePercent] = useState(12); // %

  const gramRate = selectedPurity === '24K'
    ? (prices?.gold?.['24K']?.pricePerGram || 8050)
    : selectedPurity === '22K'
    ? (prices?.gold?.['22K']?.pricePerGram || 7380)
    : selectedPurity === '18K'
    ? (prices?.gold?.['18K']?.pricePerGram || 6040)
    : (prices?.silver?.silver?.pricePerGram || 98.50);

  const calculation = calculateJewelleryPrice(gramRate, Number(weight) || 0, Number(makingChargePercent) || 0, 3);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gold-badge flex items-center justify-center text-slate-950 font-bold">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Jewellery Purchase Cost Calculator</h3>
            <p className="text-xs text-slate-500">Calculate net price with Making Charges + 3% GST</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAF4E6] text-[#9A6F20] border border-[#E8D4A2]">
          India Tax Rule (3% GST)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {/* Purity Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Select Metal & Purity
          </label>
          <select
            value={selectedPurity}
            onChange={(e) => setSelectedPurity(e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D6A84F]"
          >
            <option value="22K">22K Gold (Standard Jewellery 916) - {formatINR(prices?.gold?.['22K']?.pricePerGram)}/g</option>
            <option value="24K">24K Pure Gold (Bullion/Coins 999) - {formatINR(prices?.gold?.['24K']?.pricePerGram)}/g</option>
            <option value="18K">18K Gold (Diamond Jewellery 750) - {formatINR(prices?.gold?.['18K']?.pricePerGram)}/g</option>
            <option value="silver">999 Fine Silver - {formatINR(prices?.silver?.silver?.pricePerGram, true)}/g</option>
          </select>
        </div>

        {/* Weight input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Weight in Grams
          </label>
          <div className="relative">
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D6A84F]"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">g</span>
          </div>
        </div>

        {/* Making Charge % */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Making Charges (% of metal)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="50"
              value={makingChargePercent}
              onChange={(e) => setMakingChargePercent(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D6A84F]"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">%</span>
          </div>
        </div>
      </div>

      {/* Bill Breakdown Box */}
      <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <span className="text-[11px] text-slate-500">Pure Metal Cost:</span>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{formatINR(calculation.metalCost)}</p>
        </div>
        <div>
          <span className="text-[11px] text-slate-500">Making Charges ({makingChargePercent}%):</span>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{formatINR(calculation.makingCharge)}</p>
        </div>
        <div>
          <span className="text-[11px] text-slate-500">GST (3% on subtotal):</span>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{formatINR(calculation.gst)}</p>
        </div>
        <div className="bg-[#101828] text-white p-2.5 rounded-lg">
          <span className="text-[10px] text-[#D6A84F] font-semibold uppercase">Total Estimated Payable:</span>
          <p className="text-base font-extrabold text-white mt-0.5">{formatINR(calculation.total)}</p>
        </div>
      </div>
    </div>
  );
};
