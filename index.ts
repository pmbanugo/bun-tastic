import { s3, type S3File } from "bun";
import { extractPath } from "./lib/request-helpers";
import domains from "./config.json" assert { type: "json" };

const server = Bun.serve({
  async fetch(req) {
    const host = req.headers.get("host");
    if (!host) {
      return new Response("No host header found", {
        status: 400,
      });
    }

    //@ts-ignore
    const bucket = domains[host];
    if (!bucket) {
      return new Response("Unknown host", {
        status: 400,
      });
    }

    const fileKey = extractPath(req.url);
    const file = s3(fileKey, {
      bucket,
    });

    const headers = await getHeaders(file);
    return new Response(file.stream(), {
      headers,
    });
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);

const WEEK_IN_SECONDS = 7 * 24 * 60 * 60; // 7 days
const DAY_IN_SECONDS = 86400; // 24 hours

async function getHeaders(file: S3File): Promise<HeadersInit> {
  const stat = await file.stat();
  const cacheControl = getCacheControl(stat.type);

  return {
    "Content-Type": stat.type,
    "Content-Length": stat.size.toString(),
    Etag: stat.etag,
    "Last-Modified": stat.lastModified.toUTCString(),
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
