import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const wilayasTable = pgTable("wilayas", {
  id: serial("id").primaryKey(),
  code: integer("code").notNull(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
});

export const insertWilayaSchema = createInsertSchema(wilayasTable).omit({ id: true });
export type InsertWilaya = z.infer<typeof insertWilayaSchema>;
export type Wilaya = typeof wilayasTable.$inferSelect;
