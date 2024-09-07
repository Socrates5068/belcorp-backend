import dotenv from 'dotenv'

dotenv.config()

const config = {
    appName: process.env.APP_NAME || "Belcorp",
    logLevel: process.env.LOG_LEVEL || "info",
}

const getConfig = (): any => config;

export default getConfig;