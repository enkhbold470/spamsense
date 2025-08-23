"use client";

import { useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Moon,
  Sun,
  Palette,
  Globe,
  Smartphone,
  Save,
  DownloadCloud,
  Trash2,
} from "lucide-react";
import {
  GlassCard,
  GlassCardContent,
  GlassCardHeader,
  GlassCardTitle,
  GlassButton,
  NavSidebar,
  TopBar,
  GlassInput,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Switch,
  Slider,
} from "@/components/ui";
import type { User as UserType } from "@/components/ui/top-bar";

const sampleUser: UserType = {
  name: "Sarah Johnson",
  email: "sarah@spamsense.com",
  initials: "SJ",
};

export default function SettingsPage() {
  // Appearance
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  const [accent, setAccent] = useState<"blue" | "orange" | "green" | "purple">("blue");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [glassIntensity, setGlassIntensity] = useState(60);

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Privacy & Security
  const [hideCallerId, setHideCallerId] = useState(false);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Region
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("America/New_York");

  const handleSave = () => {
    console.log("Saving settings:", {
      appearance: { theme, accent, reducedMotion, glassIntensity },
      notifications: { emailNotifications, pushNotifications, smsNotifications },
      privacy: { hideCallerId, shareAnalytics, twoFactorAuth },
      region: { language, timezone },
    });
  };

  return (
    <div className="flex min-h-screen">
      <NavSidebar />

      <div className="flex-1 ml-72">
        <div className="p-6">
          <TopBar
            user={sampleUser}
            notifications={2}
            locationFilter={{
              current: "All Devices",
              options: ["All Devices", "iPhone", "Work Phone", "Home"],
              onChange: (loc) => console.log("Device changed:", loc),
            }}
          />

          <div className="space-y-6">
            {/* Header */}
            <GlassCard>
              <GlassCardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <GlassCardTitle className="text-2xl flex items-center gap-2">
                      <SettingsIcon className="w-6 h-6 text-trust-blue" />
                      Settings
                    </GlassCardTitle>
                    <p className="text-muted-foreground mt-2">
                      Configure your preferences, notifications, and privacy.
                    </p>
                  </div>
                  <GlassButton onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </GlassButton>
                </div>
              </GlassCardHeader>
            </GlassCard>

            {/* Appearance + Region */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle className="flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Appearance
                  </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div className="text-sm">
                        <div className="font-medium flex items-center gap-2">
                          <Sun className="w-4 h-4" /> Theme
                        </div>
                        <div className="text-muted-foreground">Choose your preferred theme.</div>
                      </div>
                      <div>
                        <Select value={theme} onValueChange={(v) => setTheme(v as typeof theme)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="system">System</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div className="text-sm">
                        <div className="font-medium flex items-center gap-2">
                          <Palette className="w-4 h-4" /> Accent Color
                        </div>
                        <div className="text-muted-foreground">Used across highlights and charts.</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {[
                          { key: "blue", className: "bg-trust-blue" },
                          { key: "orange", className: "bg-energy-orange" },
                          { key: "green", className: "bg-green-500" },
                          { key: "purple", className: "bg-purple-500" },
                        ].map((c) => (
                          <button
                            key={c.key}
                            onClick={() => setAccent(c.key as typeof accent)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform ${
                              accent === c.key ? "scale-110 border-white" : "border-transparent"
                            } ${c.className}`}
                            aria-label={`Accent ${c.key}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div className="text-sm">
                        <div className="font-medium flex items-center gap-2">
                          <Smartphone className="w-4 h-4" /> Glass Intensity
                        </div>
                        <div className="text-muted-foreground">Adjust the glass effect strength.</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Slider
                          value={[glassIntensity]}
                          onValueChange={(vals) => setGlassIntensity(vals[0] ?? 0)}
                          min={0}
                          max={100}
                          className="w-full"
                        />
                        <span className="w-10 text-right text-sm tabular-nums">{glassIntensity}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div className="text-sm">
                        <div className="font-medium flex items-center gap-2">
                          <Moon className="w-4 h-4" /> Reduced Motion
                        </div>
                        <div className="text-muted-foreground">Limit animations for accessibility.</div>
                      </div>
                      <div className="flex items-center justify-start md:justify-end">
                        <Switch
                          checked={reducedMotion}
                          onCheckedChange={(v) => setReducedMotion(Boolean(v))}
                        />
                      </div>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>

              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle className="flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Language & Region
                  </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div className="text-sm">
                        <div className="font-medium">Language</div>
                        <div className="text-muted-foreground">Used across the interface.</div>
                      </div>
                      <div>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div className="text-sm">
                        <div className="font-medium">Timezone</div>
                        <div className="text-muted-foreground">Scheduling and timestamps.</div>
                      </div>
                      <div>
                        <Select value={timezone} onValueChange={setTimezone}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">America/New_York</SelectItem>
                            <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                            <SelectItem value="Europe/London">Europe/London</SelectItem>
                            <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>

            {/* Notifications */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <Bell className="w-4 h-4" /> Notifications
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-3">
                  {[
                    {
                      key: "email",
                      label: "Email Alerts",
                      desc: "Weekly summaries and critical alerts.",
                      checked: emailNotifications,
                      set: setEmailNotifications,
                    },
                    {
                      key: "push",
                      label: "Push Notifications",
                      desc: "Real-time call and spam updates.",
                      checked: pushNotifications,
                      set: setPushNotifications,
                    },
                    {
                      key: "sms",
                      label: "SMS Messages",
                      desc: "Only for urgent account events.",
                      checked: smsNotifications,
                      set: setSmsNotifications,
                    },
                  ].map((row) => (
                    <div
                      key={row.key}
                      className="flex items-center justify-between p-4 glass-secondary rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{row.label}</div>
                        <div className="text-sm text-muted-foreground">{row.desc}</div>
                      </div>
                      <Switch
                        checked={row.checked}
                        onCheckedChange={(v) => row.set(Boolean(v))}
                      />
                    </div>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>

            {/* Privacy & Security */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Privacy & Security
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-3">
                  {[
                    {
                      key: "callerid",
                      label: "Hide Caller ID",
                      desc: "Mask your number on outbound calls.",
                      checked: hideCallerId,
                      set: setHideCallerId,
                    },
                    {
                      key: "analytics",
                      label: "Share Anonymous Analytics",
                      desc: "Help improve detection quality.",
                      checked: shareAnalytics,
                      set: setShareAnalytics,
                    },
                    {
                      key: "2fa",
                      label: "Two‑Factor Authentication",
                      desc: "Extra security for logins.",
                      checked: twoFactorAuth,
                      set: setTwoFactorAuth,
                    },
                  ].map((row) => (
                    <div
                      key={row.key}
                      className="flex items-center justify-between p-4 glass-secondary rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{row.label}</div>
                        <div className="text-sm text-muted-foreground">{row.desc}</div>
                      </div>
                      <Switch
                        checked={row.checked}
                        onCheckedChange={(v) => row.set(Boolean(v))}
                      />
                    </div>
                  ))}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <GlassButton onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" /> Save Privacy Settings
                    </GlassButton>
                    <GlassButton variant="outline">
                      <DownloadCloud className="w-4 h-4 mr-2" /> Export Data
                    </GlassButton>
                    <GlassButton
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => console.log("Request account deletion")}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                    </GlassButton>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
