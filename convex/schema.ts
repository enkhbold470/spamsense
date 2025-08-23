import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  callStats: defineTable({
    allowedCalls: v.float64(),
    avgCallDuration: v.float64(),
    blockedCalls: v.float64(),
    businessCalls: v.float64(),
    calculatedAt: v.string(),
    callsChange: v.float64(),
    personalCalls: v.float64(),
    spamBlocked: v.float64(),
    spamChange: v.float64(),
    spamPercentage: v.float64(),
    topSpamNumbers: v.array(v.string()),
    totalCalls: v.float64(),
  }),
  callSummaries: defineTable({
    actionItems: v.optional(v.array(v.string())),
    aiModel: v.optional(v.string()),
    callId: v.id("calls"),
    createdAt: v.string(),
    followUpRequired: v.boolean(),
    intent: v.object({
      confidence: v.float64(),
      keywords: v.array(v.string()),
      primary: v.string(),
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
    satisfactionScore: v.optional(v.float64()),
    summary: v.string(),
    transcriptId: v.optional(v.id("transcripts")),
  })
    .index("by_call", ["callId"])
    .index("by_follow_up", ["followUpRequired"])
    .index("by_intent", ["intent.primary"])
    .index("by_sentiment", ["intent.sentiment"]),
  calls: defineTable({
    action: v.optional(
      v.union(
        v.literal("allow"),
        v.literal("block"),
        v.literal("mark_spam"),
        v.literal("whitelist")
      )
    ),
    carrierInfo: v.optional(v.string()),
    confidence: v.float64(),
    contactId: v.optional(v.id("contacts")),
    duration: v.float64(),
    hasSummary: v.optional(v.boolean()),
    hasTranscript: v.optional(v.boolean()),
    isSpam: v.boolean(),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
    phoneNumber: v.string(),
    status: v.union(
      v.literal("allowed"),
      v.literal("blocked"),
      v.literal("spam"),
      v.literal("unknown")
    ),
    timestamp: v.string(),
    transcriptStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("completed"),
        v.literal("failed")
      )
    ),
    type: v.union(
      v.literal("personal"),
      v.literal("business")
    ),
  })
    .index("by_confidence", ["confidence"])
    .index("by_contact", ["contactId"])
    .index("by_phone", ["phoneNumber"])
    .index("by_spam", ["isSpam"])
    .index("by_status", ["status"])
    .index("by_timestamp", ["timestamp"])
    .index("by_type", ["type"]),
  contacts: defineTable({
    callCount: v.float64(),
    isBlocked: v.boolean(),
    isWhitelisted: v.boolean(),
    lastCallDate: v.optional(v.string()),
    name: v.optional(v.string()),
    notes: v.optional(v.string()),
    phoneNumber: v.string(),
    type: v.union(
      v.literal("personal"),
      v.literal("business")
    ),
  })
    .index("by_blocked", ["isBlocked"])
    .index("by_phone", ["phoneNumber"])
    .index("by_type", ["type"])
    .index("by_whitelist", ["isWhitelisted"]),
  insights: defineTable({
    actionable: v.boolean(),
    confidence: v.float64(),
    createdAt: v.optional(v.string()),
    isRead: v.optional(v.boolean()),
    message: v.string(),
    type: v.union(
      v.literal("warning"),
      v.literal("info"),
      v.literal("success"),
      v.literal("recommendation")
    ),
  })
    .index("by_actionable", ["actionable"])
    .index("by_read", ["isRead"])
    .index("by_type", ["type"]),
  spamRules: defineTable({
    confidence: v.float64(),
    description: v.string(),
    isActive: v.boolean(),
    name: v.string(),
    pattern: v.string(),
  })
    .index("by_active", ["isActive"])
    .index("by_confidence", ["confidence"]),
  tasks: defineTable({
    isCompleted: v.boolean(),
    text: v.string(),
  }),
  transcripts: defineTable({
    callId: v.id("calls"),
    createdAt: v.string(),
    duration: v.optional(v.float64()),
    fullTranscript: v.optional(v.string()),
    language: v.optional(v.string()),
    transcript: v.array(
      v.object({
        confidence: v.optional(v.float64()),
        response: v.string(),
        role: v.union(
          v.literal("agent"),
          v.literal("user")
        ),
        timestamp: v.optional(v.string()),
      })
    ),
  }).index("by_call", ["callId"]),
});