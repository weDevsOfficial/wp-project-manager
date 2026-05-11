import { __ } from '@wordpress/i18n';
import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@components/ui/dialog'
import { Crown, X } from 'lucide-react'

const UPGRADE_URL = 'https://wedevs.com/wp-project-manager-pro/pricing/?utm_source=wpdashboard&utm_medium=popup'

// ── Global Context ─────────────────────────────────

const ProModalContext = createContext({
  open: false,
  setOpen: () => {},
})

export function ProModalProvider({ children }) {
  const [open, setOpen] = useState(false)
  return (
    <ProModalContext.Provider value={{ open, setOpen }}>
      {children}
      <ProUpgradeModal />
    </ProModalContext.Provider>
  )
}

export function useProModal() {
  return useContext(ProModalContext)
}

// ── Checklist data (matches Vue 2 popup.vue exactly) ──

const checklistItems = [
  {
    text: 'Give your team & projects additional pace with 10+ premium modules such as - ',
    bold: 'Stripe Gateway, Time Tracker, Sub Task, Invoice, Kanban Board, Gantt Chart, WooCommerce Order, BuddyPress',
    suffix: ' etc',
  },
  {
    text: 'Experience the ',
    bold: 'Advanced Files Manager',
    mid: ' that helps you to ',
    bold2: 'upload, store',
    mid2: ' or ',
    bold3: 'create files, documents, custom fields,',
    mid3: ' and ',
    bold4: 'images',
    suffix: ' from one place and keeps you hassle-free',
  },
  {
    text: 'Get more ',
    bold: 'Advanced Reporting, Automatic',
    mid: ' Daily Digest Mail, and ',
    bold2: 'Real-Time Updates',
  },
  {
    text: '',
    bold: 'Collaborate',
    mid: ' with your team members privately with ',
    bold2: 'Built-in Private Messenger',
  },
]

// ── Modal Component ────────────────────────────────

// ── Auto-cycling image slider (same images as Vue) ──────────────────────

const SLIDER_IMAGES = [1, 2, 3, 4]

function getSliderImageUrl(num) {
  const base = typeof PM_Vars !== 'undefined' ? PM_Vars.dir_url : '/wp-content/plugins/wedevs-project-manager/'
  return `${base}views/assets/images/modules/popup-slider/slider-${num}.jpg`
}

function FeatureSlider() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % SLIDER_IMAGES.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginLeft: '10px', overflow: 'hidden', textAlign: 'center' }}>
      <div style={{ width: '100%', overflow: 'hidden', borderRadius: '8px' }}>
        <img
          src={getSliderImageUrl(SLIDER_IMAGES[active])}
          alt={`Feature ${active + 1}`}
          style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
        />
      </div>

      {/* Dots indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 0' }}>
        {SLIDER_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            style={{
              height: '10px',
              width: i === active ? '24px' : '10px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: i === active ? 'var(--pm-accent)' : 'var(--pm-border)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

function ProUpgradeModal() {
  const { open, setOpen } = useProModal()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent data-pm-dialog className="sm:max-w-[60vw] w-[60%] p-0 border-0 shadow-2xl [&>button]:hidden max-h-[90vh] overflow-y-auto block gap-0 rounded-lg">
        <DialogTitle className="sr-only">{__('Upgrade to Pro', 'wedevs-project-manager')}</DialogTitle>

        {/* Close button */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-5 right-5 z-10 p-2.5 rounded-full bg-black/5 hover:bg-black/10 text-pm-text-muted hover:text-pm-text transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr]" style={{ padding: '30px 40px 0' }}>
          {/* Left: Content */}
          <div className="py-4 pr-6">
            {/* Header — diamond + "Upgrade to" (matches Vue: 30px font, 500 weight) */}
            <div className="mb-5">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 0 }}>
                <img src={`${typeof PM_Vars !== 'undefined' ? PM_Vars.dir_url : '/wp-content/plugins/wedevs-project-manager/'}views/assets/images/modules/diamond.svg`} alt="" style={{ padding: '6px', background: 'linear-gradient(220deg, #FFF3DD 40%, #FFE3AD 98%)', borderRadius: '5px', width: '36px', height: '36px' }} />
                <span style={{ color: '#ff9000', fontSize: '30px', fontWeight: 500, lineHeight: '1.6' }}>{__('Upgrade to', 'wedevs-project-manager')}</span>
              </div>
              <h2 style={{ fontSize: '30px', fontWeight: 400, lineHeight: '1.6', margin: 0, color: 'var(--pm-text-primary)' }}>
                {__('WP Project Manager', 'wedevs-project-manager')} <span style={{ fontWeight: 700 }}>{__('Pro', 'wedevs-project-manager')}</span>
              </h2>
              <p style={{ fontSize: '20px', fontWeight: 400, color: 'var(--pm-text-muted)', lineHeight: '1.6', margin: 0 }}>
                {__('unlock and take advantage of our premium features', 'wedevs-project-manager')} 🎉
              </p>
            </div>

            {/* Checklist (matches Vue: flex, check-icon margin 1em 14px 0 0) */}
            <div className="space-y-2 mb-10">
              {checklistItems.map((item, i) => (
                <div key={i} className="flex" style={{ alignItems: 'flex-start' }}>
                  <img src={`${typeof PM_Vars !== 'undefined' ? PM_Vars.dir_url : '/wp-content/plugins/wedevs-project-manager/'}views/assets/images/modules/check.svg`} alt="" style={{ margin: '1em 14px 0 0', padding: '6px 5px', background: '#139F84', borderRadius: '20px', flexShrink: 0, width: '24px', height: '24px' }} />
                  <p style={{ color: 'var(--pm-text-muted)', marginBottom: '2px', paddingRight: '32px', lineHeight: '1.6', fontSize: '14px' }}>
                    {item.text && __(item.text, 'wedevs-project-manager')}
                    {item.bold && <span style={{ fontWeight: 500, color: 'var(--pm-text-primary)' }}>{__(item.bold, 'wedevs-project-manager')}</span>}
                    {item.mid && __(item.mid, 'wedevs-project-manager')}
                    {item.bold2 && <span style={{ fontWeight: 500, color: 'var(--pm-text-primary)' }}>{__(item.bold2, 'wedevs-project-manager')}</span>}
                    {item.mid2 && __(item.mid2, 'wedevs-project-manager')}
                    {item.bold3 && <span style={{ fontWeight: 500, color: 'var(--pm-text-primary)' }}>{__(item.bold3, 'wedevs-project-manager')}</span>}
                    {item.mid3 && __(item.mid3, 'wedevs-project-manager')}
                    {item.bold4 && <span style={{ fontWeight: 500, color: 'var(--pm-text-primary)' }}>{__(item.bold4, 'wedevs-project-manager')}</span>}
                    {item.suffix && __(item.suffix, 'wedevs-project-manager')}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA button — matches Vue: padding 15px 30px, #ff9000 */}
            <a
              href={UPGRADE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '15px 30px', borderRadius: '5px', color: '#fff', background: '#ff9000', textDecoration: 'none', fontWeight: 500, fontSize: '14px', minHeight: 'auto' }}
              onMouseEnter={e => e.currentTarget.style.background = '#d07805'}
              onMouseLeave={e => e.currentTarget.style.background = '#ff9000'}
            >
              {__('Upgrade to PRO ', 'wedevs-project-manager')}
              <Crown style={{ height: '16px', width: '16px' }} />
            </a>
          </div>

          {/* Right: Auto-cycling feature slider */}
          <FeatureSlider />
        </div>

        {/* Footer — matches Vue: flex, justify-between, margin-top 35px */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 40px 20px', marginTop: '15px', borderTop: '1px solid var(--pm-border)', paddingTop: '15px' }}>
          {[
            __('10,000+ successful businesses', 'wedevs-project-manager'),
            __('14 days no questions asked refund policy', 'wedevs-project-manager'),
            __('Industry leading 24x7 support', 'wedevs-project-manager'),
          ].map((text, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--pm-text-muted)', fontSize: '13px' }}>
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" fill="#139F84" d="M8.927 1.134c-.33-.33-.865-.33-1.195 0L3.374 5.492 1.897 4.015c-.33-.33-.865-.33-1.195 0s-.33.865 0 1.195l2.075 2.075c.33.33.865.33 1.195 0l4.955-4.955c.33-.33.33-.865 0-1.195z" />
              </svg>
              {text}
            </span>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProUpgradeModal
