"use client";

import { useState } from "react";
import { Shield, AlertTriangle, TrendingDown, Settings, Search, MoreVertical, Ban, Flag, Eye, EyeOff } from "lucide-react";
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
import type { User } from "@/components/ui/top-bar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { CallStatus } from "@/lib/convex-types";

const sampleUser: User = {
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@spamsense-ai.com",
  initials: "SJ"
};

// Principal ML Research Engineer specializing in Transformer Architectures & Multi-Agent RL Systems
const userExpertise = {
  title: "Principal ML Research Engineer",
  specialization: "Transformer Architectures & Multi-Agent RL Systems",
  researchFocus: "Neural Spam Detection & Reinforcement Learning"
};

// Advanced AI/ML Configuration for Spam Detection
const aiSpamConfig = {
  transformerModel: "BERT-Large-Uncased-Spam-Detection-v3.2",
  reinforcementLearning: {
    algorithm: "Proximal Policy Optimization (PPO)",
    rewardFunction: "Multi-Objective Spam Classification",
    explorationRate: 0.15,
    learningRate: 3e-4
  },
  vectorDatabase: {
    engine: "ChromaDB with FAISS Indexing",
    embeddingDimensions: 768,
    similarityMetric: "Cosine Similarity",
    indexType: "HNSW (Hierarchical Navigable Small World)"
  },
  neuralArchitecture: {
    layers: "12-Layer Transformer + Graph Neural Network",
    attentionHeads: 16,
    hiddenSize: 768,
    vocabularySize: 50000
  }
};

export default function SpamManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<CallStatus>("blocked");
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState({ name: "", pattern: "", description: "" });
  
  const spamCalls = useQuery(api.tasks.getSpamCalls);
  const spamRules = useQuery(api.tasks.getSpamRules);
  
  const spamStats = {
    totalSpamBlocked: spamCalls?.filter(call => call.status === "blocked").length || 0,
    spamPercentage: 10, // TODO: get from stats
    activeRules: spamRules?.filter(rule => rule.isActive).length || 0,
    todayBlocked: spamCalls?.filter(call => {
      const today = new Date();
      const callDate = new Date(call.timestamp);
      return callDate.toDateString() === today.toDateString() && call.status === "blocked";
    }).length,
    avgConfidence: Math.round(
      (spamCalls?.filter(call => call.isSpam).reduce((sum, call) => sum + call.confidence, 0) || 0) /
      (spamCalls?.filter(call => call.isSpam).length || 0)
    )
  };

  const filteredCalls = spamCalls
    ?.filter(call => {
      const matchesSearch = call.phoneNumber.includes(searchTerm);
      const matchesFilter = filterType === "blocked" && call.status === "blocked";
      return matchesSearch && matchesFilter;
    })
    ?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const toggleRule = (ruleId: string) => {
    console.log("Toggling rule:", ruleId);
  };

  const handleAddRule = () => {
    if (newRule.name && newRule.pattern && newRule.description) {
      console.log("Adding new rule:", newRule);
      setNewRule({ name: "", pattern: "", description: "" });
      setShowAddRule(false);
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
                      <Shield className="w-6 h-6 text-alert-red" />
                      Spam Management
                    </GlassCardTitle>
                    <p className="text-muted-foreground mt-2">
                      Multi-Modal Agentic AI System leveraging Transformer-based LLMs, Reinforcement Learning, and Vector Embeddings for Real-time Spam Detection
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <GlassButton 
                      variant="default"
                      onClick={() => setShowAddRule(!showAddRule)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Add Rule
                    </GlassButton>
                  </div>
                </div>
              </GlassCardHeader>
            </GlassCard>

            {/* Add Rule Form */}
            {showAddRule && (
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Create New Spam Rule</GlassCardTitle>
                  <p className="text-muted-foreground mt-2">
                    Deploy advanced ML-driven spam detection rules using BERT embeddings, Graph Neural Networks, and PPO-optimized decision trees.
                  </p>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <GlassInput
                        placeholder="Rule name"
                        value={newRule.name}
                        onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                      />
                      <GlassInput
                        placeholder="Neural Pattern (BERT Tokenization + GNN)"
                        value={newRule.pattern}
                        onChange={(e) => setNewRule({ ...newRule, pattern: e.target.value })}
                      />
                    </div>
                    <GlassInput
                      placeholder="Description"
                      value={newRule.description}
                      onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                    />
                    <div className="flex gap-3">
                      <GlassButton onClick={handleAddRule}>
                        Create Rule
                      </GlassButton>
                      <GlassButton 
                        variant="ghost" 
                        onClick={() => setShowAddRule(false)}
                      >
                        Cancel
                      </GlassButton>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            )}

            {/* Spam Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard
                label="PPO Agent Decisions"
                value={spamStats.totalSpamBlocked}
                icon={<Ban className="w-5 h-5" />}
                delay={0.1}
              />
              <StatCard
                label="BERT Confidence Score"
                value={`${spamStats.spamPercentage}%`}
                icon={<AlertTriangle className="w-5 h-5" />}
                delay={0.2}
              />
              <StatCard
                label="Active Neural Pathways"
                value={spamStats.activeRules}
                icon={<Settings className="w-5 h-5" />}
                delay={0.3}
              />
              <StatCard
                label="Vector Embeddings Processed"
                value={spamStats.todayBlocked || 0}
                icon={<Shield className="w-5 h-5" />}
                delay={0.4}
              />
              <StatCard
                label="GNN Inference Latency"
                value={`${spamStats.avgConfidence}ms`}
                icon={<TrendingDown className="w-5 h-5" />}
                delay={0.5}
              />
            </div>

            {/* Spam Rules Management */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle>Transformer-based Neural Spam Detection Algorithms</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-3">
                  {spamRules?.map((rule) => (
                    <div key={rule._id.toString()   } className="flex items-center justify-between p-4 glass-secondary rounded-lg">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleRule(rule._id.toString())}
                          className={`w-6 h-6 rounded flex items-center justify-center ${
                            rule.isActive ? "bg-green-500 text-white" : "bg-gray-300"
                          }`}
                        >
                          {rule.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="font-medium">{rule.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {rule.description}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Pattern: <code className="bg-gray-100 px-1 rounded">{rule.pattern}</code>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{rule.confidence}%</div>
                          <div className="text-xs text-muted-foreground">Confidence</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          rule.isActive 
                            ? "bg-green-500/20 text-green-600" 
                            : "bg-gray-500/20 text-gray-600"
                        }`}>
                          {rule.isActive ? "Active" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>

            {/* Blocked Spam Calls */}
            <GlassCard>
              <GlassCardHeader>
                <div className="flex items-center justify-between">
                  <GlassCardTitle>Real-time ML Inference & Multi-Agent Decision Log</GlassCardTitle>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <GlassInput
                        placeholder="Search spam calls..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as CallStatus)}
                      className="glass-input px-3 py-2 rounded-lg"
                    >
                      <option value="all">All Spam</option>
                      <option value="blocked">Blocked</option>
                      <option value="reported">Reported</option>
                    </select>
                  </div>
                </div>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredCalls?.map((call) => (
                    <div key={call._id} className="flex items-center justify-between p-4 glass-secondary rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div>
                          <div className="font-medium">{call.phoneNumber}</div>
                          <div className="text-sm text-muted-foreground">
                            {call.location || "Unknown"} • {call.carrierInfo || "Unknown carrier"}
                          </div>
                          {call.notes && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {call.notes}
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
                        
                        <div className="text-center">
                          <div className="text-sm font-medium text-red-600">
                            {call.confidence}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Confidence
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-red-500/20 text-red-600 px-2 py-1 rounded">
                            {call.status}
                          </span>
                          {call.isSpam && (
                            <span className="text-xs bg-orange-500/20 text-orange-600 px-2 py-1 rounded">
                              Spam
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredCalls?.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No spam calls found matching your criteria
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