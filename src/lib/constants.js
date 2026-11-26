// Indian Bullion Market Benchmarks, Purity Factors & Formatting Helpers

export const PURITY_FACTORS = {
  '24K': 1.0,         // 99.9% pure bullion
  '22K': 0.9167,      // 91.6% Hallmark jewellery standard
  '18K': 0.75,        // 75.0% Diamond jewellery standard
  'silver': 1.0,      // 99.9% Fine silver
};

export const METALS = {
  GOLD: 'gold',
  SILVER: 'silver',
};

export const PURITY_LABELS = {
  '24K': '24K Pure Gold (999)',
  '22K': '22K Standard Gold (916)',
  '18K': '18K Fine Gold (750)',
  'silver': '999 Fine Silver',
};

export const UNITS = {
  PER_GRAM: 'per_gram',
  TEN_GRAMS: '10_grams',
  KILOGRAM: 'kilogram',
};

export const UNIT_LABELS = {
  'per_gram': 'Per Gram (1g)',
  '10_grams': 'Per 10 Grams (10g / 1 Tola)',
  'kilogram': 'Per Kilogram (1kg)',
};

/**
 * Format currency in Indian Rupees format (e.g. ₹7,850 or ₹98,500)
 */
export const formatINR = (amount, includeDecimal = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const num = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: includeDecimal ? 2 : 0,
    minimumFractionDigits: includeDecimal ? 2 : 0,
  }).format(num);
};

/**
 * Format percentage change with +/- sign
 */
export const formatPercentage = (percent) => {
  if (percent === null || percent === undefined || isNaN(percent)) return '0.00%';
  const num = Number(percent);
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

/**
 * Calculate making charges + 3% GST for jewellery purchases in India
 */
export const calculateJewelleryPrice = (gramPrice, weightInGrams, makingChargePercent = 12, gstPercent = 3) => {
  const metalCost = gramPrice * weightInGrams;
  const makingCharge = (metalCost * makingChargePercent) / 100;
  const subtotal = metalCost + makingCharge;
  const gst = (subtotal * gstPercent) / 100;
  const total = subtotal + gst;
  return {
    metalCost: Math.round(metalCost),
    makingCharge: Math.round(makingCharge),
    gst: Math.round(gst),
    total: Math.round(total),
  };
};
