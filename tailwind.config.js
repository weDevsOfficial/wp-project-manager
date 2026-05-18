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

  darkMode: 'class',

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

        // Project Manager custom tokens — reference CSS vars so dark mode works
        'pm-sidebar':            'var(--pm-sidebar)',
        'pm-sidebar-hover':      'var(--pm-sidebar-hover)',
        'pm-sidebar-active':     'var(--pm-sidebar-active)',
        'pm-sidebar-text':       'var(--pm-sidebar-text)',
        'pm-sidebar-txt-active': 'var(--pm-sidebar-txt-active)',
        'pm-surface':            'var(--pm-surface)',
        'pm-surface-muted':      'var(--pm-surface-muted)',
        'pm-border':             'var(--pm-border)',
        'pm-hover':              'var(--pm-hover)',
        'pm-accent':             'var(--pm-accent)',
        'pm-accent-hover':       'var(--pm-accent-hover)',
        'pm-accent-light':       'var(--pm-accent-light)',
        'pm-text':               'var(--pm-text)',
        'pm-text-muted':         'var(--pm-text-muted)',
        'pm-text-primary':       'var(--pm-text-primary)',
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
};

