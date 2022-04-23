const dev = process.env.NODE_ENV !== 'production';
const env = process.env.NEXT_PUBLIC_VERCEL_ENV;

export const server = dev ? "http://localhost:1111" : env == "preview" && env == "development" ? "https://notal.vercel.app" : "https://notal.app";