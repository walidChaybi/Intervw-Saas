"use client";

import { JSX, useState } from "react";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/responsive-dialog";

export const useConfirm = (
  title: string,
  description: string,
): [() => JSX.Element, () => Promise<boolean>] => {
  const [resolver, setResolver] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise<boolean>((resolve) => {
      setResolver({ resolve });
    });
  };

  const handleClose = () => {
    setResolver(null);
  };

  const handleConfirm = () => {
    resolver?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    resolver?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <ResponsiveDialog
      open={resolver !== null}
      onOpenChange={handleClose}
      title={title}
      description={description}
    >
      <div className="flex w-full flex-col-reverse items-center justify-end gap-y-2 pt-4 lg:flex-row lg:gap-x-2">
        <Button
          onClick={handleCancel}
          variant="outline"
          className="w-full lg:w-auto"
        >
          Cancel
        </Button>
        <Button onClick={handleConfirm} className="w-full lg:w-auto">
          Confirm
        </Button>
      </div>
    </ResponsiveDialog>
  );

  return [ConfirmationDialog, confirm];
};

