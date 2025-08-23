import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Helper to apply glass effects with optional variants
 */
export function glassVariant(
  variant: "primary" | "secondary" | "hover" | "active" = "primary",
  className?: string
) {
  const variants = {
    primary: "glass-primary",
    secondary: "glass-secondary", 
    hover: "glass-hover",
    active: "glass-active"
  }
  
  return cn(variants[variant], className)
}

/**
 * Helper to apply status-based styling
 */
export function statusVariant(
  status: "confirmed" | "pending" | "completed" | "cancelled",
  className?: string
) {
  const variants = {
    confirmed: "bg-green-500/10 text-green-600 border-green-500/20",
    pending: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    completed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    cancelled: "bg-red-500/10 text-red-600 border-red-500/20"
  }
  
  return cn(variants[status], className)
}

/**
 * Format currency values
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

/**
 * Format time for display
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d)
}
