import React, { useState } from 'react'
import { useI18n } from '@hooks/useI18n'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group'
import { Label } from '@components/ui/label'
import { Repeat } from 'lucide-react'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function TaskRecurrence({ recurrence, onChange }) {
  const { __ } = useI18n()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState(recurrence?.type || 'no')
  const [interval, setInterval] = useState(recurrence?.interval || 1)
  const [weekdays, setWeekdays] = useState(recurrence?.weekdays || [])
  const [expireType, setExpireType] = useState(recurrence?.expire_type || 'never')
  const [expireDate, setExpireDate] = useState(recurrence?.expire_date || '')
  const [occurrences, setOccurrences] = useState(recurrence?.occurrences || 10)

  const handleSave = () => {
    onChange({
      type,
      interval,
      weekdays: type === 'week' ? weekdays : [],
      expire_type: expireType,
      expire_date: expireType === 'date' ? expireDate : '',
      occurrences: expireType === 'after' ? occurrences : 0,
    })
    setOpen(false)
  }

  const handleClear = () => {
    setType('no')
    onChange(null)
    setOpen(false)
  }

  const toggleWeekday = (day) => {
    setWeekdays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  }

  const hasRecurrence = type && type !== 'no'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex items-center gap-1.5 text-xs px-2 py-1 rounded-md border transition-colors',
            hasRecurrence
              ? 'border-pm-accent/30 bg-pm-accent/5 text-pm-accent'
              : 'border-pm-border text-pm-text-muted hover:border-pm-accent/30'
          )}
        >
          <Repeat className="h-3 w-3" />
          {hasRecurrence ? `${__('Every')} ${interval} ${type}` : __('No repeat')}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="start">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-pm-text-muted">{__('Repeat')}</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-8 text-sm mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">{__('No repeat')}</SelectItem>
                <SelectItem value="day">{__('Daily')}</SelectItem>
                <SelectItem value="week">{__('Weekly')}</SelectItem>
                <SelectItem value="month">{__('Monthly')}</SelectItem>
                <SelectItem value="year">{__('Yearly')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type !== 'no' && (
            <>
              <div>
                <label className="text-xs font-medium text-pm-text-muted">{__('Every')}</label>
                <Input
                  type="number"
                  min={1}
                  value={interval}
                  onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                  className="h-8 text-sm mt-1 w-20"
                />
              </div>

              {type === 'week' && (
                <div>
                  <label className="text-xs font-medium text-pm-text-muted mb-1.5 block">{__('On days')}</label>
                  <div className="flex gap-1">
                    {WEEKDAYS.map((day, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleWeekday(i)}
                        className={cn(
                          'w-8 h-8 rounded-full text-[10px] font-medium transition-colors',
                          weekdays.includes(i)
                            ? 'bg-pm-accent text-white'
                            : 'bg-muted text-pm-text-muted hover:bg-muted/80'
                        )}
                      >
                        {day[0]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-pm-text-muted mb-1.5 block">{__('Ends')}</label>
                <RadioGroup value={expireType} onValueChange={setExpireType} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem className="h-5 w-5" value="never" id="expire-never" />
                    <Label htmlFor="expire-never" className="text-sm cursor-pointer">{__('Never')}</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem className="h-5 w-5" value="date" id="expire-date" />
                    <Label htmlFor="expire-date" className="text-sm cursor-pointer">{__('On date')}</Label>
                  </div>
                  {expireType === 'date' && (
                    <Input type="date" value={expireDate} onChange={(e) => setExpireDate(e.target.value)} className="h-7 text-sm ml-6 w-40" />
                  )}
                  <div className="flex items-center gap-3">
                    <RadioGroupItem className="h-5 w-5" value="after" id="expire-after" />
                    <Label htmlFor="expire-after" className="text-sm cursor-pointer">{__('After')}</Label>
                  </div>
                  {expireType === 'after' && (
                    <div className="flex items-center gap-1.5 ml-6">
                      <Input type="number" min={1} value={occurrences} onChange={(e) => setOccurrences(parseInt(e.target.value) || 1)} className="h-7 text-sm w-16" />
                      <span className="text-xs text-pm-text-muted">{__('occurrences')}</span>
                    </div>
                  )}
                </RadioGroup>
              </div>

              <div className="flex gap-1.5 pt-1">
                <Button size="sm" className="h-7 text-xs" onClick={handleSave}>{__('Save')}</Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={handleClear}>{__('Clear')}</Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
