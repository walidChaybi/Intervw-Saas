import React, { Suspense } from "react";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import {
  AgentIdView,
  AgentIdViewError,
  AgentIdViewLoading,
} from "@/modules/agents/ui/views/agent-id-view";

interface AgentIdPageProps {
  params: Promise<{ agentId: string }>;
}

const AgentIdPage = async ({ params }: AgentIdPageProps) => {
  const { agentId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in", RedirectType.push);
  }

  const queryClient = getQueryClient();

  try {
    await queryClient.ensureQueryData(
      trpc.agents.getOne.queryOptions({ id: agentId })
    );
  } catch (error) {
    const errorCode =
      typeof error === "object" && error !== null && "data" in error
        ? (error as { data?: { code?: string } }).data?.code
        : undefined;

    if (errorCode === "NOT_FOUND") {
      redirect("/agents", RedirectType.push);
    }

    throw error;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentIdViewLoading />}>
        <ErrorBoundary fallback={<AgentIdViewError />}>
          <AgentIdView agentId={agentId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default AgentIdPage;

