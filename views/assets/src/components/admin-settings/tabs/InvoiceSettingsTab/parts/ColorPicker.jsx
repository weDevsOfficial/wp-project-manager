import React from 'react'
import { ColorPicker as SharedColorPicker } from '@components/ui/color-picker'
import { PRESET_COLORS } from '../constants'

export default function ColorPicker({ value, onChange }) {
  return (
    <SharedColorPicker
      value={value || '#82b541'}
      onChange={(c) => onChange(c || '#82b541')}
      presetColors={PRESET_COLORS}
      align="end"
      placeholder="#82b541"
    />
  )
}
