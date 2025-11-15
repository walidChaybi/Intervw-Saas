import { EmptyState } from "@/components/empty-state";

interface Props {
  interviewId: string;
}

export const ProcessingState = ({ interviewId }: Props) => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        image="/processing.svg"
        title="Interview processing"
        description="This interview is being processed, a summary will appear soon"
      />
    </div>
  );
};
