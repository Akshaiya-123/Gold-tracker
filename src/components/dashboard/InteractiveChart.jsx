'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCw, Calendar, TrendingUp } from '../icons';
import { formatINR, formatPercentage } from '../../lib/constants';
import { generateChartData } from '../../lib/mockData';

const TIMEFRAMES = [
  { id: '24h', label: '24H' },
  { id: '7d', label: '7D' },
  { id: '30d', label: '30D' },
  { id: '6m', label: '6M' },
  { id: '1y', label: '1Y' },
];

export const InteractiveChart = ({
  initialMetal = 'gold',
  initialPurity = '24K',
  onMetalChange,
}) => {
  const [metal, setMetal] = useState(initialMetal);
  const [purity, setPurity] = useState(initialPurity);
  const [timeframe, setTimeframe] = useState('30d');
  const [chartData, setChartData] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const svgRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const data = generateChartData(metal, purity, timeframe);
      setChartData(data);
      setIsLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [metal, purity, timeframe]);

  const prices = chartData.map((d) => d.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 100;
  const priceRange = maxPrice - minPrice || 1;

  const firstPrice = prices[0] || 0;
  const lastPrice = prices[prices.length - 1] || 0;
  const periodChange = lastPrice - firstPrice;
  const periodPercent = firstPrice ? (periodChange / firstPrice) * 100 : 0;
  const isPeriodPositive = periodChange >= 0;

  // Chart coordinates
  const svgWidth = 800;
  const svgHeight = 320;
  const paddingX = 40;
  const paddingY = 30;
  const plotWidth = svgWidth - paddingX * 2;
  const plotHeight = svgHeight - paddingY * 2;

  const points = chartData.map((d, index) => {
    const x = paddingX + (index / (chartData.length - 1 || 1)) * plotWidth;
    const y = paddingY + plotHeight - ((d.price - minPrice) / priceRange) * plotHeight;
    return { ...d, x, y };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = points.length
    ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : '';

  const activePoint = hoveredPoint || (points.length ? points[points.length - 1] : null);

  const handleMouseMove = (e) => {
    if (!svgRef.current || !points.length) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const scaleX = svgWidth / rect.width;
    const scaledMouseX = mouseX * scaleX;

    let closest = points[0];
    let minDiff = Infinity;
    for (const pt of points) {
      const diff = Math.abs(pt.x - scaledMouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = pt;
      }
    }
    setHoveredPoint(closest);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const isGold = metal === 'gold';
  const strokeColor = isGold ? '#D6A84F' : '#64748B';
  const gradientStart = isGold ? 'rgba(214, 168, 79, 0.35)' : 'rgba(100, 116, 139, 0.25)';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      {/* Chart Top Header: Metal Switches & Timeframe Tabs */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Interactive Price Movement
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              INR per gram
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-1.5">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatINR(activePoint?.price, metal === 'silver')}
            </h3>

            <div
              className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                isPeriodPositive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {isPeriodPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{formatPercentage(periodPercent)}</span>
              <span className="text-[10px] font-medium text-slate-500">({timeframe})</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            {activePoint?.dateFormatted} {activePoint?.timeFormatted ? `at ${activePoint.timeFormatted}` : ''}
          </p>
        </div>

        {/* Controls: Metal & Purity Selection + Timeframes */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Metal Select */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => {
                setMetal('gold');
                setPurity('24K');
                if (onMetalChange) onMetalChange('gold', '24K');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                metal === 'gold'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gold
            </button>
            <button
              onClick={() => {
                setMetal('silver');
                setPurity('silver');
                if (onMetalChange) onMetalChange('silver', 'silver');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                metal === 'silver'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Silver
            </button>
          </div>

          {/* Purity options (when Gold is selected) */}
          {metal === 'gold' && (
            <div className="flex items-center p-1 bg-slate-100 rounded-xl">
              {['24K', '22K', '18K'].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPurity(p);
                    if (onMetalChange) onMetalChange('gold', p);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    purity === p
                      ? 'bg-[#D6A84F] text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Timeframe Buttons */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeframe === tf.id
                    ? 'bg-[#101828] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive SVG Chart Area */}
      <div className="relative mt-6 select-none">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <RefreshCw className="w-6 h-6 text-[#D6A84F] animate-spin" />
          </div>
        )}

        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-64 sm:h-80 cursor-crosshair overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id={`gradient-${metal}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradientStart} />
              <stop offset="100%" stopColor={gradientStart} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines & Price markers */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = paddingY + plotHeight * pct;
            const priceLevel = maxPrice - pct * priceRange;
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={svgWidth - paddingX + 8}
                  y={y + 4}
                  fill="#94A3B8"
                  fontSize="10"
                  textAnchor="start"
                  fontFamily="sans-serif"
                >
                  {formatINR(priceLevel, metal === 'silver')}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill={`url(#gradient-${metal})`} />

          {/* Main Price Line */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Hover Crosshair Line */}
          {activePoint && (
            <>
              <line
                x1={activePoint.x}
                y1={paddingY}
                x2={activePoint.x}
                y2={svgHeight - paddingY}
                stroke="#94A3B8"
                strokeDasharray="3 3"
                strokeWidth="1.5"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="6"
                fill="#ffffff"
                stroke={strokeColor}
                strokeWidth="3"
                className="transition-transform duration-75"
              />
            </>
          )}
        </svg>

        {/* X-axis time labels */}
        <div className="flex items-center justify-between px-8 mt-2 text-[11px] font-medium text-slate-400">
          <span>{chartData[0]?.label || ''}</span>
          <span>{chartData[Math.floor(chartData.length / 2)]?.label || ''}</span>
          <span>{chartData[chartData.length - 1]?.label || ''}</span>
        </div>
      </div>
    </div>
  );
};
