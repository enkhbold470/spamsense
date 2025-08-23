import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Legacy tasks functions
export const getTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const addTask = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: false,
    });
    return taskId;
  },
});

// Contacts queries and mutations
export const getContacts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contacts").collect();
  },
});

export const getContactByPhone = query({
  args: { phoneNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contacts")
      .withIndex("by_phone", (q) => q.eq("phoneNumber", args.phoneNumber))
      .first();
  },
});

export const getContactsByType = query({
  args: { type: v.union(v.literal("personal"), v.literal("business")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contacts")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .collect();
  },
});

export const addContact = mutation({
  args: {
    name: v.optional(v.string()),
    phoneNumber: v.string(),
    isWhitelisted: v.boolean(),
    isBlocked: v.boolean(),
    type: v.union(v.literal("personal"), v.literal("business")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const contactId = await ctx.db.insert("contacts", {
      ...args,
      callCount: 0,
      lastCallDate: new Date().toISOString(),
    });
    return contactId;
  },
});

export const updateContact = mutation({
  args: {
    id: v.id("contacts"),
    name: v.optional(v.string()),
    isWhitelisted: v.optional(v.boolean()),
    isBlocked: v.optional(v.boolean()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Calls queries and mutations
export const getCalls = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("calls").order("desc").take(100);
  },
});

export const getCallsByType = query({
  args: { type: v.union(v.literal("personal"), v.literal("business")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("calls")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .order("desc")
      .take(50);
  },
});

export const getCallsByStatus = query({
  args: { 
    status: v.union(
      v.literal("allowed"),
      v.literal("blocked"),
      v.literal("spam"),
      v.literal("unknown")
    ) 
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("calls")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .take(50);
  },
});

export const getSpamCalls = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("calls")
      .withIndex("by_spam", (q) => q.eq("isSpam", true))
      .order("desc")
      .take(50);
  },
});

export const getRecentCalls = query({
  args: { hours: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const hoursBack = args.hours || 24;
    const cutoffTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();
    
    return await ctx.db
      .query("calls")
      .withIndex("by_timestamp")
      .filter((q) => q.gte(q.field("timestamp"), cutoffTime))
      .order("desc")
      .take(100);
  },
});

export const addCall = mutation({
  args: {
    phoneNumber: v.string(),
    contactId: v.optional(v.id("contacts")),
    type: v.union(v.literal("personal"), v.literal("business")),
    status: v.union(
      v.literal("allowed"),
      v.literal("blocked"),
      v.literal("spam"),
      v.literal("unknown")
    ),
    duration: v.number(),
    isSpam: v.boolean(),
    confidence: v.number(),
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
  },
  handler: async (ctx, args) => {
    const callId = await ctx.db.insert("calls", {
      ...args,
      timestamp: new Date().toISOString(),
    });

    // Update contact call count if contact exists
    if (args.contactId) {
      const contact = await ctx.db.get(args.contactId);
      if (contact) {
        await ctx.db.patch(args.contactId, {
          callCount: contact.callCount + 1,
          lastCallDate: new Date().toISOString(),
        });
      }
    }

    return callId;
  },
});

// Spam Rules queries and mutations
export const getSpamRules = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("spamRules").collect();
  },
});

export const getActiveSpamRules = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("spamRules")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const addSpamRule = mutation({
  args: {
    name: v.string(),
    pattern: v.string(),
    isActive: v.boolean(),
    confidence: v.number(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("spamRules", args);
  },
});

export const updateSpamRule = mutation({
  args: {
    id: v.id("spamRules"),
    name: v.optional(v.string()),
    pattern: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    confidence: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// AI Insights queries and mutations
export const getInsights = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("insights").order("desc").take(20);
  },
});

export const getActionableInsights = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("insights")
      .withIndex("by_actionable", (q) => q.eq("actionable", true))
      .order("desc")
      .take(10);
  },
});

export const addInsight = mutation({
  args: {
    type: v.union(
      v.literal("warning"),
      v.literal("info"),
      v.literal("success"),
      v.literal("recommendation")
    ),
    message: v.string(),
    confidence: v.number(),
    actionable: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("insights", {
      ...args,
      createdAt: new Date().toISOString(),
      isRead: false,
    });
  },
});

export const markInsightAsRead = mutation({
  args: { id: v.id("insights") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isRead: true });
  },
});

// Call Statistics queries and mutations
export const getCallStats = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("callStats").order("desc").first();
  },
});

export const updateCallStats = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Delete old stats and insert new ones
    const oldStats = await ctx.db.query("callStats").collect();
    for (const stat of oldStats) {
      await ctx.db.delete(stat._id);
    }

    return await ctx.db.insert("callStats", {
      ...args,
      calculatedAt: new Date().toISOString(),
    });
  },
});

// Utility queries
export const searchContacts = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const contacts = await ctx.db.query("contacts").collect();
    return contacts.filter(
      (contact) =>
        contact.name?.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
        contact.phoneNumber.includes(args.searchTerm)
    );
  },
});

// Transcript Management
export const getTranscriptByCall = query({
  args: { callId: v.id("calls") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transcripts")
      .withIndex("by_call", (q) => q.eq("callId", args.callId))
      .first();
  },
});

export const addTranscript = mutation({
  args: {
    callId: v.id("calls"),
    transcript: v.array(v.object({
      role: v.union(v.literal("agent"), v.literal("user")),
      response: v.string(),
      timestamp: v.optional(v.string()),
      confidence: v.optional(v.number()),
    })),
    fullTranscript: v.optional(v.string()),
    language: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Create full transcript from individual messages if not provided
    const fullTranscript = args.fullTranscript || 
      args.transcript.map(msg => `${msg.role}: ${msg.response}`).join('\n');

    const transcriptId = await ctx.db.insert("transcripts", {
      ...args,
      fullTranscript,
      createdAt: new Date().toISOString(),
    });

    // Update the call to indicate it has a transcript
    await ctx.db.patch(args.callId, {
      hasTranscript: true,
      transcriptStatus: "completed",
    });

    return transcriptId;
  },
});

export const updateTranscriptStatus = mutation({
  args: {
    callId: v.id("calls"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.callId, {
      transcriptStatus: args.status,
    });
  },
});

// Call Summary and Intent Analysis
export const getSummaryByCall = query({
  args: { callId: v.id("calls") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("callSummaries")
      .withIndex("by_call", (q) => q.eq("callId", args.callId))
      .first();
  },
});

export const getSummariesByIntent = query({
  args: { intent: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("callSummaries")
      .withIndex("by_intent", (q) => q.eq("intent.primary", args.intent))
      .order("desc")
      .take(20);
  },
});

export const getSummariesBySentiment = query({
  args: { 
    sentiment: v.union(
      v.literal("positive"),
      v.literal("negative"),
      v.literal("neutral")
    ) 
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("callSummaries")
      .withIndex("by_sentiment", (q) => q.eq("intent.sentiment", args.sentiment))
      .order("desc")
      .take(20);
  },
});

export const getCallsRequiringFollowUp = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("callSummaries")
      .withIndex("by_follow_up", (q) => q.eq("followUpRequired", true))
      .order("desc")
      .take(50);
  },
});

export const addCallSummary = mutation({
  args: {
    callId: v.id("calls"),
    transcriptId: v.optional(v.id("transcripts")),
    summary: v.string(),
    intent: v.object({
      primary: v.string(),
      confidence: v.number(),
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
    satisfactionScore: v.optional(v.number()),
    aiModel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const summaryId = await ctx.db.insert("callSummaries", {
      ...args,
      createdAt: new Date().toISOString(),
    });

    // Update the call to indicate it has a summary
    await ctx.db.patch(args.callId, {
      hasSummary: true,
    });

    return summaryId;
  },
});

export const updateCallSummary = mutation({
  args: {
    id: v.id("callSummaries"),
    summary: v.optional(v.string()),
    followUpRequired: v.optional(v.boolean()),
    actionItems: v.optional(v.array(v.string())),
    satisfactionScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Enhanced Call Queries with Transcript/Summary info
export const getCallWithDetails = query({
  args: { callId: v.id("calls") },
  handler: async (ctx, args) => {
    const [call, transcript, summary] = await Promise.all([
      ctx.db.get(args.callId),
      ctx.db
        .query("transcripts")
        .withIndex("by_call", (q) => q.eq("callId", args.callId))
        .first(),
      ctx.db
        .query("callSummaries")
        .withIndex("by_call", (q) => q.eq("callId", args.callId))
        .first(),
    ]);

    return {
      call,
      transcript,
      summary,
    };
  },
});

export const getCallsWithTranscripts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    const calls = await ctx.db
      .query("calls")
      .filter((q) => q.eq(q.field("hasTranscript"), true))
      .order("desc")
      .take(limit);

    const callsWithDetails = await Promise.all(
      calls.map(async (call) => {
        const [transcript, summary] = await Promise.all([
          ctx.db
            .query("transcripts")
            .withIndex("by_call", (q) => q.eq("callId", call._id))
            .first(),
          ctx.db
            .query("callSummaries")
            .withIndex("by_call", (q) => q.eq("callId", call._id))
            .first(),
        ]);

        return {
          call,
          transcript,
          summary,
        };
      })
    );

    return callsWithDetails;
  },
});

// Utility to sync call flags with transcript/summary existence
export const syncCallFlags = mutation({
  args: {},
  handler: async (ctx) => {
    const calls = await ctx.db.query("calls").collect();
    let updated = 0;

    for (const call of calls) {
      const transcript = await ctx.db
        .query("transcripts")
        .withIndex("by_call", (q) => q.eq("callId", call._id))
        .first();
      
      const summary = await ctx.db
        .query("callSummaries")
        .withIndex("by_call", (q) => q.eq("callId", call._id))
        .first();

      const hasTranscript = !!transcript;
      const hasSummary = !!summary;

      if (call.hasTranscript !== hasTranscript || call.hasSummary !== hasSummary) {
        await ctx.db.patch(call._id, {
          hasTranscript,
          hasSummary,
          transcriptStatus: hasTranscript ? "completed" : undefined,
        });
        updated++;
      }
    }

    return { updated, total: calls.length };
  },
});

export const getDashboardData = query({
  args: {},
  handler: async (ctx) => {
    const [contacts, recentCalls, spamRules, insights, stats] = await Promise.all([
      ctx.db.query("contacts").take(10),
      ctx.db.query("calls").order("desc").take(10),
      ctx.db.query("spamRules").withIndex("by_active", (q) => q.eq("isActive", true)).collect(),
      ctx.db.query("insights").withIndex("by_actionable", (q) => q.eq("actionable", true)).take(5),
      ctx.db.query("callStats").order("desc").first(),
    ]);

    return {
      contacts,
      recentCalls,
      spamRules,
      insights,
      stats,
    };
  },
});