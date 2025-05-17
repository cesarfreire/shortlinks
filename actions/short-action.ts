"use server";

import clientPromise from "@/lib/mongodb";
import { actionClient } from "@/lib/safe-action";
import { Shortlink, urlSchema } from "@/types/url.types";

export const createShortlinkAction = actionClient
  .schema(urlSchema)
  .action(async (formData) => {
    const { url } = urlSchema.parse(formData.parsedInput);
    try {
      const client = await clientPromise;
      const db = client.db("shortlinks");

      // Create a new shortlink
      const prefix = process.env.APP_URL || "https://cesarfreire.me";
      const newLink: Shortlink = {
        url,
        shortUrl: `${prefix}/${Math.random().toString(36).substring(2, 8)}`,
        createdAt: new Date(),
        accessCount: 0,
      };

      // Insert the new shortlink into the database
      await db.collection("links").insertOne(newLink);

      // Return the new shortlink
      return {
        success: true,
        message: "Shortlink created!",
        shortUrl: JSON.parse(JSON.stringify(newLink)),
      };
    } catch (error) {
      console.error("Error creating shortlink:", error);
      return {
        success: false,
        message: "Error creating shortlink",
        shortUrl: null,
      };
    }
  });
