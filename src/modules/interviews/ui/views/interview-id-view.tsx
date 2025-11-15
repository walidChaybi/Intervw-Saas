"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { InterviewIdViewHeader } from "../components/interview-id-view-header";
import { useConfirm } from "@/hooks/use-confirm";
import { EditInterviewDialog } from "../components/edit-interview-dialog";
import { ActiveState } from "../components/active-state";
import { CompletedState } from "../components/completed-state";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";
import { UpcomingState } from "../components/upcoming-state";

interface Props {
  interviewId: string;
}

export const InterviewIdView = ({ interviewId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    "The following action will remove this interview"
  );

  const removeInterview = useMutation(
    trpc.interviews.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.interviews.getMany.queryOptions({})
        );
        router.push("/interviews");
      },
    })
  );

  const handleRemoveInterview = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    await removeInterview.mutateAsync({ id: interviewId });
  };

  const { data } = useSuspenseQuery(
    trpc.interviews.getOne.queryOptions({ id: interviewId })
  );

  const isActive = data.status === "active";
  const isCompleted = data.status === "completed";
  const isCancelled = data.status === "cancelled";
  const isProcessing = data.status === "processing";
  const isUpcoming = data.status === "upcoming";

  return (
    <>
      <EditInterviewDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        interview={data}
      />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <RemoveConfirmation />
        <InterviewIdViewHeader
          interviewId={interviewId}
          interviewName={data.name}
          onEdit={() => setIsEditOpen(true)}
          onRemove={handleRemoveInterview}
        />
        {isActive && <ActiveState interviewId={interviewId} />}
        {isCompleted && <CompletedState data={data} />}
        {isCancelled && <CancelledState />}
        {isProcessing && <ProcessingState interviewId={interviewId} />}
        {isUpcoming && <UpcomingState interviewId={interviewId} />}
      </div>
    </>
  );
};
