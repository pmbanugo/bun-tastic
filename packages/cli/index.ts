#!/usr/bin/env bun

import sade from "sade";
import { upload } from "./commands/upload";
import pkg from "./package.json" with { type: "json" };

const prog = sade("buntastic");

prog
    //@ts-ignore
  .version(pkg.version)
  .example("upload react-site --dir build")
  .command("upload <bucket>", "Upload files to S3", { default: true })
  .option("--file", "Single file to upload")
  .option("--dir", "Directory to upload recursively")
  .option("--region", "AWS region")
  .option("--endpoint", "S3 endpoint/url")
  .option("--access-key-id", "AWS access key ID")
  .option("--secret-access-key", "AWS secret access key")
  .example("upload react-site --dir build --access-key-id $AWS_ACCESS_KEY_ID --secret-access-key $AWS_SECRET_ACCESS_KEY --region $S3_URL --region $AWS_REGION")
  .action(upload);

prog.parse(process.argv);
