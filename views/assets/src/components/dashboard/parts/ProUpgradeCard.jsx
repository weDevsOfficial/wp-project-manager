import { __ } from '@wordpress/i18n'
import { useNavigate } from 'react-router-dom'
import { Crown, Check } from 'lucide-react'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'

/**
 * Non-pro upsell tile (managers only) — mirrors the "premium" promo pattern.
 * When Pro IS active this card is not rendered (see DashboardPage).
 */
export default function ProUpgradeCard() {
  const navigate = useNavigate()

  const perks = [
    __('Time tracking & reports', 'wedevs-project-manager'),
    __('Kanban & Gantt views', 'wedevs-project-manager'),
    __('Invoices & sprints', 'wedevs-project-manager'),
  ]

  return (
    <Card className="p-5 border-transparent bg-gradient-to-br from-pm-accent to-[#5b21b6] text-white flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <Crown className="w-5 h-5" />
        <h3 className="text-[15px] font-semibold">{__('Unlock Pro', 'wedevs-project-manager')}</h3>
      </div>
      <p className="text-[13px] text-white/85 mb-3">
        {__('Get advanced analytics and team productivity tools.', 'wedevs-project-manager')}
      </p>
      <ul className="space-y-1.5 mb-4">
        {perks.map(p => (
          <li key={p} className="flex items-center gap-2 text-[13px] text-white/90">
            <Check className="w-4 h-4 shrink-0" />{p}
          </li>
        ))}
      </ul>
      <Button
        variant="secondary"
        className="mt-auto bg-white text-pm-accent hover:bg-white/90"
        onClick={() => navigate('/premium')}
      >
        {__('Upgrade to Pro', 'wedevs-project-manager')}
      </Button>
    </Card>
  )
}
