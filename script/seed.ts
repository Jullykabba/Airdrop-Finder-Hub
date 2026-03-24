import { db } from "../server/db";
import * as schema from "../shared/schema";

async function seed() {
  console.log("Seeding database...");
  try {
    await db.insert(schema.airdrops).values([
      {
        tokenName: "Scroll",
        symbol: "SCR",
        network: "Scroll Mainnet",
        rewardAmount: "TBA",
        description: "Layer 2 solution using ZK-rollups.",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true,
        link: "https://scroll.io"
      },
      {
        tokenName: "Linea",
        symbol: "LINEA",
        network: "Linea Mainnet",
        rewardAmount: "TBA",
        description: "ConsenSys zkEVM network.",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        link: "https://linea.build"
      }
    ]);
    console.log("✅ SEEDING SUCCESSFUL!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    process.exit(0);
  }
}

seed();