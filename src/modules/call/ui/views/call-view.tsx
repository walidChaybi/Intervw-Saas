"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { ErrorState } from "@/components/error-state";

interface Props {
  interviewId: string;
}

export const CallView = ({ interviewId }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.interviews.getOne.queryOptions({ id: interviewId })
  );

  if (data.status === "completed") {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorState
          title="Meeting has ended"
          description="You can no longer join this meeting"
        />
      </div>
    );
  }

  return <div>{JSON.stringify(data)}</div>;
};
