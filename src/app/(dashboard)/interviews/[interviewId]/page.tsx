import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RedirectType } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { InterviewIdView } from "@/modules/interviews/ui/views/interview-id-view";
interface Props {
  params: Promise<{
    interviewId: string;
  }>;
}

const InterviewIdPage = async ({ params }: Props) => {
  const { interviewId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in", RedirectType.push);
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.interviews.getOne.queryOptions({ id: interviewId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState title="Loading" description="Loading interview" />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState title="Error" description="Error loading interview" />
          }
        >
          <InterviewIdView interviewId={interviewId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default InterviewIdPage;
