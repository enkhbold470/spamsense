"use client"

import * as React from "react"
import { Calendar, Clock, DollarSign, Users } from "lucide-react"
import {
  GlassCard,
  GlassCardContent,
  GlassCardHeader,
  GlassCardTitle,
  GlassButton,
  GlassSearchInput,
  StatCard,
  StatusBadge,
  BookingCard,
  TrustModule,
  NavSidebar,
  TopBar
} from "./ui"
import type { 
  Booking, 
  Client, 
  Service, 
  Staff, 
  TrustMetrics
} from "@/lib/types"
import type { User as TopBarUser } from "./ui/top-bar"

// Sample data for demonstrations
const sampleClient: Client = {
  id: "1",
  name: "Sarah Johnson",
  email: "sarah@example.com",
  phone: "+1 (555) 123-4567",
  initials: "SJ"
}

const sampleService: Service = {
  id: "1",
  name: "Deep Tissue Massage",
  duration: 60,
  price: 120,
  category: "massage",
  color: "#4A90E2"
}

const sampleStaff: Staff = {
  id: "1",
  name: "Dr. Smith",
  email: "smith@example.com",
  services: ["1"],
  isActive: true
}

const sampleBooking: Booking = {
  id: "1",
  clientId: "1",
  client: sampleClient,
  serviceId: "1",
  service: sampleService,
  staffId: "1",
  staff: sampleStaff,
  startTime: new Date("2024-01-15T10:00:00"),
  endTime: new Date("2024-01-15T11:00:00"),
  status: "confirmed",
  price: 120,
  createdAt: new Date(),
  updatedAt: new Date()
}

const sampleTrustMetrics: TrustMetrics = {
  activeUsers: 15000,
  uptime: 99.9,
  totalProcessed: 50000000,
  testimonial: {
    text: "Spamsense transformed our booking system. Revenue increased 300% in just 6 months.",
    author: "Alex Chen",
    company: "Wellness Co"
  }
}

const sampleUser: TopBarUser = {
  name: "Sarah Johnson",
  email: "sarah@spamsense.com",
  initials: "SJ"
}

export function ComponentShowcase() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <GlassCard className="text-center">
          <GlassCardHeader>
            <GlassCardTitle className="text-3xl">
              🌟 Liquid Glass Component Library
            </GlassCardTitle>
            <p className="text-muted-foreground">
              A showcase of our beautiful liquid glass design system components
            </p>
          </GlassCardHeader>
        </GlassCard>

        {/* Buttons */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Glass Buttons</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="flex flex-wrap gap-4">
              <GlassButton variant="default">Default Button</GlassButton>
              <GlassButton variant="glass">Glass Button</GlassButton>
              <GlassButton variant="energy">Energy Button</GlassButton>
              <GlassButton variant="trust">Trust Button</GlassButton>
              <GlassButton variant="ghost">Ghost Button</GlassButton>
              <GlassButton variant="outline">Outline Button</GlassButton>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Input Components */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Glass Inputs</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassSearchInput placeholder="Search bookings..." />
              <GlassSearchInput 
                placeholder="Filter by client..." 
                variant="glass"
              />
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Status Badges */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Status Badges</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="flex flex-wrap gap-4">
              <StatusBadge status="confirmed" />
              <StatusBadge status="pending" />
              <StatusBadge status="completed" />
              <StatusBadge status="cancelled" />
              <StatusBadge status="confirmed" variant="glass" />
              <StatusBadge status="pending" size="lg" />
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Revenue"
            value="$47,280"
            change={12.5}
            trend="positive"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatCard
            label="Total Bookings"
            value="2,847"
            change={8.2}
            trend="positive"
            icon={<Calendar className="w-5 h-5" />}
          />
          <StatCard
            label="Active Users"
            value="1,423"
            change={-2.1}
            trend="negative"
            icon={<Users className="w-5 h-5" />}
          />
          <StatCard
            label="Avg. Session"
            value="24m"
            change={0}
            trend="neutral"
            icon={<Clock className="w-5 h-5" />}
          />
        </div>

        {/* Booking Card */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Booking Cards</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <BookingCard 
                booking={sampleBooking}
                onClick={(booking) => console.log("Clicked booking:", booking.id)}
              />
              <BookingCard 
                booking={{
                  ...sampleBooking,
                  id: "2",
                  status: "pending",
                  client: { ...sampleClient, name: "John Doe", initials: "JD" }
                }}
              />
              <BookingCard 
                booking={{
                  ...sampleBooking,
                  id: "3",
                  status: "completed",
                  client: { ...sampleClient, name: "Emma Wilson", initials: "EW" }
                }}
              />
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Trust Module */}
        <TrustModule metrics={sampleTrustMetrics} />

        {/* Glass Card Variants */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard variant="primary" glow="blue">
            <GlassCardContent>
              <h3 className="font-semibold mb-2">Primary Glass</h3>
              <p className="text-sm text-muted-foreground">
                Primary variant with blue glow effect
              </p>
            </GlassCardContent>
          </GlassCard>
          
          <GlassCard variant="secondary" glow="orange">
            <GlassCardContent>
              <h3 className="font-semibold mb-2">Secondary Glass</h3>
              <p className="text-sm text-muted-foreground">
                Secondary variant with orange glow
              </p>
            </GlassCardContent>
          </GlassCard>
          
          <GlassCard variant="hover">
            <GlassCardContent>
              <h3 className="font-semibold mb-2">Hover Glass</h3>
              <p className="text-sm text-muted-foreground">
                Hover state variant
              </p>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

export function LayoutShowcase() {
  const [searchQuery, setSearchQuery] = React.useState("")
  
  return (
    <div className="flex min-h-screen">
      <NavSidebar />
      
      <div className="flex-1 ml-72">
        <div className="p-6">
          <TopBar 
            user={sampleUser}
            onSearch={setSearchQuery}
            notifications={3}
            locationFilter={{
              current: "Bay Area",
              options: ["Bay Area", "San Francisco", "Oakland", "San Jose"],
              onChange: (location) => console.log("Location changed:", location)
            }}
          />
          
          <div className="space-y-6">
            <GlassCard>
              <GlassCardContent>
                <h2 className="text-2xl font-bold mb-4">Dashboard Content</h2>
                <p className="text-muted-foreground">
                  This showcases the complete layout with sidebar and top bar components.
                  Search query: &quot;{searchQuery}&quot;
                </p>
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
