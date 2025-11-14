import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type InterviewGetOne = NonNullable<inferRouterOutputs<AppRouter>["interviews"]["getOne"]>;
export type InterviewGetMany = NonNullable<inferRouterOutputs<AppRouter>["interviews"]["getMany"]>["items"][number];
export enum InterviewStatus {
  UPCOMING = "upcoming",
  ACTIVE = "active",
  COMPLETED = "completed",
  PROCESSING = "processing",
  CANCELLED = "cancelled",
}