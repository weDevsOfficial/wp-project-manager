/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/assets/src/**/*.{tsx,ts,js,jsx}',
  ],

  // !important on all utilities — needed because Radix UI portals
  // dropdowns/dialogs to <body>, outside our scoped container.
  important: true,

  // Disable Preflight — would reset WP admin styles globally
  corePlugins: {
    preflight: false,
  },

  theme: {
    extend: {
      // shadcn/ui required color tokens (CSS variable based)
      colors: {
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Project Manager custom tokens
        'pm-sidebar':            '#1A1A2E',
        'pm-sidebar-hover':      '#16213E',
        'pm-sidebar-active':     '#0F3460',
        'pm-sidebar-text':       '#A8B2D8',
        'pm-sidebar-txt-active': '#FFFFFF',
        'pm-surface':            '#FFFFFF',
        'pm-surface-muted':      '#F7F8FA',
        'pm-border':             '#E5E7EB',
        'pm-hover':              '#F3F4F6',
        'pm-accent':             '#7C3AED',
        'pm-accent-hover':       '#6D28D9',
        'pm-accent-light':       '#EDE9FE',
        'pm-text':               '#1F2937',
        'pm-text-muted':         '#6B7280',
        'pm-status-todo':        '#6B7280',
        'pm-status-ip':          '#3B82F6',
        'pm-status-review':      '#F59E0B',
        'pm-status-done':        '#10B981',
        'pm-status-late':        '#EF4444',
        'pm-priority-urgent':    '#EF4444',
        'pm-priority-high':      '#F97316',
        'pm-priority-normal':    '#3B82F6',
        'pm-priority-low':       '#9CA3AF',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        pm: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      spacing: {
        'pm-sidebar':           '240px',
        'pm-sidebar-collapsed': '56px',
        'pm-topbar':            '48px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}
