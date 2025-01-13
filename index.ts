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

async function getHeaders(file: S3File): Promise<HeadersInit> {
  const stat = await file.stat();
  return {
    "Content-Type": file.type,
    "Content-Length": stat.size.toString(),
    Etag: stat.etag,
    "Last-Modified": stat.lastModified.toUTCString(),
  };
}
