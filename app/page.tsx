import Image from "next/image";
import Link from "next/link";
import { Calendar, Phone, Shield, TrendingUp, Clock, Users, Building2, AlertTriangle } from "lucide-react";
import { 
  GlassCard, 
  GlassCardContent, 
  GlassCardHeader, 
  GlassCardTitle, 
  GlassButton,
  StatCard,
  NavSidebar,
  TopBar
} from "@/components/ui";
import mockData from "@/lib/mockData";
import type { User } from "@/components/ui/top-bar";

// This page is a Server Component (default in app/ directory).
// Remove the event handler from the prop passed to TopBar to fix the error.

const sampleUser: User = {
  name: "Sarah Johnson",
  email: "sarah@spamsense.com",
  initials: "SJ"
};

export default function StatsPage() {
  const { stats, recentCalls, insights } = mockData;
  const locationFilter = {
    current: "All Devices",
    options: ["All Devices", "iPhone", "Work Phone", "Home"],
    // Removed onChange handler to avoid passing a function to a Server Component prop
  } 

  return (
    <div className="flex min-h-screen">
      <NavSidebar />
      
      <div className="flex-1 ml-72">
        <div className="p-6">
          {/* <TopBar 
            user={sampleUser}
            notifications={3}
              locationFilter={locationFilter}
          />
           */}
          <div className="space-y-6">
            {/* Dashboard Header */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="text-2xl">📊 Call Statistics Dashboard</GlassCardTitle>
                <p className="text-muted-foreground">
                  Real-time overview of your call management and spam protection
                </p>
              </GlassCardHeader>
            </GlassCard>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                label="Total Calls"
                value={stats.totalCalls}
                change={stats.callsChange}
                trend="positive"
                icon={<Phone className="w-5 h-5" />}
                delay={0.1}
              />
              <StatCard
                label="Spam Blocked"
                value={stats.spamBlocked}
                change={stats.spamChange}
                trend="negative"
                icon={<Shield className="w-5 h-5" />}
                delay={0.2}
              />
              <StatCard
                label="Personal Calls"
                value={stats.personalCalls}
                icon={<Users className="w-5 h-5" />}
                delay={0.3}
              />
              <StatCard
                label="Business Calls"
                value={stats.businessCalls}
                icon={<Building2 className="w-5 h-5" />}
                delay={0.4}
              />
            </div>

            {/* Call Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Call Distribution</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-trust-blue" />
                        <span>Personal Calls</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-trust-blue rounded-full" 
                            style={{ width: `${(stats.personalCalls / stats.totalCalls) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{Math.round((stats.personalCalls / stats.totalCalls) * 100)}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-energy-orange" />
                        <span>Business Calls</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-energy-orange rounded-full" 
                            style={{ width: `${(stats.businessCalls / stats.totalCalls) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{Math.round((stats.businessCalls / stats.totalCalls) * 100)}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-alert-red" />
                        <span>Spam Blocked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-alert-red rounded-full" 
                            style={{ width: `${stats.spamPercentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{stats.spamPercentage}%</span>
                      </div>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>

              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Protection Overview</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-growth-green mb-2">{stats.spamPercentage}%</div>
                      <div className="text-sm text-muted-foreground">Spam Protection Rate</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 glass-secondary rounded-lg">
                        <div className="text-xl font-semibold text-growth-green">{stats.allowedCalls}</div>
                        <div className="text-xs text-muted-foreground">Allowed</div>
                      </div>
                      <div className="text-center p-3 glass-secondary rounded-lg">
                        <div className="text-xl font-semibold text-alert-red">{stats.blockedCalls}</div>
                        <div className="text-xs text-muted-foreground">Blocked</div>
                      </div>
                    </div>
                    
                    <div className="text-center p-3 glass-secondary rounded-lg">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Avg. Call Duration: {Math.floor(stats.avgCallDuration / 60)}:{(stats.avgCallDuration % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>

            {/* Recent Activity */}
            <GlassCard>
              <GlassCardHeader>
                <div className="flex items-center justify-between">
                  <GlassCardTitle>Recent Call Activity</GlassCardTitle>
                  <div className="flex gap-2">
                    <Link href="/personal-calls">
                      <GlassButton variant="glass" size="sm">View Personal</GlassButton>
                    </Link>
                    <Link href="/business-calls">
                      <GlassButton variant="glass" size="sm">View Business</GlassButton>
                    </Link>
                  </div>
                </div>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-3">
                  {recentCalls.slice(0, 6).map((call) => (
                    <div key={call.id} className="flex items-center justify-between p-3 glass-secondary rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          call.type === "personal" ? "bg-trust-blue" :
                          call.type === "business" ? "bg-energy-orange" : "bg-alert-red"
                        }`} />
                        <div>
                          <div className="font-medium">
                            {call.contact?.name || call.phoneNumber}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {call.timestamp.toLocaleTimeString()} • {call.duration > 0 ? `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}` : 'Blocked'}
                          </div>
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
                        {call.isSpam && (
                          <span className="text-xs bg-red-500/20 text-red-600 px-2 py-1 rounded">
                            {call.confidence}% spam
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>

            {/* Test Route Access */}
            <div className="fixed bottom-4 right-4 z-50">
              <Link href="/test">
                <GlassButton variant="energy" className="shadow-lg">
                  🧪 Test Components
                </GlassButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
