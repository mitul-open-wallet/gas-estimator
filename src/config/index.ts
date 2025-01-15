import { AppConfig, Environment } from "./config.interface"
import dotenv from "dotenv"

dotenv.config()

function getAppConfig(): AppConfig {
    return {
        moralis: {
            baseUrl: process.env.MORALIS_BASE_URL || "",
            apiKey: process.env.MORALIS_API_KEY || ""
        },
        lifi: {
            baseUrl: process.env.LIFI_BASE_URL || "",
            apiKey: process.env.LIFI_API_KEY || ""
        },
        environment: (process.env.ENVIRONMENT || "development") as Environment,
        core: {
            port: process.env.PORT || "3000",
            wethContractAddress: process.env.WETH_CONTRACT_ADDRESS || "",
            wcroContractAddress: process.env.WCRO_CONTRACT_ADDRESS || "",
            wpolContractAddress: process.env.WPOL_CONTRACT_ADDRESS || ""
        }

    }
}

export const appConfig = getAppConfig();

