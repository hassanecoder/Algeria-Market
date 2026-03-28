import { pgTable, serial, text, integer, numeric, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categoriesTable } from "./categories";
import { brandsTable } from "./brands";
import { wilayasTable } from "./wilayas";

export const listingsTable = pgTable("listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  condition: text("condition").notNull(),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  categoryId: integer("category_id").notNull().references(() => categoriesTable.id),
  brandId: integer("brand_id").notNull().references(() => brandsTable.id),
  wilayaId: integer("wilaya_id").notNull().references(() => wilayasTable.id),
  specs: jsonb("specs").$type<Record<string, string>>().notNull().default({}),
  sellerName: text("seller_name").notNull(),
  sellerPhone: text("seller_phone").notNull(),
  isFeatured: boolean("is_featured").notNull().default(false),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertListingSchema = createInsertSchema(listingsTable).omit({ id: true, views: true, createdAt: true });
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listingsTable.$inferSelect;
