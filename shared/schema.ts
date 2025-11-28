import { sql, count } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  doublePrecision,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(),
  specs: text("specs").notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  rating: doublePrecision("rating").notNull(),
  reviewCount: integer("review_count").notNull().default(0),
  image: text("image").notNull(),
  videoUrl: text("video_url"),
  difficulty: text("difficulty"),
  ecoFriendly: boolean("eco_friendly").default(false),
  isNew: boolean("is_new").default(false),
  isBestSeller: boolean("is_best_seller").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  id: true,
  name: true,
  brand: true,
  category: true,
  specs: true,
  price: true,
  originalPrice: true,
  rating: true,
  reviewCount: true,
  image: true,
  videoUrl: true,
  difficulty: true,
  ecoFriendly: true,
  isNew: true,
  isBestSeller: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const queries = {
  countProducts: (db: any) => db.select({ count: count() }).from(products),
};
