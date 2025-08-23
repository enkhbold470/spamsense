// Prisma seed script for Spamsense
// Seeds core models (Contact, Call, SpamRule, AIInsight) using mock data shapes

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Helper functions (mirroring lib/mockData.ts)
const generatePhoneNumber = (areaCode = '555') => {
  const exchange = Math.floor(Math.random() * 900) + 100
  const number = Math.floor(Math.random() * 9000) + 1000
  return `+1-${areaCode}-${exchange}-${number}`
}

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Contacts (from lib/mockData.ts)
const mockContacts = [
  // Personal Contacts
  {
    id: 'contact-1',
    name: 'Mom',
    phoneNumber: '+1-555-0123',
    isWhitelisted: true,
    isBlocked: false,
    lastCallDate: new Date('2024-01-15T10:30:00'),
    callCount: 25,
    type: 'personal',
    notes: 'Family - always allow'
  },
  {
    id: 'contact-2',
    name: 'Dad',
    phoneNumber: '+1-555-0124',
    isWhitelisted: true,
    isBlocked: false,
    lastCallDate: new Date('2024-01-14T19:45:00'),
    callCount: 18,
    type: 'personal'
  },
  {
    id: 'contact-3',
    name: 'Best Friend Sarah',
    phoneNumber: '+1-555-0125',
    isWhitelisted: true,
    isBlocked: false,
    lastCallDate: new Date('2024-01-15T14:20:00'),
    callCount: 42,
    type: 'personal'
  },
  {
    id: 'contact-4',
    name: 'Pizza Palace',
    phoneNumber: '+1-555-7777',
    isWhitelisted: false,
    isBlocked: false,
    lastCallDate: new Date('2024-01-12T20:15:00'),
    callCount: 3,
    type: 'personal',
    notes: 'Local pizza delivery'
  },

  // Business Contacts
  {
    id: 'contact-5',
    name: 'John Smith - Client',
    phoneNumber: '+1-555-1001',
    isWhitelisted: true,
    isBlocked: false,
    lastCallDate: new Date('2024-01-15T11:00:00'),
    callCount: 12,
    type: 'business',
    notes: 'Important client - priority'
  },
  {
    id: 'contact-6',
    name: 'Tech Support',
    phoneNumber: '+1-555-1002',
    isWhitelisted: true,
    isBlocked: false,
    lastCallDate: new Date('2024-01-10T09:30:00'),
    callCount: 8,
    type: 'business'
  },
  {
    id: 'contact-7',
    name: 'Office Manager',
    phoneNumber: '+1-555-1003',
    isWhitelisted: true,
    isBlocked: false,
    lastCallDate: new Date('2024-01-15T08:45:00'),
    callCount: 15,
    type: 'business'
  },

  // Unknown/Spam Numbers
  {
    id: 'contact-8',
    phoneNumber: '+1-800-SPAM-123',
    isWhitelisted: false,
    isBlocked: true,
    lastCallDate: new Date('2024-01-15T16:30:00'),
    callCount: 1,
    type: 'business', // They claim to be business
    notes: 'Telemarketer - auto blocked'
  }
]

// Calls (trimmed `contact` object reference — we only store `contactId` in DB)
const mockCalls = [
  // Today's calls
  {
    id: 'call-1',
    phoneNumber: '+1-555-0123',
    contactId: 'contact-1',
    type: 'personal',
    status: 'allowed',
    duration: 480, // 8 minutes
    timestamp: new Date('2024-01-15T10:30:00'),
    isSpam: false,
    confidence: 5,
    location: 'Local',
    carrierInfo: 'Verizon',
    action: 'allow'
  },
  {
    id: 'call-2',
    phoneNumber: '+1-555-1001',
    contactId: 'contact-5',
    type: 'business',
    status: 'allowed',
    duration: 720, // 12 minutes
    timestamp: new Date('2024-01-15T11:00:00'),
    isSpam: false,
    confidence: 10,
    location: 'New York, NY',
    carrierInfo: 'AT&T'
  },
  {
    id: 'call-3',
    phoneNumber: '+1-888-SCAM-NOW',
    type: 'business',
    status: 'blocked',
    duration: 0,
    timestamp: new Date('2024-01-15T12:15:00'),
    isSpam: true,
    confidence: 95,
    location: 'Unknown',
    carrierInfo: 'VoIP',
    action: 'block',
    notes: 'Auto-blocked: Known scammer'
  },
  {
    id: 'call-4',
    phoneNumber: '+1-555-0125',
    contactId: 'contact-3',
    type: 'personal',
    status: 'allowed',
    duration: 1200, // 20 minutes
    timestamp: new Date('2024-01-15T14:20:00'),
    isSpam: false,
    confidence: 3
  },
  {
    id: 'call-5',
    phoneNumber: '+1-800-SPAM-123',
    contactId: 'contact-8',
    type: 'business',
    status: 'blocked',
    duration: 0,
    timestamp: new Date('2024-01-15T16:30:00'),
    isSpam: true,
    confidence: 88,
    action: 'block'
  },

  // Yesterday's calls
  {
    id: 'call-6',
    phoneNumber: '+1-555-0124',
    contactId: 'contact-2',
    type: 'personal',
    status: 'allowed',
    duration: 360,
    timestamp: new Date('2024-01-14T19:45:00'),
    isSpam: false,
    confidence: 8
  },
  {
    id: 'call-7',
    phoneNumber: '+1-555-UNKNOWN',
    type: 'business',
    status: 'unknown',
    duration: 0,
    timestamp: new Date('2024-01-14T14:30:00'),
    isSpam: false,
    confidence: 45,
    notes: 'Missed call - unknown number'
  },

  // More spam examples
  {
    id: 'call-8',
    phoneNumber: '+1-123-456-7890',
    type: 'personal',
    status: 'blocked',
    duration: 0,
    timestamp: new Date('2024-01-14T10:15:00'),
    isSpam: true,
    confidence: 92,
    location: 'Spoofed',
    carrierInfo: 'Unknown',
    action: 'block',
    notes: 'Sequential number pattern'
  },
  {
    id: 'call-9',
    phoneNumber: '+1-555-1002',
    contactId: 'contact-6',
    type: 'business',
    status: 'allowed',
    duration: 540,
    timestamp: new Date('2024-01-14T09:30:00'),
    isSpam: false,
    confidence: 12
  },
  {
    id: 'call-10',
    phoneNumber: '+1-800-ROBOCALL',
    type: 'business',
    status: 'blocked',
    duration: 0,
    timestamp: new Date('2024-01-13T16:45:00'),
    isSpam: true,
    confidence: 98,
    location: 'Call Center',
    carrierInfo: 'VoIP Carrier',
    action: 'block'
  }
]

// Additional random calls for last 7 days
const generateRandomCalls = (count) => {
  const calls = []
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  for (let i = 0; i < count; i++) {
    const isSpam = Math.random() < 0.3
    const type = Math.random() < 0.6 ? 'personal' : 'business'
    const timestamp = randomDate(weekAgo, now)
    calls.push({
      id: `call-random-${i}`,
      phoneNumber: generatePhoneNumber(isSpam ? '800' : '555'),
      type,
      status: isSpam ? 'blocked' : 'allowed',
      duration: isSpam ? 0 : Math.floor(Math.random() * 600) + 30,
      timestamp,
      isSpam,
      confidence: isSpam ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 30),
      location: isSpam ? 'Unknown' : 'Local',
      carrierInfo: isSpam ? 'VoIP' : ['Verizon', 'AT&T', 'T-Mobile'][Math.floor(Math.random() * 3)],
      action: isSpam ? 'block' : 'allow'
    })
  }
  return calls
}

const allMockCalls = [...mockCalls, ...generateRandomCalls(50)]

// Spam Rules (from lib/mockData.ts)
const mockSpamRules = [
  {
    id: 'rule-1',
    name: 'Sequential Numbers',
    pattern: '^\\+1[0-9]{3}(012|123|234|345|456|567|678|789)[0-9]{4}$',
    isActive: true,
    confidence: 85,
    description: 'Detects phone numbers with sequential digits (often spoofed)'
  },
  {
    id: 'rule-2',
    name: 'Toll-Free Telemarketers',
    pattern: '^\\+1(800|888|877|866|855|844|833|822)[0-9]{7}$',
    isActive: true,
    confidence: 60,
    description: 'Toll-free numbers often used by telemarketers'
  },
  {
    id: 'rule-3',
    name: 'Repeated Same Digits',
    pattern: '^\\+1[0-9]{3}([0-9])\\\\1{3}$',
    isActive: true,
    confidence: 75,
    description: 'Numbers with 4 consecutive identical digits'
  },
  {
    id: 'rule-4',
    name: 'International Scam Prefixes',
    pattern: '^\\+1(900|976)[0-9]{7}$',
    isActive: true,
    confidence: 95,
    description: 'Premium rate numbers often used for scams'
  },
  {
    id: 'rule-5',
    name: 'Local Number Spoofing',
    pattern: '^\\+1555[0-9]{7}$',
    isActive: false,
    confidence: 40,
    description: '555 prefix (disabled for demo - too broad)'
  }
]

// AI Insights (from lib/mockData.ts)
const mockAIInsights = [
  {
    id: 'insight-1',
    type: 'warning',
    message: 'Spam calls increased 15% this week. Consider enabling stricter filtering.',
    confidence: 85,
    actionable: true
  },
  {
    id: 'insight-2',
    type: 'info',
    message: 'You missed 2 business calls yesterday. Review them in Business Calls section.',
    confidence: 95,
    actionable: true
  },
  {
    id: 'insight-3',
    type: 'success',
    message: 'Successfully blocked 12 spam calls today, saving you 8 minutes.',
    confidence: 100,
    actionable: false
  },
  {
    id: 'insight-4',
    type: 'recommendation',
    message: 'Consider whitelisting +1-555-1004 (called 3 times this week).',
    confidence: 70,
    actionable: true
  }
]

async function seed() {
  console.log('Seeding database...')

  // Optional: clean tables to prevent unique conflicts on repeat runs
  // Note: order respects FK constraints (Call references Contact)
  await prisma.call.deleteMany()
  await prisma.aIInsight.deleteMany()
  await prisma.spamRule.deleteMany()
  await prisma.contact.deleteMany()

  // Contacts
  for (const c of mockContacts) {
    await prisma.contact.create({ data: c })
  }

  // Spam Rules
  for (const r of mockSpamRules) {
    await prisma.spamRule.create({ data: r })
  }

  // AI Insights
  for (const i of mockAIInsights) {
    await prisma.aIInsight.create({ data: i })
  }

  // Calls
  for (const call of allMockCalls) {
    // ensure contactId references existing contact if present
    const data = { ...call }
    await prisma.call.create({ data })
  }

  const [contactsCount, callsCount, rulesCount, insightsCount] = await Promise.all([
    prisma.contact.count(),
    prisma.call.count(),
    prisma.spamRule.count(),
    prisma.aIInsight.count()
  ])

  console.log(`Seeded: contacts=${contactsCount}, calls=${callsCount}, spamRules=${rulesCount}, insights=${insightsCount}`)
}

seed()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

