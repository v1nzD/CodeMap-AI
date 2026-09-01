import { z } from "zod";

export const createRepositorySchema = z.object({
  owner: z.string().min(1, "Owner is required"),
  name: z.string().min(1, "Repository name is required"),
  url: z.string().url("Invalid repository URL"),
});
