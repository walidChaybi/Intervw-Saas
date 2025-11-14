"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";

const InterviewsView = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.interviews.getMany.queryOptions({}));

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      {data.items.length === 0 ? (
        <EmptyState
          image="/empty.png"
          title="No interviews yet"
          description="Get started by creating your first interview."
        />
      ) : (
        <DataTable columns={columns} data={data.items} />
      )}
    </div>
  );
};

export default InterviewsView;
