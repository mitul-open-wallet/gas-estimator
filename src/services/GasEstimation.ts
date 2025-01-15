import { appConfig } from "../config";
import { AppConfig } from "../config/config.interface";
import { EVMNetwork, GasByChain } from "../model/models";

export class GasEstimation {

    config: AppConfig

    constructor() {
        this.config = appConfig
    }

    async fetchGasPrice(): Promise<GasByChain> {
        const url = `${this.config.lifi.baseUrl}gas/prices`;
        console.log(url);
       const response = await fetch(url, {
        headers: {
            'accept': 'application/json',
            'x-lifi-api-key': this.config.lifi.apiKey
        }
       })
       const gasPrices = await response.json();
       return gasPrices
    }

    mapChainIdtoEVMNetwork(chainId: string): EVMNetwork | undefined {
        switch (chainId) {
            case "1":
                return EVMNetwork.ethereum
            case "59144":
                return EVMNetwork.linea
            case "10":
                return EVMNetwork.optimism
            case "137":
                return EVMNetwork.polygon
            case "8453":
                return EVMNetwork.base
            case "42161":
                return EVMNetwork.arbitrum
            case "25":
                return EVMNetwork.cronos
            default:
                return undefined
            
        }
    }
}