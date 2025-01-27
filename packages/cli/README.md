# Buntastic CLI

The Buntastic CLI is a command-line tool that enables you to upload files/folders to an S3 bucket. It is designed specifically for the [Buntastic](https://github.com/pmbanugo/bun-tastic) static site hosting service, but it can be use for uploading files to S3.

Here's a video showing how to use it with the CLI (Quickstart demo):

[![Quickstart demo of buntastic CLI](https://img.youtube.com/vi/oRommxCpHM4/0.jpg)](https://www.youtube.com/watch?v=oRommxCpHM4)

Run the following command to install or upgrade the CLI:

```bash
bun install -g @pmbanugo/buntastic-cli@latest
```

Once installed, you can access it using the `buntastic` command. For example, `buntastic --help` will display the help information.

```bash
Usage
  $ buntastic <command> [options]

Available Commands
  upload    Upload files to S3

For more info, run any command with the `--help` flag
  $ buntastic upload --help

Options
  -v, --version    Displays current version
  -h, --help       Displays this message

Examples
  $ buntastic buntastic upload react-site --dir build
```

## Configuration / Credentials

The CLI reads the following environment variables for authentication:

- `AWS_ACCESS_KEY_ID` or `S3_ACCESS_KEY_ID`: The access key ID to use for accessing the storage
- `AWS_SECRET_ACCESS_KEY` or `S3_SECRET_ACCESS_KEY`: The secret access key
- `AWS_REGION` or `S3_REGION`: The bucket's region
- `AWS_BUCKET` or `S3_BUCKET`: S3 bucket name
- `AWS_ENDPOINT` or `S3_ENDPOINT`: S3 endpoint/url
- `AWS_SESSION_TOKEN` or `S3_SESSION_TOKEN`: Session token

These variables are read from the process's environemnt or a **.env** file in the current working directory.

## Uploading Files

Use the `upload` command to upload files to a bucket. These are the options available:

```bash
$ buntastic upload --help

  Description
    Upload files to S3

  Usage
    $ buntastic upload <bucket> [options]

  Options
    --file                 Single file to upload
    --dir                  Directory to upload recursively
    --region               AWS region
    --endpoint             S3 endpoint/url
    --access-key-id        AWS access key ID
    --secret-access-key    AWS secret access key
    -h, --help             Displays this message

  Examples
    $ buntastic upload react-site --dir build --access-key-id $AWS_ACCESS_KEY_ID --secret-access-key $AWS_SECRET_ACCESS_KEY --endpoint $S3_URL --region $AWS_REGION
```

### Examples

To upload a single file, use the `--file` option:

```bash
$ buntastic upload react-site --file build/index.html
```

To upload a directory, use the `--dir` option:

```bash
$ buntastic upload react-site --dir build
```

Upload files files and specify the credentials using custom environment variables:

```bash
$ buntastic upload react-site --dir build --access-key-id $ACCESS_KEY_ID --secret-access-key $SECRET_ACCESS_KEY --endpoint $AWS_ENDPOINT_URL_S3 --region auto
```
