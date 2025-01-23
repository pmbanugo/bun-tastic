import { S3Client } from "bun";
import { basename } from "path";
import { readdir } from "node:fs/promises";

interface UploadOptions {
  file?: string;
  dir?: string;
  region?: string;
  "access-key-id"?: string;
  "secret-access-key"?: string;
  endpoint?: string;
}

export async function upload(bucket: string, opts: UploadOptions) {
  if (!opts.file && !opts.dir) {
    console.error("Either --file or --dir must be specified");
    process.exit(1);
  }

  const client = new S3Client({
    bucket: bucket,
    region: opts.region,
    accessKeyId: opts["access-key-id"],
    secretAccessKey: opts["secret-access-key"],
    endpoint: opts.endpoint,
  });

  // File takes precedence
  if (opts.file) {
    const key = basename(opts.file);
    // TODO: handle errors, especially if file doesn't exist
    await client.write(key, Bun.file(opts.file));
    console.log(`✓ Uploaded ${key}  to ${bucket}`);
    return;
  }

  if (opts.dir) {
    // Handle recursive directory upload
    const directoryContent = await readdir(opts.dir, {
      recursive: true,
      withFileTypes: true,
    });

    const files = directoryContent.reduce((acc: string[], dirent) => {
      if (dirent.isFile()) {
        acc.push(
          dirent.parentPath
            ? dirent.parentPath + "/" + dirent.name
            : dirent.name
        );
      }
      return acc;
    }, []);

    //TODO: upload more concurrently if file is more than 5 or 10
    for (const file of files) {
      await client.write(file, Bun.file(file));
      console.log(`✓ Uploaded ${file} to ${bucket}`);
    }

    console.log(`Uploaded ${files.length} files to ${bucket}`);
    return;
  }
}
