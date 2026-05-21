import { __ } from '@wordpress/i18n'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { X, ArrowRight } from 'lucide-react'

const PROMO_URL = 'https://raw.githubusercontent.com/weDevsOfficial/wppm-util/master/promotions.json'
const STORAGE_PREFIX = 'pm-promo-dismissed:'
const FETCH_TIMEOUT_MS = 6000

const TZ_OFFSETS = { EST: '-05:00', EDT: '-04:00', PST: '-08:00', PDT: '-07:00', UTC: '+00:00', GMT: '+00:00' }

function parsePromoDate(str) {
  if (!str) return NaN
  const m = String(str).trim().match(/^(\d{4}-\d{2}-\d{2})[ T](\d{1,2}):(\d{2}):(\d{2})(?:\s+([A-Z]{3,4}))?$/)
  if (!m) return Date.parse(str)
  const [, date, h, mm, ss, tz] = m
  const hour = h.padStart(2, '0')
  const offset = tz && TZ_OFFSETS[tz] ? TZ_OFFSETS[tz] : '+00:00'
  return Date.parse(`${date}T${hour}:${mm}:${ss}${offset}`)
}

function isWithinWindow(promo) {
  if (typeof window !== 'undefined' && /[?&]pm_promo_preview=1\b/.test(window.location.search)) {
    return true
  }
  const now = Date.now()
  const start = parsePromoDate(promo.start_date)
  const end = parsePromoDate(promo.end_date)
  if (!Number.isNaN(start) && now < start) return false
  if (!Number.isNaN(end) && now > end) return false
  return true
}

function extractDiscount(text) {
  if (!text) return null
  const m = String(text).match(/(\d{2,3})\s*%/)
  return m ? `${m[1]}% OFF` : null
}

function daysRemaining(endStr) {
  const end = parsePromoDate(endStr)
  if (Number.isNaN(end)) return null
  const diff = Math.ceil((end - Date.now()) / 86400000)
  return diff > 0 && diff <= 30 ? diff : null
}

export function PromoBanner({ placement = 'projects' }) {
  const [promo, setPromo] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  const dismissKey = useMemo(
    () => (promo?.key ? `${STORAGE_PREFIX}${promo.key}` : null),
    [promo]
  )

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    fetch(PROMO_URL, { signal: controller.signal, cache: 'no-store' })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        if (cancelled) return
        if (!data || !data.key) {
          console.warn('[PM PromoBanner] payload missing key', data)
          return
        }
        if (!isWithinWindow(data)) {
          console.info('[PM PromoBanner] promo outside window', data.key, data.start_date, data.end_date)
          return
        }
        const key = `${STORAGE_PREFIX}${data.key}`
        if (localStorage.getItem(key) === '1') {
          setDismissed(true)
          return
        }
        setPromo(data)
      })
      .catch(err => {
        if (err?.name !== 'AbortError') {
          console.warn('[PM PromoBanner] fetch failed', err)
        }
      })
      .finally(() => clearTimeout(timer))

    return () => {
      cancelled = true
      controller.abort()
      clearTimeout(timer)
    }
  }, [])

  const handleDismiss = useCallback(() => {
    if (dismissKey) localStorage.setItem(dismissKey, '1')
    setDismissed(true)
  }, [dismissKey])

  if (dismissed || !promo) return null

  const action = promo.action_url
    ? `${promo.action_url}${promo.action_url.includes('?') ? '&' : '?'}utm_content=pm-${placement}-banner`
    : null

  const discount = extractDiscount(promo.title) || extractDiscount(promo.content)
  const daysLeft = daysRemaining(promo.end_date)

  return (
    <div
      className="pm-promo-banner relative rounded-xl border overflow-hidden"
      style={{
        background: '#FAFAFB',
        borderColor: '#E5E7EB',
      }}
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 bottom-0"
        style={{ width: '3px', background: '#7C3AED' }}
      />

      <button
        type="button"
        onClick={handleDismiss}
        aria-label={__('Dismiss', 'wedevs-project-manager')}
        className="absolute top-2 right-2 z-20 p-1.5 rounded text-pm-text-muted hover:text-pm-text-primary bg-white/80 hover:bg-pm-hover backdrop-blur-sm transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 px-5 py-4 pl-6 pr-10 sm:pr-12">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={`${typeof PM_Vars !== 'undefined' ? PM_Vars.dir_url : '/wp-content/plugins/wedevs-project-manager/'}.wordpress-org/icon-128x128.gif`}
            alt=""
            className="shrink-0 rounded-lg"
            style={{ height: '56px', width: '56px' }}
          />
          {discount && (
            <span
              className="shrink-0 inline-flex items-baseline gap-1 px-3 py-1.5 rounded-md"
              style={{
                background: 'linear-gradient(135deg, #FF8A00 0%, #FF5C00 100%)',
                color: '#fff',
                boxShadow: '0 4px 12px -2px rgba(255,92,0,0.45)',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>
                {discount.replace(' OFF', '')}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em' }}>
                OFF
              </span>
            </span>
          )}
          <span className="text-sm font-semibold text-pm-text-primary truncate">
            {promo.title}
          </span>
          {daysLeft != null && (
            <span className="hidden md:inline text-[12px] text-pm-text-muted shrink-0">
              · {daysLeft === 1
                ? __('ends tomorrow', 'wedevs-project-manager')
                : `${daysLeft} ${__('days left', 'wedevs-project-manager')}`}
            </span>
          )}
        </div>

        {action && (
          <a
            href={action}
            target="_blank"
            rel="noopener noreferrer"
            className="pm-promo-cta inline-flex items-center justify-center gap-2 self-start sm:self-auto shrink-0 px-5 py-2.5 rounded-md font-semibold text-[13px] tracking-[0.01em] whitespace-nowrap no-underline transition-all"
            style={{
              background: '#7C3AED',
              color: '#fff',
              boxShadow: '0 1px 2px rgba(124,58,237,0.25), 0 4px 12px -2px rgba(124,58,237,0.35)',
              border: '1px solid #6D28D9',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#6D28D9'
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(124,58,237,0.3), 0 8px 18px -2px rgba(124,58,237,0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#7C3AED'
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(124,58,237,0.25), 0 4px 12px -2px rgba(124,58,237,0.35)'
            }}
          >
            <span>{promo.action_title || __('Upgrade to Pro', 'wedevs-project-manager')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  )
}

export default PromoBanner
