import { envs } from "../../config/envs.config";
import { CreatePaymentDTO } from "./dto/create-payment.dto";
import { createHmac } from 'node:crypto';
import { PaymentModel, PaymentDocument, Payment } from './schema/payment.schema';
import { HttpResponse } from '../../utils/http-response';
const generateHash = (data: CreatePaymentDTO) => {
    const sortedKeys = Object.keys(data).sort();
    const sortedData = JSON.stringify(data, sortedKeys);
    const secret = envs.secretHash;
    return createHmac('sha256', secret)
        .update(sortedData)
        .digest('hex');
}


const newPayment = async (payload: CreatePaymentDTO, hash: string, idempotencyKey?: string): Promise<Payment> => {
    const document = await PaymentModel.create({
        ...payload,
        requestHash: hash,
        ...(idempotencyKey && { idempotencyKey })
    })
    return document;
}


const findByIdemkeyOrHash = async (hash: string, idempotencyKey?: string): Promise<Payment | null> => {
    const conditions: any[] = [
        { requestHash: hash }
    ]

    if (idempotencyKey) {
        conditions.push({ idempotencyKey });
    }

    const document = await PaymentModel.findOne({
        $or: conditions
    });
    return document;
}


export const store = async (payload: CreatePaymentDTO, idempotencyKey?: string): Promise<HttpResponse<Payment>> => {
    const hash = generateHash(payload);
    const hasIdemKeyOrHash = await findByIdemkeyOrHash(hash, idempotencyKey);

    //Si no se envía Idempotency-Key, usar una regla de deduplicación que encuentre por hash
    if ((!idempotencyKey) && hasIdemKeyOrHash?.requestHash === hash) {
        return new HttpResponse(200, hasIdemKeyOrHash);
    }

    // Si se envía Idempotency-Key, pero el registro no tiene Idempotency-Key, se busca el registro por hash para evitar duplicados
    if (idempotencyKey && hash === hasIdemKeyOrHash?.requestHash) {
        return new HttpResponse(200, hasIdemKeyOrHash);
    }

    //Si el idempotencyKey y hash coinciden con un documento existente, devolver ese documento
    if (idempotencyKey === hasIdemKeyOrHash?.idempotencyKey && hash === hasIdemKeyOrHash?.requestHash) {
        console.log('Idempotency key and hash match, returning existing document');
        return new HttpResponse(200, hasIdemKeyOrHash);
    }

    // Si el idempotencyKey coincide pero el hash no, devolver un error de conflicto
    if ((idempotencyKey && idempotencyKey === hasIdemKeyOrHash?.idempotencyKey) && hash !== hasIdemKeyOrHash?.requestHash) {
        return new HttpResponse(
            409,
            { message: "Conflict: The request payload does not match the original request associated with this idempotency key." } as any
        );
    }

    const newDoc = await newPayment(payload, hash, idempotencyKey);
    return new HttpResponse(201, newDoc);
}
