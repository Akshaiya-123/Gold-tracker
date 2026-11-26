'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Bell, Mail, Smartphone, IndianRupee, Info } from '../icons';
import { formatINR, PURITY_LABELS, UNIT_LABELS } from '../../lib/constants';

export const AlertModal = ({
  isOpen,
  onClose,
  onSubmit,
  editAlert = null,
  initialValues = null,
  currentPrices,
}) => {
  const [metal, setMetal] = useState('gold');
  const [purity, setPurity] = useState('22K');
  const [condition, setCondition] = useState('below'); // 'above' | 'below'
  const [targetPrice, setTargetPrice] = useState('');
  const [unit, setUnit] = useState('per_gram');
  const [channels, setChannels] = useState(['email']);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editAlert) {
      setMetal(editAlert.metal || 'gold');
      setPurity(editAlert.purity || '22K');
      setCondition(editAlert.condition || 'below');
      setTargetPrice(editAlert.targetPrice || '');
      setUnit(editAlert.unit || 'per_gram');
      setChannels(editAlert.channels || ['email']);
    } else if (initialValues) {
      setMetal(initialValues.metal || 'gold');
      setPurity(initialValues.purity || '22K');
      setTargetPrice(initialValues.currentPrice ? String(Math.round(initialValues.currentPrice * 0.98)) : '');
      setCondition('below');
      setUnit('per_gram');
      setChannels(['email', 'sms']);
    } else {
      setMetal('gold');
      setPurity('22K');
      setCondition('below');
      setTargetPrice('7200');
      setUnit('per_gram');
      setChannels(['email', 'sms']);
    }
    setErrors({});
  }, [editAlert, initialValues, isOpen]);

  const liveCurrentPrice = metal === 'gold'
    ? currentPrices?.gold?.[purity]?.pricePerGram || 8050
    : currentPrices?.silver?.silver?.pricePerGram || 98.50;

  const handleChannelToggle = (channel) => {
    if (channels.includes(channel)) {
      if (channels.length === 1) return; // Keep at least one
      setChannels(channels.filter((c) => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const priceNum = parseFloat(targetPrice);

    if (!targetPrice || isNaN(priceNum) || priceNum <= 0) {
      newErrors.targetPrice = 'Please enter a valid target price greater than 0';
    }
    if (channels.length === 0) {
      newErrors.channels = 'Select at least one notification channel';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      id: editAlert?.id,
      metal,
      purity: metal === 'silver' ? 'silver' : purity,
      condition,
      targetPrice: priceNum,
      unit,
      channels,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editAlert ? 'Edit Price Alert' : 'Create Smart Price Alert'}
      subtitle="Receive automatic Email and SMS notifications when market reaches your target"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Metal Choice */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            1. Select Metal
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setMetal('gold');
                setPurity('22K');
                setTargetPrice('7200');
              }}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                metal === 'gold'
                  ? 'border-[#D6A84F] bg-[#FAF4E6]/50 ring-2 ring-[#D6A84F]/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-8 h-8 rounded-lg gold-badge flex items-center justify-center font-bold text-slate-950 text-xs">
                Au
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900">Gold</span>
                <span className="block text-[10px] text-slate-500">24K, 22K, 18K</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setMetal('silver');
                setPurity('silver');
                setTargetPrice('95');
              }}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                metal === 'silver'
                  ? 'border-[#AEB7C2] bg-slate-100 ring-2 ring-slate-300'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-300 flex items-center justify-center font-bold text-slate-800 text-xs">
                Ag
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900">Silver</span>
                <span className="block text-[10px] text-slate-500">999 Fine Silver</span>
              </div>
            </button>
          </div>
        </div>

        {/* Purity Choice (if Gold) */}
        {metal === 'gold' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Select Purity
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['24K', '22K', '18K'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPurity(p)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    purity === p
                      ? 'border-[#D6A84F] bg-[#FAF4E6] text-slate-950 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-xs font-bold">{p}</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">
                    {p === '24K' ? '999 Pure' : p === '22K' ? '916 Standard' : '750 Hallmarked'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Benchmark Helper Card */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
          <span className="text-slate-500">Current Market Spot Rate:</span>
          <span className="font-bold text-slate-900">
            {formatINR(liveCurrentPrice, metal === 'silver')} / gram
          </span>
        </div>

        {/* Condition & Target Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              3. Alert Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D6A84F]"
            >
              <option value="below">Price goes below (Buy Dip)</option>
              <option value="above">Price goes above (Target High)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              4. Target Price (₹)
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                placeholder="e.g. 7300"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-7 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D6A84F]"
              />
              <span className="absolute left-2.5 top-2.5 text-xs text-slate-400 font-bold">₹</span>
            </div>
            {errors.targetPrice && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.targetPrice}</p>
            )}
          </div>
        </div>

        {/* Price Unit */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            5. Price Unit
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D6A84F]"
          >
            <option value="per_gram">Per Gram (1g)</option>
            <option value="10_grams">Per 10 Grams (1 Tola / 10g)</option>
            {metal === 'silver' && <option value="kilogram">Per Kilogram (1kg)</option>}
          </select>
        </div>

        {/* Notification Channels */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            6. Delivery Channels
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleChannelToggle('email')}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                channels.includes('email')
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <Mail className="w-4 h-4 text-emerald-600" />
              <div className="text-left">
                <span className="block text-xs">Email Alert</span>
                <span className="block text-[10px] text-slate-500">HTML Rich notification</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleChannelToggle('sms')}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                channels.includes('sms')
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <div className="text-left">
                <span className="block text-xs">SMS Alert</span>
                <span className="block text-[10px] text-slate-500">Instant mobile text</span>
              </div>
            </button>
          </div>
          {errors.channels && (
            <p className="text-[11px] text-rose-600 mt-1">{errors.channels}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="gold" type="submit">
            {editAlert ? 'Save Alert Changes' : 'Create Alert'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
