import React from 'react';
import { Shield, Info } from '../icons';

export const Footer = () => {
  return (
    <footer className="mt-12 py-8 border-t border-slate-200/80 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg gold-badge flex items-center justify-center text-slate-950 font-bold text-xs">
            Au
          </div>
          <span className="font-semibold text-slate-800">
            Gold & Silver Tracker
          </span>
          <span className="text-slate-400">|</span>
          <span>India Bullion & Commodity Monitor</span>
        </div>

        <div className="flex items-center gap-6 text-[11px]">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Rates benchmarked against IBJA & MCX closing spot rates
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            DLT & SMS Compliant
          </span>
        </div>
      </div>
    </footer>
  );
};
