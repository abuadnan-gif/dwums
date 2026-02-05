// Ultra-premium color system for G-TECH Smart
export const COLORS = {
  // Primary Palette
  primary: {
    light: '#0066FF', // Vibrant blue
    dark: '#3B82F6',  // Softer blue for dark mode
  },
  
  // Secondary Palette
  secondary: {
    light: '#10B981', // Emerald green
    dark: '#34D399',  // Mint green for dark mode
  },
  
  // Accent Palette
  accent: {
    light: '#8B5CF6', // Royal purple
    dark: '#A78BFA',  // Lavender for dark mode
  },
  
  // Status Colors
  status: {
    success: {
      light: '#059669',
      dark: '#10B981',
    },
    warning: {
      light: '#D97706',
      dark: '#F59E0B',
    },
    critical: {
      light: '#DC2626',
      dark: '#EF4444',
    },
    info: {
      light: '#2563EB',
      dark: '#60A5FA',
    },
  },
  
  // Neutral Palette
  neutral: {
    50: { light: '#F9FAFB', dark: '#0F172A' },
    100: { light: '#F3F4F6', dark: '#1E293B' },
    200: { light: '#E5E7EB', dark: '#334155' },
    300: { light: '#D1D5DB', dark: '#475569' },
    400: { light: '#9CA3AF', dark: '#64748B' },
    500: { light: '#6B7280', dark: '#94A3B8' },
    600: { light: '#4B5563', dark: '#CBD5E1' },
    700: { light: '#374151', dark: '#E2E8F0' },
    800: { light: '#1F2937', dark: '#F1F5F9' },
    900: { light: '#111827', dark: '#F8FAFC' },
  },
  
  // Surface Colors
  surface: {
    light: '#FFFFFF',
    dark: '#0F172A',
  },
  
  // Background Colors
  background: {
    light: '#F8FAFC',
    dark: '#020617',
  },
  
  // Gradient Definitions
  gradients: {
    primary: {
      light: 'linear-gradient(135deg, #0066FF 0%, #8B5CF6 100%)',
      dark: 'linear-gradient(135deg, #3B82F6 0%, #A78BFA 100%)',
    },
    success: {
      light: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
      dark: 'linear-gradient(135deg, #34D399 0%, #22D3EE 100%)',
    },
    warning: {
      light: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
      dark: 'linear-gradient(135deg, #FBBF24 0%, #FB923C 100%)',
    },
    critical: {
      light: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      dark: 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)',
    },
  },
  
  // Glass Morphism Effects
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    dark: 'rgba(0, 0, 0, 0.1)',
    blur: 'blur(20px)',
  },
}

// Get color based on theme
export function getColor(type, variant = 'default', isDark = false) {
  const colorMap = {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    accent: COLORS.accent,
    success: COLORS.status.success,
    warning: COLORS.status.warning,
    critical: COLORS.status.critical,
    info: COLORS.status.info,
    surface: COLORS.surface,
    background: COLORS.background,
  }
  
  const color = colorMap[type]
  if (!color) return isDark ? COLORS.neutral[400].dark : COLORS.neutral[400].light
  
  if (typeof color === 'object' && 'light' in color && 'dark' in color) {
    return isDark ? color.dark : color.light
  }
  
  return color
}

// Get gradient based on theme
export function getGradient(type, isDark = false) {
  const gradient = COLORS.gradients[type]
  if (!gradient) return COLORS.gradients.primary
  
  return isDark ? gradient.dark : gradient.light
}