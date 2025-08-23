"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Phone, Clock, TrendingUp, Filter, Search, MoreVertical, PhoneCall, Users, AlertCircle, MessageSquare, FileText, ChevronRight } from "lucide-react";
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
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { 
  User, 
  Call, 
  CallStatus, 
  Contact 
} from "@/lib/convex-types";

const sampleUser: User = {
  name: "Mariana Ramirez",
  email: "mariana@spamsense.com",
  initials: "MR"
};

export default function BusinessCallsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<CallStatus | "all">("all");
  
  // Convex queries
  const allCalls = useQuery(api.tasks.getCalls);
  const allContacts = useQuery(api.tasks.getContacts);
  
  // Filter for business calls only
  const businessCalls = allCalls?.filter(call => call.type === "business") || [];
  const businessContacts = allContacts?.filter(contact => contact.type === "business") || [];
  
  // Loading state
  if (!allCalls || !allContacts) {
    return (
      <div className="flex min-h-screen">
        <NavSidebar />
        <div className="flex-1 ml-72">
          <div className="p-6">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-energy-orange mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading business calls...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const businessStats = {
    totalBusinessCalls: businessCalls.length,
    allowedCalls: businessCalls.filter(call => call.status === "allowed").length,
    missedCalls: businessCalls.filter(call => call.duration === 0 && !call.isSpam).length,
    avgDuration: businessCalls.filter(call => call.duration > 0).length > 0 ? 
      Math.floor(
        businessCalls.filter(call => call.duration > 0).reduce((sum, call) => sum + call.duration, 0) / 
        businessCalls.filter(call => call.duration > 0).length
      ) : 0,
    clientCalls: businessCalls.filter(call => {
      const contact = allContacts?.find(c => c._id === call.contactId);
      return contact?.name?.toLowerCase().includes("client");
    }).length
  };

  const filteredCalls = businessCalls
    .filter(call => {
      const contact = allContacts?.find(c => c._id === call.contactId);
      const matchesSearch = call.phoneNumber.includes(searchTerm) || 
                           contact?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           call.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || call.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBusinessHourCalls = () => {
    return businessCalls.filter(call => {
      const hour = new Date(call.timestamp).getHours();
      return hour >= 9 && hour <= 17; // 9 AM to 5 PM
    }).length;
  };

  // Get top business contacts
  const getTopBusinessContacts = () => {
    const contactCallCounts = businessCalls
      .filter(call => call.contactId)
      .reduce((acc, call) => {
        const contact = allContacts?.find(c => c._id === call.contactId);
        if (contact?.name) {
          acc[contact.name] = (acc[contact.name] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(contactCallCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
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
            {/* Page Header */}
            <GlassCard>
              <GlassCardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <GlassCardTitle className="text-2xl flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-energy-orange" />
                      Business Calls Management
                    </GlassCardTitle>
                    <p className="text-muted-foreground mt-2">
                      Track and manage your professional call activity
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <GlassButton variant="energy">
                      <PhoneCall className="w-4 h-4 mr-2" />
                      Quick Call
                    </GlassButton>
                  </div>
                </div>
              </GlassCardHeader>
            </GlassCard>

            {/* Business Call Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard
                label="Total Business Calls"
                value={businessStats.totalBusinessCalls}
                icon={<Building2 className="w-5 h-5" />}
                delay={0.1}
              />
              <StatCard
                label="Answered Calls"
                value={businessStats.allowedCalls}
                icon={<Phone className="w-5 h-5" />}
                delay={0.2}
              />
              <StatCard
                label="Missed Calls"
                value={businessStats.missedCalls}
                icon={<AlertCircle className="w-5 h-5" />}
                delay={0.3}
              />
              <StatCard
                label="Client Calls"
                value={businessStats.clientCalls}
                icon={<Users className="w-5 h-5" />}
                delay={0.4}
              />
              <StatCard
                label="Avg Duration"
                value={formatDuration(businessStats.avgDuration)}
                icon={<Clock className="w-5 h-5" />}
                delay={0.5}
              />
            </div>

            {/* Business Hours Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Business Hours Analysis</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Calls during business hours (9 AM - 5 PM)</span>
                      <span className="font-semibold text-energy-orange">
                        {getBusinessHourCalls()}/{businessCalls.length}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-energy-orange rounded-full" 
                        style={{ 
                          width: businessCalls.length > 0 ? 
                            `${(getBusinessHourCalls() / businessCalls.length) * 100}%` : 
                            '0%' 
                        }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {businessCalls.length > 0 ? 
                        Math.round((getBusinessHourCalls() / businessCalls.length) * 100) : 0}% of calls received during business hours
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>

              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Top Business Contacts</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-3">
                    {getTopBusinessContacts().map(([name, count]) => (
                      <div key={name} className="flex items-center justify-between p-2 glass-secondary rounded">
                        <span className="font-medium">{name}</span>
                        <span className="text-sm text-muted-foreground">{count} calls</span>
                      </div>
                    ))}
                    {getTopBusinessContacts().length === 0 && (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        No business contacts with multiple calls yet
                      </div>
                    )}
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>

            {/* Search and Filter */}
            <GlassCard>
              <GlassCardHeader>
                <div className="flex items-center justify-between">
                  <GlassCardTitle>Business Call Log</GlassCardTitle>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <GlassInput
                        placeholder="Search calls..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as CallStatus | "all")}
                      className="glass-input px-3 py-2 rounded-lg"
                    >
                      <option value="all">All Calls</option>
                      <option value="allowed">Answered</option>
                      <option value="blocked">Blocked</option>
                      <option value="spam">Spam</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  </div>
                </div>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredCalls.map((call) => {
                    const contact = allContacts?.find(c => c._id === call.contactId);
                    return (
                      <Link key={call._id} href={`/calls/${call._id}`} className="block">
                        <div className="flex items-center justify-between p-4 glass-secondary rounded-lg hover:glass-primary transition-all cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${
                              call.status === "allowed" ? "bg-green-500" :
                              call.status === "blocked" ? "bg-red-500" :
                              call.status === "spam" ? "bg-red-500" :
                              "bg-gray-500"
                            }`} />
                            <div className="p-2 rounded-lg bg-energy-orange/20">
                              <Building2 className="w-4 h-4 text-energy-orange" />
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {contact?.name || call.phoneNumber}
                                {call.hasTranscript && (
                                  <MessageSquare className="w-3 h-3 text-trust-blue" />
                                )}
                                {call.hasSummary && (
                                  <FileText className="w-3 h-3 text-energy-orange" />
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {call.phoneNumber} • {call.location || "Unknown"}
                              </div>
                              {call.notes && (
                                <div className="text-xs text-muted-foreground mt-1 truncate max-w-md">
                                  📝 {call.notes}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {new Date(call.timestamp).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(call.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {formatDuration(call.duration)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {call.carrierInfo || "Unknown"}
                              </div>
                            </div>
                            
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
                            
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  
                  {filteredCalls.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No business calls found</h3>
                      <p>Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}