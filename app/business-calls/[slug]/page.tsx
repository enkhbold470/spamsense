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
  Building2, 
  MessageSquare, 
  FileText, 
  Shield, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Share2,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Calendar
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

// Mock transcript data for business calls
const mockBusinessTranscripts: Record<string, TranscriptMessage[]> = {
  "call-2": [
    { role: "agent", response: "Good morning, this is John from Smith & Associates. I'm calling regarding the project proposal we discussed.", timestamp: "2024-01-15T11:00:00.000Z", confidence: 0.99 },
    { role: "user", response: "Hi John! Yes, I've been expecting your call. How are things progressing?", timestamp: "2024-01-15T11:00:15.000Z", confidence: 0.97 },
    { role: "agent", response: "Great! We've reviewed your requirements and I'm happy to say we can deliver everything within your timeline and budget.", timestamp: "2024-01-15T11:00:30.000Z", confidence: 0.95 },
    { role: "user", response: "That's excellent news! When can we schedule a meeting to go over the details?", timestamp: "2024-01-15T11:01:00.000Z", confidence: 0.98 },
    { role: "agent", response: "How about Thursday afternoon? I can come to your office around 2 PM if that works for you.", timestamp: "2024-01-15T11:01:15.000Z", confidence: 0.96 },
    { role: "user", response: "Perfect! I'll send you a calendar invite. Looking forward to it.", timestamp: "2024-01-15T11:01:30.000Z", confidence: 0.94 }
  ],
  "call-9": [
    { role: "user", response: "Hello, tech support?", timestamp: "2024-01-14T09:30:00.000Z", confidence: 0.92 },
    { role: "agent", response: "Yes, this is Mike from technical support. How can I help you today?", timestamp: "2024-01-14T09:30:05.000Z", confidence: 0.98 },
    { role: "user", response: "I'm having trouble with the new software update. It keeps crashing.", timestamp: "2024-01-14T09:30:20.000Z", confidence: 0.96 },
    { role: "agent", response: "I see. Let me walk you through some troubleshooting steps. First, can you restart the application?", timestamp: "2024-01-14T09:30:35.000Z", confidence: 0.97 }
  ]
};

const mockBusinessSummaries: Record<string, CallSummary> = {
  "call-2": {
    id: "summary-2",
    callId: "call-2",
    summary: "Business call from John at Smith & Associates regarding a previously discussed project proposal. Positive update confirming they can meet requirements within timeline and budget. Meeting scheduled for Thursday 2 PM.",
    intent: {
      primary: "business",
      confidence: 97,
      keywords: ["project proposal", "timeline", "budget", "meeting"],
      sentiment: "positive",
      urgency: "medium"
    },
    keyPoints: ["Project proposal update", "Requirements can be met", "Within timeline and budget", "Meeting scheduled Thursday 2 PM"],
    actionItems: ["Prepare for Thursday meeting", "Review project requirements", "Send calendar invite"],
    followUpRequired: true,
    satisfactionScore: 9,
    createdAt: "2024-01-15T11:13:00.000Z",
    aiModel: "claude-4-sonnet"
  },
  "call-9": {
    id: "summary-9",
    callId: "call-9",
    summary: "Technical support call to resolve software application crashes after recent update. Support agent provided troubleshooting guidance.",
    intent: {
      primary: "support",
      confidence: 94,
      keywords: ["technical support", "software", "crash", "troubleshooting"],
      sentiment: "neutral",
      urgency: "medium"
    },
    keyPoints: ["Software crashing after update", "Technical support provided", "Troubleshooting initiated"],
    actionItems: ["Follow troubleshooting steps", "Monitor application stability"],
    followUpRequired: true,
    satisfactionScore: 7,
    createdAt: "2024-01-14T10:00:00.000Z",
    aiModel: "claude-4-sonnet"
  }
};

export default function BusinessCallDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "transcript" | "summary">("overview");
  
  // Find the call by ID (slug)
  const call = mockData.calls.find(c => c.id === slug && c.type === "business");
  const transcript = mockBusinessTranscripts[slug];
  const summary = mockBusinessSummaries[slug];
  
  if (!call) {
    return (
      <div className="flex min-h-screen">
        <NavSidebar />
        <div className="flex-1 ml-72">
          <div className="p-6">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Call Not Found</h1>
              <p className="text-muted-foreground mb-6">The requested business call could not be found.</p>
              <Link href="/business-calls">
                <GlassButton>Back to Business Calls</GlassButton>
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

  const isBusinessHours = () => {
    const hour = call.timestamp.getHours();
    return hour >= 9 && hour <= 17;
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
              <Link href="/business-calls">
                <GlassButton variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Business Calls
                </GlassButton>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Business Call Details</h1>
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
                    <div className="p-3 bg-energy-orange/20 rounded-lg">
                      <Building2 className="w-6 h-6 text-energy-orange" />
                    </div>
                    <div>
                      <GlassCardTitle className="text-xl">
                        {call.contact?.name || "Business Contact"}
                      </GlassCardTitle>
                      <p className="text-muted-foreground">{call.phoneNumber}</p>
                      {isBusinessHours() && (
                        <div className="flex items-center gap-1 text-sm text-growth-green mt-1">
                          <CheckCircle className="w-3 h-3" />
                          Business Hours
                        </div>
                      )}
                    </div>
                    {call.contact?.isWhitelisted && (
                      <div className="px-2 py-1 bg-green-500/20 text-green-600 rounded text-xs">
                        Trusted
                      </div>
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
                      <div className={`font-medium flex items-center gap-1 ${
                        call.status === "allowed" ? "text-green-600" :
                        call.status === "blocked" ? "text-red-600" :
                        "text-gray-600"
                      }`}>
                        {call.status === "allowed" ? <CheckCircle className="w-3 h-3" /> : 
                         call.status === "blocked" ? <XCircle className="w-3 h-3" /> : null}
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
                
                {/* Call Time and Business Info */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 glass-secondary rounded-lg">
                    <div className="text-sm text-muted-foreground">Call Time</div>
                    <div className="text-lg font-medium">
                      {call.timestamp.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {isBusinessHours() ? "During business hours" : "Outside business hours"}
                    </div>
                  </div>
                  
                  <div className="p-4 glass-secondary rounded-lg">
                    <div className="text-sm text-muted-foreground">Call Priority</div>
                    <div className="flex items-center gap-2 mt-1">
                      <TrendingUp className={`w-4 h-4 ${
                        call.contact?.notes?.includes("priority") || call.contact?.notes?.includes("client") 
                          ? "text-energy-orange" : "text-muted-foreground"
                      }`} />
                      <span className="font-medium">
                        {call.contact?.notes?.includes("priority") || call.contact?.notes?.includes("client") 
                          ? "High Priority" : "Standard"}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Notes */}
                {call.notes && (
                  <div className="mt-4 p-4 glass-secondary rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">Call Notes</div>
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
                      Confidence: {call.confidence}% • Business scam likely
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
                  AI Analysis
                </button>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Business Call Overview</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    {/* Contact Information */}
                    {call.contact && (
                      <div className="p-4 glass-secondary rounded-lg">
                        <h3 className="font-medium mb-3">Business Contact Details</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Contact Name</span>
                            <span>{call.contact.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone Number</span>
                            <span>{call.contact.phoneNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Contact Type</span>
                            <span className="capitalize">{call.contact.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Calls</span>
                            <span>{call.contact.callCount} calls</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Contact</span>
                            <span>{call.contact.lastCallDate ? new Date(call.contact.lastCallDate).toLocaleDateString() : "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Trust Level</span>
                            <div className="flex items-center gap-2">
                              {call.contact.isWhitelisted && (
                                <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">
                                  Trusted Partner
                                </span>
                              )}
                              {call.contact.isBlocked && (
                                <span className="text-xs bg-red-500/20 text-red-600 px-2 py-1 rounded">
                                  Blocked
                                </span>
                              )}
                              {!call.contact.isWhitelisted && !call.contact.isBlocked && (
                                <span className="text-xs bg-gray-500/20 text-gray-600 px-2 py-1 rounded">
                                  Standard
                                </span>
                              )}
                            </div>
                          </div>
                          {call.contact.notes && (
                            <div className="pt-2 border-t glass-border">
                              <div className="text-sm text-muted-foreground">Notes</div>
                              <div className="text-sm mt-1">{call.contact.notes}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Business Analytics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 glass-secondary rounded-lg text-center">
                        <MessageSquare className={`w-8 h-8 mx-auto mb-2 ${transcript ? "text-trust-blue" : "text-muted-foreground"}`} />
                        <div className="font-medium">Transcript</div>
                        <div className="text-sm text-muted-foreground">
                          {transcript ? `${transcript.length} messages` : "Not available"}
                        </div>
                      </div>
                      
                      <div className="p-4 glass-secondary rounded-lg text-center">
                        <FileText className={`w-8 h-8 mx-auto mb-2 ${summary ? "text-energy-orange" : "text-muted-foreground"}`} />
                        <div className="font-medium">AI Analysis</div>
                        <div className="text-sm text-muted-foreground">
                          {summary ? `${summary.intent.primary} intent` : "Not available"}
                        </div>
                      </div>
                      
                      <div className="p-4 glass-secondary rounded-lg text-center">
                        <Calendar className={`w-8 h-8 mx-auto mb-2 ${summary?.followUpRequired ? "text-energy-orange" : "text-muted-foreground"}`} />
                        <div className="font-medium">Follow-up</div>
                        <div className="text-sm text-muted-foreground">
                          {summary?.followUpRequired ? "Required" : "Not needed"}
                        </div>
                      </div>
                    </div>
                    
                    {/* Business Metrics */}
                    <div className="p-4 glass-secondary rounded-lg">
                      <h3 className="font-medium mb-3">Call Performance</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-energy-orange">{formatDuration(call.duration)}</div>
                          <div className="text-xs text-muted-foreground">Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-trust-blue">
                            {summary?.satisfactionScore || "N/A"}
                          </div>
                          <div className="text-xs text-muted-foreground">Satisfaction</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-growth-green">
                            {summary?.intent.confidence || call.confidence}%
                          </div>
                          <div className="text-xs text-muted-foreground">Confidence</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-muted-foreground">
                            {isBusinessHours() ? "✓" : "✗"}
                          </div>
                          <div className="text-xs text-muted-foreground">Business Hours</div>
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
                      Business Call Transcript
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
                    {transcript.slice(0, showFullTranscript ? transcript.length : 4).map((message, index) => (
                      <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-lg p-4 rounded-lg ${
                          message.role === "user" 
                            ? "bg-energy-orange/20 text-energy-orange-foreground ml-auto" 
                            : "bg-glass-secondary"
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full ${
                              message.role === "user" ? "bg-energy-orange" : "bg-trust-blue"
                            }`} />
                            <span className="text-xs font-medium">
                              {message.role === "user" ? "You" : (call.contact?.name || "Business Contact")}
                            </span>
                            {message.timestamp && (
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(message.timestamp)}
                              </span>
                            )}
                            {message.confidence && (
                              <div className="flex items-center gap-1">
                                <div className={`w-1 h-1 rounded-full ${
                                  message.confidence > 0.95 ? "bg-green-500" :
                                  message.confidence > 0.9 ? "bg-yellow-500" : "bg-red-500"
                                }`} />
                                <span className="text-xs text-muted-foreground">
                                  {Math.round(message.confidence * 100)}%
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-sm leading-relaxed">{message.response}</div>
                        </div>
                      </div>
                    ))}
                    
                    {!showFullTranscript && transcript.length > 4 && (
                      <div className="text-center">
                        <GlassButton 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowFullTranscript(true)}
                        >
                          Show {transcript.length - 4} more messages
                        </GlassButton>
                      </div>
                    )}
                  </div>
                  
                  {/* Transcript Quality */}
                  <div className="mt-6 pt-4 border-t glass-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Transcript Quality</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-trust-blue rounded-full" 
                            style={{ 
                              width: `${(transcript.reduce((sum, msg) => sum + (msg.confidence || 0), 0) / transcript.length) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="font-medium">
                          {Math.round((transcript.reduce((sum, msg) => sum + (msg.confidence || 0), 0) / transcript.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            )}

            {activeTab === "summary" && summary && (
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-energy-orange" />
                    Business Call Analysis
                  </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-6">
                    {/* Executive Summary */}
                    <div className="p-4 glass-secondary rounded-lg">
                      <h3 className="font-medium mb-2">Executive Summary</h3>
                      <p className="leading-relaxed">{summary.summary}</p>
                    </div>
                    
                    {/* Business Intelligence */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 glass-secondary rounded-lg">
                        <h3 className="font-medium mb-3">Intent & Sentiment Analysis</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Primary Intent</span>
                            <span className="px-2 py-1 bg-energy-orange/20 text-energy-orange rounded text-sm font-medium capitalize">
                              {summary.intent.primary}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Confidence Level</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-trust-blue rounded-full" 
                                  style={{ width: `${summary.intent.confidence}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{summary.intent.confidence}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Sentiment</span>
                            <span className={`px-2 py-1 rounded text-sm font-medium capitalize ${
                              summary.intent.sentiment === "positive" ? "bg-green-500/20 text-green-600" :
                              summary.intent.sentiment === "negative" ? "bg-red-500/20 text-red-600" :
                              "bg-gray-500/20 text-gray-600"
                            }`}>
                              {summary.intent.sentiment}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Urgency Level</span>
                            <span className={`px-2 py-1 rounded text-sm font-medium capitalize ${
                              summary.intent.urgency === "high" ? "bg-red-500/20 text-red-600" :
                              summary.intent.urgency === "medium" ? "bg-yellow-500/20 text-yellow-600" :
                              "bg-green-500/20 text-green-600"
                            }`}>
                              {summary.intent.urgency}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 glass-secondary rounded-lg">
                        <h3 className="font-medium mb-3">Business Outcome</h3>
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-trust-blue mb-1">
                              {summary.satisfactionScore}/10
                            </div>
                            <div className="text-sm text-muted-foreground">Success Score</div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                              <div 
                                className="h-full bg-trust-blue rounded-full" 
                                style={{ width: `${(summary.satisfactionScore || 0) * 10}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="pt-3 border-t glass-border">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Follow-up Required</span>
                              <div className={`flex items-center gap-1 ${
                                summary.followUpRequired ? "text-energy-orange" : "text-growth-green"
                              }`}>
                                {summary.followUpRequired ? 
                                  <Calendar className="w-4 h-4" /> : 
                                  <CheckCircle className="w-4 h-4" />
                                }
                                <span className="text-sm font-medium">
                                  {summary.followUpRequired ? "Yes" : "No"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Key Business Points */}
                    <div className="p-4 glass-secondary rounded-lg">
                      <h3 className="font-medium mb-3">Key Business Points</h3>
                      <div className="grid gap-2">
                        {summary.keyPoints.map((point, index) => (
                          <div key={index} className="flex items-start gap-3 p-2 hover:glass-primary rounded transition-colors">
                            <div className="w-1.5 h-1.5 rounded-full bg-energy-orange mt-2 flex-shrink-0" />
                            <span className="text-sm">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Items */}
                    {summary.actionItems && summary.actionItems.length > 0 && (
                      <div className="p-4 glass-secondary rounded-lg">
                        <h3 className="font-medium mb-3">Action Items</h3>
                        <div className="space-y-3">
                          {summary.actionItems.map((item, index) => (
                            <div key={index} className="flex items-start gap-3 p-2 hover:glass-primary rounded transition-colors">
                              <input 
                                type="checkbox" 
                                className="mt-1 rounded border-energy-orange text-energy-orange focus:ring-energy-orange" 
                              />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Keywords & Topics */}
                    <div className="p-4 glass-secondary rounded-lg">
                      <h3 className="font-medium mb-3">Key Topics Discussed</h3>
                      <div className="flex flex-wrap gap-2">
                        {summary.intent.keywords.map((keyword, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-energy-orange/20 text-energy-orange rounded-full text-sm font-medium"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Analysis Metadata */}
                    <div className="text-xs text-muted-foreground text-center p-4 glass-secondary rounded-lg">
                      <div className="flex items-center justify-center gap-4">
                        <span>Analysis by {summary.aiModel}</span>
                        <span>•</span>
                        <span>Generated {new Date(summary.createdAt).toLocaleString()}</span>
                        <span>•</span>
                        <span>Business Intelligence Level: Advanced</span>
                      </div>
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
