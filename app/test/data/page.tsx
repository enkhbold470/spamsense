import mockData from "@/lib/mockData"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui"

export default function DataTestPage() {
  const { stats, recentCalls, contacts, insights } = mockData
  
  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <GlassCard className="text-center">
          <GlassCardHeader>
            <GlassCardTitle className="text-3xl">
              📊 Mock Data Test - Spamsense Call Management
            </GlassCardTitle>
            <p className="text-muted-foreground">
              Testing our call management data structure and logic
            </p>
          </GlassCardHeader>
        </GlassCard>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <GlassCard>
            <GlassCardContent className="text-center p-6">
              <div className="text-3xl font-bold text-trust-blue mb-2">{stats.totalCalls}</div>
              <div className="text-sm text-muted-foreground">Total Calls</div>
              <div className="text-xs text-green-600 mt-1">+{stats.callsChange}%</div>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardContent className="text-center p-6">
              <div className="text-3xl font-bold text-energy-orange mb-2">{stats.personalCalls}</div>
              <div className="text-sm text-muted-foreground">Personal Calls</div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((stats.personalCalls / stats.totalCalls) * 100)}% of total
              </div>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardContent className="text-center p-6">
              <div className="text-3xl font-bold text-growth-green mb-2">{stats.businessCalls}</div>
              <div className="text-sm text-muted-foreground">Business Calls</div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((stats.businessCalls / stats.totalCalls) * 100)}% of total
              </div>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardContent className="text-center p-6">
              <div className="text-3xl font-bold text-alert-red mb-2">{stats.spamBlocked}</div>
              <div className="text-sm text-muted-foreground">Spam Blocked</div>
              <div className="text-xs text-green-600 mt-1">{stats.spamPercentage}% protection</div>
            </GlassCardContent>
          </GlassCard>
        </div>

        {/* Recent Calls */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Recent Calls</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="space-y-3">
              {recentCalls.slice(0, 8).map((call) => (
                <div key={call.id} className="flex items-center justify-between p-3 glass-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-current" style={{
                      color: call.type === "personal" ? "#4A90E2" : call.type === "business" ? "#FF9500" : "#FF3B30"
                    }} />
                    <div>
                      <div className="font-medium">
                        {call.contact?.name || call.phoneNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {call.timestamp.toLocaleTimeString()} • {call.duration > 0 ? `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}` : 'No answer'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      call.status === "allowed" ? "bg-green-500/20 text-green-600" :
                      call.status === "blocked" ? "bg-red-500/20 text-red-600" :
                      call.status === "spam" ? "bg-orange-500/20 text-orange-600" :
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

        {/* Contacts Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle>Personal Contacts</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="space-y-2">
                {contacts.filter(c => c.type === "personal").map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-2 rounded">
                    <div>
                      <div className="font-medium">{contact.name || contact.phoneNumber}</div>
                      <div className="text-sm text-muted-foreground">{contact.callCount} calls</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {contact.isWhitelisted && (
                        <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">Trusted</span>
                      )}
                      {contact.isBlocked && (
                        <span className="text-xs bg-red-500/20 text-red-600 px-2 py-1 rounded">Blocked</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle>Business Contacts</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="space-y-2">
                {contacts.filter(c => c.type === "business").map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-2 rounded">
                    <div>
                      <div className="font-medium">{contact.name || contact.phoneNumber}</div>
                      <div className="text-sm text-muted-foreground">{contact.callCount} calls</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {contact.isWhitelisted && (
                        <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">Trusted</span>
                      )}
                      {contact.isBlocked && (
                        <span className="text-xs bg-red-500/20 text-red-600 px-2 py-1 rounded">Blocked</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>

        {/* AI Insights */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>🤖 Mariana AI Insights</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="space-y-3">
              {insights.map((insight) => (
                <div key={insight.id} className="p-3 glass-secondary rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      insight.type === "warning" ? "bg-orange-500/20 text-orange-600" :
                      insight.type === "success" ? "bg-green-500/20 text-green-600" :
                      insight.type === "info" ? "bg-blue-500/20 text-blue-600" :
                      "bg-purple-500/20 text-purple-600"
                    }`}>
                      {insight.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">{insight.confidence}% confidence</span>
                  </div>
                  <div className="text-sm">{insight.message}</div>
                  {insight.actionable && (
                    <div className="text-xs text-trust-blue mt-1">Action Required</div>
                  )}
                </div>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  )
}

export const metadata = {
  title: "Data Test - Spamsense",
  description: "Testing mock data structure and call management logic",
}
