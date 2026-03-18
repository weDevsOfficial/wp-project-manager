import React, { createContext, useContext, useState, useEffect } from 'react'
import { useI18n } from '@hooks/useI18n'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@components/ui/dialog'
import { Check, Crown, X } from 'lucide-react'

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

// ── Auto-cycling feature slides ──────────────────────

const SLIDES = [
  {
    title: 'Kanban Board',
    dot: 'bg-emerald-400',
    render: () => (
      <div className="grid grid-cols-3 gap-2">
        {['To Do', 'In Progress', 'Done'].map(col => (
          <div key={col} className="rounded-lg bg-gray-50 p-2">
            <p className="text-[9px] font-medium text-gray-400 mb-1.5">{col}</p>
            <div className="h-5 rounded bg-white border mb-1 shadow-sm" />
            <div className="h-5 rounded bg-white border shadow-sm" />
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Time Tracker',
    dot: 'bg-blue-400',
    render: () => (
      <div className="flex flex-col items-center py-4">
        <div className="text-3xl font-mono font-bold text-gray-700">00:45:32</div>
        <div className="flex gap-2 mt-3">
          <span className="h-7 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-medium text-emerald-600">Start</span>
          <span className="h-7 w-16 rounded-full bg-red-100 flex items-center justify-center text-[10px] font-medium text-red-500">Stop</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Gantt Chart',
    dot: 'bg-orange-400',
    render: () => (
      <div className="space-y-2 py-2">
        {[{ w: '80%', c: '#7C3AED' }, { w: '60%', c: '#a78bfa' }, { w: '90%', c: '#7C3AED' }, { w: '45%', c: '#a78bfa' }].map((b, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[9px] text-gray-400 w-12 shrink-0">Task {i + 1}</span>
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: b.w, background: b.c }} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Advanced Reports',
    dot: 'bg-purple-400',
    render: () => (
      <div className="flex items-end gap-1 h-24 px-2">
        {[40, 65, 30, 80, 55, 70, 45, 60, 35, 75].map((h, i) => (
          <div key={i} className="flex-1 rounded-t transition-all" style={{ height: `${h}%`, background: i % 2 === 0 ? '#7C3AED' : '#a78bfa' }} />
        ))}
      </div>
    ),
  },
]

function FeatureSlider() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % SLIDES.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const slide = SLIDES[active]

  return (
    <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-5">
      <div className="w-full rounded-xl bg-white shadow-lg p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <div className={`h-3 w-3 rounded-full ${slide.dot}`} />
          {slide.title}
        </div>
        <div className="min-h-[120px] flex items-center">
          <div className="w-full">{slide.render()}</div>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex items-center gap-2 mt-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all ${i === active ? 'w-5 bg-pm-accent' : 'w-2 bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  )
}

function ProUpgradeModal() {
  const { open, setOpen } = useProModal()
  const { __ } = useI18n()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent data-pm-dialog className="sm:max-w-[55vw] w-[55%] p-0 border-0 shadow-2xl [&>button]:hidden max-h-[85vh] overflow-y-auto block gap-0">
        <DialogTitle className="sr-only">Upgrade to Pro</DialogTitle>

        {/* Close button — visible like Vue 2 */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-5 right-5 z-10 p-2.5 rounded-full bg-black/5 hover:bg-black/10 text-gray-500 hover:text-gray-800 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 md:auto-rows-auto">
          {/* Left: Content */}
          <div className="p-6">
            {/* Header — diamond + "Upgrade to" */}
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-1.5 rounded-md" style={{ background: 'linear-gradient(220deg, #FFF3DD 40%, #FFE3AD 98%)' }}>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#ff9000" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <span className="text-2xl font-medium" style={{ color: '#ff9000' }}>{__('Upgrade to')}</span>
              </div>
              <h2 className="text-2xl font-normal text-pm-text-primary leading-tight">
                {__('WP Project Manager')} <span className="font-bold">{__('Pro')}</span>
              </h2>
              <p className="text-sm mt-1" style={{ color: '#656668' }}>
                {__('unlock and take advantage of our premium features')} 🎉
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-3 mb-6">
              {checklistItems.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="shrink-0 mt-1">
                    <span className="flex items-center justify-center h-5 w-5 rounded-full" style={{ background: '#139F84' }}>
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#656668' }}>
                    {item.text && __(item.text)}
                    {item.bold && <span className="font-medium text-black">{__(item.bold)}</span>}
                    {item.mid && __(item.mid)}
                    {item.bold2 && <span className="font-medium text-black">{__(item.bold2)}</span>}
                    {item.mid2 && __(item.mid2)}
                    {item.bold3 && <span className="font-medium text-black">{__(item.bold3)}</span>}
                    {item.mid3 && __(item.mid3)}
                    {item.bold4 && <span className="font-medium text-black">{__(item.bold4)}</span>}
                    {item.suffix && __(item.suffix)}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA button — orange with crown */}
            <a
              href={UPGRADE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-md text-white font-medium text-sm no-underline transition-colors"
              style={{ background: '#ff9000' }}
              onMouseEnter={e => e.currentTarget.style.background = '#d07805'}
              onMouseLeave={e => e.currentTarget.style.background = '#ff9000'}
            >
              {__('Upgrade to PRO')}
              <Crown className="h-4 w-4" />
            </a>
          </div>

          {/* Right: Auto-cycling feature slider */}
          <FeatureSlider />
        </div>

        {/* Footer — trust indicators */}
        <div className="px-6 py-3 border-t bg-gray-50/50 flex items-center justify-center gap-5 flex-wrap">
          {[
            __('10,000+ successful businesses'),
            __('14 days no questions asked refund policy'),
            __('Industry leading 24x7 support'),
          ].map((text, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs" style={{ color: '#656668' }}>
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
