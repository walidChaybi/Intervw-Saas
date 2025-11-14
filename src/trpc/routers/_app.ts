import { agentRouter } from '@/modules/agents/server/procedures';
import { createTRPCRouter } from '../init';
import { interviewRouter } from '@/modules/interviews/server/procedures';


export const appRouter = createTRPCRouter({
  agents: agentRouter,
  interviews: interviewRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;