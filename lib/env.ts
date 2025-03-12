import zod from "zod";

const envSchema = zod.object({
    // PORT: zod.number().default(3000), 
    NODE_ENV: zod.string().default('development'),
    MONGODB_URI: zod.string().nonempty(),
});

export const env = envSchema.parse(process.env);