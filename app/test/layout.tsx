import Link from "next/link"
import { GlassCard, GlassCardContent, GlassButton } from "@/components/ui"

export default function TestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* Test Navigation */}
      <div className="fixed top-4 right-4 z-50">
        <GlassCard className="p-4">
          <GlassCardContent className="space-y-2">
            <h3 className="font-semibold text-sm mb-3">🧪 Test Routes</h3>
            <div className="flex flex-col gap-2">
              <Link href="/test">
                <GlassButton variant="glass" size="sm" className="w-full justify-start">
                  📦 Components
                </GlassButton>
              </Link>
              <Link href="/test/layout">
                <GlassButton variant="glass" size="sm" className="w-full justify-start">
                  🏗️ Layout
                </GlassButton>
              </Link>
              <Link href="/test/data">
                <GlassButton variant="trust" size="sm" className="w-full justify-start">
                  📊 Mock Data
                </GlassButton>
              </Link>
              <Link href="/">
                <GlassButton variant="outline" size="sm" className="w-full justify-start">
                  🏠 Home
                </GlassButton>
              </Link>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
      
      {children}
    </div>
  )
}
