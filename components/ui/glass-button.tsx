"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
// import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const glassButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground shadow-lg",
          "hover:shadow-xl hover:scale-105",
          "active:scale-95",
          "focus-visible:ring-primary/50"
        ],
        glass: [
          "glass-primary text-foreground",
          "hover:glass-hover",
          "active:glass-active",
          "focus-visible:ring-white/20"
        ],
        energy: [
          "bg-gradient-to-r from-energy-orange to-trust-blue text-white shadow-lg",
          "hover:shadow-xl hover:scale-105 glow-orange",
          "active:scale-95",
          "focus-visible:ring-energy-orange/50"
        ],
        trust: [
          "bg-trust-blue text-white shadow-lg",
          "hover:shadow-xl hover:scale-105 glow-blue",
          "active:scale-95",
          "focus-visible:ring-trust-blue/50"
        ],
        ghost: [
          "text-foreground/80",
          "hover:glass-secondary hover:text-foreground",
          "active:glass-active",
          "focus-visible:ring-white/20"
        ],
        outline: [
          "border border-input glass-secondary text-foreground",
          "hover:glass-hover",
          "active:glass-active",
          "focus-visible:ring-white/20"
        ],
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface GlassButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 
    'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd' | 'transition'>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean
  animate?: boolean
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, asChild = false, animate = true, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(
          glassButtonVariants({ variant, size }),
          animate && "hover:scale-105 active:scale-95 transition-transform duration-200",
          className
        )}
        ref={!asChild ? ref : undefined}
        {...props}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -top-1 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
        
        {/* Glass refraction */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
        
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </Comp>
    )
  }
)
GlassButton.displayName = "GlassButton"

export { GlassButton, glassButtonVariants }
