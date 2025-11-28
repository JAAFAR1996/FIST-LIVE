import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, "[]", "utf-8");
  }
}

export class FileStorage implements IStorage {
  private users: Map<string, User>;
  private ready: Promise<void>;

  constructor() {
    this.users = new Map();
    this.ready = this.init();
  }

  private async init() {
    await ensureDataFile();
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    const parsed: User[] = JSON.parse(raw || "[]");
    parsed.forEach((u) => this.users.set(u.id, u));
  }

  private async persist() {
    await fs.writeFile(
      USERS_FILE,
      JSON.stringify(Array.from(this.users.values()), null, 2),
      "utf-8",
    );
  }

  async getUser(id: string): Promise<User | undefined> {
    await this.ready;
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.ready;
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    await this.ready;
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    await this.persist();
    return user;
  }
}

export const storage = new FileStorage();
