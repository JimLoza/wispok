import { Router } from "express";
import paymentRoutes from "./payment/payment.routes";

const router = Router();

//Routes here

//Payment routes
router.use("/payment", paymentRoutes);


export default router;