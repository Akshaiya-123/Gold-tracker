import React from 'react';

export const Card = ({ children, className = '', hover = true, goldBorder = false, silverBorder = false }) => {
  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
        goldBorder
          ? 'border-[#D6A84F]/40 shadow-sm shadow-[#D6A84F]/10'
          : silverBorder
          ? 'border-[#AEB7C2]/40 shadow-sm shadow-[#AEB7C2]/10'
          : 'border-slate-200/80 shadow-sm'
      } ${hover ? 'hover:shadow-md hover:border-slate-300' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`font-semibold text-slate-900 text-base tracking-tight ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-xs text-slate-500 mt-0.5 ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between ${className}`}>
    {children}
  </div>
);
