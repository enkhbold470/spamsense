import Image from "next/image";
import Link from "next/link";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle, GlassButton } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      {/* Test Route Link */}
      <div className="fixed top-4 right-4 z-50">
        <Link href="/test">
          <GlassButton variant="energy" className="shadow-lg">
            🧪 View Components
          </GlassButton>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 pt-20">
        {/* Hero Section */}
        <GlassCard className="text-center" size="lg">
          <GlassCardHeader>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-trust-blue to-energy-orange rounded-xl flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <GlassCardTitle className="text-4xl">Spamsense</GlassCardTitle>
            </div>
            <p className="text-xl text-muted-foreground">
              Beautiful Liquid Glass Dashboard with Next.js & Tailwind CSS
            </p>
          </GlassCardHeader>
          
          <GlassCardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="glass-secondary p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🎨 Liquid Glass UI</h3>
                <p className="text-sm text-muted-foreground">
                  Apple-inspired glassmorphism design system
                </p>
              </div>
              <div className="glass-secondary p-4 rounded-lg">
                <h3 className="font-semibold mb-2">⚡ High Performance</h3>
                <p className="text-sm text-muted-foreground">
                  CSS-based animations with optimal performance
                </p>
              </div>
              <div className="glass-secondary p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🔧 Type Safe</h3>
                <p className="text-sm text-muted-foreground">
                  Full TypeScript support with shadcn/ui
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center justify-center flex-wrap">
              <Link href="/test">
                <GlassButton variant="trust" size="lg">
                  🧪 View Components
                </GlassButton>
              </Link>
              
              <Link href="/test/layout">
                <GlassButton variant="glass" size="lg">
                  🏗️ Test Layout
                </GlassButton>
              </Link>
              
              <a 
                href="https://github.com/your-repo/spamsense" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <GlassButton variant="outline" size="lg">
                  📱 GitHub
                </GlassButton>
              </a>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-primary p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-trust-blue">26+</div>
            <div className="text-sm text-muted-foreground">Components</div>
          </div>
          <div className="glass-primary p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-energy-orange">100%</div>
            <div className="text-sm text-muted-foreground">TypeScript</div>
          </div>
          <div className="glass-primary p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-growth-green">0ms</div>
            <div className="text-sm text-muted-foreground">Bundle Impact</div>
          </div>
          <div className="glass-primary p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-trust-blue">A11y</div>
            <div className="text-sm text-muted-foreground">Accessible</div>
          </div>
        </div>

        {/* Footer */}
        <GlassCard className="text-center">
          <GlassCardContent>
            <p className="text-muted-foreground mb-4">
              Built with Next.js 15, Tailwind CSS 4, and shadcn/ui
            </p>
            <div className="flex gap-4 items-center justify-center">
              <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-muted-foreground"
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  aria-hidden
                  src="/globe.svg"
                  alt="Globe icon"
                  width={16}
                  height={16}
                />
                Next.js
              </a>
              <div className="w-px h-4 bg-border" />
              <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-muted-foreground"
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  aria-hidden
                  src="/window.svg"
                  alt="Window icon"
                  width={16}
                  height={16}
                />
                Tailwind
              </a>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  );
}
