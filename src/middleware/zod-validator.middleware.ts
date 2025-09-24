import type { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";

export const ZodValidator =
    <T extends z.ZodTypeAny>(schema: T): RequestHandler =>
        async (req: Request, res: Response, next: NextFunction) => {
            const result = await schema.safeParseAsync(req.body);
            if (!result.success) {
                const errors = (result.error.issues as z.ZodError["issues"]).map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }));
                return res.status(400).json({ ok: false, errors });
            }
            req.body = result.data;
            next();
        };
