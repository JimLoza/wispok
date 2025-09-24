import { z } from 'zod';
import { PaymentMethodE } from '../enums/';

export const HeaderPaymentSchema = z.object({
    "idempotency-key": z.uuidv4().optional()
})

export const ZodPaymentSchema = z.object({
    amount: z.number().positive(),
    reference: z.string().min(5).nonempty().trim(),
    method: z.enum(PaymentMethodE),
})

export type CreatePaymentDTO = z.infer<typeof ZodPaymentSchema>;