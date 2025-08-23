"use client";

import { useState } from "react";
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
  Calendar,
  User
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
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { 
  User as UserType, 
  Call, 
  CallTranscript, 
  CallSummary, 
  Contact,
  Id
} from "@/lib/convex-types";

const sampleUser: UserType = {
  name: "Mariana Ramirez",
  email: "mariana@spamsense.com",
  initials: "MR"
};

export default function CallDetailPage() {
  const params = useParams();
  const router = useRouter();
  const callId = params.slug as Id<"calls">;

  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(true);

  // Convex queries
  const callDetails = useQuery(api.tasks.getCallWithDetails, { callId });
  const contact = callDetails?.contact;
  const call = callDetails?.call;
  const transcript = callDetails?.transcript;
  const summary = callDetails?.summary;

  // Loading state
  if (!callDetails) {
    return (
      <div className="flex min-h-screen">
        <NavSidebar />
        <div className="flex-1 ml-72">
          <div className="p-6">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trust-blue mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading call details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex min-h-screen">
        <NavSidebar />
        <div className="flex-1 ml-72">
          <div className="p-6">
            <div className="text-center py-12">
              <XCircle className="w-12 h-12 mx-auto mb-4 text-alert-red" />
              <h3 className="text-lg font-medium mb-2">Call Not Found</h3>
              <p className="text-muted-foreground mb-4">The requested call could not be found.</p>
              <Link href="/recent-activity">
                <GlassButton>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Activity
                </GlassButton>
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

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const callTime = new Date(timestamp);
    const diff = now.getTime() - callTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getStatusColor = (status: Call["status"]) => {
    switch (status) {
      case "allowed": return "text-green-600 bg-green-500/20";
      case "blocked": return "text-red-600 bg-red-500/20";
      case "spam": return "text-red-600 bg-red-500/20";
      default: return "text-gray-600 bg-gray-500/20";
    }
  };

  const getTypeIcon = (type: Call["type"]) => {
    return type === "personal" ? (
      <Users className="w-5 h-5 text-trust-blue" />
    ) : (
      <Building2 className="w-5 h-5 text-energy-orange" />
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy: ", err);
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
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/recent-activity">
                  <GlassButton variant="ghost" className="p-2">
                    <ArrowLeft className="w-5 h-5" />
                  </GlassButton>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Call Details</h1>
                  <p className="text-muted-foreground">
                    {formatRelativeTime(call.timestamp)} • {formatDuration(call.duration)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <GlassButton variant="ghost" onClick={() => copyToClipboard(call.phoneNumber)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Number
                </GlassButton>
                <GlassButton variant="ghost">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </GlassButton>
              </div>
            </div>

            {/* Call Overview */}
            <GlassCard>
              <GlassCardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-trust-blue/20">
                      {getTypeIcon(call.type)}
                    </div>
                    <div>
                      <GlassCardTitle className="text-xl">
                        {contact?.name || call.phoneNumber}
                      </GlassCardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {call.phoneNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(call.timestamp).toLocaleString()}
                        </span>
                        {call.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {call.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(call.status)}`}>
                      {call.status}
                    </span>
                    {call.isSpam && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium text-red-600 bg-red-500/20 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {call.confidence}% spam
                      </span>
                    )}
                  </div>
                </div>
              </GlassCardHeader>
              
              <GlassCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{formatDuration(call.duration)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{call.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Carrier</p>
                    <p className="font-medium">{call.carrierInfo || "Unknown"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="font-medium">{call.confidence}%</p>
                  </div>
                </div>
                
                {call.notes && (
                  <div className="mt-4 p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{call.notes}</p>
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>

            {/* Contact Information */}
            {contact && (
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Contact Information
                  </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{contact.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{contact.type}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Call Count</p>
                      <p className="font-medium">{contact.callCount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex gap-2">
                        {contact.isWhitelisted && (
                          <span className="px-2 py-1 text-xs rounded bg-green-500/20 text-green-600">
                            Whitelisted
                          </span>
                        )}
                        {contact.isBlocked && (
                          <span className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-600">
                            Blocked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {contact.notes && (
                    <div className="mt-4 p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Contact Notes</p>
                      <p className="text-sm">{contact.notes}</p>
                    </div>
                  )}
                </GlassCardContent>
              </GlassCard>
            )}

            {/* AI Summary */}
            {summary && (
              <GlassCard>
                <GlassCardHeader>
                  <div className="flex items-center justify-between">
                    <GlassCardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      AI Analysis & Summary
                    </GlassCardTitle>
                    <GlassButton 
                      variant="ghost" 
                      onClick={() => setShowAnalysis(!showAnalysis)}
                      className="p-2"
                    >
                      {showAnalysis ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </GlassButton>
                  </div>
                </GlassCardHeader>
                
                {showAnalysis && (
                  <GlassCardContent>
                    <div className="space-y-4">
                      {/* Summary */}
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Summary</p>
                        <p className="text-sm leading-relaxed">{summary.summary}</p>
                      </div>

                      {/* Intent Analysis */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Intent</p>
                          <p className="font-medium capitalize">{summary.intent.primary}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Sentiment</p>
                          <p className={`font-medium capitalize ${
                            summary.intent.sentiment === "positive" ? "text-green-600" :
                            summary.intent.sentiment === "negative" ? "text-red-600" :
                            "text-gray-600"
                          }`}>
                            {summary.intent.sentiment}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Urgency</p>
                          <p className={`font-medium capitalize ${
                            summary.intent.urgency === "high" ? "text-red-600" :
                            summary.intent.urgency === "medium" ? "text-yellow-600" :
                            "text-green-600"
                          }`}>
                            {summary.intent.urgency}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Confidence</p>
                          <p className="font-medium">{summary.intent.confidence}%</p>
                        </div>
                      </div>

                      {/* Key Points */}
                      {summary.keyPoints.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Key Points</p>
                          <ul className="space-y-1">
                            {summary.keyPoints.map((point, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-trust-blue rounded-full mt-2 flex-shrink-0" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action Items */}
                      {summary.actionItems && summary.actionItems.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Action Items</p>
                          <ul className="space-y-1">
                            {summary.actionItems.map((item, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Keywords */}
                      {summary.intent.keywords.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Keywords</p>
                          <div className="flex flex-wrap gap-2">
                            {summary.intent.keywords.map((keyword, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 text-xs rounded bg-trust-blue/20 text-trust-blue"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Satisfaction Score */}
                      {summary.satisfactionScore && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Satisfaction Score</p>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">{summary.satisfactionScore}/10</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-trust-blue rounded-full"
                                style={{ width: `${(summary.satisfactionScore / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </GlassCardContent>
                )}
              </GlassCard>
            )}

            {/* Transcript */}
            {transcript && transcript.transcript.length > 0 && (
              <GlassCard>
                <GlassCardHeader>
                  <div className="flex items-center justify-between">
                    <GlassCardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Call Transcript
                    </GlassCardTitle>
                    <div className="flex items-center gap-2">
                      <GlassButton variant="ghost" className="text-xs">
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </GlassButton>
                      <GlassButton 
                        variant="ghost" 
                        onClick={() => setShowFullTranscript(!showFullTranscript)}
                        className="p-2"
                      >
                        {showFullTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </GlassButton>
                    </div>
                  </div>
                </GlassCardHeader>
                
                <GlassCardContent>
                  <div className="space-y-3">
                    {/* Transcript Info */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Language: {transcript.language || "English"}</span>
                      <span>Duration: {formatDuration(transcript.duration || call.duration)}</span>
                    </div>

                    {/* Transcript Messages */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {transcript.transcript
                        .slice(0, showFullTranscript ? undefined : 5)
                        .map((message, index) => (
                          <div 
                            key={index}
                            className={`flex gap-3 p-3 rounded-lg ${
                              message.role === "user" 
                                ? "bg-trust-blue/10 ml-8" 
                                : "bg-muted/50 mr-8"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              message.role === "user" 
                                ? "bg-trust-blue text-white" 
                                : "bg-energy-orange text-white"
                            }`}>
                              {message.role === "user" ? "U" : "A"}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium capitalize">
                                  {message.role === "user" ? "You" : "Caller"}
                                </span>
                                {message.timestamp && (
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm leading-relaxed">{message.response}</p>
                              {message.confidence && (
                                <div className="mt-2 flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    Confidence: {Math.round(message.confidence * 100)}%
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>

                    {transcript.transcript.length > 5 && !showFullTranscript && (
                      <div className="text-center">
                        <GlassButton 
                          variant="ghost" 
                          onClick={() => setShowFullTranscript(true)}
                          className="text-sm"
                        >
                          Show {transcript.transcript.length - 5} more messages
                        </GlassButton>
                      </div>
                    )}

                    {/* Full Transcript */}
                    {transcript.fullTranscript && showFullTranscript && (
                      <div className="mt-4 p-4 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-2">Raw Transcript</p>
                        <pre className="text-xs whitespace-pre-wrap font-mono">
                          {transcript.fullTranscript}
                        </pre>
                      </div>
                    )}
                  </div>
                </GlassCardContent>
              </GlassCard>
            )}

            {/* No Additional Data Message */}
            {!transcript && !summary && (
              <GlassCard>
                <GlassCardContent className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Additional Data Available</h3>
                  <p className="text-muted-foreground">
                    Transcript and AI analysis are not available for this call.
                  </p>
                </GlassCardContent>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}