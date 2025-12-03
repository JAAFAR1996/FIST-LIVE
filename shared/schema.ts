import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, numeric, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name"),
  role: text("role").notNull().default("user"), // user, admin
  emailVerified: boolean("email_verified").default(false),
  verificationToken: text("verification_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  originalPrice: numeric("original_price"),
  currency: text("currency").notNull().default("IQD"),
  images: jsonb("images").notNull().$type<string[]>(),
  thumbnail: text("thumbnail").notNull(),
  rating: numeric("rating").notNull().default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  stock: integer("stock").notNull().default(0),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(10),
  isNew: boolean("is_new").notNull().default(false),
  isBestSeller: boolean("is_best_seller").notNull().default(false),
  specifications: jsonb("specifications").notNull().$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").references(() => users.id),
  status: text("status").notNull().default("pending"),
  total: numeric("total").notNull(),
  items: jsonb("items").notNull().$type<any[]>(),
  shippingAddress: jsonb("shipping_address").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: text("product_id").references(() => products.id).notNull(),
  userId: text("user_id").references(() => users.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  images: jsonb("images").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sessions table for persistent session storage
export const sessions = pgTable("sessions", {
  sid: text("sid").primaryKey(),
  sess: jsonb("sess").notNull().$type<any>(),
  expire: timestamp("expire").notNull(),
}, (table) => ({
  expireIdx: index("sessions_expire_idx").on(table.expire),
}));

// Discounts table for product discounts
export const discounts = pgTable("discounts", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: text("product_id").references(() => products.id).notNull(),
  type: text("type").notNull(), // percentage, fixed
  value: numeric("value").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Audit logs for tracking admin actions
export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // create, update, delete
  entityType: text("entity_type").notNull(), // product, order, user
  entityId: text("entity_id").notNull(),
  changes: jsonb("changes").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  passwordHash: true,
  fullName: true,
  role: true,
}).extend({
  email: z.string().email("Valid email is required"),
  passwordHash: z.string().min(1, "Password is required"),
  fullName: z.string().optional(),
  role: z.enum(["user", "admin"]).optional(),
});

export const insertProductSchema = createInsertSchema(products);
export const insertOrderSchema = createInsertSchema(orders);
export const insertReviewSchema = createInsertSchema(reviews);
export const insertDiscountSchema = createInsertSchema(discounts);
export const insertAuditLogSchema = createInsertSchema(auditLogs);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Discount = typeof discounts.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
