"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface NewAgentDialogContextValue {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  setIsOpen: (open: boolean) => void;
}

const NewAgentDialogContext = createContext<NewAgentDialogContextValue | null>(
  null
);

export const useNewAgentDialog = () => {
  const context = useContext(NewAgentDialogContext);
  if (!context) {
    throw new Error(
      "useNewAgentDialog must be used within NewAgentDialogProvider"
    );
  }
  return context;
};

export const NewAgentDialogProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NewAgentDialogContext.Provider
      value={{
        isOpen,
        openDialog: () => setIsOpen(true),
        closeDialog: () => setIsOpen(false),
        setIsOpen,
      }}
    >
      {children}
    </NewAgentDialogContext.Provider>
  );
};
