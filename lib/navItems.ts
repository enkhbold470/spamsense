import { NavItem } from "@/lib/convex-types";
import { AlertTriangle, Bot, Building2, Home, User, Users, BarChart3, Clock } from "lucide-react";

export const defaultNavItems: NavItem[] = [
    // { label: "Profile", href: "/profile", icon: User },
    // { label: "Stats", href: "/", icon: BarChart3 },
    // { label: "Recent Activity", href: "/recent-activity", icon: Clock },
     { label: "Personal Calls", href: "/personal-calls", icon: Users },
    { label: "Business Calls", href: "/business-calls", icon: Building2 },
    { label: "Spam Management", href: "/spam-management", icon: AlertTriangle },
    // { label: "Mariana", href: "/mariana", icon: Bot },
  ]
