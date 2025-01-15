export type Environment = "testnet" | "mainnet"

interface Core {
    port: string,
    wethContractAddress: string
    wcroContractAddress: string
    wpolContractAddress: string
}

interface MoralisConfig {
    baseUrl: string,
    apiKey: string
}

interface LiFiConfig {
    baseUrl: string,
    apiKey: string
}

export interface AppConfig {
    moralis: MoralisConfig,
    lifi: LiFiConfig,
    environment: Environment
    core: Core
}