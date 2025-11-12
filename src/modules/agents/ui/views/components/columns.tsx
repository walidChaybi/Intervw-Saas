"use client";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { AgentGetMany } from "@/modules/agents/types";
import { ColumnDef } from "@tanstack/react-table";
import { CornerDownRightIcon, VideoIcon } from "lucide-react";

export const columns: ColumnDef<AgentGetMany>[] = [
  {
    accessorKey: "name",
    header: "Agent name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar
              seed={row.original.name}
              variant="botttsNeutral"
              className="size-6"
            />
            <span className="font-semibold capitalize">
              {row.original.name}
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <CornerDownRightIcon className="size-3" />
            <span className="text-sm text-muted-foreground max-w-[200px] truncate">
              {row.original.instructions}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "meetingCount",
    header: "Meetings",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="flex items-center gap-x-2">
          <VideoIcon className="text-blue-700" />5 meetings
        </Badge>
      );
    },
  },
];
