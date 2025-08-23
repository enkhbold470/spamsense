# SpamSense API Documentation

## Overview

The SpamSense API provides endpoints for external microservices to publish call data, transcripts, and AI-generated summaries to the Convex database.

## Base URL

```
https://your-domain.com/api
```

## Authentication

Currently, no authentication is required. For production, consider implementing API keys or other authentication mechanisms.

## API Endpoints

### 1. Calls API

#### POST /api/calls
Create a new call record.

**Request Body:**
```json
{
  "phoneNumber": "+1-555-0123",
  "contactId": "optional-convex-contact-id",
  "type": "personal", // or "business"
  "status": "allowed", // "allowed", "blocked", "spam", "unknown"
  "duration": 420, // seconds
  "timestamp": "2024-01-20T10:30:00.000Z",
  "isSpam": false,
  "confidence": 5, // 0-100 spam confidence
  "location": "Los Angeles, CA",
  "carrierInfo": "Verizon",
  "action": "allow", // optional: "allow", "block", "mark_spam", "whitelist"
  "notes": "Family call",
  "hasTranscript": false,
  "hasSummary": false,
  "transcriptStatus": "pending" // optional: "pending", "processing", "completed", "failed"
}
```

**Response (201):**
```json
{
  "success": true,
  "callId": "convex-generated-id",
  "message": "Call published successfully"
}
```

#### GET /api/calls
Retrieve calls with optional filtering.

**Query Parameters:**
- `callId`: Specific call ID
- `phoneNumber`: Filter by phone number
- `type`: Filter by type ("personal" or "business")
- `status`: Filter by status
- `limit`: Maximum number of results

**Response (200):**
```json
{
  "success": true,
  "calls": [...],
  "count": 10
}
```

### 2. Transcripts API

#### POST /api/transcripts
Publish a transcript for an existing call.

**Request Body:**
```json
{
  "callId": "convex-call-id",
  "transcript": [
    {
      "role": "user", // "user" or "agent"
      "response": "Hello, is this tech support?",
      "timestamp": "2024-01-20T10:30:05.000Z",
      "confidence": 0.98 // optional: speech-to-text confidence
    },
    {
      "role": "agent",
      "response": "Yes, this is tech support. How can I help you?",
      "timestamp": "2024-01-20T10:30:10.000Z",
      "confidence": 0.95
    }
  ],
  "fullTranscript": "user: Hello, is this tech support?\nagent: Yes, this is tech support. How can I help you?",
  "language": "en", // optional, defaults to "en"
  "duration": 420, // optional, uses call duration if not provided
  "createdAt": "2024-01-20T10:35:00.000Z" // optional, defaults to now
}
```

**Response (201):**
```json
{
  "success": true,
  "transcriptId": "convex-generated-id",
  "message": "Transcript published successfully"
}
```

#### GET /api/transcripts?callId=xxx
Retrieve transcript for a specific call.

**Response (200):**
```json
{
  "success": true,
  "transcript": {
    "_id": "convex-id",
    "callId": "call-id",
    "transcript": [...],
    "fullTranscript": "...",
    "language": "en",
    "duration": 420,
    "createdAt": "2024-01-20T10:35:00.000Z"
  }
}
```

### 3. Summaries API

#### POST /api/summaries
Publish an AI-generated summary for a call.

**Request Body:**
```json
{
  "callId": "convex-call-id",
  "transcriptId": "convex-transcript-id", // optional
  "summary": "Customer called for technical support regarding their internet connection. Issue was resolved by restarting the modem.",
  "intent": {
    "primary": "support", // primary intent classification
    "confidence": 95, // 0-100 confidence in classification
    "keywords": ["technical support", "internet", "modem"],
    "sentiment": "positive", // "positive", "negative", "neutral"
    "urgency": "medium" // "low", "medium", "high"
  },
  "keyPoints": [
    "Customer experiencing internet connectivity issues",
    "Problem resolved with modem restart",
    "Customer satisfied with solution"
  ],
  "actionItems": [ // optional
    "Follow up in 24 hours to ensure stability"
  ],
  "followUpRequired": true,
  "satisfactionScore": 8, // optional: 1-10
  "createdAt": "2024-01-20T10:40:00.000Z", // optional
  "aiModel": "gpt-4" // optional: which AI model generated the summary
}
```

**Response (201):**
```json
{
  "success": true,
  "summaryId": "convex-generated-id",
  "message": "Summary published successfully"
}
```

#### GET /api/summaries?callId=xxx
Retrieve summary for a specific call.

**Response (200):**
```json
{
  "success": true,
  "summary": {
    "_id": "convex-id",
    "callId": "call-id",
    "summary": "...",
    "intent": {...},
    "keyPoints": [...],
    "followUpRequired": true,
    "satisfactionScore": 8,
    "createdAt": "2024-01-20T10:40:00.000Z"
  }
}
```

#### PUT /api/summaries
Update an existing summary.

**Request Body:**
```json
{
  "callId": "convex-call-id",
  "summary": "Updated summary text", // optional
  "intent": {...}, // optional
  "keyPoints": [...], // optional
  "satisfactionScore": 9 // optional
}
```

## Error Responses

All endpoints return consistent error responses:

**400 Bad Request:**
```json
{
  "error": "Missing required field: callId"
}
```

**404 Not Found:**
```json
{
  "error": "Call not found"
}
```

**409 Conflict:**
```json
{
  "error": "Transcript already exists for this call"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

## Integration Examples

### Python Example
```python
import requests
import json

# Publish a call
call_data = {
    "phoneNumber": "+1-555-0123",
    "type": "business",
    "status": "allowed",
    "duration": 420,
    "timestamp": "2024-01-20T10:30:00.000Z",
    "isSpam": False,
    "confidence": 5
}

response = requests.post(
    "https://your-domain.com/api/calls",
    headers={"Content-Type": "application/json"},
    data=json.dumps(call_data)
)

if response.status_code == 201:
    call_id = response.json()["callId"]
    print(f"Call created with ID: {call_id}")
    
    # Publish transcript
    transcript_data = {
        "callId": call_id,
        "transcript": [
            {
                "role": "user",
                "response": "Hello, I need help with my account",
                "confidence": 0.98
            }
        ]
    }
    
    transcript_response = requests.post(
        "https://your-domain.com/api/transcripts",
        headers={"Content-Type": "application/json"},
        data=json.dumps(transcript_data)
    )
    
    if transcript_response.status_code == 201:
        print("Transcript published successfully")
```

### Node.js Example
```javascript
const fetch = require('node-fetch');

async function publishCall() {
  const callData = {
    phoneNumber: "+1-555-0123",
    type: "business",
    status: "allowed",
    duration: 420,
    timestamp: new Date().toISOString(),
    isSpam: false,
    confidence: 5
  };

  const response = await fetch('https://your-domain.com/api/calls', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(callData)
  });

  if (response.ok) {
    const result = await response.json();
    console.log('Call created:', result.callId);
    return result.callId;
  }
}
```

### cURL Example
```bash
# Create a call
curl -X POST https://your-domain.com/api/calls \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1-555-0123",
    "type": "business",
    "status": "allowed",
    "duration": 420,
    "timestamp": "2024-01-20T10:30:00.000Z",
    "isSpam": false,
    "confidence": 5
  }'

# Publish transcript
curl -X POST https://your-domain.com/api/transcripts \
  -H "Content-Type: application/json" \
  -d '{
    "callId": "your-call-id",
    "transcript": [
      {
        "role": "user",
        "response": "Hello, I need help",
        "confidence": 0.98
      }
    ]
  }'
```

## Rate Limiting

Currently no rate limiting is implemented. For production, consider implementing appropriate rate limiting based on your usage patterns.

## Environment Variables

Make sure these environment variables are set:

```env
NEXT_PUBLIC_CONVEX_URL=your-convex-deployment-url
```

## Notes

1. Call IDs, transcript IDs, and summary IDs are Convex-generated unique identifiers
2. Timestamps should be in ISO 8601 format
3. The API automatically updates call flags (`hasTranscript`, `hasSummary`) when transcripts/summaries are published
4. Duplicate transcripts/summaries for the same call are not allowed (returns 409 Conflict)
5. All operations are atomic and will rollback on errors
