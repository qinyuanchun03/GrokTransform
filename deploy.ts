/**
 * Xai API Proxy Deployment Script
 *
 * This script helps deploy the Xai API proxy to CloudFlare Workers.
 * It provides a simple interface to deploy, update, and manage your proxy.
 */

import { parse } from "https://deno.land/std@0.224.0/flags/mod.ts";
import { exists } from "https://deno.land/std@0.224.0/fs/exists.ts";

// Type declarations for Deno API
declare namespace Deno {
  export const args: string[];
  export function readTextFile(path: string): Promise<string>;
  export function writeTextFile(path: string, data: string): Promise<void>;
  export function run(options: {
    cmd: string[];
    stdout?: "inherit" | "piped" | "null";
    stderr?: "inherit" | "piped" | "null";
  }): {
    status(): Promise<{ success: boolean }>;
  };
}

// Type declaration for import.meta
declare interface ImportMeta {
  main: boolean;
}

/**
 * Main deployment function
 */
async function main() {
  try {
    // Parse command line arguments
    const args = parse(Deno.args, {
      boolean: ["help", "preview"],
      string: ["domain", "account", "zone"],
      alias: {
        h: "help",
        p: "preview",
        d: "domain",
        a: "account",
        z: "zone",
      },
    });

    // Show help message
    if (args.help) {
      console.log(`
Xai API Proxy Deployment Script

USAGE:
  deno run --allow-run --allow-read --allow-write deploy.ts [OPTIONS]

OPTIONS:
  -h, --help                Show this help message
  -p, --preview             Deploy to preview environment
  -d, --domain=<domain>     Set custom domain (e.g., api-grok.domain.com)
  -a, --account=<id>        Set CloudFlare account ID
  -z, --zone=<id>           Set CloudFlare zone ID

EXAMPLES:
  # Deploy to production
  deno run --allow-run --allow-read --allow-write deploy.ts

  # Deploy with custom domain
  deno run --allow-run --allow-read --allow-write deploy.ts --domain=api-grok.domain.com --account=your-account-id --zone=your-zone-id

  # Deploy to preview environment
  deno run --allow-run --allow-read --allow-write deploy.ts --preview
  `);
      // Exit the script by returning
      return;
    }

    // Check if wrangler.toml exists
    if (!await exists("wrangler.toml")) {
      console.error("Error: wrangler.toml not found. Make sure you're in the project directory.");
      throw new Error("wrangler.toml not found");
    }

    // Update wrangler.toml if domain, account, or zone is provided
    if (args.domain || args.account || args.zone) {
      try {
        let wranglerContent = await Deno.readTextFile("wrangler.toml");

        if (args.account) {
          wranglerContent = wranglerContent.replace(
            /# account_id = "your-cloudflare-account-id"/,
            `account_id = "${args.account}"`
          );
        }

        if (args.zone) {
          wranglerContent = wranglerContent.replace(
            /# zone_id = "your-cloudflare-zone-id"/,
            `zone_id = "${args.zone}"`
          );
        }

        if (args.domain) {
          wranglerContent = wranglerContent.replace(
            /# workers_dev = false/,
            "workers_dev = false"
          );

          wranglerContent = wranglerContent.replace(
            /# custom_domain = "api-grok.domain.com"/,
            `custom_domain = "${args.domain}"`
          );

          const domainParts = args.domain.split(".");
          const zoneName = domainParts.slice(-2).join(".");

          wranglerContent = wranglerContent.replace(
            /# routes = \[\n#   \{ pattern = "api-grok.domain.com\/\*", zone_name = "domain.com" \}\n# \]/,
            `routes = [\n  { pattern = "${args.domain}/*", zone_name = "${zoneName}" }\n]`
          );
        }

        await Deno.writeTextFile("wrangler.toml", wranglerContent);
        console.log("Updated wrangler.toml with your configuration.");
      } catch (error) {
        console.error("Error updating wrangler.toml:", error.message);
        throw error;
      }
    }

    // Deploy the worker
    const command = ["wrangler", "deploy"];

    if (args.preview) {
      command.push("--env", "preview");
    }

    const process = Deno.run({
      cmd: command,
      stdout: "inherit",
      stderr: "inherit",
    });

    const status = await process.status();

    if (!status.success) {
      console.error("Deployment failed. Check the error messages above.");
      throw new Error("Deployment failed");
    }

    console.log("\nDeployment successful!");
    console.log("\nNext steps:");
    console.log("1. Configure your local AI chat software to use your proxy");
    console.log("2. Add your API key in your chat software");
    console.log("3. Configure your preferred models");
    console.log("\nFor detailed instructions, see the configuration guides:");
    console.log("- English: CONFIGURATION-GUIDE.md");
    console.log("- Chinese: CONFIGURATION-GUIDE-CN.md");
} catch (error) {
  console.error("Error deploying worker:", error.message);
  console.error("\nMake sure you have the Wrangler CLI installed:");
  console.error("npm install -g wrangler");
  throw error;
  }
}

// Run the main function and handle any errors
if (import.meta.main) {
  main().catch((error) => {
    console.error("Deployment failed:", error.message);
  });
}
