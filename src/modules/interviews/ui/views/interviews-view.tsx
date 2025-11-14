"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/data-table";
import { DataPagination } from "@/components/data-pagination";
import { EmptyState } from "@/components/empty-state";
import { useTRPC } from "@/trpc/client";

import { useInterviewsFilters } from "../../hooks/use-interviews-filters";
import { columns } from "../components/columns";

const InterviewsView = () => {
  const [filters, setFilters] = useInterviewsFilters();
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.interviews.getMany.queryOptions({
      ...filters,
    })
  );

  if (!data || data.items.length === 0) {
    return (
      <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
        <EmptyState
          image="/empty.png"
          title="No interviews yet"
          description="Get started by creating your first interview."
        />
      </div>
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

export default InterviewsView;
