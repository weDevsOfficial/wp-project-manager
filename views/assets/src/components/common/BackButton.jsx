import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/ui/button'
import { cn } from '@lib/utils'

export default function BackButton({ fallback = '/', label, variant = 'ghost', size = 'icon', className }) {
  const navigate = useNavigate()
  const handleClick = () => window.history.length > 2 ? navigate(-1) : navigate(fallback)

  if (label) {
    return (
      <Button
        variant={variant === 'ghost' ? 'outline' : variant}
        size="sm"
        className={cn('gap-1.5 bg-white hover:border-pm-accent hover:text-pm-accent', className)}
        onClick={handleClick}
      >
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Button>
    )
  }

  return (
    <Button variant="ghost" size="icon" className={cn('h-8 w-8', className)} onClick={handleClick}>
      <ArrowLeft className="h-5 w-5" />
    </Button>
  )
}
