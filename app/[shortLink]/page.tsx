import { ShortlinkParam } from "@/types/url.types";
import clientPromise from "@/lib/mongodb";
import { redirect } from "next/navigation";

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

  // If the shortlink exists, redirect to the original url
  if (shortlink) {
    const originalUrl = shortlink.url;

    // Redirect to the original url
    if (originalUrl) {
      // Increment the access count
      await db
        .collection("links")
        .updateOne({ shortUrl: shortlinkUrl }, { $inc: { accessCount: 1 } });
      // Redirect to the original url
      redirect(originalUrl);
    } else {
      return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
          <h1 className="text-2xl font-bold">Shortlink not found.</h1>
        </div>
      );
    }
  }
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <h1 className="text-2xl font-bold">Shortlink not found.</h1>
      <p className="text-lg text-muted-foreground text-center max-w-md">
        The shortlink you tried to access does not exist or has expired. Create
        a new link and share it with your friends!
      </p>
      <p className="text-sm text-muted-foreground">
        You will be redirected to the home page.
      </p>

      {/* Redirecionamento automático para a home */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            setTimeout(() => {
              window.location.href = "/";
            }, 5000);
          `,
        }}
      />
    </div>
  );
}
