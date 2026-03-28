import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { wilayasTable } from "@workspace/db/schema";
import { asc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/wilayas", async (req, res) => {
  try {
    const wilayas = await db.select().from(wilayasTable).orderBy(asc(wilayasTable.code));
    res.json(wilayas);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch wilayas");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch wilayas" });
  }
});

export default router;
