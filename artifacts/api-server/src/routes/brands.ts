import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { brandsTable, listingsTable } from "@workspace/db/schema";
import { asc, sql, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/brands", async (req, res) => {
  try {
    const brands = await db
      .select({
        id: brandsTable.id,
        name: brandsTable.name,
        slug: brandsTable.slug,
        logo: brandsTable.logo,
        listingCount: sql<number>`cast(count(${listingsTable.id}) as int)`,
      })
      .from(brandsTable)
      .leftJoin(listingsTable, eq(listingsTable.brandId, brandsTable.id))
      .groupBy(brandsTable.id)
      .orderBy(asc(brandsTable.name));
    res.json(brands);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch brands");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch brands" });
  }
});

export default router;
