import { appConfig } from "../config";
import { AppConfig } from "../config/config.interface";
import { EVMNetwork, GasByChain } from "../model/models";
import defaultGasPrice from "./default-data/default_gas_price.json";

export class GasEstimation {

    config: AppConfig

    constructor() {
        this.config = appConfig
    }

    async fetchGasPrice(): Promise<GasByChain> {
        try {
            const url = `${this.config.lifi.baseUrl}gas/prices`;
            console.log(url);
            const response = await fetch(url, {
                headers: {
                    'accept': 'application/json',
                    'x-lifi-api-key': this.config.lifi.apiKey
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const gasPrices = await response.json();
            return gasPrices;
        } catch (error) {
            console.warn('Failed to fetch gas prices from API, falling back to default values:', error);
            return defaultGasPrice as GasByChain;
        }
    }
}