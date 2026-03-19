import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import { fetchCustomFields, setCustomFieldValue } from '@store/pro/customFieldsSlice'
import { useI18n } from '@hooks/useI18n'
import { Input } from '@components/ui/input'
import { Textarea } from '@components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Checkbox } from '@components/ui/checkbox'
import { Skeleton } from '@components/ui/skeleton'
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
          placeholder={field.placeholder || ''}
        />
      )
    case 'textarea':
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="text-sm"
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
        <Checkbox
          checked={value === '1' || value === true}
          onCheckedChange={(checked) => onChange(checked ? '1' : '0')}
        />
      )
    case 'dropdown':
    case 'select':
      return (
        <Select value={value || ''} onValueChange={onChange}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(field.options || []).map((opt, i) => (
              <SelectItem key={i} value={opt.value || opt}>{opt.label || opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
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

  useEffect(() => {
    if (projectId && taskId) dispatch(fetchCustomFields({ projectId, taskId }))
  }, [projectId, taskId, dispatch])

  useEffect(() => {
    // Initialize values from API response — each field has .value property
    const initial = {}
    fields.forEach(f => {
      initial[f.id] = f.value?.value ?? taskCustomFields[f.id] ?? ''
    })
    setValues(initial)
  }, [fields, taskCustomFields])

  const debounceRef = useRef({})

  const handleChange = useCallback((fieldId, value) => {
    setValues(prev => ({ ...prev, [fieldId]: value }))
    // Debounce API calls — 500ms delay per field
    clearTimeout(debounceRef.current[fieldId])
    debounceRef.current[fieldId] = setTimeout(() => {
      dispatch(setCustomFieldValue({ projectId, fieldId, taskId, value }))
    }, 500)
  }, [dispatch, projectId, taskId])

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  if (fields.length === 0) return null

  return (
    <div className="space-y-3">
      {fields.map(field => (
        <div key={field.id} className="flex items-start gap-3">
          <label className="text-xs font-medium text-pm-text-muted w-28 pt-1.5 shrink-0 truncate" title={field.title}>
            {field.title}
          </label>
          <div className="flex-1">
            <FieldInput field={field} value={values[field.id]} onChange={(v) => handleChange(field.id, v)} />
          </div>
        </div>
      ))}
    </div>
  )
}
