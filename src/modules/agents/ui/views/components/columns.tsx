"use client";

import Link from "next/link";
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
        <Link
          href={`/agents/${row.original.id}`}
          className="group flex flex-col gap-y-1 rounded-md px-1 py-1 transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
        >
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar
              seed={row.original.name}
              variant="botttsNeutral"
              className="size-6"
            />
            <span className="font-semibold capitalize group-hover:underline">
              {row.original.name}
            </span>
          </div>
          <div className="flex items-center gap-x-2 text-muted-foreground">
            <CornerDownRightIcon className="size-3" />
            <span className="text-sm max-w-[200px] truncate">
              {row.original.instructions}
            </span>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "interviewCount",
    header: "Interviews",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="flex items-center gap-x-2">
          <VideoIcon className="text-blue-700" />
          {row.original.interviewCount}{" "}
          {row.original.interviewCount === 1 ? "interview" : "interviews"}
        </Badge>
      );
    },
  },
];
