'use client';
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Bell,
  Home,
  ClipboardList,
  Users,
  Video,
  Library,
  Store,
  MessageSquare,
  Rss,
  Hash,
  Cpu,
  DollarSign,
  Shield,
  ChevronDown,
  User,
  Settings,
  LogOut,
  RefreshCw,
  Expand,
  Shrink,
  Calendar,
  FileText,
  ChevronLeft,
  Plus,
  CloudRain,
  Eye,
  Camera,
  Building2,
  PenLine
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/components/logo";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { mockSubscriptionPlans } from "@/lib/data";
import { FlashNotificationBar } from "@/components/flash-notification-bar";
import { NewsWidget } from "@/components/news-widget";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuthStore, logout } from "@/lib/auth/auth-service";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarSeparator,
  useSidebar
} from "@/components/ui/sidebar"
import OverHUD from "./overhud/OverHUD";
import { PLATFORM_VERSION } from "@/lib/version";
import { TopCommandBar } from './layout/TopCommandBar';
import { ShellLayoutProvider } from '@/lib/layout/shell-layout-state';
import { ScingPanelProvider } from '@/lib/scing/scing-panel-state';


// Separate component for the sidebar content to access sidebar context
const AppSidebarContent = ({ 
    navItems, 
    toolsItems, 
    managementItems, 
    user, 
    handleLogout, 
    isProOrEnterprise 
}: {
    navItems: any[],
    toolsItems: any[],
    managementItems: any[],
    user: any,
    handleLogout: () => void,
    isProOrEnterprise: boolean | undefined
}) => {
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === "collapsed";
    const pathname = usePathname();
    const avatarImage = PlaceHolderImages.find(p => p.id === 'avatar1');

    return (
        <Sidebar collapsible="icon" className="border-r border-border/30 bg-background/60">
            <SidebarHeader className={cn("flex flex-col items-center justify-center transition-all duration-300 relative", isCollapsed ? "p-2 h-[60px]" : "p-4")}>
                 <div className="flex flex-col items-center justify-center w-full relative">
                    <Logo isCollapsed={isCollapsed} className={cn("transition-all duration-300", isCollapsed ? "mb-0" : "mb-2")} />
                    
                    {/* Collapse Button - only visible when expanded */}
                    {!isCollapsed && (
                        <div className="w-full flex justify-end mt-2">
                           <Button
                               variant="ghost"
                               size="icon"
                               className="h-6 w-6 rounded-full hover:bg-accent text-muted-foreground"
                               onClick={toggleSidebar}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    
                    {/* Expand Button (Plus Sign) - only visible when collapsed */}
                    {isCollapsed && (
                        <div className="w-full flex justify-center mt-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-accent text-muted-foreground"
                                onClick={toggleSidebar}
                            >
                                <Plus className="h-5 w-5" />
                            </Button>
                        </div>
                    )}

                    {isProOrEnterprise && !isCollapsed && <Badge variant="pro" className="mt-2 text-[0.6rem] px-1.5 py-0.5 h-auto">Pro</Badge>}
                 </div>
            </SidebarHeader>
            <SidebarContent className="px-2">
                <SidebarMenu>
                  {navItems.map(item => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton 
                            asChild 
                            tooltip={item.label} 
                            isActive={pathname === item.href}
                            className={cn("w-full justify-start hover:bg-accent/50", isCollapsed && "justify-center")}
                        >
                            <Link href={item.href} className="flex items-center gap-2">
                                {item.icon}
                                {!isCollapsed && <span>{item.label}</span>}
                                {!isCollapsed && item.badge && <Badge className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">{item.badge}</Badge>}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarSeparator className="my-2 bg-border/30" />
                  {toolsItems.map(item => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton 
                            asChild 
                            tooltip={item.label} 
                            isActive={pathname === item.href}
                            className={cn("w-full justify-start hover:bg-accent/50", isCollapsed && "justify-center")}
                        >
                            <Link href={item.href} className="flex items-center gap-2">
                                {item.icon}
                                {!isCollapsed && <span>{item.label}</span>}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarSeparator className="my-2 bg-border/30" />
                  {managementItems.map(item => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton 
                            asChild 
                            tooltip={item.label} 
                            isActive={pathname === item.href}
                            className={cn("w-full justify-start hover:bg-accent/50", isCollapsed && "justify-center")}
                        >
                            <Link href={item.href} className="flex items-center gap-2">
                                {item.icon}
                                {!isCollapsed && <span>{item.label}</span>}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className={cn("p-2 flex flex-col gap-2", isCollapsed ? "items-center" : "")}>
                {!isCollapsed && (
                    <div className="mb-2">
                        <NewsWidget />
                    </div>
                )}
                
                {isCollapsed && (
                    <div className="mb-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-accent/50">
                                    {avatarImage ? (
                                        <Image
                                        src={avatarImage.imageUrl}
                                        width={32}
                                        height={32}
                                        alt="User"
                                        className="rounded-full"
                                        />
                                    ) : <User className="h-5 w-5" />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" side="right" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild><Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href="/workstation"><Settings className="mr-2 h-4 w-4" />Workstation</Link></DropdownMenuItem>
                                <DropdownMenuItem>Support</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <div className="px-2 py-1 text-[10px] text-muted-foreground text-center">
                                    v{PLATFORM_VERSION}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
                {!isCollapsed && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 w-full px-2 justify-start hover:bg-accent/50">
                            {avatarImage ? (
                                <Image
                                src={avatarImage.imageUrl}
                                width={32}
                                height={32}
                                alt="User"
                                className="rounded-full"
                                />
                            ) : <User className="h-5 w-5" />}
                            
                            <div className="text-left flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{user?.email?.split('@')[0] || 'Guest'}</div>
                                <div className="text-xs text-muted-foreground truncate">Inspector</div>
                            </div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="top" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/workstation"><Settings className="mr-2 h-4 w-4" />Workstation</Link></DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1 text-[10px] text-muted-foreground text-center">
                            v{PLATFORM_VERSION}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
                )}
            </SidebarFooter>
        </Sidebar>
    );
};

export default function AppShell({ 
  children,
  userId = null,
  isFullScreen = false,
  toggleFullScreen = () => {},
  handleRefresh = () => {},
}: { 
  children: React.ReactNode;
  userId?: string | null;
  isFullScreen?: boolean;
  toggleFullScreen?: () => void;
  handleRefresh?: () => void;
}) {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const currentPlan = mockSubscriptionPlans.find(plan => plan.isCurrent);
  const isProOrEnterprise = currentPlan && (currentPlan.name === 'Pro' || currentPlan.name === 'Enterprise');

  const handleLogout = async () => {
      await logout();
      router.push('/');
  };
  
  const navItems = [
    { href: "/dashboard", icon: <Home className="h-4 w-4" />, label: "Dashboard" },
    { href: "/overview", icon: <FileText className="h-4 w-4" />, label: "Overview Report" },
    { href: "/inspections", icon: <ClipboardList className="h-4 w-4" />, label: "Inspections", badge: "3" },
    { href: "/contractor", icon: <Building2 className="h-4 w-4" />, label: "Contractor" },
    { href: "/docuscribe", icon: <PenLine className="h-4 w-4" />, label: "DocuSCRIBE™" },
    { href: "/calendar", icon: <Calendar className="h-4 w-4" />, label: "Calendar & Scheduling" },
    { href: "/messaging", icon: <MessageSquare className="h-4 w-4" />, label: "Messaging" },
    { href: "/clients", icon: <Users className="h-4 w-4" />, label: "Clients & Contacts" },
    { href: "/teams", icon: <Users className="h-4 w-4" />, label: "Teams & Dispatch" },
    { href: "/conference-rooms", icon: <Video className="h-4 w-4" />, label: "Meetings & Conferences" },
  ];

  const toolsItems = [
    { href: "/weather", icon: <CloudRain className="h-4 w-4" />, label: "Environment & Safety" },
    { href: "/lari-vision", icon: <Eye className="h-4 w-4" />, label: "LARI Vision" },
    { href: "/drone-vision", icon: <Camera className="h-4 w-4" />, label: "Drone Vision" },
    { href: "/library", icon: <Library className="h-4 w-4" />, label: "Standards Library" },
    { href: "/marketplace", icon: <Store className="h-4 w-4" />, label: "Marketplace" },
    { href: "/community", icon: <MessageSquare className="h-4 w-4" />, label: "Community Hub" },
    { href: "/social", icon: <Rss className="h-4 w-4" />, label: "Social Timeline" },
    { href: "/topics", icon: <Hash className="h-4 w-4" />, label: "Topics" },
  ];

  const managementItems = [
    { href: "/workstation", icon: <Cpu className="h-4 w-4" />, label: "Workstation" },
    { href: "/finances", icon: <DollarSign className="h-4 w-4" />, label: "Finances" },
    { href: "/monitor", icon: <Bell className="h-4 w-4" />, label: "LARI-Monitor" },
    { href: "/admin", icon: <Shield className="h-4 w-4" />, label: "Admin" },
    { href: "/admin/notifications", icon: <Bell className="h-4 w-4" />, label: "Notifications Console" },
  ];

  return (
    <ShellLayoutProvider>
      <ScingPanelProvider>
        <SidebarProvider defaultOpen={true} style={{ "--sidebar-width": "16rem", "--sidebar-width-mobile": "20rem" } as React.CSSProperties}>
          <AppSidebarContent 
              navItems={navItems}
              toolsItems={toolsItems}
              managementItems={managementItems}
              user={user}
              handleLogout={handleLogout}
              isProOrEnterprise={isProOrEnterprise}
          />
          
          {/* ─── Shell Composition: SidebarInset + OverHUD as flex siblings ─── */}
          {/* OverHUD is a sibling of SidebarInset so it spans full viewport height
              and pushes the entire inset (header + notification + body) left. */}
          <SidebarInset className="bg-transparent flex-1 min-w-0 relative flex flex-col h-screen">

            {/* ─── Fixed Chrome (never scrolls) ─── */}
            <TopCommandBar 
              userId={user?.uid || null} 
              isFullScreen={isFullScreen}
              toggleFullScreen={toggleFullScreen}
              handleRefresh={handleRefresh}
            />
            <FlashNotificationBar />

            {/* ─── Scrollable body ─── */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <main className={cn(
                "p-4 lg:p-6 transition-all duration-300 mx-auto max-w-full",
                isFullScreen && "p-0 max-w-none"
              )}>
                {children}
              </main>
            </div>

          </SidebarInset>

          {/* ─── OverHUD: Full-height push-layout panel ─── */}
          <OverHUD />
        </SidebarProvider>
      </ScingPanelProvider>
    </ShellLayoutProvider>
  );
}