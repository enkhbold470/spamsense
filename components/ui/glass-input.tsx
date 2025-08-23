"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
// import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const glassInputVariants = cva(
  "flex w-full rounded-xl border transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: [
          "glass-secondary",
          "focus-visible:glass-hover focus-visible:ring-2 focus-visible:ring-white/20",
          "hover:glass-hover"
        ],
        glass: [
          "glass-primary",
          "focus-visible:glass-active focus-visible:ring-2 focus-visible:ring-trust-blue/30",
          "hover:glass-hover"
        ],
        outline: [
          "bg-background border-input",
          "focus-visible:ring-2 focus-visible:ring-ring",
          "hover:border-input/80"
        ],
      },
      size: {
        default: "h-10 px-3 py-2 text-sm",
        sm: "h-8 px-2.5 py-1.5 text-xs",
        lg: "h-12 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface GlassInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof glassInputVariants> {
  icon?: React.ReactNode
  animate?: boolean
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, variant, size, type, icon, animate = false, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    return (
      <div
        className={cn(
          "relative group",
          animate && "animate-fade-in",
          className
        )}
      >
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-foreground/80 transition-colors duration-200 z-10">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          className={cn(
            glassInputVariants({ variant, size }),
            icon && "pl-10",
            "relative z-10 bg-transparent"
          )}
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          {...props}
        />
        
        {/* Glass shine effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Focus glow */}
        {isFocused && (
          <div className="absolute inset-0 rounded-xl bg-trust-blue/10 -z-10 transition-all duration-200" />
        )}
      </div>
    )
  }
)
GlassInput.displayName = "GlassInput"

// Search input with built-in search icon
const GlassSearchInput = React.forwardRef<
  HTMLInputElement,
  Omit<GlassInputProps, 'icon' | 'type'>
>(({ className, ...props }, ref) => (
  <GlassInput
    ref={ref}
    type="search"
    icon={
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    }
    className={cn("search-cancel:appearance-none", className)}
    {...props}
  />
))
GlassSearchInput.displayName = "GlassSearchInput"

export { GlassInput, GlassSearchInput, glassInputVariants }
