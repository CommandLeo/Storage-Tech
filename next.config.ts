import type { NextConfig } from "next";
import { validateEnv } from "@/lib/env";
import config, { validateConfig } from "@/lib/config";

console.log("Validating environment variables...");
validateEnv();
console.log("Validating config...");
validateConfig();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/discord",
        destination: config.discordServers["Storage Tech"],
        permanent: true,
      },
      {
        source: "/dictionary",
        destination: "https://storagetechdictionary.github.io/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
