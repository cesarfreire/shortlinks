import { ShortlinkParam } from "@/types/url.types";
import clientPromise from "@/lib/mongodb";
import { redirect, notFound } from "next/navigation";

export default async function RedirectShortlinkPage({
  params,
}: {
  params: Promise<ShortlinkParam>;
}) {
  const { shortLink } = await params;
  // Create url with prefix
  const prefix = process.env.APP_URL;
  const shortlinkUrl = `${prefix}/${shortLink}`;

  // Get the shortlink from the database
  const client = await clientPromise;
  const db = client.db("shortlinks");
  const shortlink = await db
    .collection("links")
    .findOne({ shortUrl: shortlinkUrl });

  // If the shortlink does not exist, return a 404
  if (!shortlink || !shortlink.url) {
    notFound();
  }

  // Increment the access count
  await db
    .collection("links")
    .updateOne({ shortUrl: shortlinkUrl }, { $inc: { accessCount: 1 } });

  // Redirect to the original URL
  redirect(shortlink.url);
}
