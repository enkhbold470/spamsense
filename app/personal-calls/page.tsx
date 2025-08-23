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
import mockData from "@/lib/mockData";
import type { User } from "@/components/ui/top-bar";
import type { CallStatus } from "@/lib/types";

const sampleUser: User = {
  name: "Sarah Johnson",
  email: "sarah@spamsense.com",
  initials: "SJ"
};

export default function PersonalCallsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<CallStatus>("allowed");
  
  const personalCalls = mockData.getPersonalCalls();
  const personalContacts = mockData.contacts.filter(contact => contact.type === "personal");
  
  const personalStats = {
    totalPersonalCalls: personalCalls.length,
    allowedCalls: personalCalls.filter(call => call.status === "allowed").length,
    missedCalls: personalCalls.filter(call => call.duration === 0 && !call.isSpam).length,
    whitelistedContacts: personalContacts.filter(contact => contact.isWhitelisted).length
  };

  const filteredCalls = personalCalls
    .filter(call => {
      const matchesSearch = call.phoneNumber.includes(searchTerm) || 
                           call.contact?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "allowed" || 
                           (filterStatus === "blocked" && call.status === "blocked") ||
                           (filterStatus === "spam" && call.isSpam);
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
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="text-2xl flex items-center gap-2">
                  <Users className="w-6 h-6 text-trust-blue" />
                  Personal Calls Management
                </GlassCardTitle>
              </GlassCardHeader>
            </GlassCard>

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
                      onChange={(e) => setFilterStatus(e.target.value as CallStatus)}
                      className="glass-input px-3 py-2 rounded-lg"
                    >
                      <option value="all">All Calls</option>
                      <option value="allowed">Answered</option>
                      <option value="blocked">Blocked</option>
                      <option value="missed">Missed</option>
                    </select>
                  </div>
                </div>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredCalls.map((call) => (
                    <Link key={call.id} href={`/personal-calls/${call.id}`} className="block">
                      <div className="flex items-center justify-between p-4 glass-secondary rounded-lg hover:glass-primary transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${
                            call.status === "allowed" ? "bg-green-500" :
                            call.status === "blocked" ? "bg-red-500" :
                            "bg-gray-500"
                          }`} />
                          <div className="flex items-center gap-2">
                            {call.contact?.isWhitelisted && (
                              <Star className="w-4 h-4 text-growth-green" />
                            )}
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {call.contact?.name || call.phoneNumber}
                                {call.hasTranscript && (
                                  <MessageSquare className="w-3 h-3 text-trust-blue" />
                                )}
                                {call.hasSummary && (
                                  <FileText className="w-3 h-3 text-energy-orange" />
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {call.phoneNumber}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {call.timestamp.toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {call.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {formatDuration(call.duration)}
                            </div>
                          </div>
                          
                          <span className={`text-xs px-2 py-1 rounded font-medium ${
                            call.status === "allowed" ? "bg-green-500/20 text-green-600" :
                            call.status === "blocked" ? "bg-red-500/20 text-red-600" :
                            "bg-gray-500/20 text-gray-600"
                          }`}>
                            {call.status}
                          </span>
                          
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {filteredCalls.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No personal calls found
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