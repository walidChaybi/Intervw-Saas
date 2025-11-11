import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { agentInsertSchema } from "../schemas";
import z from "zod";
import { eq } from "drizzle-orm";

export const agentRouter = createTRPCRouter({

    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({input}) => {
        const [existingAgent] = await db.select().from(agents).where(eq(agents.id, input.id));

        return existingAgent;
    }),
    getMany: protectedProcedure.query(async () => {
        const data = await db.select().from(agents);

        return data;
    }),
    create : protectedProcedure.input(agentInsertSchema).mutation(async ({ input, ctx }) => {
        const { name, instructions } = input;
        const [createdAgent] = await db.insert(agents).values({
            name,
            instructions,
            userId: ctx.session.user.id,
        }).returning();
        return createdAgent;
    }),
});