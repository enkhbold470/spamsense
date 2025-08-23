"use client";

import { useState } from "react";
import { User, Settings, Bell, Shield, Phone, Mail, Lock, Save } from "lucide-react";
import { 
  GlassCard, 
  GlassCardContent, 
  GlassCardHeader, 
  GlassCardTitle,
  GlassButton,
  NavSidebar,
  TopBar,
  GlassInput
} from "@/components/ui";
import type { User as UserType } from "@/components/ui/top-bar";

const sampleUser: UserType = {
  name: "Sarah Johnson",
  email: "sarah@spamsense.com",
  initials: "SJ"
};

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    email: "sarah@spamsense.com",
    phone: "+1-555-0123",
    timezone: "America/New_York"
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    spamAlerts: true,
    autoBlock: true
  });

  const updateProfile = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const updatePreference = (field: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
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
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="text-2xl flex items-center gap-2">
                  <User className="w-6 h-6 text-trust-blue" />
                  Profile & Settings
                </GlassCardTitle>
              </GlassCardHeader>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Profile Information</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <GlassInput
                        value={profile.name}
                        onChange={(e) => updateProfile("name", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <GlassInput
                        value={profile.email}
                        onChange={(e) => updateProfile("email", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <GlassInput
                        value={profile.phone}
                        onChange={(e) => updateProfile("phone", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <GlassButton className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </GlassButton>
                  </div>
                </GlassCardContent>
              </GlassCard>

              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Preferences
                  </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    {[
                      { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email", icon: <Mail className="w-4 h-4" /> },
                      { key: "pushNotifications", label: "Push Notifications", desc: "Real-time alerts on your device", icon: <Bell className="w-4 h-4" /> },
                      { key: "spamAlerts", label: "Spam Alerts", desc: "Immediate alerts for blocked spam calls", icon: <Shield className="w-4 h-4" /> },
                      { key: "autoBlock", label: "Auto Block", desc: "Automatically block known spam numbers", icon: <Lock className="w-4 h-4" /> }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-3 glass-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-trust-blue">{item.icon}</div>
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-sm text-muted-foreground">{item.desc}</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences[item.key as keyof typeof preferences] as boolean}
                            onChange={(e) => updatePreference(item.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-trust-blue"></div>
                        </label>
                      </div>
                    ))}

                    <GlassButton className="w-full mt-6">
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </GlassButton>
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