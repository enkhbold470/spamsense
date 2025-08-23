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
  try {
    // Parse the request body
    const body: PublishSummaryRequest = await request.json();

    // Validate required fields
    if (!body.callId) {
      return NextResponse.json(
        { error: "Missing required field: callId" },
        { status: 400 }
      );
    }

    if (!body.summary) {
      return NextResponse.json(
        { error: "Missing required field: summary" },
        { status: 400 }
      );
    }

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
    const callId = body.callId as Id<"calls">;
    const existingCall = await convex.query(api.tasks.getCalls, {}).then(calls => 
      calls.find(call => call._id === callId)
    );

    if (!existingCall) {
      return NextResponse.json(
        { error: "Call not found" },
        { status: 404 }
      );
    }

    // Check if summary already exists
    const existingSummary = await convex.query(api.tasks.getSummaryByCall, { callId });

    if (existingSummary) {
      return NextResponse.json(
        { error: "Summary already exists for this call" },
        { status: 409 }
      );
    }

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
      createdAt: body.createdAt || new Date().toISOString(),
      aiModel: body.aiModel || "external-service",
    };

    // Save summary to Convex
    const summaryId = await convex.mutation(api.tasks.addCallSummary, summaryData);

    // Sync call flags to update hasSummary
    await convex.mutation(api.tasks.syncCallFlags, {});

    return NextResponse.json({
      success: true,
      summaryId,
      message: "Summary published successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Error publishing summary:", error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET method to retrieve summary by call ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const callId = searchParams.get("callId");

    if (!callId) {
      return NextResponse.json(
        { error: "Missing callId parameter" },
        { status: 400 }
      );
    }

    const summary = await convex.query(api.tasks.getSummaryByCall, { 
      callId: callId as Id<"calls"> 
    });

    if (!summary) {
      return NextResponse.json(
        { error: "Summary not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      summary
    });

  } catch (error) {
    console.error("Error retrieving summary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
