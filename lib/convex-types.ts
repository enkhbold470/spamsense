/**
 * Convex-generated types with UI-specific extensions
 * This file exports Convex auto-generated types and adds only UI-specific types
 */

import { Doc } from "@/convex/_generated/dataModel";

// Export all Convex generated types
export type { Id, Doc, TableNames } from "@/convex/_generated/dataModel";

// Type aliases for better readability
export type Contact = Doc<"contacts">;
export type Call = Doc<"calls">;
export type SpamRule = Doc<"spamRules">;
export type Insight = Doc<"insights">;
export type CallStats = Doc<"callStats">;
export type CallTranscript = Doc<"transcripts">;
export type CallSummary = Doc<"callSummaries">;

// Extract specific union types from the Convex schema
export type CallType = Call["type"];
export type CallStatus = Call["status"];
export type CallAction = Call["action"];
export type ContactType = Contact["type"];
export type InsightType = Insight["type"];
export type TranscriptRole = CallTranscript["transcript"][number]["role"];
export type IntentSentiment = CallSummary["intent"]["sentiment"];
export type IntentUrgency = CallSummary["intent"]["urgency"];

// UI-specific types that don't belong in the database schema
export interface User {
  name: string;
  email: string;
  initials: string;
}

export interface FilterOptions {
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  className?: string;
  delay?: number;
}

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "hover" | "active";
  onClick?: () => void;
}

// Enhanced types for queries that join multiple tables
export interface CallWithDetails {
  call: Call;
  contact?: Contact;
  transcript?: CallTranscript;
  summary?: CallSummary;
}

// Time range type for filters
export type TimeRange = "today" | "week" | "month" | "all";

// Navigation items type
export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}
