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
import { InterviewStatus } from "../types";

export const interviewRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingInterview] = await db
        .select({
          ...getTableColumns(interviews),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
        })
        .from(interviews)
        .innerJoin(agents, eq(interviews.agentId, agents.id))
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
        agentId: z.string().nullish(),
        status: z.enum([InterviewStatus.UPCOMING, InterviewStatus.ACTIVE, InterviewStatus.COMPLETED, InterviewStatus.CANCELLED, InterviewStatus.PROCESSING]).nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, search, status, agentId, } = input;

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
            status ? eq(interviews.status, status) : undefined,
            agentId ? eq(interviews.agentId, agentId) : undefined,
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
            status ? eq(interviews.status, status) : undefined,
            agentId ? eq(interviews.agentId, agentId) : undefined,
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
      const { id, agentId, name } = input;

      const [updatedInterview] = await db
        .update(interviews)
        .set({
          agentId,
          name,
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

    remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      const [removedInterview] = await db
        .delete(interviews)
        .where(
          and(
            eq(interviews.id, id),
            eq(interviews.userId, ctx.session.user.id),
          ),
        )
        .returning({
          ...getTableColumns(interviews), 
        });

      if (!removedInterview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Interview not found",
        });
      }

      return removedInterview;
    }),
});