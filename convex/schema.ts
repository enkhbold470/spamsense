import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Contacts table
  contacts: defineTable({
    name: v.optional(v.string()),
    phoneNumber: v.string(),
    isWhitelisted: v.boolean(),
    isBlocked: v.boolean(),
    lastCallDate: v.optional(v.string()), // ISO date string
    callCount: v.number(),
    type: v.union(v.literal("personal"), v.literal("business")),
    notes: v.optional(v.string()),
  })
    .index("by_phone", ["phoneNumber"])
    .index("by_type", ["type"])
    .index("by_whitelist", ["isWhitelisted"])
    .index("by_blocked", ["isBlocked"]),

  // Calls table
  calls: defineTable({
    phoneNumber: v.string(),
    contactId: v.optional(v.id("contacts")),
    type: v.union(v.literal("personal"), v.literal("business")),
    status: v.union(
      v.literal("allowed"),
      v.literal("blocked"),
      v.literal("spam"),
      v.literal("unknown")
    ),
    duration: v.number(), // in seconds
    timestamp: v.string(), // ISO date string
    isSpam: v.boolean(),
    confidence: v.number(), // 0-100 spam confidence
    location: v.optional(v.string()),
    carrierInfo: v.optional(v.string()),
    action: v.optional(
      v.union(
        v.literal("allow"),
        v.literal("block"),
        v.literal("mark_spam"),
        v.literal("whitelist")
      )
    ),
    notes: v.optional(v.string()),
    // Transcript and summary references
    hasTranscript: v.optional(v.boolean()),
    hasSummary: v.optional(v.boolean()),
    transcriptStatus: v.optional(v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    )),
  })
    .index("by_phone", ["phoneNumber"])
    .index("by_contact", ["contactId"])
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_spam", ["isSpam"])
    .index("by_timestamp", ["timestamp"])
    .index("by_confidence", ["confidence"]),

  // Spam Rules table
  spamRules: defineTable({
    name: v.string(),
    pattern: v.string(), // regex pattern
    isActive: v.boolean(),
    confidence: v.number(),
    description: v.string(),
  })
    .index("by_active", ["isActive"])
    .index("by_confidence", ["confidence"]),

  // AI Insights table
  insights: defineTable({
    type: v.union(
      v.literal("warning"),
      v.literal("info"),
      v.literal("success"),
      v.literal("recommendation")
    ),
    message: v.string(),
    confidence: v.number(),
    actionable: v.boolean(),
    createdAt: v.optional(v.string()), // ISO date string
    isRead: v.optional(v.boolean()),
  })
    .index("by_type", ["type"])
    .index("by_actionable", ["actionable"])
    .index("by_read", ["isRead"]),

  // Call Transcripts
  transcripts: defineTable({
    callId: v.id("calls"),
    transcript: v.array(v.object({
      role: v.union(v.literal("agent"), v.literal("user")),
      response: v.string(),
      timestamp: v.optional(v.string()), // ISO date string
      confidence: v.optional(v.number()), // Speech-to-text confidence
    })),
    fullTranscript: v.optional(v.string()), // Combined full text
    language: v.optional(v.string()),
    duration: v.optional(v.number()), // transcript duration in seconds
    createdAt: v.string(), // ISO date string
  })
    .index("by_call", ["callId"]),

  // Call Summaries and Intent Analysis
  callSummaries: defineTable({
    callId: v.id("calls"),
    transcriptId: v.optional(v.id("transcripts")),
    summary: v.string(),
    intent: v.object({
      primary: v.string(), // e.g., "sales", "support", "spam", "personal"
      confidence: v.number(), // 0-100
      keywords: v.array(v.string()),
      sentiment: v.union(
        v.literal("positive"),
        v.literal("negative"),
        v.literal("neutral")
      ),
      urgency: v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high")
      ),
    }),
    keyPoints: v.array(v.string()),
    actionItems: v.optional(v.array(v.string())),
    followUpRequired: v.boolean(),
    satisfactionScore: v.optional(v.number()), // 1-10
    createdAt: v.string(), // ISO date string
    aiModel: v.optional(v.string()), // Which AI model generated the summary
  })
    .index("by_call", ["callId"])
    .index("by_intent", ["intent.primary"])
    .index("by_sentiment", ["intent.sentiment"])
    .index("by_follow_up", ["followUpRequired"]),

  // Call Statistics (aggregated data)
  callStats: defineTable({
    totalCalls: v.number(),
    personalCalls: v.number(),
    businessCalls: v.number(),
    spamBlocked: v.number(),
    spamPercentage: v.number(),
    allowedCalls: v.number(),
    blockedCalls: v.number(),
    avgCallDuration: v.number(),
    topSpamNumbers: v.array(v.string()),
    callsChange: v.number(),
    spamChange: v.number(),
    calculatedAt: v.string(), // ISO date string when stats were calculated
  }),

  // Legacy tasks table (keeping for existing functionality)
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
});
