import { s3, type S3Stats } from "bun";
import { extractPath } from "./lib/request-helpers";
import domains from "./config.json" with { type: "json" };

const server = Bun.serve({
  async fetch(req) {
    const host = req.headers.get("host");
    if (!host) {
      return new Response("No host header found", { status: 400 });
    }

    //@ts-ignore
    const bucket = domains[host];
    if (!bucket) {
      return new Response("Unknown host", { status: 400 });
    }

    const fileKey = extractPath(req.url);
    const file = s3.file(fileKey, { bucket });
    try {
      const stat = await file.stat();

      // Check If-None-Match against current S3 ETag
      const ifNoneMatch = req.headers.get("If-None-Match");
      if (ifNoneMatch === stat.etag) {
        return new Response(null, { status: 304 });
      }
      // Check If-Modified-Since against S3 Last-Modified
      const ifModifiedSince = req.headers.get("If-Modified-Since");
      if (ifModifiedSince && new Date(ifModifiedSince) >= stat.lastModified) {
        return new Response(null, { status: 304 });
      }

      const headers = await getHeaders(stat);
      return new Response(file.stream(), {
        headers,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "S3Error" &&
        "code" in error &&
        error.code === "NoSuchKey"
      ) {
        return new Response(null, { status: 404 });
      }

      console.error(error);
      return new Response(null, { status: 500 });
    }
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);

const WEEK_IN_SECONDS = 7 * 24 * 60 * 60; // 7 days
const DAY_IN_SECONDS = 86400; // 24 hours

async function getHeaders(fileStat: S3Stats): Promise<HeadersInit> {
  const cacheControl = getCacheControl(fileStat.type);

  return {
    "Content-Type": fileStat.type,
    Etag: fileStat.etag,
    "Last-Modified": fileStat.lastModified.toUTCString(),
    "Cache-Control": cacheControl,
  };
}

function getCacheControl(contentType: string): string {
  if (contentType === "text/html") {
    return "public, max-age=0";
  }

  if (
    contentType.match(
      /^(image|video|audio|font|application\/font-|application\/x-font-|text\/css|application\/javascript)/
    )
  ) {
    return `public, max-age=${WEEK_IN_SECONDS}, stale-while-revalidate=${DAY_IN_SECONDS}`;
  }

  /* A typical static site content, there aren't many file types
   * that would fall into this category - we could remove this default and explicitly handle all expected content types above
   */
  return "public, max-age=0, must-revalidate";
}
