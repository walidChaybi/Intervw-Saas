"use client";

import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { DashboardCommand } from "./dashboard-command";

export const DashboardNavbar = () => {
  const [commandOpen, setCommandOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(window.navigator.platform.toLowerCase().includes("mac"));

    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <nav className="flex items-center gap-2 border-b bg-background px-4 py-3">
        <SidebarTrigger className="md:hidden" />
        <Button
          className="h-9 w-[240px] justify-start gap-2 font-normal text-muted-foreground hover:text-muted-foreground"
          variant="outline"
          size="sm"
          onClick={() => setCommandOpen((open) => !open)}
        >
          <SearchIcon className="size-4" />
          Search
          <kbd className="ml-auto inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-md font-medium text-muted-foreground">
            <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
          </kbd>
        </Button>
      </nav>
    </>
  );
};
