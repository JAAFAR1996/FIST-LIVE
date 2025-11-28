import { db } from "./db";
import {
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  users,
  products,
  queries,
} from "@shared/schema";
import { eq, count, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  listProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  seedProducts(seed: InsertProduct[]): Promise<void>;
}

export class DbStorage implements IStorage {
  private ready: Promise<void>;

  constructor() {
    this.ready = this.ensureTables();
  }

  private async ensureTables() {
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id varchar(255) PRIMARY KEY DEFAULT gen_random_uuid(),
        username text UNIQUE NOT NULL,
        password text NOT NULL,
        created_at timestamptz DEFAULT now()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS products (
        id varchar(255) PRIMARY KEY,
        name text NOT NULL,
        brand text NOT NULL,
        category text NOT NULL,
        specs text NOT NULL,
        price integer NOT NULL,
        original_price integer,
        rating double precision NOT NULL,
        review_count integer DEFAULT 0,
        image text NOT NULL,
        video_url text,
        difficulty text,
        eco_friendly boolean DEFAULT false,
        is_new boolean DEFAULT false,
        is_best_seller boolean DEFAULT false,
        created_at timestamptz DEFAULT now()
      );
    `);
  }

  async getUser(id: string): Promise<User | undefined> {
    await this.ready;
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.ready;
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    await this.ready;
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async listProducts(): Promise<Product[]> {
    await this.ready;
    return db.select().from(products).orderBy(products.createdAt);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    await this.ready;
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    return result[0];
  }

  async seedProducts(seed: InsertProduct[]): Promise<void> {
    await this.ready;
    const [{ count: existing }] = await db.select({ count: count() }).from(products);
    if (Number(existing) > 0) return;
    await db.insert(products).values(seed);
  }
}

export const storage = new DbStorage();
