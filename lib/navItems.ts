import { NavItem } from "@/components/ui/nav-sidebar";
import { AlertTriangle, Bot, Building2, Home, User, Users } from "lucide-react";

 export const defaultNavItems: NavItem[] = [
    { label: "Profile", href: "/profile", icon: User },
    // { label: "Referrals", href: "/referrals", icon: LinkIcon },
    { label: "Mariana", href: "/mariana", icon: Bot  },
    { label: "Stats", href: "/", icon: Home },
    { label: "Spam Management", href: "/spam-management", icon: AlertTriangle },
    { label: "Personal Calls", href: "/personal-calls", icon: Users },
    { label: "Business Calls", href: "/business-calls", icon: Building2 },
    // { label: "Storefront", href: "/storefront", icon: Store },
  ]
