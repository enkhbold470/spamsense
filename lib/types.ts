/**
 * Type definitions for the Spamsense booking management dashboard
 */

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
