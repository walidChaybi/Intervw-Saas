import { ResponsiveDialog } from "@/components/responsive-dialog";
import { InterviewForm } from "./interview-form";
import { useRouter } from "next/navigation";

interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewMeetingDialog = ({
  open,
  onOpenChange,
}: NewMeetingDialogProps) => {
  const router = useRouter();

  const handleSuccess = (id: string) => {
    router.push(`/interviews/${id}`);
  };

  const handleCancel = () => {
    router.push("/interviews");
    onOpenChange(false);
  };
  return (
    <ResponsiveDialog
      title="New Interview"
      description="Create a new interview"
      open={open}
      onOpenChange={onOpenChange}
    >
      <InterviewForm
        onSuccess={(id) => router.push(`/interviews/${id}`)}
        onCancel={handleCancel}
      />
    </ResponsiveDialog>
  );
};
