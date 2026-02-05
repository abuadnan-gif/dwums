// Premium visual effects utilities
export class PremiumEffects {
  // Create glass morphism effect
  static glassMorphism(options = {}) {
    const {
      blur = '20px',
      saturation = '180%',
      lightOpacity = 0.1,
      darkOpacity = 0.1,
      borderWidth = '1px',
      borderRadius = '1rem'
    } = options

    return {
      backdropFilter: `blur(${blur}) saturate(${saturation})`,
      WebkitBackdropFilter: `blur(${blur}) saturate(${saturation})`,
      backgroundColor: `rgba(255, 255, 255, ${lightOpacity})`,
      border: `${borderWidth} solid rgba(255, 255, 255, 0.2)`,
      borderRadius,
      boxShadow: '0 8px 32px rgba(0, 102, 255, 0.1)',
      
      '.dark &': {
        backgroundColor: `rgba(15, 23, 42, ${darkOpacity})`,
        border: `${borderWidth} solid rgba(255, 255, 255, 0.1)`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }
    }
  }

  // Create gradient text
  static gradientText(gradient = 'primary', animated = false) {
    const gradients = {
      primary: 'linear-gradient(135deg, #0066FF 0%, #8B5CF6 100%)',
      success: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
      critical: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      accent: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    }

    const styles = {
      background: gradients[gradient] || gradients.primary,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }

    if (animated) {
      styles.backgroundSize = '200% 200%'
      styles.animation = 'gradientShift 3s ease infinite'
    }

    return styles
  }

  // Create floating animation
  static floating(distance = '10px', duration = '3s') {
    return {
      animation: `float ${duration} ease-in-out infinite`,
      '@keyframes float': {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: `translateY(-${distance})` },
      }
    }
  }

  // Create shine effect
  static shine(duration = '2s') {
    return {
      position: 'relative',
      overflow: 'hidden',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
        animation: `shine ${duration} infinite`,
      },
      '@keyframes shine': {
        '100%': { left: '100%' },
      }
    }
  }

  // Create pulse glow
  static pulseGlow(color = '#0066FF', size = '20px') {
    return {
      animation: `pulseGlow 2s ease-in-out infinite`,
      '@keyframes pulseGlow': {
        '0%, 100%': { boxShadow: `0 0 ${size} ${color}50` },
        '50%': { boxShadow: `0 0 ${size} ${color}80` },
      }
    }
  }

  // Create border gradient
  static borderGradient(gradient = 'primary', width = '2px') {
    const gradients = {
      primary: 'linear-gradient(135deg, #0066FF, #8B5CF6)',
      success: 'linear-gradient(135deg, #10B981, #06B6D4)',
      warning: 'linear-gradient(135deg, #F59E0B, #F97316)',
      critical: 'linear-gradient(135deg, #EF4444, #DC2626)',
    }

    return {
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        padding: width,
        background: gradients[gradient] || gradients.primary,
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        borderRadius: 'inherit',
      }
    }
  }

  // Create 3D lift effect
  static lift3D(height = '10px') {
    return {
      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: `translateY(-${height}) perspective(1000px) rotateX(5deg)`,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      },
      '.dark &:hover': {
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      }
    }
  }

  // Create particle effect
  static particles(count = 3, size = '2px') {
    const particles = {}
    
    for (let i = 0; i < count; i++) {
      particles[`&::particle-${i}`] = {
        content: '""',
        position: 'absolute',
        width: size,
        height: size,
        background: 'currentColor',
        borderRadius: '50%',
        animation: `particleFloat 3s ease-in-out infinite`,
        animationDelay: `${i * 0.5}s`,
        opacity: 0.3,
      }
    }

    return {
      position: 'relative',
      ...particles,
      '@keyframes particleFloat': {
        '0%, 100%': { 
          transform: 'translate(0, 0) scale(1)',
          opacity: 0.3,
        },
        '33%': { 
          transform: `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(1.5)`,
          opacity: 0.6,
        },
        '66%': { 
          transform: `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(0.8)`,
          opacity: 0.2,
        },
      }
    }
  }
}

// Export individual effects as functions
export const glass = PremiumEffects.glassMorphism
export const gradientText = PremiumEffects.gradientText
export const floating = PremiumEffects.floating
export const shine = PremiumEffects.shine
export const pulseGlow = PremiumEffects.pulseGlow
export const borderGradient = PremiumEffects.borderGradient
export const lift3D = PremiumEffects.lift3D
export const particles = PremiumEffects.particles