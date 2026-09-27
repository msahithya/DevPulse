/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Charcoal base
        surface: {
          50:  '#f8f9fa',
          100: '#1a1d23',
          200: '#14171e',
          300: '#0f1116',
          400: '#0b0d12',
          500: '#07090d',
        },
        // Border
        border: {
          DEFAULT: '#1e2330',
          subtle: '#161923',
          bright: '#2a3040',
        },
        // Emerald accent
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        // Cyan accent
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        // Text
        text: {
          primary: '#e8eaf0',
          secondary: '#8b92a5',
          muted: '#4b5263',
          code: '#a8b4c8',
        },
        // Risk levels
        risk: {
          critical: '#ef4444',
          high: '#f97316',
          medium: '#eab308',
          low: '#22c55e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      backgroundImage: {
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        'gradient-emerald': 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
        'gradient-subtle': 'linear-gradient(180deg, rgba(16,185,129,0.05) 0%, rgba(6,182,212,0.02) 100%)',
      },
      boxShadow: {
        'glass': '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 0 0 1px rgba(255,255,255,0.02)',
        'glow-emerald': '0 0 20px rgba(16,185,129,0.15)',
        'glow-cyan': '0 0 20px rgba(6,182,212,0.15)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-in': 'slide-in 0.2s ease-out',
        'pulse-dot': 'pulse-dot 1.5s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}
