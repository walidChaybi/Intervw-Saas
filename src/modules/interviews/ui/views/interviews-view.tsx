"use client";

import { useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { DataTable } from "@/components/data-table";
import { DataPagination } from "@/components/data-pagination";
import { EmptyState } from "@/components/empty-state";
import { useTRPC } from "@/trpc/client";

import { useInterviewsFilters } from "../../hooks/use-interviews-filters";
import { columns } from "../components/columns";
import { InterviewGetMany } from "../../types";

const InterviewsView = () => {
  const [filters, setFilters] = useInterviewsFilters();
  const trpc = useTRPC();
  const router = useRouter();

  const { data } = useSuspenseQuery(
    trpc.interviews.getMany.queryOptions({
      ...filters,
    })
  );

  useEffect(() => {
    if (!data?.items?.length) return;

    data.items.slice(0, 5).forEach((interview) => {
      router.prefetch(`/interviews/${interview.id}`);
    });
  }, [data, router]);

  const handleRowClick = (interview: InterviewGetMany) => {
    router.push(`/interviews/${interview.id}`);
  };

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
      <DataTable
        columns={columns}
        data={data.items}
        onRowClick={handleRowClick}
      />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
    </div>
  );
};

export default InterviewsView;
