import { useMemo } from "react";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { InterviewForm } from "./interview-form";
import { InterviewGetOne } from "../../types";

interface EditInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview?: InterviewGetOne;
}

export const EditInterviewDialog = ({
  open,
  onOpenChange,
  interview,
}: EditInterviewDialogProps) => {
  const initialValues = useMemo(() => interview, [interview]);

  return (
    <ResponsiveDialog
      title="Edit Interview"
      description="Update the interview details"
      open={open}
      onOpenChange={onOpenChange}
    >
      {initialValues ? (
        <InterviewForm
          initialValues={initialValues}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      ) : null}
    </ResponsiveDialog>
  );
};
