import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'sm', className = '' }) => {
  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  }[size] || 'text-xs px-2.5 py-1';

  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/80 font-medium',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/80 font-medium',
    gold: 'bg-[#FAF4E6] text-[#9A6F20] border border-[#E8D4A2] font-semibold',
    silver: 'bg-[#F1F4F8] text-[#475569] border border-[#CBD5E1] font-semibold',
    primary: 'bg-[#101828] text-white font-medium',
    neutral: 'bg-slate-100 text-slate-600 border border-slate-200 font-medium',
  }[variant] || 'bg-slate-100 text-slate-600';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full tracking-wide ${sizeStyles} ${variantStyles} ${className}`}>
      {children}
    </span>
  );
};
