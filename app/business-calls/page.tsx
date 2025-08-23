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
import mockData from "@/lib/mockData";
import type { User } from "@/components/ui/top-bar";
import type { CallStatus } from "@/lib/types";

const sampleUser: User = {
  name: "Sarah Johnson",
  email: "sarah@spamsense.com",
  initials: "SJ"
};

export default function BusinessCallsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<CallStatus>("allowed");
  
  const businessCalls = mockData.getBusinessCalls();
  const businessStats = {
    totalBusinessCalls: businessCalls.length,
    allowedCalls: businessCalls.filter(call => call.status === "allowed").length,
    missedCalls: businessCalls.filter(call => call.duration === 0 && !call.isSpam).length,
    avgDuration: Math.floor(
      businessCalls.filter(call => call.duration > 0).reduce((sum, call) => sum + call.duration, 0) / 
      businessCalls.filter(call => call.duration > 0).length
    ),
    clientCalls: businessCalls.filter(call => call.contact?.name?.includes("Client")).length
  };

  const filteredCalls = businessCalls
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

  const getBusinessHourCalls = () => {
    return businessCalls.filter(call => {
      const hour = call.timestamp.getHours();
      return hour >= 9 && hour <= 17; // 9 AM to 5 PM
    }).length;
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
                        style={{ width: `${(getBusinessHourCalls() / businessCalls.length) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round((getBusinessHourCalls() / businessCalls.length) * 100)}% of calls received during business hours
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
                    {businessCalls
                      .filter(call => call.contact?.name)
                      .reduce((acc, call) => {
                        const name = call.contact!.name!;
                        acc[name] = (acc[name] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                      .valueOf() &&
                      Object.entries(
                        businessCalls
                          .filter(call => call.contact?.name)
                          .reduce((acc, call) => {
                            const name = call.contact!.name!;
                            acc[name] = (acc[name] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                      )
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 3)
                      .map(([name, count]) => (
                        <div key={name} className="flex items-center justify-between p-2 glass-secondary rounded">
                          <span className="font-medium">{name}</span>
                          <span className="text-sm text-muted-foreground">{count} calls</span>
                        </div>
                      ))
                    }
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
                    <Link key={call.id} href={`/business-calls/${call.id}`} className="block">
                      <div className="flex items-center justify-between p-4 glass-secondary rounded-lg hover:glass-primary transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${
                            call.status === "allowed" ? "bg-green-500" :
                            call.status === "blocked" ? "bg-red-500" :
                            "bg-gray-500"
                          }`} />
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
                              {call.phoneNumber} • {call.location || "Unknown"}
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
                            <div className="text-xs text-muted-foreground">
                              {call.carrierInfo || "Unknown"}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded font-medium ${
                              call.status === "allowed" ? "bg-green-500/20 text-green-600" :
                              call.status === "blocked" ? "bg-red-500/20 text-red-600" :
                              "bg-gray-500/20 text-gray-600"
                            }`}>
                              {call.status}
                            </span>
                            {call.notes && (
                              <span className="text-xs bg-blue-500/20 text-blue-600 px-2 py-1 rounded">
                                Note
                              </span>
                            )}
                          </div>
                          
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {filteredCalls.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No business calls found matching your criteria
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