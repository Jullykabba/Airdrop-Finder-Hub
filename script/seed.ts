import { db } from "../server/db";
import * as schema from "../shared/schema";

async function seed() {
  console.log("Seeding database...");
  await db.insert(schema.airdrops).values([
    {
      token_name: "Scroll",
      description: "Layer 2 solution using ZK-rollups.",
      link: "https://scroll.io",
      value: "High",
      status: "Active"
    },
    {
      token_name: "Linea",
      description: "ConsenSys zkEVM network.",
      link: "https://linea.build",
      value: "High",
      status: "Active"
    }
  ]);
  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
