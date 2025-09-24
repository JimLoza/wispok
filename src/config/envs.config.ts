import "dotenv/config";
import * as Joi from "joi";

interface EnvVars {
    PORT: number;
    DB_URI: string;
    SECRET_HASH: string;
}

export const envsSchema = Joi.object<EnvVars>({
    PORT: Joi.number().required().default(3000),
    DB_URI: Joi.string().required(),
    SECRET_HASH: Joi.string().required(),
}).unknown(true);


const { error, value } = envsSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const envVars: EnvVars = value as EnvVars;

export const envs = {
    port: envVars.PORT,
    secretHash: envVars.SECRET_HASH,
    database: {
        uri: envVars.DB_URI,
    },
}

