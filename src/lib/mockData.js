// Realistic Indian Market Gold & Silver Prices, Chart Datasets, and Default State

export const INITIAL_PRICES = {
  gold: {
    '24K': {
      pricePerGram: 8050,
      price10Grams: 80500,
      priceKg: 8050000,
      previousDayPrice: 7990,
      change: 60,
      percentageChange: 0.75,
      highToday: 8085,
      lowToday: 7980,
      openingPrice: 7995,
      fiftyTwoWeekHigh: 8250,
      fiftyTwoWeekLow: 6150,
      lastUpdated: new Date().toISOString(),
    },
    '22K': {
      pricePerGram: 7380,
      price10Grams: 73800,
      priceKg: 7380000,
      previousDayPrice: 7325,
      change: 55,
      percentageChange: 0.75,
      highToday: 7410,
      lowToday: 7315,
      openingPrice: 7330,
      fiftyTwoWeekHigh: 7560,
      fiftyTwoWeekLow: 5640,
      lastUpdated: new Date().toISOString(),
    },
    '18K': {
      pricePerGram: 6040,
      price10Grams: 60400,
      priceKg: 6040000,
      previousDayPrice: 5995,
      change: 45,
      percentageChange: 0.75,
      highToday: 6065,
      lowToday: 5985,
      openingPrice: 6000,
      fiftyTwoWeekHigh: 6190,
      fiftyTwoWeekLow: 4610,
      lastUpdated: new Date().toISOString(),
    },
  },
  silver: {
    silver: {
      pricePerGram: 98.50,
      price10Grams: 985.00,
      priceKg: 98500,
      previousDayPrice: 99.80,
      change: -1.30,
      percentageChange: -1.30,
      highToday: 100.20,
      lowToday: 98.10,
      openingPrice: 99.70,
      fiftyTwoWeekHigh: 104.50,
      fiftyTwoWeekLow: 71.00,
      lastUpdated: new Date().toISOString(),
    },
  },
};

/**
 * Generate accurate historical data points for given metal, purity, and timeframe
 */
export const generateChartData = (metal = 'gold', purity = '24K', timeframe = '30d') => {
  const basePrice = metal === 'gold' 
    ? (INITIAL_PRICES.gold[purity]?.pricePerGram || 8050)
    : (INITIAL_PRICES.silver.silver.pricePerGram || 98.50);

  const pointsCount = {
    '24h': 24,
    '7d': 7,
    '30d': 30,
    '6m': 26, // weekly for 6 months
    '1y': 52, // weekly for 1 year
  }[timeframe] || 30;

  const data = [];
  const now = new Date();

  // Create an organic, realistic market fluctuation curve
  let currentVal = basePrice;
  // Trend coefficient based on timeframe (gold has had an upward trend over the last year in India)
  const drift = metal === 'gold' ? 0.0008 : 0.0004;
  const volatility = metal === 'gold' ? 0.004 : 0.008;

  for (let i = pointsCount - 1; i >= 0; i--) {
    let date = new Date(now);
    let label = '';

    if (timeframe === '24h') {
      date.setHours(now.getHours() - i);
      label = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    } else if (timeframe === '7d' || timeframe === '30d') {
      date.setDate(now.getDate() - i);
      label = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } else {
      date.setDate(now.getDate() - (i * 7));
      label = date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    }

    // Mathematical pseudo-random walk anchored to current price at the end
    const progress = (pointsCount - i) / pointsCount;
    const wave = Math.sin(progress * Math.PI * 4) * 0.015;
    const noise = (Math.sin(i * 1.7) * 0.5 + Math.cos(i * 2.3) * 0.5) * volatility;
    
    // Reverse calculation so that the last point lands near the current live price
    const discountFactor = 1 - ((pointsCount - 1 - i) * drift);
    const calculatedPrice = (basePrice * discountFactor * (1 + wave + noise));

    data.push({
      timestamp: date.toISOString(),
      label,
      dateFormatted: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      timeFormatted: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      price: Math.round(calculatedPrice * (metal === 'silver' ? 100 : 1)) / (metal === 'silver' ? 100 : 1),
    });
  }

  // Ensure last point matches exactly
  if (data.length > 0) {
    data[data.length - 1].price = basePrice;
  }

  return data;
};

// Default alerts for initial preview and demonstration
export const INITIAL_ALERTS = [
  {
    id: 'alt-001',
    metal: 'gold',
    purity: '22K',
    condition: 'below',
    targetPrice: 7300,
    unit: 'per_gram',
    channels: ['email', 'sms'],
    isActive: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    lastTriggeredAt: null,
    lastPriceSeen: 7380,
    status: 'active',
  },
  {
    id: 'alt-002',
    metal: 'gold',
    purity: '24K',
    condition: 'above',
    targetPrice: 8100,
    unit: 'per_gram',
    channels: ['email'],
    isActive: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    lastTriggeredAt: null,
    lastPriceSeen: 8050,
    status: 'active',
  },
  {
    id: 'alt-003',
    metal: 'silver',
    purity: 'silver',
    condition: 'below',
    targetPrice: 97.00,
    unit: 'per_gram',
    channels: ['email', 'sms'],
    isActive: true,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    lastTriggeredAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    lastPriceSeen: 98.50,
    status: 'triggered',
  },
  {
    id: 'alt-004',
    metal: 'gold',
    purity: '18K',
    condition: 'below',
    targetPrice: 5950,
    unit: 'per_gram',
    channels: ['sms'],
    isActive: false,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    lastTriggeredAt: null,
    lastPriceSeen: 6040,
    status: 'disabled',
  },
];

// Initial notification logs
export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-101',
    alertId: 'alt-003',
    title: 'Silver Price Alert Reached!',
    message: '999 Fine Silver price dropped to ₹96.80/g, reaching your target of ₹97.00/g.',
    metal: 'silver',
    purity: 'silver',
    condition: 'below',
    currentPrice: 96.80,
    targetPrice: 97.00,
    unit: 'per_gram',
    channels: ['email', 'sms'],
    deliveryStatus: { email: 'sent', sms: 'sent' },
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: 'notif-102',
    alertId: 'alt-prev-001',
    title: 'Gold 24K Milestone Alert',
    message: '24K Pure Gold surpassed ₹8,000/g benchmark. Current price is ₹8,050/g.',
    metal: 'gold',
    purity: '24K',
    condition: 'above',
    currentPrice: 8050,
    targetPrice: 8000,
    unit: 'per_gram',
    channels: ['email'],
    deliveryStatus: { email: 'sent', sms: 'skipped' },
    isRead: true,
    createdAt: new Date(Date.now() - 28 * 3600000).toISOString(),
  },
  {
    id: 'notif-103',
    alertId: null,
    title: 'Daily Market Closing Summary',
    message: 'MCX Bullion closed in green: Gold +0.75% (₹8,050/g), Silver -1.30% (₹98.50/g).',
    metal: 'gold',
    purity: '24K',
    condition: 'summary',
    currentPrice: 8050,
    targetPrice: 8050,
    unit: 'per_gram',
    channels: ['email'],
    deliveryStatus: { email: 'sent', sms: 'skipped' },
    isRead: true,
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
];

// Initial user profile
export const INITIAL_USER = {
  name: 'Akshaiya Sharma',
  email: 'akshaiya.fintech@example.com',
  phone: '9876543210',
  isEmailVerified: true,
  isPhoneVerified: true,
  joinedDate: 'November 2026',
  avatarUrl: null,
  preferences: {
    emailNotifications: true,
    smsNotifications: true,
    inAppNotifications: true,
    priceIncreaseAlerts: true,
    priceDecreaseAlerts: true,
    dailyMarketSummary: false,
    preferredCurrency: 'INR',
    preferredUnit: 'per_gram',
  },
};

// Initial watchlist items
export const INITIAL_WATCHLIST = [
  {
    id: 'wl-1',
    metal: 'gold',
    purity: '22K',
    note: 'Wedding Jewellery Purchase (Gold Chain 16g)',
    targetBuyPrice: 7200,
    addedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'wl-2',
    metal: 'gold',
    purity: '24K',
    note: 'Sovereign Gold Coin Investment (10g)',
    targetBuyPrice: 7900,
    addedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: 'wl-3',
    metal: 'silver',
    purity: 'silver',
    note: 'Silver Bar 1 Kg Accumulation',
    targetBuyPrice: 95000,
    addedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
];
