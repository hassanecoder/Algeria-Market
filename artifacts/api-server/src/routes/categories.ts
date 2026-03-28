import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { categoriesTable, listingsTable } from "@workspace/db/schema";
import { asc, sql, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/categories", async (req, res) => {
  try {
    const categories = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        nameAr: categoriesTable.nameAr,
        slug: categoriesTable.slug,
        icon: categoriesTable.icon,
        listingCount: sql<number>`cast(count(${listingsTable.id}) as int)`,
      })
      .from(categoriesTable)
      .leftJoin(listingsTable, eq(listingsTable.categoryId, categoriesTable.id))
      .groupBy(categoriesTable.id)
      .orderBy(asc(categoriesTable.name));
    res.json(categories);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch categories");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch categories" });
  }
});

export default router;
