# Deployment Guide

[English](#english) | [中文](#中文)

<a name="english"></a>

## English

This guide explains how to deploy the Xai API proxy to CloudFlare Workers.

### Prerequisites

- [Deno](https://deno.land/) installed
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed
- A CloudFlare account
- (Optional) A custom domain connected to CloudFlare

### Method 1: Manual Deployment

1. Configure your CloudFlare account details in `wrangler.toml`:
   ```toml
   account_id = "your-cloudflare-account-id"
   zone_id = "your-cloudflare-zone-id"
   ```

2. (Optional) Configure your custom domain:
   ```toml
   workers_dev = false
   custom_domain = "api-grok.domain.com"
   
   routes = [
     { pattern = "api-grok.domain.com/*", zone_name = "domain.com" }
   ]
   ```

3. Deploy the worker:
   ```bash
   deno task deploy
   ```

### Method 2: Using the Deployment Script

We provide a deployment script that simplifies the process:

```bash
# Deploy with default settings
deno run --allow-run --allow-read --allow-write deploy.ts

# Deploy with custom domain
deno run --allow-run --allow-read --allow-write deploy.ts --domain=api-grok.domain.com --account=your-account-id --zone=your-zone-id

# Deploy to preview environment
deno run --allow-run --allow-read --allow-write deploy.ts --preview

# Show help
deno run --allow-run --allow-read --allow-write deploy.ts --help
```

### Verifying Deployment

After deployment, you can verify that your proxy is working by making a request to:

```
https://api-grok.domain.com/v1/chat/completions
```

If you didn't configure a custom domain, CloudFlare will provide a workers.dev domain that you can use.

### Next Steps

After deployment, configure your local AI chat software to use your proxy. See [Configuration Guide](./CONFIGURATION-GUIDE.md) for detailed instructions.

---

<a name="中文"></a>

## 中文

本指南说明如何将Xai API代理部署到CloudFlare Workers。

### 前置条件

- 安装[Deno](https://deno.land/)
- 安装[Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- 拥有CloudFlare账户
- (可选) 连接到CloudFlare的自定义域名

### 方法1：手动部署

1. 在`wrangler.toml`中配置您的CloudFlare账户详情：
   ```toml
   account_id = "您的CloudFlare账户ID"
   zone_id = "您的CloudFlare区域ID"
   ```

2. (可选) 配置您的自定义域名：
   ```toml
   workers_dev = false
   custom_domain = "api-grok.domain.com"
   
   routes = [
     { pattern = "api-grok.domain.com/*", zone_name = "domain.com" }
   ]
   ```

3. 部署Worker：
   ```bash
   deno task deploy
   ```

### 方法2：使用部署脚本

我们提供了一个部署脚本，简化了部署过程：

```bash
# 使用默认设置部署
deno run --allow-run --allow-read --allow-write deploy.ts

# 使用自定义域名部署
deno run --allow-run --allow-read --allow-write deploy.ts --domain=api-grok.domain.com --account=您的账户ID --zone=您的区域ID

# 部署到预览环境
deno run --allow-run --allow-read --allow-write deploy.ts --preview

# 显示帮助
deno run --allow-run --allow-read --allow-write deploy.ts --help
```

### 验证部署

部署后，您可以通过向以下地址发送请求来验证您的代理是否正常工作：

```
https://api-grok.domain.com/v1/chat/completions
```

如果您没有配置自定义域名，CloudFlare将提供一个workers.dev域名供您使用。

### 下一步

部署后，配置您的本地AI聊天软件以使用您的代理。详细说明请参阅[配置指南](./CONFIGURATION-GUIDE-CN.md)。
