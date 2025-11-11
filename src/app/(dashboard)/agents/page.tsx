import React, { Suspense } from "react";
import { AgentsView } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorState } from "@/components/error-state";

const AgentsPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={<LoadingState title="Loading" description="Loading agents" />}
      >
        <ErrorBoundary
          fallback={
            <ErrorState title="Error" description="Error loading agents" />
          }
        >
          <AgentsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default AgentsPage;
