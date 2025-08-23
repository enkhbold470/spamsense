"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Phone, 
  Clock, 
  MapPin, 
  Wifi, 
  User, 
  MessageSquare, 
  FileText, 
  Star, 
  Shield, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Share2
} from "lucide-react";
import { 
  GlassCard, 
  GlassCardContent, 
  GlassCardHeader, 
  GlassCardTitle,
  GlassButton,
  NavSidebar,
  TopBar
} from "@/components/ui";
import mockData from "@/lib/mockData";
import type { User as UserType } from "@/components/ui/top-bar";
import type { Call, TranscriptMessage, CallSummary } from "@/lib/types";

const sampleUser: UserType = {
  name: "Sarah Johnson",
  email: "sarah@spamsense.com",
  initials: "SJ"
};

// Mock transcript data - in real app this would come from Convex
const mockTranscripts: Record<string, TranscriptMessage[]> = {
  "call-1": [
    { role: "user", response: "Hi Mom!", timestamp: "2024-01-15T10:30:00.000Z", confidence: 0.98 },
    { role: "agent", response: "Hi honey! How are you doing? I was just calling to check in on you.", timestamp: "2024-01-15T10:30:05.000Z", confidence: 0.97 },
    { role: "user", response: "I'm doing great! Just busy with work. Thanks for calling.", timestamp: "2024-01-15T10:30:20.000Z", confidence: 0.94 },
    { role: "agent", response: "That's wonderful to hear. Don't forget about dinner this Sunday!", timestamp: "2024-01-15T10:30:35.000Z", confidence: 0.96 },
    { role: "user", response: "Of course! I wouldn't miss it. Looking forward to seeing everyone.", timestamp: "2024-01-15T10:30:50.000Z", confidence: 0.93 }
  ],
  "call-4": [
    { role: "user", response: "Hello?", timestamp: "2024-01-15T14:20:00.000Z", confidence: 0.95 },
    { role: "agent", response: "Hey! It's Sarah. Are you free to chat?", timestamp: "2024-01-15T14:20:05.000Z", confidence: 0.98 },
    { role: "user", response: "Of course! What's up?", timestamp: "2024-01-15T14:20:10.000Z", confidence: 0.97 },
    { role: "agent", response: "I wanted to tell you about what happened at work today...", timestamp: "2024-01-15T14:20:15.000Z", confidence: 0.96 }
  ]
};

const mockSummaries: Record<string, CallSummary> = {
  "call-1": {
    id: "summary-1",
    callId: "call-1",
    summary: "Pleasant personal call from mother checking in on user's wellbeing. Discussion about upcoming family dinner on Sunday. Positive family interaction.",
    intent: {
      primary: "personal",
      confidence: 99,
      keywords: ["family", "dinner", "Sunday", "check in"],
      sentiment: "positive",
      urgency: "low"
    },
    keyPoints: ["Family check-in call", "Reminder about Sunday dinner", "Positive family interaction"],
    actionItems: ["Remember Sunday dinner"],
    followUpRequired: false,
    satisfactionScore: 10,
    createdAt: "2024-01-15T11:16:00.000Z",
    aiModel: "claude-4-sonnet"
  },
  "call-4": {
    id: "summary-4", 
    callId: "call-4",
    summary: "Personal call with best friend Sarah to catch up and share work experiences. Friendly conversation with positive sentiment.",
    intent: {
      primary: "personal",
      confidence: 95,
      keywords: ["friend", "work", "chat", "catch up"],
      sentiment: "positive", 
      urgency: "low"
    },
    keyPoints: ["Friendly catch-up call", "Work discussion", "Personal conversation"],
    actionItems: [],
    followUpRequired: false,
    satisfactionScore: 9,
    createdAt: "2024-01-15T15:00:00.000Z",
    aiModel: "claude-4-sonnet"
  }
};

export default function PersonalCallDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "transcript" | "summary">("overview");
  
  // Find the call by ID (slug)
  const call = mockData.calls.find(c => c.id === slug && c.type === "personal");
  const transcript = mockTranscripts[slug];
  const summary = mockSummaries[slug];
  
  if (!call) {
    return (
      <div className="flex min-h-screen">
        <NavSidebar />
        <div className="flex-1 ml-72">
          <div className="p-6">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Call Not Found</h1>
              <p className="text-muted-foreground mb-6">The requested personal call could not be found.</p>
              <Link href="/personal-calls">
                <GlassButton>Back to Personal Calls</GlassButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyTranscript = () => {
    if (transcript) {
      const fullText = transcript.map(msg => `${msg.role}: ${msg.response}`).join('\n');
      navigator.clipboard.writeText(fullText);
    }
  };

  return (
    <div className="flex min-h-screen">
      <NavSidebar />
      
      <div className="flex-1 ml-72">
        <div className="p-6">
          <TopBar 
            user={sampleUser}
            notifications={3}
            locationFilter={{
              current: "All Devices",
              options: ["All Devices", "iPhone", "Work Phone", "Home"],
              onChange: (location) => console.log("Device changed:", location)
            }}
          />
          
          <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
              <Link href="/personal-calls">
                <GlassButton variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Personal Calls
                </GlassButton>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Personal Call Details</h1>
                <p className="text-muted-foreground">
                  {call.contact?.name || call.phoneNumber}
                </p>
              </div>
            </div>

            {/* Call Overview Card */}
            <GlassCard>
              <GlassCardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-trust-blue/20 rounded-lg">
                      <User className="w-6 h-6 text-trust-blue" />
                    </div>
                    <div>
                      <GlassCardTitle className="text-xl">
                        {call.contact?.name || "Unknown Contact"}
                      </GlassCardTitle>
                      <p className="text-muted-foreground">{call.phoneNumber}</p>
                    </div>
                    {call.contact?.isWhitelisted && (
                      <Star className="w-5 h-5 text-growth-green fill-current" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <GlassButton variant="ghost" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </GlassButton>
                    <GlassButton variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </GlassButton>
                  </div>
                </div>
              </GlassCardHeader>
              
              <GlassCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                      <div className="font-medium">{formatDuration(call.duration)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className={`font-medium ${
                        call.status === "allowed" ? "text-green-600" :
                        call.status === "blocked" ? "text-red-600" :
                        "text-gray-600"
                      }`}>
                        {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Location</div>
                      <div className="font-medium">{call.location || "Unknown"}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Carrier</div>
                      <div className="font-medium">{call.carrierInfo || "Unknown"}</div>
                    </div>
                  </div>
                </div>
                
                {/* Call Time */}
                <div className="mt-6 p-4 glass-secondary rounded-lg">
                  <div className="text-sm text-muted-foreground">Call Time</div>
                  <div className="text-lg font-medium">
                    {call.timestamp.toLocaleString()}
                  </div>
                </div>
                
                {/* Notes */}
                {call.notes && (
                  <div className="mt-4 p-4 glass-secondary rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">Notes</div>
                    <div>{call.notes}</div>
                  </div>
                )}
                
                {/* Spam Detection */}
                {call.isSpam && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-medium">Spam Detected</span>
                    </div>
                    <div className="text-sm mt-2">
                      Confidence: {call.confidence}%
                    </div>
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>

            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 glass-secondary rounded-lg w-fit">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "overview" 
                    ? "glass-primary text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Overview
              </button>
              {transcript && (
                <button
                  onClick={() => setActiveTab("transcript")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === "transcript" 
                      ? "glass-primary text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Transcript
                </button>
              )}
              {summary && (
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === "summary" 
                      ? "glass-primary text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  AI Summary
                </button>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Call Overview</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    {/* Contact Information */}
                    {call.contact && (
                      <div className="p-4 glass-secondary rounded-lg">
                        <h3 className="font-medium mb-3">Contact Information</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name</span>
                            <span>{call.contact.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone</span>
                            <span>{call.contact.phoneNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type</span>
                            <span className="capitalize">{call.contact.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Call Count</span>
                            <span>{call.contact.callCount} calls</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <div className="flex items-center gap-2">
                              {call.contact.isWhitelisted && (
                                <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">
                                  Whitelisted
                                </span>
                              )}
                              {call.contact.isBlocked && (
                                <span className="text-xs bg-red-500/20 text-red-600 px-2 py-1 rounded">
                                  Blocked
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Call Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 glass-secondary rounded-lg text-center">
                        <MessageSquare className={`w-8 h-8 mx-auto mb-2 ${transcript ? "text-trust-blue" : "text-muted-foreground"}`} />
                        <div className="font-medium">Transcript</div>
                        <div className="text-sm text-muted-foreground">
                          {transcript ? "Available" : "Not available"}
                        </div>
                      </div>
                      
                      <div className="p-4 glass-secondary rounded-lg text-center">
                        <FileText className={`w-8 h-8 mx-auto mb-2 ${summary ? "text-energy-orange" : "text-muted-foreground"}`} />
                        <div className="font-medium">AI Summary</div>
                        <div className="text-sm text-muted-foreground">
                          {summary ? "Generated" : "Not available"}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            )}

            {activeTab === "transcript" && transcript && (
              <GlassCard>
                <GlassCardHeader>
                  <div className="flex items-center justify-between">
                    <GlassCardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-trust-blue" />
                      Call Transcript
                    </GlassCardTitle>
                    <div className="flex gap-2">
                      <GlassButton variant="ghost" size="sm" onClick={copyTranscript}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </GlassButton>
                      <GlassButton 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowFullTranscript(!showFullTranscript)}
                      >
                        {showFullTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {showFullTranscript ? "Collapse" : "Expand"}
                      </GlassButton>
                    </div>
                  </div>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    {transcript.slice(0, showFullTranscript ? transcript.length : 3).map((message, index) => (
                      <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                          message.role === "user" 
                            ? "bg-trust-blue/20 text-trust-blue-foreground ml-auto" 
                            : "bg-glass-secondary"
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium capitalize">
                              {message.role === "user" ? "You" : call.contact?.name || "Caller"}
                            </span>
                            {message.timestamp && (
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(message.timestamp)}
                              </span>
                            )}
                            {message.confidence && (
                              <span className="text-xs text-muted-foreground">
                                {Math.round(message.confidence * 100)}%
                              </span>
                            )}
                          </div>
                          <div className="text-sm">{message.response}</div>
                        </div>
                      </div>
                    ))}
                    
                    {!showFullTranscript && transcript.length > 3 && (
                      <div className="text-center">
                        <GlassButton 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowFullTranscript(true)}
                        >
                          Show {transcript.length - 3} more messages
                        </GlassButton>
                      </div>
                    )}
                  </div>
                </GlassCardContent>
              </GlassCard>
            )}

            {activeTab === "summary" && summary && (
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-energy-orange" />
                    AI-Generated Summary
                  </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-6">
                    {/* Summary Text */}
                    <div className="p-4 glass-secondary rounded-lg">
                      <h3 className="font-medium mb-2">Summary</h3>
                      <p>{summary.summary}</p>
                    </div>
                    
                    {/* Intent Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 glass-secondary rounded-lg">
                        <h3 className="font-medium mb-3">Intent Analysis</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Primary Intent</span>
                            <span className="capitalize">{summary.intent.primary}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Confidence</span>
                            <span>{summary.intent.confidence}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sentiment</span>
                            <span className={`capitalize ${
                              summary.intent.sentiment === "positive" ? "text-green-600" :
                              summary.intent.sentiment === "negative" ? "text-red-600" :
                              "text-gray-600"
                            }`}>
                              {summary.intent.sentiment}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Urgency</span>
                            <span className="capitalize">{summary.intent.urgency}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 glass-secondary rounded-lg">
                        <h3 className="font-medium mb-3">Satisfaction</h3>
                        <div className="flex items-center gap-3">
                          <div className="text-3xl font-bold text-trust-blue">
                            {summary.satisfactionScore}/10
                          </div>
                          <div className="flex-1">
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-trust-blue rounded-full" 
                                style={{ width: `${(summary.satisfactionScore || 0) * 10}%` }}
                              />
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {summary.satisfactionScore && summary.satisfactionScore >= 8 ? "Excellent" :
                               summary.satisfactionScore && summary.satisfactionScore >= 6 ? "Good" :
                               summary.satisfactionScore && summary.satisfactionScore >= 4 ? "Fair" : "Poor"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Key Points */}
                    <div className="p-4 glass-secondary rounded-lg">
                      <h3 className="font-medium mb-3">Key Points</h3>
                      <ul className="space-y-2">
                        {summary.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-trust-blue mt-2 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Keywords */}
                    <div className="p-4 glass-secondary rounded-lg">
                      <h3 className="font-medium mb-3">Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {summary.intent.keywords.map((keyword, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-trust-blue/20 text-trust-blue rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Items */}
                    {summary.actionItems && summary.actionItems.length > 0 && (
                      <div className="p-4 glass-secondary rounded-lg">
                        <h3 className="font-medium mb-3">Action Items</h3>
                        <ul className="space-y-2">
                          {summary.actionItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <input type="checkbox" className="mt-1" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* AI Model Info */}
                    <div className="text-xs text-muted-foreground text-center">
                      Analysis generated by {summary.aiModel} on {new Date(summary.createdAt).toLocaleString()}
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
