import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { listingsTable, categoriesTable, brandsTable, wilayasTable } from "@workspace/db/schema";
import { eq, and, gte, lte, ilike, inArray, sql, desc, asc } from "drizzle-orm";

const router: IRouter = Router();

function buildListingResponse(row: any) {
  return {
    id: row.listing.id,
    title: row.listing.title,
    description: row.listing.description,
    price: parseFloat(row.listing.price),
    condition: row.listing.condition,
    images: row.listing.images as string[],
    categoryId: row.listing.categoryId,
    categoryName: row.category?.name ?? "",
    brandId: row.listing.brandId,
    brandName: row.brand?.name ?? "",
    wilayaId: row.listing.wilayaId,
    wilayaName: row.wilaya?.name ?? "",
    wilayaCode: row.wilaya?.code ?? 0,
    specs: row.listing.specs as Record<string, string>,
    seller: {
      name: row.listing.sellerName,
      phone: row.listing.sellerPhone,
      wilayaName: row.wilaya?.name ?? "",
      memberSince: row.listing.createdAt.toISOString().split("T")[0],
      isVerified: false,
      totalListings: 1,
    },
    isFeatured: row.listing.isFeatured,
    views: row.listing.views,
    createdAt: row.listing.createdAt.toISOString(),
  };
}

router.get("/listings/featured", async (req, res) => {
  try {
    const rows = await db
      .select({
        listing: listingsTable,
        category: categoriesTable,
        brand: brandsTable,
        wilaya: wilayasTable,
      })
      .from(listingsTable)
      .leftJoin(categoriesTable, eq(listingsTable.categoryId, categoriesTable.id))
      .leftJoin(brandsTable, eq(listingsTable.brandId, brandsTable.id))
      .leftJoin(wilayasTable, eq(listingsTable.wilayaId, wilayasTable.id))
      .where(eq(listingsTable.isFeatured, true))
      .orderBy(desc(listingsTable.createdAt))
      .limit(8);

    res.json(rows.map(buildListingResponse));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch featured listings");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch featured listings" });
  }
});

router.get("/listings/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "invalid_id", message: "Invalid listing ID" });
    return;
  }

  try {
    await db.update(listingsTable).set({ views: sql`${listingsTable.views} + 1` }).where(eq(listingsTable.id, id));

    const rows = await db
      .select({
        listing: listingsTable,
        category: categoriesTable,
        brand: brandsTable,
        wilaya: wilayasTable,
      })
      .from(listingsTable)
      .leftJoin(categoriesTable, eq(listingsTable.categoryId, categoriesTable.id))
      .leftJoin(brandsTable, eq(listingsTable.brandId, brandsTable.id))
      .leftJoin(wilayasTable, eq(listingsTable.wilayaId, wilayasTable.id))
      .where(eq(listingsTable.id, id));

    if (rows.length === 0) {
      res.status(404).json({ error: "not_found", message: "Listing not found" });
      return;
    }

    res.json(buildListingResponse(rows[0]));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch listing");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch listing" });
  }
});

router.get("/listings", async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
  const offset = (page - 1) * limit;

  const conditions: any[] = [];
  if (req.query.categoryId) conditions.push(eq(listingsTable.categoryId, parseInt(req.query.categoryId as string)));
  if (req.query.brandId) conditions.push(eq(listingsTable.brandId, parseInt(req.query.brandId as string)));
  if (req.query.wilayaId) conditions.push(eq(listingsTable.wilayaId, parseInt(req.query.wilayaId as string)));
  if (req.query.condition) conditions.push(eq(listingsTable.condition, req.query.condition as string));
  if (req.query.minPrice) conditions.push(gte(listingsTable.price, req.query.minPrice as string));
  if (req.query.maxPrice) conditions.push(lte(listingsTable.price, req.query.maxPrice as string));
  if (req.query.search) conditions.push(ilike(listingsTable.title, `%${req.query.search}%`));
  if (req.query.featured === "true") conditions.push(eq(listingsTable.isFeatured, true));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  try {
    const [countResult, rows] = await Promise.all([
      db.select({ count: sql<number>`cast(count(*) as int)` }).from(listingsTable).where(whereClause),
      db
        .select({
          listing: listingsTable,
          category: categoriesTable,
          brand: brandsTable,
          wilaya: wilayasTable,
        })
        .from(listingsTable)
        .leftJoin(categoriesTable, eq(listingsTable.categoryId, categoriesTable.id))
        .leftJoin(brandsTable, eq(listingsTable.brandId, brandsTable.id))
        .leftJoin(wilayasTable, eq(listingsTable.wilayaId, wilayasTable.id))
        .where(whereClause)
        .orderBy(desc(listingsTable.createdAt))
        .limit(limit)
        .offset(offset),
    ]);

    const total = countResult[0]?.count ?? 0;

    res.json({
      listings: rows.map(buildListingResponse),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch listings");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch listings" });
  }
});

router.post("/listings", async (req, res) => {
  const { title, description, price, condition, categoryId, brandId, wilayaId, images, specs, sellerName, sellerPhone } = req.body;

  if (!title || !description || price === undefined || !condition || !categoryId || !brandId || !wilayaId || !sellerName || !sellerPhone) {
    res.status(400).json({ error: "validation_error", message: "Missing required fields" });
    return;
  }

  if (!["new", "used", "refurbished"].includes(condition)) {
    res.status(400).json({ error: "validation_error", message: "Invalid condition value" });
    return;
  }

  try {
    const [inserted] = await db
      .insert(listingsTable)
      .values({
        title: String(title),
        description: String(description),
        price: String(price),
        condition: String(condition),
        categoryId: Number(categoryId),
        brandId: Number(brandId),
        wilayaId: Number(wilayaId),
        images: Array.isArray(images) ? images : [],
        specs: specs && typeof specs === "object" ? specs : {},
        sellerName: String(sellerName),
        sellerPhone: String(sellerPhone),
        isFeatured: false,
      })
      .returning();

    const rows = await db
      .select({
        listing: listingsTable,
        category: categoriesTable,
        brand: brandsTable,
        wilaya: wilayasTable,
      })
      .from(listingsTable)
      .leftJoin(categoriesTable, eq(listingsTable.categoryId, categoriesTable.id))
      .leftJoin(brandsTable, eq(listingsTable.brandId, brandsTable.id))
      .leftJoin(wilayasTable, eq(listingsTable.wilayaId, wilayasTable.id))
      .where(eq(listingsTable.id, inserted.id));

    res.status(201).json(buildListingResponse(rows[0]));
  } catch (err) {
    req.log.error({ err }, "Failed to create listing");
    res.status(500).json({ error: "internal_error", message: "Failed to create listing" });
  }
});

export default router;
