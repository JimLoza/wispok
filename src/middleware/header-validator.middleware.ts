import type { Request, Response, NextFunction } from "express";
import { z } from "zod";


export const validateHeaders =
    <T extends z.ZodTypeAny>(schema: T) =>
        (req: Request, res: Response, next: NextFunction) => {
            const result = schema.safeParse(req.headers);

            if (!result.success) {
                const errors = result.error.issues.map(i => ({
                    field: i.path.join("."),
                    message: i.message,
                }));
                return res.status(400).json({ ok: false, errors });
            }
            res.locals.validatedHeaders = result.data;
            return next();
        };
