import crypto from "crypto";

export function hashPassword(password: string) {
    const salt = crypto.randomBytes(16).toString("hex");
    // N=16384, r=8, p=1 are standard defaults for scrypt. 64 is key length.
    const digest = crypto.scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${digest}`;
}

export function verifyPassword(password: string, stored: string) {
    const [salt, digest] = stored.split(":");
    if (!salt || !digest) return false;

    // 1. Try Scrypt (New)
    try {
        const check = crypto.scryptSync(password, salt, 64).toString("hex");
        if (crypto.timingSafeEqual(Buffer.from(digest, "hex"), Buffer.from(check, "hex"))) {
            return true;
        }
    } catch (e) {
        // Ignore scrypt errors, proceed to fallback
    }

    // 2. Try PBKDF2 (Legacy) - Fallback
    try {
        // Attempt standard defaults which were likely used
        const checkLegacy = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
        if (crypto.timingSafeEqual(Buffer.from(digest, "hex"), Buffer.from(checkLegacy, "hex"))) {
            return true;
        }
    } catch (e) {
        return false;
    }

    return false;
}
