
import { hashPassword } from '../server/utils/auth.js';
import { db } from "../server/db.js";
import { users } from "../shared/schema.js";
import { eq } from "drizzle-orm";

async function run() {
    const newHash = hashPassword('Admin123!@#');
    console.log("Generated Hash:", newHash);

    try {
        await db.update(users)
            .set({ password: newHash })
            .where(eq(users.email, 'admin@fishstore.com'));
        console.log("Successfully updated admin password.");
        process.exit(0);
    } catch (e) {
        console.error("Error updating password:", e);
        process.exit(1);
    }
}

run();
