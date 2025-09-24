import { Request, Response, NextFunction } from 'express';
import { store } from './payment.service';
import { CreatePaymentDTO } from './dto/create-payment.dto';



export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
    const paymentData = req.body as CreatePaymentDTO;
    const idempotencyKey = req.headers["idempotency-key"] as string | undefined;
    try {
        const response = await store(paymentData, idempotencyKey);
        res.status(response.status).json(response.body);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }

}