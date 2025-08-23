import type {
  Call,
  Contact,
  CallStats,
  SpamRule,
  CallType,
  CallStatus
} from './types'

// Helper function to generate realistic phone numbers
const generatePhoneNumber = (areaCode: string = "555") => {
  const exchange = Math.floor(Math.random() * 900) + 100
  const number = Math.floor(Math.random() * 9000) + 1000
  return `+1-${areaCode}-${exchange}-${number}`
}

// Helper function to generate random dates
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Mock Contacts Database
export const mockContacts: Contact[] = [
  // Personal Contacts
  {
    id: "contact-1",
    name: "Mom",
    phoneNumber: "+1-555-0123",
    isWhitelisted: true,
    isBlocked: false,
    lastCallDate: new Date("2024-01-15T10:30:00"),
    callCount: 25,
    type: "personal",
    notes: "Family - always allow"
  },
  {
    id: "contact-2", 
    name: "Dad",
    phoneNumber: "+1-555-0124",
    isWhitelisted: true,
    isBlocked: false,
    lastCallDate: new Date("2024-01-14T19:45:00"),
    callCount: 18,
    type: "personal"
  },
  {
    id: "contact-3",
    name: "Best Friend Sarah",
    phoneNumber: "+1-555-0125",
    isWhitelisted: true,
    isBlocked: false,
    lastCallDate: new Date("2024-01-15T14:20:00"),
    callCount: 42,
    type: "personal"
  },
  {
    id: "contact-4",
    name: "Pizza Palace",
    phoneNumber: "+1-555-7777",
    isWhitelisted: false,
    isBlocked: false,
    lastCallDate: new Date("2024-01-12T20:15:00"),
    callCount: 3,
    type: "personal",
    notes: "Local pizza delivery"
  },

  // Business Contacts
  {
    id: "contact-5",
    name: "John Smith - Client",
    phoneNumber: "+1-555-1001",
    isWhitelisted: true,
    isBlocked: false,
    lastCallDate: new Date("2024-01-15T11:00:00"),
    callCount: 12,
    type: "business",
    notes: "Important client - priority"
  },
  {
    id: "contact-6",
    name: "Tech Support",
    phoneNumber: "+1-555-1002",
    isWhitelisted: true,
    isBlocked: false,
    lastCallDate: new Date("2024-01-10T09:30:00"),
    callCount: 8,
    type: "business"
  },
  {
    id: "contact-7",
    name: "Office Manager",
    phoneNumber: "+1-555-1003",
    isWhitelisted: true,
    isBlocked: false,
    lastCallDate: new Date("2024-01-15T08:45:00"),
    callCount: 15,
    type: "business"
  },

  // Unknown/Spam Numbers
  {
    id: "contact-8",
    phoneNumber: "+1-800-SPAM-123",
    isWhitelisted: false,
    isBlocked: true,
    lastCallDate: new Date("2024-01-15T16:30:00"),
    callCount: 1,
    type: "business", // They claim to be business
    notes: "Telemarketer - auto blocked"
  }
]

// Mock Calls Database - Last 7 days
export const mockCalls: Call[] = [
  // Today's calls
  {
    id: "call-1",
    phoneNumber: "+1-555-0123",
    contactId: "contact-1",
    contact: mockContacts[0],
    type: "personal",
    status: "allowed",
    duration: 480, // 8 minutes
    timestamp: new Date("2024-01-15T10:30:00"),
    isSpam: false,
    confidence: 5,
    location: "Local",
    carrierInfo: "Verizon",
    action: "allow"
  },
  {
    id: "call-2",
    phoneNumber: "+1-555-1001",
    contactId: "contact-5",
    contact: mockContacts[4],
    type: "business",
    status: "allowed",
    duration: 720, // 12 minutes
    timestamp: new Date("2024-01-15T11:00:00"),
    isSpam: false,
    confidence: 10,
    location: "New York, NY",
    carrierInfo: "AT&T"
  },
  {
    id: "call-3",
    phoneNumber: "+1-888-SCAM-NOW",
    type: "business",
    status: "blocked",
    duration: 0,
    timestamp: new Date("2024-01-15T12:15:00"),
    isSpam: true,
    confidence: 95,
    location: "Unknown",
    carrierInfo: "VoIP",
    action: "block",
    notes: "Auto-blocked: Known scammer"
  },
  {
    id: "call-4",
    phoneNumber: "+1-555-0125",
    contactId: "contact-3",
    contact: mockContacts[2],
    type: "personal",
    status: "allowed",
    duration: 1200, // 20 minutes
    timestamp: new Date("2024-01-15T14:20:00"),
    isSpam: false,
    confidence: 3
  },
  {
    id: "call-5",
    phoneNumber: "+1-800-SPAM-123",
    contactId: "contact-8",
    contact: mockContacts[7],
    type: "business",
    status: "blocked",
    duration: 0,
    timestamp: new Date("2024-01-15T16:30:00"),
    isSpam: true,
    confidence: 88,
    action: "block"
  },

  // Yesterday's calls
  {
    id: "call-6",
    phoneNumber: "+1-555-0124",
    contactId: "contact-2",
    contact: mockContacts[1],
    type: "personal",
    status: "allowed",
    duration: 360,
    timestamp: new Date("2024-01-14T19:45:00"),
    isSpam: false,
    confidence: 8
  },
  {
    id: "call-7",
    phoneNumber: "+1-555-UNKNOWN",
    type: "business",
    status: "unknown",
    duration: 0,
    timestamp: new Date("2024-01-14T14:30:00"),
    isSpam: false,
    confidence: 45,
    notes: "Missed call - unknown number"
  },

  // More spam examples
  {
    id: "call-8",
    phoneNumber: "+1-123-456-7890",
    type: "personal",
    status: "blocked",
    duration: 0,
    timestamp: new Date("2024-01-14T10:15:00"),
    isSpam: true,
    confidence: 92,
    location: "Spoofed",
    carrierInfo: "Unknown",
    action: "block",
    notes: "Sequential number pattern"
  },
  {
    id: "call-9",
    phoneNumber: "+1-555-1002",
    contactId: "contact-6",
    contact: mockContacts[5],
    type: "business",
    status: "allowed",
    duration: 540,
    timestamp: new Date("2024-01-14T09:30:00"),
    isSpam: false,
    confidence: 12
  },
  {
    id: "call-10",
    phoneNumber: "+1-800-ROBOCALL",
    type: "business",
    status: "blocked",
    duration: 0,
    timestamp: new Date("2024-01-13T16:45:00"),
    isSpam: true,
    confidence: 98,
    location: "Call Center",
    carrierInfo: "VoIP Carrier",
    action: "block"
  }
]

// Generate additional random calls for the last 7 days
const generateRandomCalls = (count: number): Call[] => {
  const calls: Call[] = []
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  for (let i = 0; i < count; i++) {
    const isSpam = Math.random() < 0.3 // 30% spam rate
    const type: CallType = Math.random() < 0.6 ? "personal" : "business"
    const timestamp = randomDate(weekAgo, now)
    
    calls.push({
      id: `call-random-${i}`,
      phoneNumber: generatePhoneNumber(isSpam ? "800" : "555"),
      type,
      status: isSpam ? "blocked" : "allowed",
      duration: isSpam ? 0 : Math.floor(Math.random() * 600) + 30,
      timestamp,
      isSpam,
      confidence: isSpam ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 30),
      location: isSpam ? "Unknown" : "Local",
      carrierInfo: isSpam ? "VoIP" : ["Verizon", "AT&T", "T-Mobile"][Math.floor(Math.random() * 3)],
      action: isSpam ? "block" : "allow"
    })
  }
  
  return calls
}

// All calls including generated ones
export const allMockCalls = [...mockCalls, ...generateRandomCalls(50)]

// Mock Spam Rules
export const mockSpamRules: SpamRule[] = [
  {
    id: "rule-1",
    name: "Sequential Numbers",
    pattern: "^\\+1[0-9]{3}(012|123|234|345|456|567|678|789)[0-9]{4}$",
    isActive: true,
    confidence: 85,
    description: "Detects phone numbers with sequential digits (often spoofed)"
  },
  {
    id: "rule-2", 
    name: "Toll-Free Telemarketers",
    pattern: "^\\+1(800|888|877|866|855|844|833|822)[0-9]{7}$",
    isActive: true,
    confidence: 60,
    description: "Toll-free numbers often used by telemarketers"
  },
  {
    id: "rule-3",
    name: "Repeated Same Digits",
    pattern: "^\\+1[0-9]{3}([0-9])\\1{3}$",
    isActive: true,
    confidence: 75,
    description: "Numbers with 4 consecutive identical digits"
  },
  {
    id: "rule-4",
    name: "International Scam Prefixes",
    pattern: "^\\+1(900|976)[0-9]{7}$",
    isActive: true,
    confidence: 95,
    description: "Premium rate numbers often used for scams"
  },
  {
    id: "rule-5",
    name: "Local Number Spoofing",
    pattern: "^\\+1555[0-9]{7}$",
    isActive: false,
    confidence: 40,
    description: "555 prefix (disabled for demo - too broad)"
  }
]

// Calculate mock statistics from the call data
export const calculateCallStats = (): CallStats => {
  const totalCalls = allMockCalls.length
  const personalCalls = allMockCalls.filter(call => call.type === "personal").length
  const businessCalls = allMockCalls.filter(call => call.type === "business").length
  const spamBlocked = allMockCalls.filter(call => call.isSpam && call.status === "blocked").length
  const allowedCalls = allMockCalls.filter(call => call.status === "allowed").length
  const blockedCalls = allMockCalls.filter(call => call.status === "blocked").length
  
  const totalDuration = allMockCalls
    .filter(call => call.duration > 0)
    .reduce((sum, call) => sum + call.duration, 0)
  const avgCallDuration = Math.floor(totalDuration / allowedCalls)
  
  const spamNumbers = allMockCalls
    .filter(call => call.isSpam)
    .map(call => call.phoneNumber)
  const topSpamNumbers = [...new Set(spamNumbers)].slice(0, 5)
  
  return {
    totalCalls,
    personalCalls,
    businessCalls,
    spamBlocked,
    spamPercentage: Math.round((spamBlocked / totalCalls) * 100),
    allowedCalls,
    blockedCalls,
    avgCallDuration,
    topSpamNumbers,
    callsChange: 12, // Mock 12% increase
    spamChange: -8   // Mock 8% decrease in spam
  }
}

export const mockCallStats = calculateCallStats()

// Helper functions for filtering data
export const getPersonalCalls = () => allMockCalls.filter(call => call.type === "personal")
export const getBusinessCalls = () => allMockCalls.filter(call => call.type === "business")
export const getSpamCalls = () => allMockCalls.filter(call => call.isSpam)
export const getRecentCalls = (hours: number = 24) => {
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)
  return allMockCalls.filter(call => call.timestamp > cutoff)
}
export const getCallsByStatus = (status: CallStatus) => allMockCalls.filter(call => call.status === status)

// Mock AI Insights (for Mariana)
export const mockAIInsights = [
  {
    id: "insight-1",
    type: "warning",
    message: "Spam calls increased 15% this week. Consider enabling stricter filtering.",
    confidence: 85,
    actionable: true
  },
  {
    id: "insight-2", 
    type: "info",
    message: "You missed 2 business calls yesterday. Review them in Business Calls section.",
    confidence: 95,
    actionable: true
  },
  {
    id: "insight-3",
    type: "success",
    message: "Successfully blocked 12 spam calls today, saving you 8 minutes.",
    confidence: 100,
    actionable: false
  },
  {
    id: "insight-4",
    type: "recommendation",
    message: "Consider whitelisting +1-555-1004 (called 3 times this week).",
    confidence: 70,
    actionable: true
  }
]

// Export default object with all mock data
const mockData = {
  contacts: mockContacts,
  calls: allMockCalls,
  recentCalls: mockCalls,
  spamRules: mockSpamRules,
  stats: mockCallStats,
  insights: mockAIInsights,
  // Utility functions
  getPersonalCalls,
  getBusinessCalls,
  getSpamCalls,
  getRecentCalls,
  getCallsByStatus
}

export default mockData
