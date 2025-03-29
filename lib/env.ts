import zod from "zod";

const envSchema = zod.object({
  // PORT: zod.number().default(3000),
  NODE_ENV: zod.string().default("development"),
  MONGODB_URI: zod.string(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: zod.string(),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: zod.string(),
});

export const env = envSchema.parse(process.env);
