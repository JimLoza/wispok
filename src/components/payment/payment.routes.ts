import { Router } from "express";
import { createPayment } from "./payment.controller";
import { ZodValidator } from "../../middleware/zod-validator.middleware";
import { HeaderPaymentSchema, ZodPaymentSchema } from "./dto/create-payment.dto";
import { validateHeaders } from "../../middleware/header-validator.middleware";

const router = Router();
router.post(
    "/",
    validateHeaders(HeaderPaymentSchema),
    ZodValidator(ZodPaymentSchema),
    createPayment
);

export default router;