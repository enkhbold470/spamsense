"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { GlassCard, GlassCardContent, GlassCardHeader } from "./glass-card"

const statCardVariants = cva(
  "group relative cursor-pointer transition-all duration-300",
  {
    variants: {
      trend: {
        positive: "hover:shadow-green-500/20",
        negative: "hover:shadow-red-500/20", 
        neutral: "hover:shadow-blue-500/20",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    defaultVariants: {
      trend: "neutral",
      size: "md",
    },
  }
)

const trendColors = {
  positive: "text-green-600 bg-green-500/10 border-green-500/20",
  negative: "text-red-600 bg-red-500/10 border-red-500/20",
  neutral: "text-blue-600 bg-blue-500/10 border-blue-500/20",
} as const

const trendIcons = {
  positive: ArrowUpIcon,
  negative: ArrowDownIcon, 
  neutral: MinusIcon,
} as const

interface StatCardProps extends VariantProps<typeof statCardVariants> {
  label: string
  value: string | number
  change?: number
  trend?: "positive" | "negative" | "neutral"
  icon?: React.ReactNode
  className?: string
  animate?: boolean
  delay?: number
  onClick?: () => void
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ 
    className, 
    label, 
    value, 
    change, 
    trend = "neutral", 
    icon, 
    size,
    animate = true,
    delay = 0,
    onClick,
    ...props 
  }, ref) => {
    const TrendIcon = trendIcons[trend]
    
    return (
      <GlassCard
        ref={ref}
        className={cn(
          statCardVariants({ trend, size }),
          onClick && "cursor-pointer",
          className
        )}
        variant="primary"
        size="md"
        animate={animate}
        delay={delay}
        onClick={onClick}
        {...props}
      >
        {/* Accent border based on trend */}
        <div 
          className={cn(
            "absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            trend === "positive" && "bg-green-500",
            trend === "negative" && "bg-red-500",
            trend === "neutral" && "bg-blue-500"
          )}
        />
        
        <GlassCardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium text-muted-foreground/80">
            {label}
          </div>
          {icon && (
            <div className="text-muted-foreground/60 group-hover:text-foreground/80 transition-colors duration-200">
              {icon}
            </div>
          )}
        </GlassCardHeader>
        
        <GlassCardContent className="space-y-3">
          <motion.div
            className="text-2xl font-bold text-foreground tracking-tight"
            initial={animate ? { opacity: 0, scale: 0.5 } : false}
            animate={animate ? { opacity: 1, scale: 1 } : false}
            transition={{ 
              duration: 0.5, 
              delay: delay + 0.2,
              ease: "easeOut"
            }}
          >
            {value}
          </motion.div>
          
          {change !== undefined && (
            <motion.div
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg border w-fit",
                trendColors[trend]
              )}
              initial={animate ? { opacity: 0, x: -10 } : false}
              animate={animate ? { opacity: 1, x: 0 } : false}
              transition={{ 
                duration: 0.3, 
                delay: delay + 0.4,
                ease: "easeOut"
              }}
            >
              <TrendIcon className="w-3 h-3" />
              <span>
                {trend === "positive" ? "+" : trend === "negative" ? "" : ""}{change}%
              </span>
              <span className="text-muted-foreground/60">vs last period</span>
            </motion.div>
          )}
        </GlassCardContent>
      </GlassCard>
    )
  }
)
StatCard.displayName = "StatCard"

// Pre-configured stat card for revenue
const RevenueStatCard = ({ value, change, ...props }: Omit<StatCardProps, 'label' | 'icon'>) => (
  <StatCard
    label="Total Revenue"
    value={value}
    change={change}
    trend={change && change > 0 ? "positive" : change && change < 0 ? "negative" : "neutral"}
    icon={
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    }
    {...props}
  />
)

// Pre-configured stat card for bookings
const BookingsStatCard = ({ value, change, ...props }: Omit<StatCardProps, 'label' | 'icon'>) => (
  <StatCard
    label="Total Bookings"
    value={value}
    change={change}
    trend={change && change > 0 ? "positive" : change && change < 0 ? "negative" : "neutral"}
    icon={
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    }
    {...props}
  />
)

export { 
  StatCard, 
  RevenueStatCard, 
  BookingsStatCard,
  statCardVariants 
}
