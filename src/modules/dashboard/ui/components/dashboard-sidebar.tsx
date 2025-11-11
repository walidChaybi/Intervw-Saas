"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  VideoIcon,
  BotIcon,
  StarIcon,
  CreditCardIcon,
  PanelLeftCloseIcon,
  PanelLeftIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DashboardUserButton } from "./dashboard-user-button";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const firstSection = [
  {
    icon: VideoIcon,
    label: "Interviews",
    href: "/interviews",
  },
  {
    icon: BotIcon,
    label: "Agents",
    href: "/agents",
  },
];

const secondSection = [
  {
    icon: StarIcon,
    label: "Upgrade",
    href: "/upgrade",
  },
  {
    icon: CreditCardIcon,
    label: "Billing",
    href: "/billing",
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const { state, toggleSidebar, isMobile, open, setOpenMobile } = useSidebar();
  const [isHoveringHeader, setIsHoveringHeader] = useState(false);

  const isCollapsed = state === "collapsed" || !open;

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, pathname, setOpenMobile]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="text-sidebar-accent-foreground">
        <div
          className={cn(
            "relative flex items-center px-2 py-3 transition-all duration-200",
            !isMobile && "group",
            isCollapsed ? "justify-center" : "justify-between"
          )}
          onMouseEnter={() => setIsHoveringHeader(true)}
          onMouseLeave={() => setIsHoveringHeader(false)}
        >
          {/* Logo - changes based on collapsed state */}
          {isCollapsed ? (
            <button
              type="button"
              onClick={toggleSidebar}
              className={cn(
                "flex items-center justify-center gap-2 transition-all duration-200 w-9 h-9 rounded-lg shrink-0 bg-white/10 p-1"
              )}
              aria-label="Expand sidebar"
              style={{ cursor: "e-resize" }}
            >
              {isHoveringHeader ? (
                <PanelLeftIcon className="size-5 text-white" />
              ) : (
                <Image
                  src={"/intervw_mini.webp"}
                  alt="Logo"
                  width={180}
                  height={90}
                  className="transition-all duration-200"
                />
              )}
            </button>
          ) : (
            <Link
              href={"/"}
              className="flex items-center gap-2 transition-all duration-200"
              aria-label="Intervw home"
            >
              <Image
                src={"/ai_interview_prepare.webp"}
                alt="Logo"
                width={180}
                height={90}
                className="transition-all duration-200"
              />
            </Link>
          )}

          {/* Toggle button - shows on hover when collapsed, always visible when expanded */}
          {!isMobile && !isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "size-9 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 shrink-0",
                isCollapsed && "absolute right-2 top-1/2 -translate-y-1/2"
              )}
              onClick={toggleSidebar}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              style={{
                cursor: isCollapsed ? "e-resize" : "w-resize",
              }}
            >
              <PanelLeftCloseIcon className="size-4" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      <div className="px-4 py-2">
        <Separator className="opacity-10 text-[#5D6B68]" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      className={cn(
                        "group relative h-10 border border-transparent px-3 text-white/75 hover:text-white/90 transition-all duration-200 hover:border-[#5D6B68]/10 hover:bg-linear-to-r/oklch from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50 data-[active=true]:text-white/90 data-[active=true]:hover:text-white",
                        isActive &&
                          "bg-linear-to-r/oklch border-[#5D6B68]/10 before:absolute before:inset-y-1 before:left-0 before:w-1 before:rounded-full before:bg-[#39ff14] before:shadow-[0_0_12px_3px_rgba(57,255,20,0.45)]"
                      )}
                      isActive={isActive}
                    >
                      <Link
                        href={item.href}
                        className="flex w-full items-center gap-3 text-sm font-medium tracking-tight text-white/80 transition-colors duration-200 group-data-[active=true]:text-white/95"
                      >
                        <item.icon className="size-5 text-white/80 transition-colors duration-200 group-data-[active=true]:text-white" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 py-2">
          <Separator className="opacity-10 text-[#5D6B68]" />
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      className={cn(
                        "group relative h-10 border border-transparent px-3 text-white/75 hover:text-white/90 transition-all duration-200 hover:border-[#5D6B68]/10 hover:bg-linear-to-r/oklch from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50 data-[active=true]:text-white/90 data-[active=true]:hover:text-white",
                        isActive &&
                          "bg-linear-to-r/oklch border-[#5D6B68]/10 before:absolute before:inset-y-1 before:left-0 before:w-1 before:rounded-full before:bg-[#39ff14] before:shadow-[0_0_12px_3px_rgba(57,255,20,0.45)]"
                      )}
                      isActive={isActive}
                    >
                      <Link
                        href={item.href}
                        className="flex w-full items-center gap-3 text-sm font-medium tracking-tight text-white/80 transition-colors duration-200 group-data-[active=true]:text-white/95"
                      >
                        <item.icon className="size-5 text-white/80 transition-colors duration-200 group-data-[active=true]:text-white" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="text-white">
        {!isCollapsed && <DashboardUserButton />}
      </SidebarFooter>
    </Sidebar>
  );
};
