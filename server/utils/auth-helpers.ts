
import express from "express";
import session from "express-session";

declare module "express-session" {
    interface SessionData {
        userId?: string;
    }
}

export const getSession = (req: express.Request): (session.Session & Partial<session.SessionData>) | undefined =>
    (req as express.Request & { session?: session.Session & Partial<session.SessionData> }).session;

export function localRequireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const sess = getSession(req);
    if (!sess?.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    next();
}
