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
import type { User } from "@/components/ui/top-bar";
import { Call, CallStatus, CallType } from "@/lib/convex-types";

// This page is a Server Component (default in app/ directory).
// Remove the event handler from the prop passed to TopBar to fix the error.

const sampleUser: User = {
  name: "Mariana Ramirez",
  email: "mariana@spamsense.com",
  initials: "MR"
};

export default function StatsPage() {
    const { stats, recentCalls, insights } = {
    stats: {
      totalCalls: 100,
      spamBlocked: 10,
      personalCalls: 50,
      businessCalls: 30,
      spamPercentage: 10,
      allowedCalls: 90,
      blockedCalls: 10,
      avgCallDuration: 120
    },
    recentCalls: [],
    insights: []
  };
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
                change={stats.totalCalls}
                trend="positive"
                icon={<Phone className="w-5 h-5" />}
                delay={0.1}
              />
              <StatCard
                label="Spam Blocked"
                value={stats.spamBlocked}
                  change={stats.spamBlocked}
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
                <GlassCardHeader className="py-4">
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

   
            {/* Test Route Access */}
            {/* <div className="fixed bottom-4 right-4 z-50">
              <Link href="/test">
                <GlassButton variant="energy" className="shadow-lg">
                  🧪 Test Components
                </GlassButton>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
