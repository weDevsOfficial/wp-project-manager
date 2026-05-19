import React from 'react'
import { cn } from '@lib/utils'

export default function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-pm-border flex flex-col gap-6">
      <div className={cn('p-2 rounded-full flex items-center justify-center self-start', bg)}>
        <Icon className={cn('w-5 h-5', color)} />
      </div>
      <div className="flex items-end justify-between gap-1">
        <span className="text-sm text-pm-text-muted leading-tight">{label}</span>
        <span className="text-3xl font-bold text-pm-text-primary tabular-nums leading-none shrink-0">
          {value}
        </span>
      </div>
    </div>
  )
}
