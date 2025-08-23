import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Initialize Convex client for server-side operations
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Type definitions for the API request
interface TranscriptMessage {
  role: "agent" | "user";
  response: string;
  timestamp?: string;
  confidence?: number;
}

interface PublishTranscriptRequest {
  callId: string; // Convex ID of the call
  transcript: TranscriptMessage[];
  fullTranscript?: string;
  language?: string;
  duration?: number;
  createdAt?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: PublishTranscriptRequest = await request.json();

    // Validate required fields
    if (!body.callId) {
      return NextResponse.json(
        { error: "Missing required field: callId" },
        { status: 400 }
      );
    }

    if (!body.transcript || !Array.isArray(body.transcript)) {
      return NextResponse.json(
        { error: "Missing or invalid transcript array" },
        { status: 400 }
      );
    }

    // Validate transcript messages
    for (const message of body.transcript) {
      if (!message.role || !["agent", "user"].includes(message.role)) {
        return NextResponse.json(
          { error: "Invalid transcript message: role must be 'agent' or 'user'" },
          { status: 400 }
        );
      }
      if (!message.response) {
        return NextResponse.json(
          { error: "Invalid transcript message: response is required" },
          { status: 400 }
        );
      }
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

    // Check if transcript already exists
    const existingTranscript = await convex.query(api.tasks.getTranscriptByCall, { callId });

    if (existingTranscript) {
      return NextResponse.json(
        { error: "Transcript already exists for this call" },
        { status: 409 }
      );
    }

    // Prepare transcript data
    const transcriptData = {
      callId,
      transcript: body.transcript,
      fullTranscript: body.fullTranscript || body.transcript.map(msg => `${msg.role}: ${msg.response}`).join('\n'),
      language: body.language || "en",
      duration: body.duration || existingCall.duration,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    // Save transcript to Convex
    const transcriptId = await convex.mutation(api.tasks.addTranscript, transcriptData);

    // Update call to mark it has transcript and set status
    await convex.mutation(api.tasks.updateTranscriptStatus, {
      callId,
      status: "completed"
    });

    // Sync call flags to update hasTranscript
    await convex.mutation(api.tasks.syncCallFlags, {});

    return NextResponse.json({
      success: true,
      transcriptId,
      message: "Transcript published successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Error publishing transcript:", error);
    
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

// GET method to retrieve transcript by call ID
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

    const transcript = await convex.query(api.tasks.getTranscriptByCall, { 
      callId: callId as Id<"calls"> 
    });

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      transcript
    });

  } catch (error) {
    console.error("Error retrieving transcript:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT method to update existing transcript
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
    const existingTranscript = await convex.query(api.tasks.getTranscriptByCall, { callId });

    if (!existingTranscript) {
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    // Update transcript data
    const updateData: any = {};
    
    if (body.transcript) updateData.transcript = body.transcript;
    if (body.fullTranscript) updateData.fullTranscript = body.fullTranscript;
    if (body.language) updateData.language = body.language;
    if (body.duration !== undefined) updateData.duration = body.duration;

    // Note: You'll need to add an updateTranscript mutation to tasks.ts
    // For now, we'll return an error
    return NextResponse.json(
      { error: "Transcript updates not yet supported. Use DELETE and POST to replace." },
      { status: 501 }
    );

  } catch (error) {
    console.error("Error updating transcript:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE method to remove transcript
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const callId = searchParams.get("callId");

    if (!callId) {
      return NextResponse.json(
        { error: "Missing callId parameter" },
        { status: 400 }
      );
    }

    const transcript = await convex.query(api.tasks.getTranscriptByCall, { 
      callId: callId as Id<"calls"> 
    });

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    // Note: You'll need to add a deleteTranscript mutation to tasks.ts
    // For now, we'll return an error
    return NextResponse.json(
      { error: "Transcript deletion not yet supported" },
      { status: 501 }
    );

  } catch (error) {
    console.error("Error deleting transcript:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
