import { z } from "zod";

export const interviewInsertSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  agentId: z.string().min(1, { message: "Agent ID is required" }),
});

export const interviewUpdateSchema = interviewInsertSchema.extend({
  id: z.string()
    .min(1, { message: "ID is required" }),
});