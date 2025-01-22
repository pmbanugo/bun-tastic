#!/usr/bin/env bun

import sade from "sade";
import { upload } from "./commands/upload";
import pkg from "./package.json" with { type: "json" };

const prog = sade("buntastic");

prog
    //@ts-ignore
  .version(pkg.version)
  .command("upload <bucket>", "Upload files to S3", { default: true })
  .option("--file", "Single file to upload")
  .option("--dir", "Directory to upload recursively")
  .option("--bucket", "Target S3 bucket")
  .option("--region", "AWS region")
  .option("--accessKeyId", "AWS access key ID")
  .option("--secretAccessKey", "AWS secret access key")
  .option("--endpoint", "S3 endpoint/url")
  .action(upload);

prog.parse(process.argv);
