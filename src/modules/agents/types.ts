import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type AgentGetOne = NonNullable<inferRouterOutputs<AppRouter>["agents"]["getOne"]>;
export type AgentGetMany = NonNullable<inferRouterOutputs<AppRouter>["agents"]["getMany"]>["items"][number];