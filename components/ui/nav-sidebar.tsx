"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { 
  Home, 
  Calendar, 
  Settings, 
  Bot,
  Link as LinkIcon,
  Store,
  Target,
  User,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { defaultNavItems } from "@/lib/navItems"
import Image from "next/image"

const sidebarVariants = cva(
  "fixed left-0 top-0 z-50 h-screen w-72 glass-primary border-r transition-all duration-300",
  {
    variants: {
      collapsed: {
        true: "w-16",
        false: "w-72",
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
)

const navItemVariants = cva(
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
  {
    variants: {
      active: {
        true: [
          "glass-active text-foreground shadow-lg",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-trust-blue/20 before:to-energy-orange/20",
          "glow-blue"
        ],
        false: [
          "text-muted-foreground hover:text-foreground",
          "hover:glass-secondary",
          "hover:shadow-md"
        ],
      },
      collapsed: {
        true: "justify-center px-2",
        false: "justify-start px-3",
      },
    },
    defaultVariants: {
      active: false,
      collapsed: false,
    },
  }
)

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
}


interface NavSidebarProps extends VariantProps<typeof sidebarVariants> {
  navItems?: NavItem[]
  className?: string
  onItemClick?: (item: NavItem) => void
}

const NavSidebar = React.forwardRef<HTMLDivElement, NavSidebarProps>(
  ({ collapsed = false, navItems = defaultNavItems, className, onItemClick, ...props }, ref) => {
    const pathname = usePathname()
    const [isHovered, setIsHovered] = React.useState(false)

    const isCollapsed = collapsed && !isHovered

    return (
      <motion.aside
        ref={ref}
        className={cn(sidebarVariants({ collapsed: isCollapsed }), className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={false}
        animate={{ width: isCollapsed ? 64 : 288 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        {...props}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-trust-blue/5 via-transparent to-energy-orange/5 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-4">
          {/* Brand */}
          <motion.div
            className="flex items-center gap-3 mb-8 px-2"
            animate={{ justifyContent: isCollapsed ? "center" : "flex-start" }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-trust-blue to-energy-orange rounded-full flex items-center justify-center text-white font-bold text-sm glow-blue">
              <Image src="/logo.svg" alt="Spamsense" width={40} height={40} />
            </div>
            
            <motion.span
              className="text-lg font-bold text-foreground"
              animate={{ 
                opacity: isCollapsed ? 0 : 1,
                width: isCollapsed ? 0 : "auto"
              }}
              transition={{ duration: 0.2 }}
            >
              Spamsense
            </motion.span>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <div
                  key={item.href}
                  // initial={{ opacity: 0, x: -20 }}
                  // animate={{ opacity: 1, x: 0 }}
                  // transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    className={cn(navItemVariants({ active: isActive, collapsed: isCollapsed }))}
                    onClick={() => onItemClick?.(item)}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-trust-blue to-energy-orange rounded-r-full"
                        // layoutId="activeIndicator"
                        // transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    )}
                    
                    <Icon className={cn(
                      "w-5 h-5 transition-all duration-200",
                      isActive ? "text-trust-blue" : "text-current"
                    )} />
                    
                    <span
                      className="truncate"
                      // animate={{ 
                      //   opacity: isCollapsed ? 0 : 1,
                      //   width: isCollapsed ? 0 : "auto"
                      // }}
                      // transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </span>

                    

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-trust-blue/10 via-transparent to-energy-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  </Link>
                </div>
              )
            })}
          </nav>

          {/* Footer */}
          <div
            className="mt-auto pt-4 border-t border-white/10"
            // animate={{ opacity: isCollapsed ? 0 : 1 }}
            // transition={{ duration: 0.2 }}
          >
            <Link
              href="/settings"
              className={cn(navItemVariants({ 
                active: pathname === "/settings", 
                collapsed: isCollapsed 
              }))}
            >
              <Settings className="w-5 h-5" />
              <span className="truncate">Settings</span>
            </Link>
          </div>
        </div>

        {/* Collapse toggle */}
        <motion.button
          className="absolute right-3 top-8 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200 z-20"
          onClick={() => setIsHovered(!isHovered)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
            <div
              // animate={{ rotate: isCollapsed ? 90 : 0 }}
              // transition={{ duration: 0.2 }}
            >
              {/* <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M15 19l-7-7 7-7" />
              </svg> */}
              <ChevronRight className="w-4 h-4" />
            </div>
        </motion.button>
      </motion.aside>
    )
  }
)
NavSidebar.displayName = "NavSidebar"

export { NavSidebar, type NavItem, defaultNavItems }
