"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Phone, Clock, Search, MoreVertical, PhoneCall, Star, UserPlus, AlertCircle, MessageSquare, FileText, ChevronRight } from "lucide-react";
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

export default function PersonalCallsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<CallStatus | "all">("all");
  
  // Convex queries
  const allCalls = useQuery(api.tasks.getCalls);
  const allContacts = useQuery(api.tasks.getContacts);
  
  // Filter for personal calls only
  const personalCalls = allCalls?.filter(call => call.type === "personal") || [];
  const personalContacts = allContacts?.filter(contact => contact.type === "personal") || [];
  
  // Loading state
  if (!allCalls || !allContacts) {
    return (
      <div className="flex min-h-screen">
        <NavSidebar />
        <div className="flex-1 ml-72">
          <div className="p-6">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trust-blue mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading personal calls...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const personalStats = {
    totalPersonalCalls: personalCalls.length,
    allowedCalls: personalCalls.filter(call => call.status === "allowed").length,
    missedCalls: personalCalls.filter(call => call.duration === 0 && !call.isSpam).length,
    whitelistedContacts: personalContacts.filter(contact => contact.isWhitelisted).length
  };

  const filteredCalls = personalCalls
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
                      <Users className="w-6 h-6 text-trust-blue" />
                      Personal Calls Management
                    </GlassCardTitle>
                    <p className="text-muted-foreground mt-2">
                      Track and manage your personal call activity with family and friends
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <GlassButton>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Contact
                    </GlassButton>
                  </div>
                </div>
              </GlassCardHeader>
            </GlassCard>

            {/* Personal Call Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Personal Calls"
                value={personalStats.totalPersonalCalls}
                icon={<Users className="w-5 h-5" />}
                delay={0.1}
              />
              <StatCard
                label="Answered Calls"
                value={personalStats.allowedCalls}
                icon={<Phone className="w-5 h-5" />}
                delay={0.2}
              />
              <StatCard
                label="Missed Calls"
                value={personalStats.missedCalls}
                icon={<AlertCircle className="w-5 h-5" />}
                delay={0.3}
              />
              <StatCard
                label="Whitelisted"
                value={personalStats.whitelistedContacts}
                icon={<Star className="w-5 h-5" />}
                delay={0.4}
              />
            </div>

            {/* Personal Contacts Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Favorite Contacts</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-3">
                    {personalContacts
                      .filter(contact => contact.isWhitelisted)
                      .slice(0, 5)
                      .map((contact) => (
                        <div key={contact._id} className="flex items-center justify-between p-2 glass-secondary rounded">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-growth-green" />
                            <span className="font-medium">{contact.name || contact.phoneNumber}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{contact.callCount} calls</span>
                        </div>
                      ))}
                    {personalContacts.filter(contact => contact.isWhitelisted).length === 0 && (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        No whitelisted contacts yet
                      </div>
                    )}
                  </div>
                </GlassCardContent>
              </GlassCard>

              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Recent Activity</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Calls today</span>
                      <span className="font-semibold text-trust-blue">
                        {personalCalls.filter(call => {
                          const today = new Date();
                          const callDate = new Date(call.timestamp);
                          return callDate.toDateString() === today.toDateString();
                        }).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>This week</span>
                      <span className="font-semibold text-trust-blue">
                        {personalCalls.filter(call => {
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return new Date(call.timestamp) >= weekAgo;
                        }).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Average duration</span>
                      <span className="font-semibold text-trust-blue">
                        {formatDuration(
                          personalCalls.filter(call => call.duration > 0).length > 0 ?
                          Math.floor(
                            personalCalls.filter(call => call.duration > 0).reduce((sum, call) => sum + call.duration, 0) / 
                            personalCalls.filter(call => call.duration > 0).length
                          ) : 0
                        )}
                      </span>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>

            {/* Search and Filter */}
            <GlassCard>
              <GlassCardHeader>
                <div className="flex items-center justify-between">
                  <GlassCardTitle>Personal Call Log</GlassCardTitle>
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
                            <div className="p-2 rounded-lg bg-trust-blue/20">
                              <Users className="w-4 h-4 text-trust-blue" />
                            </div>
                            <div className="flex items-center gap-2">
                              {contact?.isWhitelisted && (
                                <Star className="w-4 h-4 text-growth-green" />
                              )}
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
                                {contact?.isWhitelisted ? "Whitelisted" : "Standard"}
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
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No personal calls found</h3>
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