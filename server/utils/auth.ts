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
    try {
        const check = crypto.scryptSync(password, salt, 64).toString("hex");
        return crypto.timingSafeEqual(Buffer.from(digest, "hex"), Buffer.from(check, "hex"));
    } catch (e) {
        return false;
    }
}
