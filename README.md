# bun-tastic: static site hosting with Bun + Tigris

A high-performance web server built with Bun that lets you serve multiple static websites from different S3 buckets through a single server. Perfect for managing multiple static sites with their own domains while keeping the hosting simple and efficient.

It uses Tigris for object storage and benefits from its global caching. Default deployment is on Fly.io and with it you can set up global compute with a single command.

In other words, it's a high-performance, scalable, and efficient solution for hosting multiple static websites on your own terms.

> 📚 **Tip**: Use GitHub's table of contents feature to navigate this document easily! Click the menu icon next to the README title above.

## Features and Benefits 🔥

- Serve multiple static websites from one application
- Global distributed caching and compute
- Easy configuration through JSON
- HTTP/3 support
- Brotli & zstd compression support
- Built-in monitoring with Grafana dashboard (via Fly)
- Smart path handling with automatic index.html resolution
- Built on Bun's native S3 client and web server, thereby benefitting [from Bun's fast performance](https://x.com/jarredsumner/status/1877660347709972484))
- _Lightweight:_ Uses zero dependency and can run on a single CPU with 256MB RAM
- Posssibility to add and configure middleware and that can handle extra needs like authorization, redirect/rewrite rules, etc.
- Possible cheap/affordable hosting with volume-based licensing on Fly and affordable Tigris storage.

### Planned Features

- CLI/API for simplified site uploads (with resumability)
- Per-machine/VM caching with cache invalidation (potential performance boost)
- 103 Early Hints support (more efficient page load times)
- Easy setup/config to run on multi-cores
- Configurable bot request blocking

## Performance

It's fast! But better to try it for yourself. Here's a sample from a local test:

![load testing and measuring response time](https://cdn.hashnode.com/res/hashnode/image/upload/v1736875740269/531f0b7a-5b22-44f6-9156-57b5619f63f9.webp)

You can see the response time is very low and more than have returned in less than 100ms, for a response of 6KiB in size. Now deploy this in the regions you want to get lower latency and faster response times.

> The server is a shared VM with 256MB RAM and 1 CPU running on fly.io. Deployed region is in Sweden (arn).
> Tested on a 2021 MacBook Pro with M1 chip. Average internet speed 200 - 300Mbps.
> Try it yourself at https://first.flycd.dev or https://second.flycd.dev

Here's a video of me sampling the load and response times:

![GIF showing the output from my terminal load testing and ](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zy6zc10dg96vv3qel94u.gif)

## Setup Instructions

### Prerequisites

- Bun >= 1.1.43
- S3-compatible storage (like Tigris). Tigris is recommended for its global/distributed caching support.
- An account on Fly.io (optional)

### Configuration

1. Clone this repository
2. Copy config.example.json to config.json:
   ```bash
   cp config.example.json config.json
   ```
3. Update config.json with your domain to bucket mappings:
   ```json
   {
     "example.com": "my-bucket-name",
     "another-site.com": "another-bucket"
   }
   ```
4. If you intend to run it local, copy `.env.example` to `.env` and fill in your S3 credentials:
   ```bash
   cp .env.example .env
   ```
5. For Fly.io deployment, add the secrets after you deployed or created the app. You can do it from the dashboard or CLI:
   ```bash
   fly secrets set AWS_ACCESS_KEY_ID=<KEY_ID> AWS_SECRET_ACCESS_KEY=<ACCESS_KEY> AWS_REGION=auto AWS_ENDPOINT=https://fly.storage.tigris.dev
   ```

### Running Locally

To run it locally ensure you have the minimum required version for Bun, the correct .env file and values, and the comain config (confgi.json).

Once those are in place, run `bun index.ts` to start the server.

> You can configure a local domain in /etc/hosts and use a tool like Caddy to proxy the requests to the local server.

### Deployment to fly.io

There's a sample fly.toml file in the repo, i.e. **fly.example.toml**. Rename it to fly.toml. Edit it and set the name for the app, and optionally change the machines type (or other settings) to match your needs.

Then run `fly launch --no-deploy` to launch/scaffold the app. Next, set the secrets using the command:

```bash
fly secrets set AWS_ACCESS_KEY_ID=<KEY_ID> AWS_SECRET_ACCESS_KEY=<ACCESS_KEY> AWS_REGION=auto AWS_ENDPOINT=https://fly.storage.tigris.dev
```

Finally, run `fly deploy` to deploy the app. You can scale the app to multiple machines and regions if needed (see [docs for details](https://fly.io/docs/flyctl/scale-count/)).

### Domains, DNS, and TLS Certificates

For the domain configuration, you'll need to set up DNS records for each domain you want to serve. Fly.io can handle TLS certificates for you, but you'll need to set up the DNS records to point to the app's IP address or Fly's subdomain.

You'll find more info on how to do this in their [docs](https://fly.io/docs/networking/custom-domain/). If you use Cloudflare for DNS, make sure you read this [section in that page](https://fly.io/docs/networking/custom-domain/#i-use-cloudflare-and-there-seems-to-be-a-problem-issuing-or-validating-my-fly-io-tls-certificate).

## FAQ

I try to answer some questions I assume you might have here. If you have more question or have doubts/critic, please start a discussion :)

Heree are some common questions and answers:

### Q: Why use bun-tastic instead of traditional static hosting?

It's fine to use traditional hosting service but if you're looking to selfhost your our static sites from a single (or distributed) machine, this is **FOR YOU**.

You have the flexibility to configure as much redirect/rewrite rules as you want. You could also add authorization/authentication rules to specific domains and routes, which can help you share content with specific users.

It's ideal for agencies, freelancers, or individuals who have many clients and projects, and they can easily manage them from one server and save cost.

### Q: Isn't it more expensive to selfhost?

It depends on your usage.

If you have just one website that gets a few hundred visits per day, it's probably cheaper to use a traditional static site host. However, if you have multiple websites or a high traffic site, self-hosting can be more cost-effective.

When you combine the flexibility and control of self-hosting, with the affordable cost of Tigris storage, volume-based licensing on [Fly.io](https://fly.io/pricing/), and the ability to scale to zero, then you can save a lot of money.

### Q: What are the benefits of bun-tastic?

See the [benefits section](#features-and-benefits-).

### Q: Can I use any S3-compatible storage?

Yes, any S3-compatible storage service will work.

## Contributing

Feel free to open pull requests if there's an issue! Use GitHub DIscussion for feature requests or to discuss the project or potential defects.

## Sponsors

If you find this project useful, please consider sponsoring it. Your support helps me continue developing and maintaining this project. I haven't set up a Patreon or similar platform yet, but I'm open to suggestions. In the meantime, DM me on [Twitter/X](https://x.com/p_mbanugo), [LinkedIn](https://www.linkedin.com/in/pmbanugo/), or [Bluesky](https://bsky.app/profile/pmbanugo.me).
