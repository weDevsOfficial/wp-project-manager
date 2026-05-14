import { __ } from '@wordpress/i18n';
import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[PM] App render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      const __ = typeof window.__ === 'function' ? window.__ : (t) => t
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-pm-text-primary gap-3 p-8">
          <p className="text-lg font-semibold">{__('Something went wrong.', 'wedevs-project-manager')}</p>
          <p className="text-sm text-pm-text-muted">{this.state.error?.message}</p>
          <button
            className="text-sm underline text-pm-accent"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            {__('Try again', 'wedevs-project-manager')}
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
