import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { agentInsertSchema } from "../schemas";
import z from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

export const agentRouter = createTRPCRouter({

    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({input}) => {
        const [existingAgent] = await db.select({
            meetingCount: sql<number>`5`,
            ...getTableColumns(agents),
        }).from(agents).where(eq(agents.id, input.id))

        return existingAgent;
    }),
    getMany: protectedProcedure
    .input(z.object({
        page: z.number().min(1).default(DEFAULT_PAGE),
        pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
    }))
    .query(async ({input, ctx}) => {
        const { page, pageSize, search } = input;
        const data = await db.select({
            meetingCount: sql<number>`5`,
            ...getTableColumns(agents),
        }).from(agents)
        .where(and(
            eq(agents.userId, ctx.session.user.id),
            input.search ? ilike(agents.name, `%${input.search}%`) : undefined,
        ))
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);
        const [total] = await db.select({ count: count() }).from(agents).where(and(
            eq(agents.userId, ctx.session.user.id),
            input.search ? ilike(agents.name, `%${input.search}%`) : undefined,
        ));

        const totalPages = Math.ceil(total.count / pageSize);
        return {
            items: data,
            totalPages,
            total: total.count,
        }
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