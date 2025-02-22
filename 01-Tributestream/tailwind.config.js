/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
          light: '#60a5fa'
        },
        secondary: {
          DEFAULT: '#64748b',
          dark: '#475569',
          light: '#94a3b8'
        },
        accent: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          light: '#fbbf24'
        },
        destructive: {
          DEFAULT: '#ef4444',
          dark: '#dc2626',
          light: '#f87171'
        },
        muted: {
          DEFAULT: '#6b7280',
          dark: '#4b5563',
          light: '#9ca3af'
        },
        background: 'white',
        foreground: '#1f2937',
        card: {
          DEFAULT: 'white',
          foreground: '#1f2937'
        }
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem'
      }
    }
  },
  plugins: []
}