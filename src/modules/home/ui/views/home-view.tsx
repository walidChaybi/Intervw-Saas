"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const HomeView = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  return <div></div>;
};
