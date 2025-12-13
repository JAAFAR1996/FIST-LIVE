
import crypto from "crypto";
import fs from "fs";

function hashPassword(password: string) {
    const salt = crypto.randomBytes(16).toString("hex");
    const digest = crypto.scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${digest}`;
}

const hash = hashPassword('Admin123!@#');
fs.writeFileSync('hash.txt', hash, 'utf8');
