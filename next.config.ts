import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["172.20.10.4"],
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-d1",
  ],
};

export default nextConfig;

import("@opennextjs/cloudflare").then((m) =>
  m.initOpenNextCloudflareForDev()
);