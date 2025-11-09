"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export const HomeView = () => {
  const { data: session } = authClient.useSession();

  return (
    <div>
      <p>logged in as {session?.user?.email}</p>
      <Button
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                redirect("/sign-in");
              },
              onError: () => {
                toast.error("Failed to sign out");
              },
            },
          })
        }
      >
        Sign Out
      </Button>
    </div>
  );
};
