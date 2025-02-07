import { error } from "console"
import { AppConfig, Environment } from "./config.interface"
import dotenv from "dotenv"

dotenv.config()

function ensureAllEnvVarsAvailable() {
    const configMap = {
        "LIFI_API_KEY": process.env.LIFI_API_KEY,
        "LIFI_BASE_URL": process.env.LIFI_BASE_URL,
        "PORT": process.env.PORT,
        "ENVIRONMENT": process.env.ENVIRONMENT,
        "WETH_CONTRACT_ADDRESS": process.env.WETH_CONTRACT_ADDRESS,
        "WCRO_CONTRACT_ADDRESS": process.env.WCRO_CONTRACT_ADDRESS,
        "WPOL_CONTRACT_ADDRESS": process.env.WPOL_CONTRACT_ADDRESS,
        "WBNB_CONTRACT_ADDRESS": process.env.WBNB_CONTRACT_ADDRESS,
        "MORALIS_BASE_URL": process.env.MORALIS_BASE_URL,
        "MORALIS_API_KEY": process.env.MORALIS_API_KEY,
        "PRICE_CACHE_DURATION": process.env.PRICE_CACHE_DURATION
    }
    Object.entries(configMap).forEach(([item, value]) => {
        if (value === undefined || value.length === 0) {
            throw new Error(`missing env var: ${item}`)
        }
    })
}

function getAppConfig(): AppConfig {
    ensureAllEnvVarsAvailable()
    return {
        moralis: {
            baseUrl: process.env.MORALIS_BASE_URL!,
            apiKey: process.env.MORALIS_API_KEY!
        },
        lifi: {
            baseUrl: process.env.LIFI_BASE_URL!,
            apiKey: process.env.LIFI_API_KEY!
        },
        environment: process.env.ENVIRONMENT! as Environment,
        core: {
            port: process.env.PORT!,
            wethContractAddress: process.env.WETH_CONTRACT_ADDRESS!,
            wcroContractAddress: process.env.WCRO_CONTRACT_ADDRESS!,
            wpolContractAddress: process.env.WPOL_CONTRACT_ADDRESS!
        }

    }
}

export const appConfig: AppConfig = (() => {
    try {
        return getAppConfig();
    } catch {
        console.error("caught error: missing env var", error)
        throw error
    }
})()

