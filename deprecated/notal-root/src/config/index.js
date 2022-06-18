
const env = {
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV,
    isDev: process.env.NODE_ENV !== "production",
    devPort: process.env.NEXT_PUBLIC_DEV_PORT,
    devAPI: process.env.NEXT_PUBLIC_DEV_API_URL,
    prodAPI: process.env.NEXT_PUBLIC_API_URL,
}

const getServer = () => {
    if (env.environment == "preview") return "https://notal.vercel.app";
    if (env.isDev || env.environment == "development") {
        return `${env.devAPI}:${env.devPort}`;
    }
    return `${env.prodAPI}`;
}

export const server = getServer();