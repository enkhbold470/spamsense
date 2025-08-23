import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";



// Initialize Convex client for server-side operations
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Type definitions for the API request
interface PublishCallRequest {
  phoneNumber: string;
  contactId?: string;
  type: "personal" | "business";
  status: "allowed" | "blocked" | "spam" | "unknown";
  duration: number; // in seconds
  timestamp: string; // ISO string
  isSpam: boolean;
  confidence: number; // 0-100 spam confidence
  location?: string;
  carrierInfo?: string;
  action?: "allow" | "block" | "mark_spam" | "whitelist";
  notes?: string;
  hasTranscript?: boolean;
  hasSummary?: boolean;
  transcriptStatus?: "pending" | "processing" | "completed" | "failed";
}

export async function POST(request: NextRequest) {
  console.log("[CALLS API] POST request received");
  
  try {
    console.log("[CALLS API] Parsing request body...");
    // Parse the request body
    const body: PublishCallRequest = await request.json();
    console.log("[CALLS API] Request body parsed successfully:", JSON.stringify(body, null, 2));

    console.log("[CALLS API] Starting validation...");
    // Validate required fields
    if (!body.phoneNumber) {
      console.log("[CALLS API] Validation failed: Missing phoneNumber");
      return NextResponse.json(
        { error: "Missing required field: phoneNumber" },
        { status: 400 }
      );
    }
    console.log("[CALLS API] phoneNumber validation passed:", body.phoneNumber);

    if (!body.type || !["personal", "business"].includes(body.type)) {
      return NextResponse.json(
        { error: "Invalid type: must be 'personal' or 'business'" },
        { status: 400 }
      );
    }

    if (!body.status || !["allowed", "blocked", "spam", "unknown"].includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status: must be 'allowed', 'blocked', 'spam', or 'unknown'" },
        { status: 400 }
      );
    }

    if (typeof body.duration !== "number" || body.duration < 0) {
      return NextResponse.json(
        { error: "Invalid duration: must be a non-negative number" },
        { status: 400 }
      );
    }

    if (!body.timestamp) {
      return NextResponse.json(
        { error: "Missing required field: timestamp" },
        { status: 400 }
      );
    }

    // Validate timestamp
    const timestamp = new Date(body.timestamp);
    if (isNaN(timestamp.getTime())) {
      return NextResponse.json(
        { error: "Invalid timestamp format" },
        { status: 400 }
      );
    }

    if (typeof body.isSpam !== "boolean") {
      return NextResponse.json(
        { error: "Invalid isSpam: must be a boolean" },
        { status: 400 }
      );
    }

    if (typeof body.confidence !== "number" || body.confidence < 0 || body.confidence > 100) {
      return NextResponse.json(
        { error: "Invalid confidence: must be a number between 0 and 100" },
        { status: 400 }
      );
    }

    // Validate optional contactId if provided
    let contactId: Id<"contacts"> | undefined;
    if (body.contactId) {
      console.log("[CALLS API] Validating contactId:", body.contactId);
      contactId = body.contactId as Id<"contacts">;
      // Verify contact exists
      console.log("[CALLS API] Querying contacts from Convex...");
      const contacts = await convex.query(api.tasks.getContacts, {});
      console.log("[CALLS API] Retrieved", contacts.length, "contacts from Convex");
      const contact = contacts.find(c => c._id === contactId);
      if (!contact) {
        console.log("[CALLS API] Contact not found for contactId:", contactId);
        return NextResponse.json(
          { error: "Invalid contactId: contact not found" },
          { status: 400 }
        );
      }
      console.log("[CALLS API] Contact validation passed:", contact._id);
    }

    // Validate optional action if provided
    if (body.action && !["allow", "block", "mark_spam", "whitelist"].includes(body.action)) {
      return NextResponse.json(
        { error: "Invalid action: must be 'allow', 'block', 'mark_spam', or 'whitelist'" },
        { status: 400 }
      );
    }

    // Validate optional transcriptStatus if provided
    if (body.transcriptStatus && !["pending", "processing", "completed", "failed"].includes(body.transcriptStatus)) {
      return NextResponse.json(
        { error: "Invalid transcriptStatus: must be 'pending', 'processing', 'completed', or 'failed'" },
        { status: 400 }
      );
    }

    console.log("[CALLS API] All validations passed, preparing call data...");
    // Prepare call data
    const callData = {
      phoneNumber: body.phoneNumber,
      contactId,
      type: body.type,
      status: body.status,
      duration: body.duration,
      timestamp: body.timestamp,
      isSpam: body.isSpam,
      confidence: body.confidence,
      location: body.location,
      carrierInfo: body.carrierInfo,
      action: body.action,
      notes: body.notes,
      hasTranscript: body.hasTranscript || false,
      hasSummary: body.hasSummary || false,
      transcriptStatus: body.transcriptStatus,
    };
    console.log("[CALLS API] Call data prepared:", JSON.stringify(callData, null, 2));

    console.log("[CALLS API] Saving call to Convex...");
    // Save call to Convex
    const callId = await convex.mutation(api.tasks.addCall, callData);
    console.log("[CALLS API] Call saved successfully with ID:", callId);

    return NextResponse.json({
      success: true,
      callId,
      message: "Call published successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("[CALLS API] Error publishing call:", error);
    console.error("[CALLS API] Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    console.error("[CALLS API] Error name:", error instanceof Error ? error.name : 'Unknown');
    console.error("[CALLS API] Error message:", error instanceof Error ? error.message : String(error));
    
    if (error instanceof SyntaxError) {
      console.log("[CALLS API] Returning 400 - Invalid JSON");
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    console.log("[CALLS API] Returning 500 - Internal server error");
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// GET method to retrieve calls
export async function GET(request: NextRequest) {
  console.log("[CALLS API] GET request received");
  
  try {
    console.log("[CALLS API] Parsing URL search parameters...");
    const { searchParams } = new URL(request.url);
    console.log("[CALLS API] Search parameters:", Object.fromEntries(searchParams.entries()));
    const callId = searchParams.get("callId");
    const phoneNumber = searchParams.get("phoneNumber");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");
    console.log("[CALLS API] Extracted parameters - callId:", callId, "phoneNumber:", phoneNumber, "type:", type, "status:", status, "limit:", limit);

    // If specific call ID is requested
    if (callId) {
      console.log("[CALLS API] Fetching specific call with ID:", callId);
      console.log("[CALLS API] Querying all calls from Convex...");
      const calls = await convex.query(api.tasks.getCalls, {});
      console.log("[CALLS API] Retrieved", calls.length, "calls from Convex");
      const call = calls.find(c => c._id === callId);
      
      if (!call) {
        console.log("[CALLS API] Call not found for ID:", callId);
        return NextResponse.json(
          { error: "Call not found" },
          { status: 404 }
        );
      }

      console.log("[CALLS API] Call found, returning call data");
      return NextResponse.json({
        success: true,
        call
      });
    }

    // Filter calls based on query parameters
    console.log("[CALLS API] Fetching all calls from Convex...");
    let calls = await convex.query(api.tasks.getCalls, {});
    console.log("[CALLS API] Retrieved", calls.length, "total calls from Convex");

    if (phoneNumber) {
      console.log("[CALLS API] Filtering calls by phoneNumber:", phoneNumber);
      calls = calls.filter(call => call.phoneNumber === phoneNumber);
      console.log("[CALLS API] After phoneNumber filtering:", calls.length, "calls remain");
    }

    if (type && ["personal", "business"].includes(type)) {
      console.log("[CALLS API] Filtering calls by type:", type);
      calls = calls.filter(call => call.type === type);
      console.log("[CALLS API] After type filtering:", calls.length, "calls remain");
    }

    if (status && ["allowed", "blocked", "spam", "unknown"].includes(status)) {
      console.log("[CALLS API] Filtering calls by status:", status);
      calls = calls.filter(call => call.status === status);
      console.log("[CALLS API] After status filtering:", calls.length, "calls remain");
    }

    // Apply limit if provided
    if (limit) {
      const limitNum = parseInt(limit, 10);
      console.log("[CALLS API] Applying limit:", limitNum);
      if (!isNaN(limitNum) && limitNum > 0) {
        calls = calls.slice(0, limitNum);
        console.log("[CALLS API] After limit applied:", calls.length, "calls remain");
      }
    }

    // Sort by timestamp (newest first)
    console.log("[CALLS API] Sorting calls by timestamp (newest first)");
    calls.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    console.log("[CALLS API] Returning", calls.length, "calls");
    return NextResponse.json({
      success: true,
      calls,
      count: calls.length
    });

  } catch (error) {
    console.error("[CALLS API] Error retrieving calls:", error);
    console.error("[CALLS API] Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    console.error("[CALLS API] Error name:", error instanceof Error ? error.name : 'Unknown');
    console.error("[CALLS API] Error message:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// PUT method to update existing call
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
    const calls = await convex.query(api.tasks.getCalls, {});
    const existingCall = calls.find(c => c._id === callId);

    if (!existingCall) {
      return NextResponse.json(
        { error: "Call not found" },
        { status: 404 }
      );
    }

    // Prepare update data (only include provided fields)
    const updateData: any = {};
    
    if (body.status) updateData.status = body.status;
    if (body.isSpam !== undefined) updateData.isSpam = body.isSpam;
    if (body.confidence !== undefined) updateData.confidence = body.confidence;
    if (body.action) updateData.action = body.action;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.hasTranscript !== undefined) updateData.hasTranscript = body.hasTranscript;
    if (body.hasSummary !== undefined) updateData.hasSummary = body.hasSummary;
    if (body.transcriptStatus) updateData.transcriptStatus = body.transcriptStatus;

    // Note: You might need to add an updateCall mutation to tasks.ts
    // For now, we'll return a success message
    return NextResponse.json({
      success: true,
      message: "Call update queued (implement updateCall mutation in tasks.ts)"
    });

  } catch (error) {
    console.error("Error updating call:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
