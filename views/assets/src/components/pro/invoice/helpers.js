/* ── Invoice Calculation & Formatting Helpers ── */

const CURRENCY_MAP = {
  USD: '$', EUR: '€', GBP: '£', BDT: '৳', INR: '₹',
  AUD: 'A$', CAD: 'C$', JPY: '¥', CNY: '¥', CHF: 'CHF',
  SEK: 'kr', NOK: 'kr', DKK: 'kr', NZD: 'NZ$', SGD: 'S$',
  HKD: 'HK$', MYR: 'RM', PHP: '₱', THB: '฿', IDR: 'Rp',
  BRL: 'R$', MXN: 'MX$', ZAR: 'R', RUB: '₽', TRY: '₺',
  PLN: 'zł', CZK: 'Kč', HUF: 'Ft', RON: 'lei', AED: 'د.إ',
  SAR: '﷼', KRW: '₩', TWD: 'NT$', CLP: 'CLP$', ARS: 'AR$',
  COP: 'COL$', PEN: 'S/.', EGP: 'E£', NGN: '₦', KES: 'KSh',
}

export function getCurrencySymbol() {
  const code = typeof PM_Vars !== 'undefined' ? PM_Vars?.settings?.invoice?.currency_code : null
  return CURRENCY_MAP[code] || '$'
}

export function extractDateStr(d) {
  if (!d) return ''
  if (typeof d === 'string') return d.split(' ')[0]
  if (d?.date) return typeof d.date === 'string' ? d.date.split(' ')[0] : ''
  return ''
}

export function fmtMoney(v) {
  return getCurrencySymbol() + (parseFloat(v) || 0).toFixed(2)
}

export function taskLineTotal(t) {
  return (parseFloat(t.amount) || 0) * (parseFloat(t.hour) || 0)
}

export function itemLineTotal(t) {
  return (parseFloat(t.amount) || 0) * (parseFloat(t.quantity) || 0)
}

export function calcSubtotal(tasks, items) {
  const ts = (tasks || []).reduce((s, t) => s + taskLineTotal(t), 0)
  const ns = (items || []).reduce((s, t) => s + itemLineTotal(t), 0)
  return ts + ns
}

export function calcTax(tasks, items) {
  const ts = (tasks || []).reduce((s, t) => s + taskLineTotal(t) * (parseFloat(t.tax) || 0) / 100, 0)
  const ns = (items || []).reduce((s, t) => s + itemLineTotal(t) * (parseFloat(t.tax) || 0) / 100, 0)
  return ts + ns
}

export function calcDiscount(tasks, items, discount) {
  return calcSubtotal(tasks, items) * (parseFloat(discount) || 0) / 100
}

export function calcTotal(tasks, items, discount) {
  return calcSubtotal(tasks, items) + calcTax(tasks, items) - calcDiscount(tasks, items, discount)
}

export function calcPaid(payments) {
  return (payments || []).reduce((s, p) => s + (parseFloat(p.amount) || 0), 0)
}

export const STATUS_MAP  = { 0: 'Unpaid', 1: 'Paid', 2: 'Partial Paid' }
export const STATUS_STYLE = {
  0: 'bg-red-50 text-red-700 border-red-200',
  1: 'bg-green-50 text-green-700 border-green-200',
  2: 'bg-yellow-50 text-yellow-700 border-yellow-200',
}

export const emptyTaskRow = () => ({ task: '', description: '', amount: '', hour: '', tax: '', descriptionField: false })
export const emptyItemRow = () => ({ task: '', description: '', amount: '', quantity: '', tax: '', descriptionField: false })
