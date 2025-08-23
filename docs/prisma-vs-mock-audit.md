# Spamsense: Prisma Schema vs. Mock Data Audit

Date: 2025-08-23

## Verdict
- Mostly aligned. Core models and enums in `prisma/schema.prisma` match the shapes used in `lib/mockData.ts` and `lib/types.ts`, with a few intentional frontend-only fields and DB-only fields handled by defaults.

## What Matches
- Enums: `CallType`, `CallStatus`, `CallAction`, `BookingStatus` values match between Prisma and TS types.
- Models in active use: `Contact`, `Call`, `SpamRule` fields correspond 1:1 with schema names and types.
- Optional relations: `Call.contactId` is optional in schema and mock data; frontend uses optional `contact` object (not persisted).
- Defaults: Schema defaults (e.g., `isSpam`, `confidence`, `isActive`, timestamps) are compatible with mock data which often sets values explicitly.

## Notable Differences
- AIInsight
  - Prisma model includes `isRead`, `createdAt`, `updatedAt`. Mock AI insights omit these; defaults cover them in DB.
  - `lib/types.ts` lacks `AIInsight` and `InsightType` types; mock uses string literals for `type`.
- Timestamps
  - Prisma includes `createdAt`/`updatedAt` on most models (`Contact`, `Call`, `SpamRule`, etc.).
  - `lib/types.ts` interfaces for `Contact`/`Call` don’t include these; fine for mock, but DB queries will return them.
- Frontend-only field
  - `Call.contact` exists in TS/mocks for convenience but is not a DB column. Populate via query `include` or keep it client-only. The seeder already strips it when writing.
- Analytics vs. Stats
  - Prisma `CallAnalytics` (persisted daily metrics) is not a 1:1 with `CallStats` (derived at runtime). Overlap is by design, not a mismatch.
- Extra Prisma models not used by mocks
  - `Client`, `Service`, `Staff`, `Booking`, `SystemConfig`, `User` exist for legacy/future use; there’s no current mock data for these.

## Implications
- Reading from DB into frontend types will surface extra fields (timestamps, `isRead`). Either extend TS types with optional fields or map/omit on the client.
- Writing to DB must avoid frontend-only props like `Call.contact`. Current `prisma/seed.js` handles this correctly.

## Recommendations
1. Add TS types for AI insights:
   - `type InsightType = "warning" | "info" | "success" | "recommendation"`
   - `interface AIInsight { id: string; type: InsightType; message: string; confidence: number; actionable: boolean; isRead?: boolean }`
2. Optionally extend `Contact` and `Call` interfaces with `createdAt?` and `updatedAt?` if you plan to use DB records directly in the UI.
3. Keep seeding via `prisma/seed.js` pattern (strip frontend-only fields; rely on schema defaults where mocks omit DB-only fields).

## Files Reviewed
- Prisma schema: `prisma/schema.prisma`
- Mock data: `lib/mockData.ts`
- Type definitions: `lib/types.ts`
- Seeder (alignment reference): `prisma/seed.js`

