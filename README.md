# Xai API Proxy for CloudFlare Workers

A simple and efficient proxy for Xai API using Deno and CloudFlare Workers.

## Documentation

- [English Documentation](./README-EN.md)
- [中文文档](./README-CN.md)

## Quick Links

### English
- [Configuration Guide](./CONFIGURATION-GUIDE.md)
- [Deployment Guide](./DEPLOYMENT.md)

### 中文
- [配置指南](./CONFIGURATION-GUIDE-CN.md)
- [部署指南](./DEPLOYMENT.md)

## Project Structure

```
.
├── src/
│   └── index.ts          # Main proxy code
├── deno.json             # Deno configuration
├── wrangler.toml         # CloudFlare Worker configuration
├── import_map.json       # Import map for Deno
├── deploy.ts             # Deployment script
├── README.md             # This file
├── README-EN.md          # English documentation
├── README-CN.md          # Chinese documentation
├── CONFIGURATION-GUIDE.md       # English configuration guide
├── CONFIGURATION-GUIDE-CN.md    # Chinese configuration guide
└── DEPLOYMENT.md         # Deployment guide (English & Chinese)
```

## License

MIT
