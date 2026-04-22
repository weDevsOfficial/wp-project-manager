export const PRESET_COLORS = [
  '#000000', '#ffffff', '#dd3333', '#dd9933', '#eeee22',
  '#81d742', '#1e73be', '#8224e3', '#82b541', '#e91e63',
  '#9c27b0', '#3f51b5', '#03a9f4', '#009688', '#ff9800',
];

export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar ($)' },
  { code: 'EUR', name: 'Euro (€)' },
  { code: 'GBP', name: 'British Pound (£)' },
  { code: 'BDT', name: 'Bangladeshi Taka (৳)' },
  { code: 'INR', name: 'Indian Rupee (₹)' },
  { code: 'AUD', name: 'Australian Dollar (A$)' },
  { code: 'CAD', name: 'Canadian Dollar (C$)' },
  { code: 'JPY', name: 'Japanese Yen (¥)' },
  { code: 'CNY', name: 'Chinese Yuan (¥)' },
  { code: 'SGD', name: 'Singapore Dollar (S$)' },
];

export function getInv(key, fallback) {
  const s = typeof PM_Vars !== 'undefined' ? PM_Vars.settings?.invoice : null;
  if (!s || typeof s !== 'object') return fallback;
  return s[key] ?? fallback;
}
