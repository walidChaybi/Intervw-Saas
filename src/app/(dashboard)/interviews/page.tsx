import InterviewsView from "@/modules/interviews/ui/views/interviews-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { LoadingState } from "@/components/loading-state";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorState } from "@/components/error-state";

const InterviewsPage = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.interviews.getMany.queryOptions({}));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="Loading interviews"
            description="Please wait while we load the interviews"
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Error loading interviews"
              description="Please try again later"
            />
          }
        >
          <InterviewsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default InterviewsPage;
