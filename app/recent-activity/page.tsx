"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Phone, Shield, Filter, Search, MoreVertical, MessageSquare, FileText, ChevronRight, Calendar, AlertTriangle, Users, Building2 } from "lucide-react";
import { 
  GlassCard, 
  GlassCardContent, 
  GlassCardHeader, 
  GlassCardTitle,
  GlassButton,
  StatCard,
  NavSidebar,
  TopBar,
  GlassInput
} from "@/components/ui";
// import mockData from "@/lib/mockData";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { 
  User, 
  Call, 
  CallStatus, 
  CallType, 
  TimeRange,
  CallTranscript,
  CallSummary
} from "@/lib/convex-types";

// Extended call type that includes transcript and summary
interface CallWithExtras extends Call {
  transcript?: CallTranscript;
  summary?: CallSummary;
}

const sampleUser: User = {
  name: "Mariana Ramirez",
  email: "mariana@spamsense.com",
  initials: "MR"
};

export default function RecentActivityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<CallStatus | "all">("all");
  const [filterType, setFilterType] = useState<CallType | "all">("all");
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  
  // Convex queries - use enhanced query that includes transcript/summary data
  const callsWithDetails = useQuery(api.tasks.getCallsWithTranscripts, { limit: 50 });
  const regularCalls = useQuery(api.tasks.getCalls);
  const callStats = useQuery(api.tasks.getCallStats);
  
  // Combine calls with and without transcripts, prioritizing calls with details
  const calls: CallWithExtras[] = callsWithDetails && regularCalls ? [
    ...callsWithDetails.map(item => ({
      ...item.call,
      hasTranscript: !!item.transcript,
      hasSummary: !!item.summary,
      transcript: item.transcript || undefined,
      summary: item.summary || undefined
    } as CallWithExtras)),
    ...regularCalls.filter(call => 
      !callsWithDetails.some(item => item.call._id === call._id)
    ).map(call => call as CallWithExtras)
  ] : (regularCalls || []).map(call => call as CallWithExtras);
  
  // const allCalls = mockData.calls.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const allCalls = calls ? calls.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : [];
  
  // Filter calls based on time range
  const getFilteredByTime = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return allCalls.filter(call => {
      const callDate = new Date(call.timestamp);
      switch (timeRange) {
        case "today":
          return callDate >= today;
        case "week":
          return callDate >= weekAgo;
        case "month":
          return callDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const filteredCalls = getFilteredByTime()
    .filter(call => {
      const matchesSearch = call.phoneNumber.includes(searchTerm) || 
                           call.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || call.status === filterStatus;
      const matchesType = filterType === "all" || call.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });

  // Simple stats calculation
  const stats = {
    totalCalls: filteredCalls.length || 0,
    spamBlocked: filteredCalls.filter(call => call.isSpam).length || 0,
    averageDuration: filteredCalls.length > 0 ? 
      Math.floor(filteredCalls.filter(call => call.duration > 0).reduce((sum, call) => sum + call.duration, 0) / 
      (filteredCalls.filter(call => call.duration > 0).length || 1)) : 0,
    withTranscripts: filteredCalls.filter(call => call.hasTranscript).length || 0
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getCallDetailUrl = (call: CallWithExtras) => {
    return `/calls/${call._id}`;
  };

  // Loading state
  if (!calls) {
    return (
      <div className="flex min-h-screen">
        <NavSidebar />
        <div className="flex-1 ml-72">
          <div className="p-6">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trust-blue mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading call activity...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            {/* Page Header */}
            <GlassCard>
              <GlassCardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <GlassCardTitle className="text-2xl flex items-center gap-2">
                      <Clock className="w-6 h-6 text-trust-blue" />
                      Recent Call Activity
                    </GlassCardTitle>
                    <p className="text-muted-foreground mt-2">
                      Comprehensive view of all your recent call activity with transcripts and analysis
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <GlassButton variant="ghost">
                      <Calendar className="w-4 h-4 mr-2" />
                      Export
                    </GlassButton>
                  </div>
                </div>
              </GlassCardHeader>
            </GlassCard>

            {/* Activity Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Calls"
                value={stats.totalCalls}
                icon={<Phone className="w-5 h-5" />}
                delay={0.1}
              />
              <StatCard
                label="Spam Blocked"
                value={stats.spamBlocked}
                icon={<Shield className="w-5 h-5" />}
                delay={0.2}
              />
              <StatCard
                label="Avg Duration"
                value={formatDuration(stats.averageDuration)}
                icon={<Clock className="w-5 h-5" />}
                delay={0.3}
              />
              <StatCard
                label="With Transcripts"
                value={stats.withTranscripts}
                icon={<MessageSquare className="w-5 h-5" />}
                delay={0.4}
              />
            </div>

            {/* Filters and Search */}
            <GlassCard>
              <GlassCardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <GlassCardTitle>Call Activity Log</GlassCardTitle>
                  <div className="flex gap-3 flex-wrap">
                    {/* Time Range Filter */}
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                      className="glass-input px-3 py-2 rounded-lg"
                    >
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="all">All Time</option>
                    </select>

                    {/* Type Filter */}
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as CallType | "all")}
                      className="glass-input px-3 py-2 rounded-lg"
                    >
                      <option value="all">All Types</option>
                      <option value="personal">Personal</option>
                      <option value="business">Business</option>
                    </select>

                    {/* Status Filter */}
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as CallStatus | "all")}
                      className="glass-input px-3 py-2 rounded-lg"
                    >
                      <option value="all">All Status</option>
                      <option value="allowed">Allowed</option>
                      <option value="blocked">Blocked</option>
                      <option value="spam">Spam</option>
                      <option value="unknown">Unknown</option>
                    </select>

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <GlassInput
                        placeholder="Search calls..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </GlassCardHeader>
              
              <GlassCardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredCalls.map((call: CallWithExtras) => (
                    <Link 
                      key={call._id} 
                      href={getCallDetailUrl(call)}
                      className="block"
                    >
                      <div className="flex items-center justify-between p-4 glass-secondary rounded-lg hover:glass-primary transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          {/* Call Type Indicator */}
                          <div className={`w-3 h-3 rounded-full ${
                            call.type === "personal" ? "bg-trust-blue" :
                            call.type === "business" ? "bg-energy-orange" : "bg-alert-red"
                          }`} />
                          
                          {/* Call Icon */}
                          <div className={`p-2 rounded-lg ${
                            call.type === "personal" ? "bg-trust-blue/20" : "bg-energy-orange/20"
                          }`}>
                            {call.type === "personal" ? 
                              <Users className="w-4 h-4 text-trust-blue" /> :
                              <Building2 className="w-4 h-4 text-energy-orange" />
                            }
                          </div>
                          
                          {/* Call Details */}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {call.phoneNumber}
                              </span>
                              {call.hasTranscript && (
                                <MessageSquare className="w-4 h-4 text-trust-blue" />
                              )}
                              {call.hasSummary && (
                                <FileText className="w-4 h-4 text-energy-orange" />
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {call.location || "San Francisco, CA"} • {call.carrierInfo || "T-Mobile"}
                            </div>
                            {call.summary?.intent && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Intent: {call.summary.intent.primary} • Sentiment: {call.summary.intent.sentiment}
                              </div>
                            )}
                            {call.notes && (
                              <div className="text-xs text-muted-foreground mt-1 truncate max-w-md">
                                📝 {call.notes}
                              </div>
                            )}
                            {call.transcript?.transcript && call.transcript.transcript.length > 0 && (
                              <div className="text-xs text-muted-foreground mt-1 truncate max-w-md">
                                💬 &quot; {call.transcript.transcript[0].response}&quot;
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Call Metadata */}
                        <div className="flex items-center gap-6">
                          {/* Time */}
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {formatRelativeTime(new Date(call.timestamp))}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(call.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                          
                          {/* Duration */}
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {formatDuration(call.duration)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {call.carrierInfo || "Unknown"}
                            </div>
                          </div>
                          
                          {/* Status & Confidence */}
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-xs px-2 py-1 rounded font-medium ${
                              call.status === "allowed" ? "bg-green-500/20 text-green-600" :
                              call.status === "blocked" ? "bg-red-500/20 text-red-600" :
                              call.status === "spam" ? "bg-red-500/20 text-red-600" :
                              "bg-gray-500/20 text-gray-600"
                            }`}>
                              {call.status}
                            </span>
                            {call.isSpam && (
                              <span className="text-xs bg-red-500/20 text-red-600 px-2 py-1 rounded">
                                {call.confidence}% spam
                              </span>
                            )}
                          </div>
                          
                          {/* Arrow */}
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {filteredCalls.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Phone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No calls found</h3>
                      <p>Try adjusting your filters or search criteria</p>
                    </div>
                  )}
                </div>
                
                {/* Results Summary */}
                {filteredCalls.length > 0 && (
                  <div className="mt-4 pt-4 border-t glass-border text-center text-sm text-muted-foreground">
                    Showing {filteredCalls.length} calls {timeRange !== "all" && `from ${timeRange}`}
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
