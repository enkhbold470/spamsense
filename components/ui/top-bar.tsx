"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Bell, ChevronDown, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { GlassSearchInput } from "./glass-input"
import { GlassButton } from "./glass-button"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Badge } from "./badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"

interface User {
  name: string
  email: string
  avatar?: string
  initials: string
}

interface TopBarProps {
  user: User
  onSearch?: (query: string) => void
  onMenuClick?: () => void
  showMenuButton?: boolean
  notifications?: number
  className?: string
  locationFilter?: {
    current: string
    options: string[]
    onChange: (location: string) => void
  }
}

const TopBar = React.forwardRef<HTMLDivElement, TopBarProps>(
  ({ 
    user, 
    onSearch, 
    onMenuClick, 
    showMenuButton = false,
    notifications = 0,
    locationFilter,
    className,
    ...props 
  }, ref) => {
    const [searchQuery, setSearchQuery] = React.useState("")

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value
      setSearchQuery(query)
      onSearch?.(query)
    }

    const getGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) return "Good morning"
      if (hour < 17) return "Good afternoon"
      return "Good evening"
    }

    return (
      <motion.header
        ref={ref}
        className={cn(
          "glass-primary rounded-2xl border p-6 mb-6 relative overflow-hidden",
          className
        )}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        {...props}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-trust-blue/5 via-transparent to-energy-orange/5 pointer-events-none" />
        
        {/* Top border accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-trust-blue/50 to-transparent" />
        
        <div className="relative z-10 flex items-center justify-between gap-6">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            {showMenuButton && (
              <GlassButton
                variant="ghost"
                size="icon"
                onClick={onMenuClick}
                className="md:hidden"
              >
                <Menu className="w-5 h-5" />
              </GlassButton>
            )}

            {/* Welcome section */}
            <div className="space-y-1">
              <motion.h1
                className="text-2xl font-bold text-foreground tracking-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {getGreeting()}, {user.name.split(' ')[0]} 👋
              </motion.h1>
              <motion.p
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Here&apos;s what&apos;s happening with your business today
              </motion.p>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <GlassSearchInput
                placeholder="🔍 Search customers, bookings..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-80"
              />
            </motion.div>

            {/* Location filter */}
            {locationFilter && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <GlassButton variant="glass" className="gap-2">
                      📍 {locationFilter.current}
                      <ChevronDown className="w-4 h-4" />
                    </GlassButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-primary border">
                    <DropdownMenuLabel>Select Location</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {locationFilter.options.map((location) => (
                      <DropdownMenuItem
                        key={location}
                        onClick={() => locationFilter.onChange(location)}
                        className="cursor-pointer"
                      >
                        📍 {location}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            )}

            {/* Notifications */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <GlassButton variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-energy-orange text-white text-xs"
                  >
                    {notifications > 9 ? "9+" : notifications}
                  </Badge>
                )}
              </GlassButton>
            </motion.div>

            {/* User menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <GlassButton variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-trust-blue to-energy-orange text-white font-semibold">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                  </GlassButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-primary border" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>
        </div>

        {/* Mobile search */}
        <motion.div
          className="md:hidden mt-4 pt-4 border-t border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <GlassSearchInput
            placeholder="🔍 Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full"
          />
        </motion.div>
      </motion.header>
    )
  }
)
TopBar.displayName = "TopBar"

export { TopBar, type User }
