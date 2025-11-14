"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

const InterviewsView = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.interviews.getMany.queryOptions({}));

  return <div>{JSON.stringify(data)}</div>;
};

export default InterviewsView;
