import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

function getPrismaClient() {
  const { env } = getCloudflareContext();
  const adapter = new PrismaD1((env as any).DB);

  return new PrismaClient({
    adapter,
  });
}

export const prisma = new Proxy(
  {} as PrismaClient,
  {
    get(_target, property) {
      const client = getPrismaClient();
      const value = (client as any)[property];

      if (typeof value === "function") {
        return value.bind(client);
      }

      return value;
    },
  }
);
