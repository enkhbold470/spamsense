"use client";

import { useState } from "react";
import { Bot, Brain, TrendingUp, Lightbulb, MessageCircle, Zap, AlertCircle, CheckCircle, Info, Star } from "lucide-react";
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


const sampleUser: User = {
  name: "Sarah Johnson",
  email: "sarah@spamsense.com",
  initials: "SJ"
};

export default function MarianaPage() {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      id: "1",
      type: "ai" as const,
      message: "Hello! I'm Mariana, your AI call management assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  
  const insights = mockData.insights;
  const stats = mockData.stats;
  
  const aiMetrics = {
    totalInsights: insights.length,
    actionableInsights: insights.filter(insight => insight.actionable).length,
    avgConfidence: Math.round(insights.reduce((sum, insight) => sum + insight.confidence, 0) / insights.length),
    spamTrends: "Decreasing",
    callPatterns: "Normal"
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      message: chatInput,
      timestamp: new Date()
    };
    
    // setChatHistory(prev => [...prev, userMessage as { id: string; type: "user"; message: string; timestamp: Date; }]);
    setChatInput("");
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: "ai" as const,
        message: "I've analyzed your call patterns and found some interesting insights. Your spam protection is working well!",
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "success": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "info": return <Info className="w-4 h-4 text-blue-500" />;
      case "recommendation": return <Star className="w-4 h-4 text-purple-500" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "warning": return "border-l-yellow-500 bg-yellow-50/50";
      case "success": return "border-l-green-500 bg-green-50/50";
      case "info": return "border-l-blue-500 bg-blue-50/50";
      case "recommendation": return "border-l-purple-500 bg-purple-50/50";
      default: return "border-l-gray-500 bg-gray-50/50";
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
            {/* Page Header */}
            <GlassCard>
              <GlassCardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <GlassCardTitle className="text-2xl flex items-center gap-2">
                      <Bot className="w-6 h-6 text-creativity-purple" />
                      Mariana AI Assistant
                    </GlassCardTitle>
                    <p className="text-muted-foreground mt-2">
                      Your intelligent call management companion
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <GlassButton variant="default">
                      <Brain className="w-4 h-4 mr-2" />
                      Analyze Patterns
                    </GlassButton>
                  </div>
                </div>
              </GlassCardHeader>
            </GlassCard>

            {/* AI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard
                label="Total Insights"
                value={aiMetrics.totalInsights}
                icon={<Lightbulb className="w-5 h-5" />}
                delay={0.1}
              />
              <StatCard
                label="Actionable"
                value={aiMetrics.actionableInsights}
                icon={<Zap className="w-5 h-5" />}
                delay={0.2}
              />
              <StatCard
                label="Avg Confidence"
                value={`${aiMetrics.avgConfidence}%`}
                icon={<TrendingUp className="w-5 h-5" />}
                delay={0.3}
              />
              <StatCard
                label="Spam Trends"
                value={aiMetrics.spamTrends}
                icon={<TrendingUp className="w-5 h-5" />}
                delay={0.4}
              />
              <StatCard
                label="Call Patterns"
                value={aiMetrics.callPatterns}
                icon={<Brain className="w-5 h-5" />}
                delay={0.5}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Insights */}
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>AI Insights & Recommendations</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    {insights.map((insight) => (
                      <div key={insight.id} className={`p-4 border-l-4 rounded-r-lg ${getInsightColor(insight.type)}`}>
                        <div className="flex items-start gap-3">
                          {getInsightIcon(insight.type)}
                          <div className="flex-1">
                            <p className="text-sm">{insight.message}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">
                                Confidence: {insight.confidence}%
                              </span>
                              {insight.actionable && (
                                <GlassButton size="sm" variant="default">
                                  Take Action
                                </GlassButton>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCardContent>
              </GlassCard>

              {/* Chat Interface */}
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Chat with Mariana
                  </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="flex flex-col h-96">
                    {/* Chat History */}
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                      {/* {chatHistory.map((message) => (
                        <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.type === "user"  
                              ? "bg-creativity-purple text-white" 
                              : "glass-secondary"
                          }`}>
                            <p className="text-sm">{message.message}</p>
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))} */}
                      Chat History
                    </div>
                    
                    {/* Chat Input */}
                    <div className="flex gap-2">
                      <GlassInput
                        placeholder="Ask Mariana about your calls..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                      />
                      <GlassButton onClick={handleSendMessage} variant="default">
                        Send
                      </GlassButton>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}