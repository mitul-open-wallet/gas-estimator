import { EVMNetwork, Price, NativeAssetPrice } from "../model/models";
import { appConfig } from "../config/index";
import { AppConfig } from "../config/config.interface";
import { mapEVMNetworkToChainId } from "../model/models";

export class AssetPrice {

    config: AppConfig

    constructor() {
        this.config = appConfig
    }

    private async fetchPrice(chain: EVMNetwork, contract: string): Promise<NativeAssetPrice> {
        let url = `${this.config.moralis.baseUrl}${contract}/price?chain=${chain}`
        console.log(url);
        const response = await fetch(url, {
            headers: {
                accept: 'application/json',
                'X-API-Key': this.config.moralis.apiKey
            }
        })
        const priceInfo: Price = await response.json()
        return {
            chainId: mapEVMNetworkToChainId(chain),
            price: priceInfo,
            timestamp: new Date()
        }
    }

    async fetchNativeAssetPrice(): Promise<NativeAssetPrice[]> {
        let nativeContracts: Partial<Record<EVMNetwork, string>> = {
            [EVMNetwork.ethereum]: this.config.core.wethContractAddress,
            [EVMNetwork.polygon]: this.config.core.wpolContractAddress,
            [EVMNetwork.cronos]: this.config.core.wcroContractAddress
        }
        return await Promise.all(
            Object.entries(nativeContracts).map(([chain, contract]) => {
                return this.fetchPrice(chain as EVMNetwork, contract)
            })
        )
    }
}