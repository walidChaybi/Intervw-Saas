import React, { Suspense } from "react";
import { AgentsView } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorState } from "@/components/error-state";
import AgentsListHeader from "@/modules/agents/ui/views/components/agents-list-header";
import { NewAgentDialogProvider } from "@/modules/agents/ui/views/components/new-agent-dialog-context";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect, RedirectType } from "next/navigation";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/modules/agents/params";

interface props {
  searchParams: Promise<SearchParams>;
}

const AgentsPage = async ({ searchParams }: props) => {
  const filters = await loadSearchParams(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in", RedirectType.push);
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    })
  );

  return (
    <NewAgentDialogProvider>
      <AgentsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense
          fallback={
            <LoadingState title="Loading" description="Loading agents" />
          }
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
    </NewAgentDialogProvider>
  );
};

export default AgentsPage;
