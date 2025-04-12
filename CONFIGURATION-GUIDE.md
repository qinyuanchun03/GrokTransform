# Xai API Proxy Configuration Guide

This guide will help you configure a CloudFlare Worker to proxy Xai API requests and use a custom domain in your local AI chat software.

## Deploying the CloudFlare Worker

1. **Prerequisites**
   - [Deno](https://deno.land/) installed
   - [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed
   - A CloudFlare account
   - A domain connected to CloudFlare

2. **Configure wrangler.toml**
   - Open the `wrangler.toml` file
   - Uncomment and fill in your CloudFlare account ID and zone ID
   ```toml
   account_id = "your-cloudflare-account-id"
   zone_id = "your-cloudflare-zone-id"
   ```
   - Uncomment and configure your custom domain
   ```toml
   workers_dev = false
   custom_domain = "api-grok.domain.com"  # Replace with your actual domain
   ```
   - Uncomment and configure routes
   ```toml
   routes = [
     { pattern = "api-grok.domain.com/*", zone_name = "domain.com" }  # Replace with your actual domain
   ]
   ```

3. **No Environment Variables Required**
   - This proxy is designed as a pure forwarding service with no need to set any environment variables in CloudFlare
   - All configuration (such as API keys and model selection) is done in your chat software

4. **Deploy the Worker**
   ```bash
   deno task deploy
   ```

## Configuring Your Local AI Chat Software

The configuration may vary depending on your local AI chat software. Here are general configuration steps:

### Basic Configuration

1. **API URL**: Use your custom domain
   ```
   https://api-grok.domain.com
   ```

2. **API Key**: Set in your chat software
   - Enter your Xai API key in your chat software
   - This is typically sent in the request headers as `Authorization: Bearer YOUR_API_KEY`

3. **Model Information**: Set in your chat software
   - Model name: Can be freely configured, such as `grok-1`, `grok-2`, etc.
   - If your chat software allows custom model parameters, you can set:
     - Maximum context length: 131,072 tokens
     - Temperature: 0.7 (adjustable)
     - Maximum generation length: 4,096 tokens (adjustable)

### Advanced Configuration

If your chat software supports advanced configuration, you may need the following information:

1. **Endpoint URLs**:
   - Chat completions: `https://api-grok.domain.com/v1/chat/completions`
   - Text completions: `https://api-grok.domain.com/v1/completions`

2. **Request Format**:
   - Content type: `application/json`
   - Request method: `POST`
   - Authentication: `Bearer Token`

3. **Request Body Example** (chat completions):
   ```json
   {
     "model": "your-model-name",  // Replace with your chosen model name
     "messages": [
       {"role": "system", "content": "You are a helpful AI assistant."},
       {"role": "user", "content": "Hello, please introduce yourself."}
     ],
     "temperature": 0.7,
     "max_tokens": 1000
   }
   ```

### Chatbox Configuration Example

If you're using Chatbox software, you can configure it with these steps:

1. Open Chatbox and go to Settings
2. Click "Add Custom API Provider"
3. Fill in the following information:
   - Name: Xai API
   - Base URL: `https://api-grok.domain.com`
   - API Key: Enter your Xai API key
   - Model List: Add the models you need, such as `grok-1`, `grok-2`, etc.
4. Save the configuration
5. Select Xai API and your added models in the chat interface

## Troubleshooting

If you encounter connection issues:

1. **Check API Key**: Ensure your Xai API key is correct and valid
2. **Check Domain Configuration**: Make sure your custom domain is properly configured and pointing to CloudFlare
3. **Check Worker Logs**: View the Worker logs in the CloudFlare dashboard for error information
4. **CORS Issues**: If you encounter CORS errors, make sure your chat software's domain is added to the allowed origins list

## Security Considerations

- Your API key will be forwarded through your proxy, ensure you're using HTTPS connections
- Consider restricting CORS origins in production environments
- Use CloudFlare's security features like rate limiting and firewall rules
- If multiple people share the same proxy, each user should use their own API key
