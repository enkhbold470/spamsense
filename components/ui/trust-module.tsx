"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Star, Users, TrendingUp, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "./glass-card"
// import { StatCard } from "./stat-card"
import type { TrustMetrics } from "@/lib/types"

interface TrustModuleProps {
  metrics: TrustMetrics
  className?: string
  animate?: boolean
}

const TrustModule = React.forwardRef<HTMLDivElement, TrustModuleProps>(
  ({ metrics, className, animate = true, ...props }, ref) => {
    return (
      <GlassCard
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          className
        )}
        variant="primary"
        size="lg"
        glow="blue"
        animate={animate}
        {...props}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-trust-blue/5 via-transparent to-energy-orange/5 pointer-events-none" />
        
        <GlassCardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <GlassCardTitle className="text-2xl font-bold tracking-tight">
                Trusted by Industry Leaders
              </GlassCardTitle>
              <p className="text-muted-foreground">
                Join thousands of professionals who trust our platform
              </p>
            </div>
            
            {/* YC Badge */}
            <motion.div
              className="px-3 py-1.5 bg-gradient-to-r from-energy-orange/20 to-trust-blue/20 rounded-lg border border-energy-orange/30 text-sm font-semibold text-foreground"
              initial={animate ? { opacity: 0, scale: 0.8 } : false}
              animate={animate ? { opacity: 1, scale: 1 } : false}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              YC S23
            </motion.div>
          </div>
        </GlassCardHeader>
        
        <GlassCardContent className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trust Statistics */}
            <div className="lg:col-span-2 grid grid-cols-3 gap-4">
              <motion.div
                className="text-center"
                initial={animate ? { opacity: 0, y: 20 } : false}
                animate={animate ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="text-3xl font-bold text-foreground mb-1">
                  {(metrics.activeUsers / 1000).toFixed(0)}K+
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Users className="w-4 h-4" />
                  Active Users
                </div>
              </motion.div>
              
              <motion.div
                className="text-center"
                initial={animate ? { opacity: 0, y: 20 } : false}
                animate={animate ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="text-3xl font-bold text-foreground mb-1">
                  {metrics.uptime}%
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Shield className="w-4 h-4" />
                  Uptime
                </div>
              </motion.div>
              
              <motion.div
                className="text-center"
                initial={animate ? { opacity: 0, y: 20 } : false}
                animate={animate ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="text-3xl font-bold text-foreground mb-1">
                  ${(metrics.totalProcessed / 1000000).toFixed(0)}M+
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Processed
                </div>
              </motion.div>
            </div>
            
            {/* Testimonial */}
            <motion.div
              className="lg:col-span-1 space-y-4"
              initial={animate ? { opacity: 0, x: 20 } : false}
              animate={animate ? { opacity: 1, x: 0 } : false}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative">
                <div className="absolute top-0 left-0 text-4xl text-trust-blue/20 font-serif">
                  &quot;
                </div>
                <blockquote className="text-sm text-muted-foreground italic pl-6 pr-2 leading-relaxed">
                  {metrics.testimonial.text}
                </blockquote>
              </div>
              
              <div className="flex items-center gap-3 pl-6">
                <div className="w-8 h-8 bg-gradient-to-br from-trust-blue to-energy-orange rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {metrics.testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {metrics.testimonial.author}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metrics.testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Trust Indicators */}
          <motion.div
            className="flex items-center justify-center gap-6 pt-6 mt-6 border-t border-white/10"
            initial={animate ? { opacity: 0, y: 10 } : false}
            animate={animate ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="font-medium">4.9/5</span>
              <span>Customer Rating</span>
            </div>
            
            <div className="w-px h-4 bg-white/20" />
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="font-medium">SOC 2</span>
              <span>Compliant</span>
            </div>
            
            <div className="w-px h-4 bg-white/20" />
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="font-medium">99.9%</span>
              <span>Satisfaction</span>
            </div>
          </motion.div>
        </GlassCardContent>
      </GlassCard>
    )
  }
)
TrustModule.displayName = "TrustModule"

// Compact version for smaller spaces
const CompactTrustModule = ({ metrics, className, ...props }: TrustModuleProps) => (
  <GlassCard className={cn("p-4", className)} variant="secondary" {...props}>
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-sm">Trusted Platform</h3>
      <div className="px-2 py-1 bg-trust-blue/20 rounded text-xs font-medium">
        YC S23
      </div>
    </div>
    
    <div className="grid grid-cols-3 gap-3 text-center">
      <div>
        <div className="text-lg font-bold">{(metrics.activeUsers / 1000).toFixed(0)}K+</div>
        <div className="text-xs text-muted-foreground">Users</div>
      </div>
      <div>
        <div className="text-lg font-bold">{metrics.uptime}%</div>
        <div className="text-xs text-muted-foreground">Uptime</div>
      </div>
      <div>
        <div className="text-lg font-bold">${(metrics.totalProcessed / 1000000).toFixed(0)}M+</div>
        <div className="text-xs text-muted-foreground">Processed</div>
      </div>
    </div>
  </GlassCard>
)

export { TrustModule, CompactTrustModule }
