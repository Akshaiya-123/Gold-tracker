'use client';

import React, { useState } from 'react';
import {
  User,
  Mail,
  Smartphone,
  Shield,
  CheckCircle2,
  Lock,
} from '../icons';
import { Button } from '../ui/Button';

export const ProfileView = ({ user, onUpdateProfile }) => {
  const [name, setName] = useState(user?.name || 'Akshaiya Sharma');
  const [email, setEmail] = useState(user?.email || 'akshaiya.fintech@example.com');
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateProfile({ name, email, phone });
    setFeedback({ type: 'success', message: 'Profile information updated successfully!' });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setFeedback({ type: 'success', message: 'Password updated successfully!' });
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900">User Profile & Account Security</h3>
        <p className="text-xs text-slate-500">Manage personal details, SMS verification, and login credentials</p>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Profile Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-[#101828] text-[#D6A84F] font-extrabold text-xl flex items-center justify-center shadow-md">
            {name ? name.charAt(0) : 'A'}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> Email Verified
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> Phone Verified
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D6A84F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D6A84F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Number (India +91)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-11 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D6A84F]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="gold" size="sm" type="submit">
              Update Profile
            </Button>
          </div>
        </form>
      </div>

      {/* Security & Password Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#D6A84F]" />
          <span>Security & Password</span>
        </h4>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" type="submit">
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
