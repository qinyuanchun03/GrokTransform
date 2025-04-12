/**
 * Xai API Proxy for CloudFlare Workers using Deno
 *
 * This worker proxies requests to the Xai API, allowing you to use your own domain
 * while maintaining authentication and other headers.
 *
 * This is a pure proxy that forwards all requests and headers without modification,
 * allowing users to configure their API keys and models in their chat software.
 */

// Configuration
const XAI_API_BASE_URL = "https://api.xai.com/v1";
const ALLOWED_ORIGINS = ["*"]; // Set to specific domains in production

interface Env {
  // No required environment variables
}

interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return handleCORS(request);
    }

    try {
      // Get the path from the request URL
      const url = new URL(request.url);
      let path = url.pathname;

      // Handle different path patterns
      // If the path is just the root or /v1, we'll assume it's a chat completion request
      if (path === "/" || path === "/v1" || path === "/v1/") {
        path = "/v1/chat/completions";
      } else if (!path.startsWith("/v1/")) {
        // If the path doesn't start with /v1/, add it
        path = `/v1${path.startsWith("/") ? path : "/" + path}`;
      }

      // Construct the target URL
      const targetUrl = `${XAI_API_BASE_URL}${path.replace(/^\/v1/, "")}${url.search}`;

      // Clone the request headers
      const headers = new Headers(request.headers);

      // Forward the request to the Xai API without modifying the body
      // This allows users to configure their API keys and models in their chat software

      // Forward the request to the Xai API
      const response = await fetch(targetUrl, {
        method: request.method,
        headers,
        body: request.body,
        redirect: "follow",
      });

      // Clone the response and add CORS headers
      const responseHeaders = new Headers(response.headers);
      addCORSHeaders(responseHeaders, request);

      // Return the proxied response
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (error) {
      // Handle errors
      console.error("Proxy error:", error);
      return new Response(JSON.stringify({ error: "Failed to proxy request" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...getCORSHeaders(request),
        },
      });
    }
  },
};

/**
 * Handle CORS preflight requests
 */
function handleCORS(request: Request): Response {
  const headers = getCORSHeaders(request);
  return new Response(null, {
    status: 204,
    headers,
  });
}

/**
 * Add CORS headers to the response
 */
function addCORSHeaders(headers: Headers, request: Request): void {
  const corsHeaders = getCORSHeaders(request);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
}

/**
 * Get CORS headers based on the request
 */
function getCORSHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin") || "";

  // Check if the origin is allowed
  const allowOrigin = ALLOWED_ORIGINS.includes("*") || ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0] || "";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, OpenAI-Organization",
    "Access-Control-Max-Age": "86400",
  };
}
