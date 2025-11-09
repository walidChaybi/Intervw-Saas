import { auth } from "@/lib/auth";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { redirect, RedirectType } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { PAGE_SEO, BASE_SEO } from "@/lib/seo";

export const metadata: Metadata = {
  ...BASE_SEO,
  title: PAGE_SEO.dashboard.title,
  description: PAGE_SEO.dashboard.description,
  openGraph: {
    ...BASE_SEO.openGraph,
    title: PAGE_SEO.dashboard.title,
    description: PAGE_SEO.dashboard.description,
    url: "/",
  },
  robots: {
    index: false, // Dashboard pages typically shouldn't be indexed
    follow: false,
  },
};

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in", RedirectType.push);
  }
  return <HomeView />;
}
