import { auth } from "@/lib/auth";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { PAGE_SEO, BASE_SEO } from "@/lib/seo";

export const metadata: Metadata = {
  ...BASE_SEO,
  title: PAGE_SEO.signIn.title,
  description: PAGE_SEO.signIn.description,
  openGraph: {
    ...BASE_SEO.openGraph,
    title: PAGE_SEO.signIn.title,
    description: PAGE_SEO.signIn.description,
    url: "/sign-in",
  },
  alternates: {
    canonical: "/sign-in",
  },
};

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return <SignInView />;
};

export default Page;
