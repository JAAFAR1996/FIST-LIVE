import crypto from "crypto";

export function hashPassword(password: string) {
    const salt = crypto.randomBytes(16).toString("hex");
    const digest = crypto.pbkdf2Sync(password, salt, 15000, 64, "sha512").toString("hex");
    return `${salt}:${digest}`;
}

export function verifyPassword(password: string, stored: string) {
    const [salt, digest] = stored.split(":");
    if (!salt || !digest) return false;
    const check = crypto.pbkdf2Sync(password, salt, 15000, 64, "sha512").toString("hex");
    return crypto.timingSafeEqual(Buffer.from(digest, "hex"), Buffer.from(check, "hex"));
}
