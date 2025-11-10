"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BotIcon,
  CalendarCheck2Icon,
  PanelLeftIcon,
  VideoIcon,
} from "lucide-react";

import {
  CommandResponsiveDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";

interface DashboardCommandProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const interviewShortcuts = [
  {
    label: "All interviews",
    href: "/interviews",
    icon: VideoIcon,
  },
  {
    label: "Schedule new interview",
    href: "/interviews/new",
    icon: CalendarCheck2Icon,
  },
];

const agentShortcuts = [
  {
    label: "All agents",
    href: "/agents",
    icon: BotIcon,
  },
  {
    label: "Create agent",
    href: "/agents/new",
    icon: PanelLeftIcon,
  },
];

export const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const handleSelect = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <CommandResponsiveDialog open={open} onOpenChange={setOpen} shouldFilter>
      <CommandInput
        placeholder="Find an interview or agent..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Interviews">
          {interviewShortcuts.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => handleSelect(item.href)}
            >
              <item.icon className="size-5" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Agents">
          {agentShortcuts.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => handleSelect(item.href)}
            >
              <item.icon className="size-5" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandResponsiveDialog>
  );
};
