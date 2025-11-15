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
import { streamVideo } from "@/lib/stream-video";
import { generateAvatarUri } from "@/lib/avatar";

export const interviewRouter = createTRPCRouter({

  generateToken: protectedProcedure
    .mutation(async ({ ctx }) => {
      await streamVideo.upsertUsers([{
        id: ctx.session.user.id,
        name: ctx.session.user.name,
        role : "admin",
        image: ctx.session.user.image ?? generateAvatarUri({ seed: ctx.session.user.name, variant: "initials" }),
      }]);

      const expirationTime = Math.floor( Date.now() / 1000 ) + 60 * 60 ; // 30 days
      const issuedAt = Math.floor( Date.now() / 1000 ) - 60;

      const token = streamVideo.generateUserToken( {
        user_id: ctx.session.user.id,
        expiration_time: expirationTime,
        validity_in_seconds: issuedAt 
      }); 

      return token;
    }),


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

        const call = streamVideo.video.call("default", createdInterview.id);
        await call.create({
          data: { 
            created_by_id : ctx.session.user.id,
            custom : {
              interviewId: createdInterview.id,
              interviewName: createdInterview.name,
            },
            settings_override: {
              transcription :{
                language: "en",
                mode: "auto-on",
                closed_caption_mode: "auto-on",
                
              },
              recording : {
                mode: "auto-on",
                quality: "1080p",
              },
            }
          }
        });

        const [existingAgent] = await db
          .select()
          .from(agents)
          .where(eq(agents.id, createdInterview.agentId));

          if (!existingAgent) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Agent not found",
            });
          }

          await streamVideo.upsertUsers([
            {
              id: existingAgent.id,
              name: existingAgent.name,
              role: "user",
              image: generateAvatarUri({ seed: existingAgent.name, variant: "botttsNeutral" }),
            }
          ])

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