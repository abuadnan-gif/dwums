/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
      '17': '4.25rem',  // 68px for header + divider
      '28': '7rem',     // 112px for desktop header
      '29': '7.25rem',  // 116px for desktop header + divider
    },
      colors: {
        primary: { 
          light: '#0066FF', 
          DEFAULT: '#0066FF', 
          dark: '#3B82F6' 
        },
        secondary: { 
          light: '#10B981', 
          DEFAULT: '#10B981', 
          dark: '#34D399' 
        },
        accent: { 
          light: '#8B5CF6', 
          DEFAULT: '#8B5CF6', 
          dark: '#A78BFA' 
        },
        neutral: { 
          light: '#1F2937', 
          DEFAULT: '#1F2937', 
          dark: '#F9FAFB' 
        },
        surface: { 
          light: '#FFFFFF', 
          DEFAULT: '#FFFFFF', 
          dark: '#0F172A' 
        },
        background: { 
          light: '#F8FAFC', 
          DEFAULT: '#F8FAFC', 
          dark: '#020617' 
        },
        success: { 
          light: '#059669', 
          DEFAULT: '#059669', 
          dark: '#10B981' 
        },
        warning: { 
          light: '#D97706', 
          DEFAULT: '#D97706', 
          dark: '#F59E0B' 
        },
        critical: { 
          light: '#DC2626', 
          DEFAULT: '#DC2626', 
          dark: '#EF4444' 
        },
        informational: { 
          light: '#2563EB', 
          DEFAULT: '#2563EB', 
          dark: '#60A5FA' 
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'], // Changed from 'inter' to 'sans'
        'mono': ['JetBrains Mono', 'monospace'],
        'display': ['SF Pro Display', 'Inter', 'sans-serif']
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0066FF 0%, #8B5CF6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
        'gradient-accent': 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
        'gradient-success': 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
        'gradient-warning': 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
        'gradient-critical': 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
        'gradient-light-primary': 'linear-gradient(135deg, rgba(0, 102, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        'gradient-light-secondary': 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%)',
        'gradient-light-accent': 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)',
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: '200px 0' },
        },
      },
    },
  },
  plugins: [],
}