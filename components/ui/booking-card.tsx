"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Clock, User } from "lucide-react"
import { cn, formatTime } from "@/lib/utils"
import { GlassCard, GlassCardContent } from "./glass-card"
import { StatusBadge } from "./status-badge"
import { Avatar, AvatarFallback } from "./avatar"
import type { Booking } from "@/lib/types"

interface BookingCardProps {
  booking: Booking
  onClick?: (booking: Booking) => void
  className?: string
  animate?: boolean
  delay?: number
}

const BookingCard = React.forwardRef<HTMLDivElement, BookingCardProps>(
  ({ booking, onClick, className, animate = true, delay = 0, ...props }, ref) => {
    const handleClick = () => {
      onClick?.(booking)
    }

    // Generate initials from client name
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    // Get service category color
    const getCategoryColor = (category: string) => {
      const colors = {
        massage: "border-l-blue-500 bg-blue-500/5",
        consultation: "border-l-green-500 bg-green-500/5", 
        facial: "border-l-purple-500 bg-purple-500/5",
        therapy: "border-l-orange-500 bg-orange-500/5",
        default: "border-l-gray-500 bg-gray-500/5"
      }
      return colors[category.toLowerCase() as keyof typeof colors] || colors.default
    }

    return (
      <GlassCard
        ref={ref}
        className={cn(
          "group cursor-pointer transition-all duration-300 border-l-4",
          getCategoryColor(booking.service.category),
          "hover:scale-[1.02] hover:shadow-lg",
          onClick && "cursor-pointer",
          className
        )}
        variant="secondary"
        size="sm"
        animate={animate}
        delay={delay}
        onClick={handleClick}
        {...props}
      >
        <GlassCardContent className="space-y-3">
          {/* Client Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials(booking.client.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {booking.client.name}
              </p>
              <p className="text-xs text-muted-foreground/70 truncate">
                {booking.client.email}
              </p>
            </div>

            <StatusBadge 
              status={booking.status} 
              size="sm" 
              showIndicator={true}
            />
          </div>

          {/* Service Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
              <span className="text-sm font-medium text-foreground">
                {booking.service.name}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatTime(booking.startTime)}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{booking.staff.name}</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="text-xs text-muted-foreground">
              {booking.service.duration} min
            </span>
            <span className="text-sm font-semibold text-foreground">
              ${booking.price}
            </span>
          </div>
        </GlassCardContent>

        {/* Hover effect overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
          initial={false}
          animate={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      </GlassCard>
    )
  }
)
BookingCard.displayName = "BookingCard"

// Compact version for dense layouts
const CompactBookingCard = React.forwardRef<HTMLDivElement, BookingCardProps>(
  ({ booking, onClick, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg glass-secondary cursor-pointer transition-all duration-200 hover:glass-hover border border-white/10",
        className
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick?.(booking)}
      {...props}
    >
      <Avatar className="w-6 h-6">
        <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          {booking.client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{booking.client.name}</p>
        <p className="text-xs text-muted-foreground">{formatTime(booking.startTime)}</p>
      </div>
      
      <StatusBadge status={booking.status} size="sm" />
    </motion.div>
  )
)
CompactBookingCard.displayName = "CompactBookingCard"

export { BookingCard, CompactBookingCard }
