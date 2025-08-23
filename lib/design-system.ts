/**
 * Liquid Glass Design System
 * Core design tokens and utilities for the Spamsense dashboard
 */

// Color palette based on the design principles
export const colors = {
  trust: {
    blue: "var(--color-trust-blue)",
    50: "oklch(0.95 0.05 234)",
    100: "oklch(0.9 0.1 234)",
    500: "var(--color-trust-blue)",
    600: "oklch(0.55 0.2 234)",
    900: "oklch(0.3 0.25 234)",
  },
  energy: {
    orange: "var(--color-energy-orange)",
    50: "oklch(0.95 0.05 62)",
    100: "oklch(0.9 0.1 62)",
    500: "var(--color-energy-orange)",
    600: "oklch(0.65 0.18 62)",
    900: "oklch(0.35 0.22 62)",
  },
  growth: {
    green: "var(--color-growth-green)",
    50: "oklch(0.95 0.05 142)",
    100: "oklch(0.9 0.1 142)",
    500: "var(--color-growth-green)",
    600: "oklch(0.65 0.18 142)",
    900: "oklch(0.35 0.22 142)",
  },
  alert: {
    red: "var(--color-alert-red)",
    50: "oklch(0.95 0.05 30)",
    100: "oklch(0.9 0.1 30)",
    500: "var(--color-alert-red)",
    600: "oklch(0.55 0.25 30)",
    900: "oklch(0.3 0.28 30)",
  },
} as const;

// Glass effect variants
export const glassEffects = {
  primary: "glass-primary",
  secondary: "glass-secondary",
  hover: "glass-hover",
  active: "glass-active",
} as const;

// Animation variants
export const animations = {
  fadeIn: "animate-fade-in",
  slideIn: "animate-slide-in",
} as const;

// Shadow variants
export const shadows = {
  glass: "var(--shadow-glass)",
  elevated: "var(--shadow-elevated)",
  glowBlue: "var(--glow-blue)",
  glowOrange: "var(--glow-orange)",
} as const;

// Typography scale following Apple's guidelines
export const typography = {
  display: "text-4xl font-bold tracking-tight",
  title: "text-2xl font-semibold tracking-tight",
  heading: "text-xl font-semibold",
  body: "text-base font-medium",
  caption: "text-sm font-medium",
  micro: "text-xs font-medium",
} as const;

// Spacing based on 8px grid
export const spacing = {
  xs: "0.5rem", // 8px
  sm: "0.75rem", // 12px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px
} as const;

// Border radius variants
export const borderRadius = {
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
} as const;

// Status colors for booking states
export const statusColors = {
  confirmed: colors.growth.green,
  pending: colors.energy.orange,
  completed: colors.trust.blue,
  cancelled: colors.alert.red,
} as const;

// Export type for TypeScript inference
export type GlassEffect = keyof typeof glassEffects;
export type Animation = keyof typeof animations;
export type StatusColor = keyof typeof statusColors;
