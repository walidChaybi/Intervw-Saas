"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { columns } from "./components/columns";
import { EmptyState } from "@/components/empty-state";
import { useNewAgentDialog } from "./components/new-agent-dialog-context";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { DataPagination } from "@/components/data-pagination";
import DataTable from "@/components/data-table";

export const AgentsView = () => {
  const [filters, setFilters] = useAgentsFilters();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    })
  );
  const { openDialog } = useNewAgentDialog();

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        image="/empty.png"
        title="No agents yet"
        description="Get started by creating your first AI agent. Agents can help you with interviews, practice sessions, and more."
      />
    );
  }

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable columns={columns} data={data.items} />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
    </div>
  );
};
