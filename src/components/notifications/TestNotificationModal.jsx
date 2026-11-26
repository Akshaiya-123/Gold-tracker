'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Mail, Smartphone, Send, CheckCircle2, Shield } from '../icons';

export const TestNotificationModal = ({ isOpen, onClose, onSendTest }) => {
  const [channel, setChannel] = useState('both'); // 'email' | 'sms' | 'both'
  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSend = async () => {
    setIsSending(true);
    setSuccessMsg(null);
    try {
      await onSendTest(channel);
      setSuccessMsg(`Test alert dispatched via ${channel.toUpperCase()} successfully! Check your notifications.`);
      setTimeout(() => {
        setIsSending(false);
        setSuccessMsg(null);
        onClose();
      }, 1800);
    } catch (e) {
      setIsSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Test Notification Delivery"
      subtitle="Verify that your Email and SMS channels are configured and receiving alerts properly."
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Channel Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Test Channel
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setChannel('email')}
              className={`p-3 rounded-xl border text-center transition-all ${
                channel === 'email'
                  ? 'border-emerald-500 bg-emerald-50/60 text-emerald-900 font-bold'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <Mail className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
              <span className="text-xs">Email Only</span>
            </button>

            <button
              type="button"
              onClick={() => setChannel('sms')}
              className={`p-3 rounded-xl border text-center transition-all ${
                channel === 'sms'
                  ? 'border-emerald-500 bg-emerald-50/60 text-emerald-900 font-bold'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <Smartphone className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
              <span className="text-xs">SMS Only</span>
            </button>

            <button
              type="button"
              onClick={() => setChannel('both')}
              className={`p-3 rounded-xl border text-center transition-all ${
                channel === 'both'
                  ? 'border-[#D6A84F] bg-[#FAF4E6] text-slate-950 font-bold'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <Send className="w-5 h-5 mx-auto mb-1 text-[#D6A84F]" />
              <span className="text-xs">Email + SMS</span>
            </button>
          </div>
        </div>

        {/* Preview of Test Message Template */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <span className="font-bold text-slate-800 block">Sample Alert Format:</span>
          <p className="font-mono text-[11px] bg-white p-2 rounded border border-slate-100 text-slate-700">
            [Gold & Silver Tracker] TEST ALERT: 24K Gold spot rate reached ₹8,050/g. Your automated notification system is active.
          </p>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSending}>
            Cancel
          </Button>
          <Button variant="gold" size="sm" onClick={handleSend} loading={isSending}>
            Dispatch Test Alert
          </Button>
        </div>
      </div>
    </Modal>
  );
};
