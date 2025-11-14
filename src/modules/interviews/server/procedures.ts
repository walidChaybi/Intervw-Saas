import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";

import { db } from "@/db";
import { interviews, agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { interviewInsertSchema, interviewUpdateSchema } from "../schemas";

export const interviewRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingInterview] = await db
        .select({
          ...getTableColumns(interviews),
        })
        .from(interviews)
        .where(
          and(
            eq(interviews.id, input.id),
            eq(interviews.userId, ctx.session.user.id),
          ),
        );

      if (!existingInterview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Interview not found",
        });
      }

      return existingInterview;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, search } = input;

      const data = await db
        .select({
          ...getTableColumns(interviews),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
        })
        .from(interviews)
        .innerJoin(agents, eq(interviews.agentId, agents.id))
        .where(
          and(
            eq(interviews.userId, ctx.session.user.id),
            search ? ilike(interviews.name, `%${search}%`) : undefined,
          ),
        )
        .orderBy(desc(interviews.createdAt), desc(interviews.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(interviews)
        .innerJoin(agents, eq(interviews.agentId, agents.id))
        .where(
          and(
            eq(interviews.userId, ctx.session.user.id),
            search ? ilike(interviews.name, `%${search}%`) : undefined,
          ),
        );

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),

    create: protectedProcedure
    .input(interviewInsertSchema)
    .mutation(async ({ input, ctx }) => {

      const [createdInterview] = await db
        .insert(interviews)
        .values({
          ...input,
          userId: ctx.session.user.id,
        })
        .returning();

      return createdInterview;
    }),

    update: protectedProcedure
    .input(interviewUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, agentId } = input;

      const [updatedInterview] = await db
        .update(interviews)
        .set({
          agentId,
        })
        .where(
          and(
            eq(interviews.id, id),
            eq(interviews.userId, ctx.session.user.id),
          ),
        )
        .returning({
          ...getTableColumns(interviews), 
        });

      if (!updatedInterview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Interview not found",
        });
      }

      return updatedInterview;
    }),
});