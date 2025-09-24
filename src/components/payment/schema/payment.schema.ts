import mongoose, { Schema, Model, InferSchemaType, HydratedDocument } from "mongoose";
import { PaymentMethodE, PaymentStatusE } from "../enums/";

export const PaymentSchema = new Schema({
    amount: { type: Number, required: true },
    reference: { type: String, required: true, unique: true },
    method: { type: String, enum: Object.values(PaymentMethodE) },
    status: { type: String, enum: Object.values(PaymentStatusE), default: PaymentStatusE.CONFIRMED },
    idempotencyKey: { type: String, required: false, unique: true, sparse: true },
    requestHash: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
})

export type Payment = InferSchemaType<typeof PaymentSchema>;
export type PaymentDocument = HydratedDocument<Payment>;

export const PaymentModel: Model<Payment> = mongoose.model<Payment>("Payment", PaymentSchema);
