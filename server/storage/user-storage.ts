import { type User, type InsertUser, type InsertUserAddress, type UserAddress, users, userAddresses, passwordResetTokens, newsletterSubscriptions, type NewsletterSubscription, type InsertNewsletterSubscription } from "../../shared/schema.js";
import { eq, isNull } from "drizzle-orm";
import { getDb } from "../db.js";

export class UserStorage {
    private db = getDb()!;

    async getUsers(): Promise<User[]> {
        return await this.db.select().from(users).where(isNull(users.deletedAt));
    }

    async getUser(id: string): Promise<User | undefined> {
        const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
        return result[0];
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
        return result[0];
    }

    async createUser(insertUser: InsertUser): Promise<User> {
        const result = await this.db.insert(users).values({
            email: insertUser.email,
            passwordHash: insertUser.passwordHash,
            fullName: insertUser.fullName,
            role: insertUser.role || "user",
            phone: insertUser.phone,
        }).returning();
        return result[0];
    }

    async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
        const result = await this.db.update(users).set({ ...updates, updatedAt: new Date() }).where(eq(users.id, id)).returning();
        return result[0];
    }

    // Address Methods
    async createUserAddress(address: InsertUserAddress): Promise<UserAddress> {
        const result = await this.db.insert(userAddresses).values(address).returning();
        return result[0];
    }

    async getUserAddresses(userId: string): Promise<UserAddress[]> {
        return await this.db.select().from(userAddresses).where(eq(userAddresses.userId, userId));
    }

    // Password Reset
    async createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<string> {
        // Invalidate existing tokens
        await this.db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));

        await this.db.insert(passwordResetTokens).values({
            token: tokenHash,
            userId,
            expiresAt,
        });
        return tokenHash;
    }

    async verifyPasswordResetToken(tokenHash: string): Promise<{ userId: string; expiresAt: Date } | undefined> {
        const result = await this.db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, tokenHash)).limit(1);
        return result[0];
    }

    async deletePasswordResetToken(tokenHash: string): Promise<void> {
        await this.db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, tokenHash));
    }

    // Newsletter Methods
    async getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined> {
        const result = await this.db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.email, email)).limit(1);
        return result[0];
    }

    async createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
        const result = await this.db.insert(newsletterSubscriptions).values(subscription).returning();
        return result[0];
    }
}
