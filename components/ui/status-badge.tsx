"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
// import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { BookingStatus } from "@/lib/types"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-all duration-200",
  {
    variants: {
      status: {
        confirmed: [
          "bg-green-500/10 text-green-600 border border-green-500/20",
          "dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30"
        ],
        pending: [
          "bg-orange-500/10 text-orange-600 border border-orange-500/20",
          "dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30"
        ],
        completed: [
          "bg-blue-500/10 text-blue-600 border border-blue-500/20",
          "dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30"
        ],
        cancelled: [
          "bg-red-500/10 text-red-600 border border-red-500/20",
          "dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30"
        ],
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
      variant: {
        default: "",
        glass: "backdrop-filter backdrop-blur-sm",
        solid: "border-none",
      },
    },
    defaultVariants: {
      status: "pending",
      size: "md",
      variant: "default",
    },
  }
)

// Status indicators (dots/icons) - kept for future use
// const statusIndicators = {
//   confirmed: "🟢",
//   pending: "🟡", 
//   completed: "🔵",
//   cancelled: "🔴",
// } as const

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  status: BookingStatus
  showIndicator?: boolean
  animate?: boolean
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ 
    className, 
    status, 
    size, 
    variant, 
    showIndicator = true, 
    animate = false,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          statusBadgeVariants({ status, size, variant }),
          animate && "animate-scale-in",
          className
        )}
        {...props}
      >
        {showIndicator && (
          <span className="w-2 h-2 rounded-full bg-current opacity-80" />
        )}
        <span>{status}</span>
      </div>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

// Specialized status components
const BookingStatusBadge = ({ status, ...props }: Omit<StatusBadgeProps, 'status'> & { status: BookingStatus }) => (
  <StatusBadge status={status} {...props} />
)

const StatusIndicator = ({ 
  status, 
  className,
  size = "md" 
}: { 
  status: BookingStatus
  className?: string
  size?: "sm" | "md" | "lg"
}) => {
  const sizeMap = {
    sm: "w-2 h-2",
    md: "w-3 h-3", 
    lg: "w-4 h-4"
  }

  const colorMap = {
    confirmed: "bg-green-500",
    pending: "bg-orange-500",
    completed: "bg-blue-500", 
    cancelled: "bg-red-500"
  }

  return (
    <div 
      className={cn(
        "rounded-full animate-pulse",
        sizeMap[size],
        colorMap[status],
        className
      )}
    />
  )
}

export { 
  StatusBadge, 
  BookingStatusBadge, 
  StatusIndicator,
  statusBadgeVariants 
}
