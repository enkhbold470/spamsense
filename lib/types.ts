/**
 * Type definitions for the Spamsense call management dashboard
 */

// Call Management Types
export type CallType = "personal" | "business";
export type CallStatus = "allowed" | "blocked" | "spam" | "unknown";
export type CallAction = "allow" | "block" | "mark_spam" | "whitelist";

export interface Contact {
  id: string;
  name?: string;
  phoneNumber: string;
  isWhitelisted: boolean;
  isBlocked: boolean;
  lastCallDate?: Date;
  callCount: number;
  type: CallType;
  notes?: string;
}

export interface Call {
  id: string;
  phoneNumber: string;
  contactId?: string;
  contact?: Contact;
  type: CallType;
  status: CallStatus;
  duration: number; // in seconds
  timestamp: Date;
  isSpam: boolean;
  confidence: number; // 0-100 spam confidence
  location?: string;
  carrierInfo?: string;
  action?: CallAction;
  notes?: string;
}

export interface SpamRule {
  id: string;
  name: string;
  pattern: string; // regex pattern
  isActive: boolean;
  confidence: number;
  description: string;
}

// Legacy booking types (keeping for backward compatibility)
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  initials: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  category: string;
  color?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  services: string[]; // service IDs
  isActive: boolean;
}

export type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

export interface Booking {
  id: string;
  clientId: string;
  client: Client;
  serviceId: string;
  service: Service;
  staffId: string;
  staff: Staff;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  notes?: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DayData {
  date: Date;
  bookings: Booking[];
  revenue: number;
  bookingCount: number;
}

export interface WeekData {
  startDate: Date;
  endDate: Date;
  days: DayData[];
  totalRevenue: number;
  totalBookings: number;
  completionRate: number;
}

// Dashboard Stats for Call Management
export interface CallStats {
  totalCalls: number;
  personalCalls: number;
  businessCalls: number;
  spamBlocked: number;
  spamPercentage: number;
  allowedCalls: number;
  blockedCalls: number;
  avgCallDuration: number; // in seconds
  topSpamNumbers: string[];
  callsChange: number; // percentage change
  spamChange: number; // percentage change
}

// Legacy booking stats (keeping for backward compatibility)
export interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  completionRate: number;
  revenueChange: number;
  bookingsChange: number;
  averageBookingValue: number;
}

export interface TrustMetrics {
  activeUsers: number;
  uptime: number;
  totalProcessed: number;
  testimonial: {
    text: string;
    author: string;
    company: string;
  };
}

export interface FilterOptions {
  services: string[];
  staff: string[];
  status: BookingStatus[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

// Component props interfaces
export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "hover" | "active";
  onClick?: () => void;
}

export interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export interface BookingCardProps {
  booking: Booking;
  onClick?: (booking: Booking) => void;
  className?: string;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}
