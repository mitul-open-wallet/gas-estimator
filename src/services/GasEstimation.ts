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
}