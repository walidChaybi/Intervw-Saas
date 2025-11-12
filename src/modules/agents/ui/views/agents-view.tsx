"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { EmptyState } from "@/components/empty-state";
import { Bot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewAgentDialog } from "./components/new-agent-dialog-context";

export const AgentsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());
  const { openDialog } = useNewAgentDialog();

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No agents yet"
        description="Get started by creating your first AI agent. Agents can help you with interviews, practice sessions, and more."
        icon={<Bot className="size-9 text-primary/60" strokeWidth={2.2} />}
        action={
          <Button onClick={openDialog} className="gap-2">
            <Plus className="size-4" />
            Create Your First Agent
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable columns={columns} data={data} />
    </div>
  );
};
