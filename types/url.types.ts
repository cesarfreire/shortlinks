import { link } from "fs";
import { z } from "zod";

export const urlSchema = z.object({
  url: z.string().url(),
});

export type UrlSchema = z.infer<typeof urlSchema>;

export interface ShortlinkParam {
  shortLink: string;
}

export const shortlinkSchema = z.object({
  url: z.string().url(),
  shortUrl: z.string(),
  createdAt: z.date(),
  accessCount: z.number().default(0),
});

export type Shortlink = z.infer<typeof shortlinkSchema>;
