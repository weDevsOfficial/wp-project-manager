import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchCustomFields, setCustomFieldValue } from '@store/pro/customFieldsSlice'
import { useI18n } from '@hooks/useI18n'
import { Input } from '@components/ui/input'
import { Textarea } from '@components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Checkbox } from '@components/ui/checkbox'
import { Separator } from '@components/ui/separator'
import { Skeleton } from '@components/ui/skeleton'
import { TextCursorInput, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

function FieldInput({ field, value, onChange }) {
  const type = field.type || field.field_type || 'text'

  switch (type) {
    case 'text':
      return (
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 text-sm"
          placeholder={field.placeholder || field.description || ''}
        />
      )
    case 'textarea':
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="text-sm"
          placeholder={field.description || ''}
        />
      )
    case 'number':
      return (
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 text-sm"
        />
      )
    case 'date':
      return (
        <Input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 text-sm"
        />
      )
    case 'checkbox':
      return (
        <div className="pt-1">
          <Checkbox
            checked={value === '1' || value === true || value === 'true'}
            onCheckedChange={(checked) => onChange(checked ? '1' : '0')}
          />
        </div>
      )
    case 'dropdown':
    case 'select': {
      const options = Array.isArray(field.options)
        ? field.options
        : field.optional_value
          ? (typeof field.optional_value === 'string'
            ? field.optional_value.split(',').map(o => o.trim())
            : Array.isArray(field.optional_value) ? field.optional_value : [])
          : []

      return (
        <Select value={value || 'none'} onValueChange={(v) => onChange(v === 'none' ? '' : v)}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder={field.description || ''} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">—</SelectItem>
            {options.map((opt, i) => {
              const val = typeof opt === 'object' ? (opt.value || opt.label || '') : String(opt)
              const label = typeof opt === 'object' ? (opt.label || opt.value || '') : String(opt)
              return <SelectItem key={i} value={val}>{label}</SelectItem>
            })}
          </SelectContent>
        </Select>
      )
    }
    default:
      return (
        <Input value={value || ''} onChange={(e) => onChange(e.target.value)} className="h-8 text-sm" />
      )
  }
}

export default function CustomFieldsSection({ projectId, taskId, taskCustomFields = {} }) {
  const { __ } = useI18n()
  const dispatch = useAppDispatch()
  const { fields, loading } = useAppSelector(s => s.customFields)
  const [values, setValues] = useState({})
  const [savedFields, setSavedFields] = useState({}) // tracks save status per field

  useEffect(() => {
    if (projectId && taskId) dispatch(fetchCustomFields({ projectId, taskId }))
  }, [projectId, taskId, dispatch])

  useEffect(() => {
    const initial = {}
    fields.forEach(f => {
      initial[f.id] = f.value?.value ?? taskCustomFields[f.id] ?? ''
    })
    setValues(initial)
  }, [fields, taskCustomFields])

  const debounceRef = useRef({})

  const handleChange = useCallback((fieldId, value) => {
    setValues(prev => ({ ...prev, [fieldId]: value }))
    setSavedFields(prev => ({ ...prev, [fieldId]: 'saving' }))

    clearTimeout(debounceRef.current[fieldId])
    debounceRef.current[fieldId] = setTimeout(() => {
      dispatch(setCustomFieldValue({ projectId, fieldId, taskId, value }))
        .then(() => {
          setSavedFields(prev => ({ ...prev, [fieldId]: 'saved' }))
          setTimeout(() => setSavedFields(prev => ({ ...prev, [fieldId]: '' })), 1500)
        })
    }, 500)
  }, [dispatch, projectId, taskId])

  if (loading) {
    return (
      <div className="space-y-2 pt-2">
        <Separator className="mb-2" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  if (fields.length === 0) return null

  return (
    <div className="pt-2">
      <Separator className="mb-3" />
      <div className="space-y-1">
        {fields.map(field => (
          <div key={field.id} className="flex items-start min-h-[28px]">
            <div className="flex items-center gap-2 text-pm-text-muted w-28 shrink-0 pt-1">
              <TextCursorInput className="h-3.5 w-3.5" />
              <span className="text-xs truncate" title={field.title}>{field.title}</span>
            </div>
            <div className="flex-1 relative">
              <FieldInput
                field={field}
                value={values[field.id]}
                onChange={(v) => handleChange(field.id, v)}
              />
              {/* Save indicator */}
              {savedFields[field.id] === 'saved' && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
              {savedFields[field.id] === 'saving' && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2">
                  <span className="w-3 h-3 rounded-full border-2 border-pm-accent border-t-transparent animate-spin inline-block" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
