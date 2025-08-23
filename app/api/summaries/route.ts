import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Initialize Convex client for server-side operations
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Type definitions for the API request
interface CallIntent {
  primary: string;
  confidence: number;
  keywords: string[];
  sentiment: "positive" | "negative" | "neutral";
  urgency: "low" | "medium" | "high";
}

interface PublishSummaryRequest {
  callId: string; // Convex ID of the call
  transcriptId?: string; // Optional transcript ID
  summary: string;
  intent: CallIntent;
  keyPoints: string[];
  actionItems?: string[];
  followUpRequired: boolean;
  satisfactionScore?: number; // 1-10
  createdAt?: string;
  aiModel?: string;
}

export async function POST(request: NextRequest) {
  console.log("[SUMMARIES API] POST request received");
  
  try {
    console.log("[SUMMARIES API] Parsing request body...");
    // Parse the request body
    const body: PublishSummaryRequest = await request.json();
    console.log("[SUMMARIES API] Request body parsed successfully:", JSON.stringify(body, null, 2));

    console.log("[SUMMARIES API] Starting validation...");
    // Validate required fields
    if (!body.callId) {
      console.log("[SUMMARIES API] Validation failed: Missing callId");
      return NextResponse.json(
        { error: "Missing required field: callId" },
        { status: 400 }
      );
    }
    console.log("[SUMMARIES API] callId validation passed:", body.callId);

    if (!body.summary) {
      console.log("[SUMMARIES API] Validation failed: Missing summary");
      return NextResponse.json(
        { error: "Missing required field: summary" },
        { status: 400 }
      );
    }
    console.log("[SUMMARIES API] summary validation passed");

    if (!body.intent) {
      return NextResponse.json(
        { error: "Missing required field: intent" },
        { status: 400 }
      );
    }

    // Validate intent object
    const { intent } = body;
    if (!intent.primary || typeof intent.confidence !== "number") {
      return NextResponse.json(
        { error: "Invalid intent: primary and confidence are required" },
        { status: 400 }
      );
    }

    if (!["positive", "negative", "neutral"].includes(intent.sentiment)) {
      return NextResponse.json(
        { error: "Invalid intent sentiment: must be 'positive', 'negative', or 'neutral'" },
        { status: 400 }
      );
    }

    if (!["low", "medium", "high"].includes(intent.urgency)) {
      return NextResponse.json(
        { error: "Invalid intent urgency: must be 'low', 'medium', or 'high'" },
        { status: 400 }
      );
    }

    if (!Array.isArray(intent.keywords)) {
      return NextResponse.json(
        { error: "Invalid intent keywords: must be an array" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.keyPoints)) {
      return NextResponse.json(
        { error: "Invalid keyPoints: must be an array" },
        { status: 400 }
      );
    }

    // Verify the call exists
    console.log("[SUMMARIES API] Verifying call exists...");
    const callId = body.callId as Id<"calls">;
    console.log("[SUMMARIES API] Querying calls from Convex...");
    const existingCall = await convex.query(api.tasks.getCalls, {}).then(calls => {
      console.log("[SUMMARIES API] Retrieved", calls.length, "calls from Convex");
      return calls.find(call => call._id === callId);
    });

    if (!existingCall) {
      console.log("[SUMMARIES API] Call not found for callId:", callId);
      return NextResponse.json(
        { error: "Call not found" },
        { status: 404 }
      );
    }
    console.log("[SUMMARIES API] Call found:", existingCall._id);

    // Check if summary already exists
    console.log("[SUMMARIES API] Checking if summary already exists...");
    const existingSummary = await convex.query(api.tasks.getSummaryByCall, { callId });

    if (existingSummary) {
      console.log("[SUMMARIES API] Summary already exists for call:", callId);
      return NextResponse.json(
        { error: "Summary already exists for this call" },
        { status: 409 }
      );
    }
    console.log("[SUMMARIES API] No existing summary found, proceeding...");

    // Verify transcript exists if transcriptId is provided
    let transcriptId: Id<"transcripts"> | undefined;
    if (body.transcriptId) {
      transcriptId = body.transcriptId as Id<"transcripts">;
      const transcript = await convex.query(api.tasks.getTranscriptByCall, { callId });
      if (!transcript || transcript._id !== transcriptId) {
        return NextResponse.json(
          { error: "Invalid transcriptId: transcript not found for this call" },
          { status: 400 }
        );
      }
    }

    console.log("[SUMMARIES API] Preparing summary data...");
    // Prepare summary data
    const summaryData = {
      callId,
      transcriptId,
      summary: body.summary,
      intent: body.intent,
      keyPoints: body.keyPoints,
      actionItems: body.actionItems,
      followUpRequired: body.followUpRequired,
      satisfactionScore: body.satisfactionScore,
      // Note: createdAt is auto-generated by Convex schema, not passed from request
      aiModel: body.aiModel || "external-service",
    };
    console.log("[SUMMARIES API] Summary data prepared:", JSON.stringify(summaryData, null, 2));

    console.log("[SUMMARIES API] Saving summary to Convex...");
    // Save summary to Convex
    const summaryId = await convex.mutation(api.tasks.addCallSummary, summaryData);
    console.log("[SUMMARIES API] Summary saved successfully with ID:", summaryId);

    console.log("[SUMMARIES API] Syncing call flags...");
    // Sync call flags to update hasSummary
    await convex.mutation(api.tasks.syncCallFlags, {});
    console.log("[SUMMARIES API] Call flags synced successfully");

    return NextResponse.json({
      success: true,
      summaryId,
      message: "Summary published successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("[SUMMARIES API] Error publishing summary:", error);
    console.error("[SUMMARIES API] Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    console.error("[SUMMARIES API] Error name:", error instanceof Error ? error.name : 'Unknown');
    console.error("[SUMMARIES API] Error message:", error instanceof Error ? error.message : String(error));
    
    if (error instanceof SyntaxError) {
      console.log("[SUMMARIES API] Returning 400 - Invalid JSON");
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    console.log("[SUMMARIES API] Returning 500 - Internal server error");
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// GET method to retrieve summary by call ID
export async function GET(request: NextRequest) {
  console.log("[SUMMARIES API] GET request received");
  
  try {
    console.log("[SUMMARIES API] Parsing URL search parameters...");
    const { searchParams } = new URL(request.url);
    console.log("[SUMMARIES API] Search parameters:", Object.fromEntries(searchParams.entries()));
    const callId = searchParams.get("callId");
    console.log("[SUMMARIES API] Extracted callId:", callId);

    if (!callId) {
      console.log("[SUMMARIES API] Missing callId parameter");
      return NextResponse.json(
        { error: "Missing callId parameter" },
        { status: 400 }
      );
    }

    console.log("[SUMMARIES API] Querying summary from Convex for callId:", callId);
    const summary = await convex.query(api.tasks.getSummaryByCall, { 
      callId: callId as Id<"calls"> 
    });

    if (!summary) {
      console.log("[SUMMARIES API] Summary not found for callId:", callId);
      return NextResponse.json(
        { error: "Summary not found" },
        { status: 404 }
      );
    }
    console.log("[SUMMARIES API] Summary found, returning data");

    return NextResponse.json({
      success: true,
      summary
    });

  } catch (error) {
    console.error("[SUMMARIES API] Error retrieving summary:", error);
    console.error("[SUMMARIES API] Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    console.error("[SUMMARIES API] Error name:", error instanceof Error ? error.name : 'Unknown');
    console.error("[SUMMARIES API] Error message:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// PUT method to update existing summary
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.callId) {
      return NextResponse.json(
        { error: "Missing required field: callId" },
        { status: 400 }
      );
    }

    const callId = body.callId as Id<"calls">;
    const existingSummary = await convex.query(api.tasks.getSummaryByCall, { callId });

    if (!existingSummary) {
      return NextResponse.json(
        { error: "Summary not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      callId,
      summaryId: existingSummary._id
    };

    if (body.summary) updateData.summary = body.summary;
    if (body.intent) updateData.intent = body.intent;
    if (body.keyPoints) updateData.keyPoints = body.keyPoints;
    if (body.actionItems) updateData.actionItems = body.actionItems;
    if (body.followUpRequired !== undefined) updateData.followUpRequired = body.followUpRequired;
    if (body.satisfactionScore !== undefined) updateData.satisfactionScore = body.satisfactionScore;
    if (body.aiModel) updateData.aiModel = body.aiModel;

    // Update summary
    await convex.mutation(api.tasks.updateCallSummary, updateData);

    return NextResponse.json({
      success: true,
      message: "Summary updated successfully"
    });

  } catch (error) {
    console.error("Error updating summary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
