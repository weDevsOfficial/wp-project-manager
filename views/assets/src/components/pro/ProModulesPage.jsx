import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchModules, toggleModule } from '@store/pro/modulesSlice'
import { useI18n } from '@hooks/useI18n'
import { Switch } from '@components/ui/switch'
import { Skeleton } from '@components/ui/skeleton'
import {
  Columns3, GitBranch, Settings2, ShoppingCart, Repeat,
  BarChart, Users2, Clock, CreditCard, Receipt, Puzzle,
} from 'lucide-react'
import { toast } from 'sonner'

// Icon + color map keyed by directory name (first part of the API path)
// API returns keys like "Kanboard/Kanboard.php" — we match on the directory name
const MODULE_META = {
  Kanboard:            { icon: Columns3,    color: 'text-blue-500 bg-blue-50' },
  Sub_Tasks:           { icon: GitBranch,   color: 'text-orange-500 bg-orange-50' },
  Custom_Fields:       { icon: Settings2,   color: 'text-purple-500 bg-purple-50' },
  Woo_Project:         { icon: ShoppingCart, color: 'text-violet-500 bg-violet-50' },
  Task_Recurring:      { icon: Repeat,      color: 'text-cyan-500 bg-cyan-50' },
  Gantt:               { icon: BarChart,    color: 'text-indigo-500 bg-indigo-50' },
  PM_Pro_Buddypress:   { icon: Users2,      color: 'text-amber-500 bg-amber-50' },
  Time_Tracker:        { icon: Clock,       color: 'text-emerald-500 bg-emerald-50' },
  Stripe:              { icon: CreditCard,  color: 'text-pink-500 bg-pink-50' },
  Invoice:             { icon: Receipt,     color: 'text-red-500 bg-red-50' },
}

// Extract directory name from API path like "Kanboard/Kanboard.php" → "Kanboard"
function getModuleDir(path) {
  return path.split('/')[0] || path
}

export default function ProModulesPage() {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const { allModules, activeModules, loading } = useAppSelector(s => s.modules)

  useEffect(() => {
    dispatch(fetchModules())
  }, [dispatch])

  const modulesList = Object.entries(allModules).map(([path, mod]) => ({
    path,
    name: mod.name || path,
    description: mod.description || '',
  }))

  const isActive = (path) => activeModules.some(m => m.path === path)

  const handleToggle = (path) => {
    const currentlyActive = isActive(path)
    dispatch(toggleModule({ moduleId: path, active: !currentlyActive })).then((action) => {
      if (!action.error) {
        toast.success(!currentlyActive ? __('Module enabled') : __('Module disabled'))
        setTimeout(() => window.location.reload(), 500)
      }
    })
  }

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Header — matches free ModulesPage */}
      <div>
        <h1 className="text-xl font-bold text-pm-text-primary">{__('Modules')}</h1>
        <p className="text-sm text-pm-text-muted mt-0.5">
          {__('Enable or disable project manager modules')}
        </p>
      </div>

      {/* Module grid — same card design as free */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modulesList.map(mod => {
          const dirName = getModuleDir(mod.path)
          const meta = MODULE_META[dirName] || { icon: Puzzle, color: 'text-gray-500 bg-gray-50' }
          const Icon = meta.icon
          const [fg, bg] = meta.color.split(' ')
          const active = isActive(mod.path)

          return (
            <div
              key={mod.path}
              className="group relative rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                {/* Header: icon + toggle */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl ${bg} group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${fg}`} />
                  </div>
                  <Switch
                    checked={active}
                    onCheckedChange={() => handleToggle(mod.path)}
                  />
                </div>

                {/* Title + description */}
                <h3 className="text-sm font-semibold text-pm-text-primary mb-1.5">
                  {__(mod.name)}
                </h3>
                <p className="text-xs text-pm-text-muted leading-relaxed">
                  {__(mod.description)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
