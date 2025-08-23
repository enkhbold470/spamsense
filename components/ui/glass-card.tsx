"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
// import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const glassCardVariants = cva(
  "relative overflow-hidden rounded-2xl border transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        primary: "glass-primary",
        secondary: "glass-secondary",
        hover: "glass-hover",
        active: "glass-active",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      glow: {
        none: "",
        blue: "glow-blue",
        orange: "glow-orange",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      glow: "none",
    },
  }
)

const glassCardContentVariants = cva("relative z-10", {
  variants: {
    spacing: {
      none: "",
      sm: "space-y-2",
      md: "space-y-4", 
      lg: "space-y-6",
    },
  },
  defaultVariants: {
    spacing: "md",
  },
})

interface GlassCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 
    'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd' | 'transition'>,
    VariantProps<typeof glassCardVariants> {
  children: React.ReactNode
  animate?: boolean
  delay?: number
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, size, glow, animate = true, delay = 0, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          glassCardVariants({ variant, size, glow }),
          animate && "animate-fade-in",
          className
        )}
        style={{ animationDelay: animate ? `${delay}s` : undefined }}
        {...props}
      >
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Glow border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {children}
      </div>
    )
  }
)
GlassCard.displayName = "GlassCard"

const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof glassCardContentVariants>
>(({ className, spacing, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 relative z-10",
      glassCardContentVariants({ spacing }),
      className
    )}
    {...props}
  />
))
GlassCardHeader.displayName = "GlassCardHeader"

const GlassCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-foreground/90",
      className
    )}
    {...props}
  />
))
GlassCardTitle.displayName = "GlassCardTitle"

const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground/80", className)}
    {...props}
  />
))
GlassCardDescription.displayName = "GlassCardDescription"

const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof glassCardContentVariants>
>(({ className, spacing, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative z-10", glassCardContentVariants({ spacing }), className)}
    {...props}
  />
))
GlassCardContent.displayName = "GlassCardContent"

const GlassCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 relative z-10", className)}
    {...props}
  />
))
GlassCardFooter.displayName = "GlassCardFooter"

export {
  GlassCard,
  GlassCardHeader,
  GlassCardFooter,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  glassCardVariants,
}
