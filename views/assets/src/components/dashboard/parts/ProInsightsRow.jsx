import { __ } from '@wordpress/i18n'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Timer, Zap, Receipt } from 'lucide-react'
import { useProApi } from '@hooks/useProApi'
import { Card } from '@components/ui/card'
import { Progress } from '@components/ui/progress'
import { cn } from '@lib/utils'

function fmtDuration(seconds) {
  const s = Math.max(0, parseInt(seconds, 10) || 0)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (h === 0 && m === 0) return '0m'
  return `${h > 0 ? h + 'h ' : ''}${m}m`.trim()
}

function Tile({ icon: Icon, accent, children, onClick }) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-4 border-pm-border flex items-center gap-4 transition-shadow',
        onClick && 'cursor-pointer hover:shadow-md',
      )}
    >
      <span className={cn('flex items-center justify-center w-10 h-10 rounded-lg shrink-0', accent)}>
        <Icon className="w-5 h-5" />
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </Card>
  )
}

export default function ProInsightsRow() {
  const proApi = useProApi()
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    let cancelled = false
    proApi.get('dashboard-pro')
      .then(res => { if (!cancelled) setData(res?.data ?? res) })
      .catch(() => { /* pro insights are best-effort */ })
    return () => { cancelled = true }
  }, [])

  if (!data) return null

  const { time, sprint, invoice } = data
  const tiles = []

  if (time?.enabled) {
    tiles.push(
      <Tile key="time" icon={Timer} accent="bg-violet-100 text-violet-600" onClick={() => navigate('/reports')}>
        <div className="text-[12px] text-pm-text-muted">{__('Time tracked today', 'wedevs-project-manager')}</div>
        <div className="text-xl font-bold text-pm-text-primary leading-tight">{fmtDuration(time.today_seconds)}</div>
        <div className="text-[11px] text-pm-text-muted">{fmtDuration(time.week_seconds)} {__('this week', 'wedevs-project-manager')}</div>
      </Tile>
    )
  }

  if (sprint?.enabled && sprint?.active) {
    tiles.push(
      <Tile key="sprint" icon={Zap} accent="bg-amber-100 text-amber-600" onClick={() => navigate('/sprints')}>
        <div className="text-[12px] text-pm-text-muted truncate">{sprint.title || __('Active Sprint', 'wedevs-project-manager')}</div>
        <div className="text-xl font-bold text-pm-text-primary leading-tight">{sprint.done}/{sprint.total}</div>
        <Progress value={sprint.progress} className="h-1.5 mt-1" />
      </Tile>
    )
  }

  if (invoice?.enabled) {
    tiles.push(
      <Tile key="invoice" icon={Receipt} accent="bg-emerald-100 text-emerald-600">
        <div className="text-[12px] text-pm-text-muted">{__('Invoices', 'wedevs-project-manager')}</div>
        <div className="text-xl font-bold text-pm-text-primary leading-tight">{invoice.total}</div>
        <div className="text-[11px] text-pm-text-muted">
          <span className="text-emerald-600">{invoice.paid} {__('paid', 'wedevs-project-manager')}</span>
          {' · '}
          <span className="text-rose-500">{invoice.unpaid} {__('due', 'wedevs-project-manager')}</span>
        </div>
      </Tile>
    )
  }

  if (tiles.length === 0) return null

  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{tiles}</div>
}
