import { auth } from "@/lib/auth";
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { PAGE_SEO, BASE_SEO } from "@/lib/seo";

export const metadata: Metadata = {
  ...BASE_SEO,
  title: PAGE_SEO.signUp.title,
  description: PAGE_SEO.signUp.description,
  openGraph: {
    ...BASE_SEO.openGraph,
    title: PAGE_SEO.signUp.title,
    description: PAGE_SEO.signUp.description,
    url: "/sign-up",
  },
  alternates: {
    canonical: "/sign-up",
  },
};

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }
  return <SignUpView />;
};

export default Page;
