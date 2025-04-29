import { EVMNetwork, Price, NativeAssetPrice } from "../model/models";
import { appConfig } from "../config/index";
import { AppConfig } from "../config/config.interface";
import { mapEVMNetworkToChainId } from "../model/models";

interface PricePromiseContainer {
    date: Date,
    promise: Promise<NativeAssetPrice>
}

interface AssetPriceCache {
    cachedAt: Date,
    assetPrice: NativeAssetPrice[]
}

export class AssetPrice {

    private readonly REQUEST_TIMEOUT: number = 5 * 1000;
    private readonly CACHE_DURATION: number = 60 * 1000;
    nativeContracts: Partial<Record<EVMNetwork, string>> = {};
    config: AppConfig
    cache?: AssetPriceCache = undefined
    promises: Map<string, PricePromiseContainer> = new Map();

    constructor() {
        this.config = appConfig
        this.nativeContracts = {
            [EVMNetwork.ethereum]: this.config.core.wethContractAddress,
            [EVMNetwork.polygon]: this.config.core.wpolContractAddress,
            [EVMNetwork.cronos]: this.config.core.wcroContractAddress,
            [EVMNetwork.binanceSmartChain]: this.config.core.wbnbContractAdrress
        }
    }

    private getCacheKey(chain: EVMNetwork, contract: string): string {
        return `${chain}:${contract}}`
    }

    private async fetchPrice(chain: EVMNetwork, contract: string): Promise<NativeAssetPrice> {
        const cacheKey = this.getCacheKey(chain, contract)
        let existingPromise = this.promises.get(cacheKey)

        let fetchPromise = (async () => {
            try {
                let url = `${this.config.moralis.baseUrl}${contract}/price?chain=${chain}`
                const response = await fetch(url, {
                    headers: {
                        accept: 'application/json',
                        'X-API-Key': this.config.moralis.apiKey
                    }
                })
                if (response.ok === false) {
                    throw new Error(`Error: ${response.status}`)
                }
                const priceInfo: Price = await response.json()
                return {
                    chainId: mapEVMNetworkToChainId(chain),
                    price: priceInfo,
                    timestamp: new Date()
                } as NativeAssetPrice
            } catch (error) {
                // TODO:- Add a retry
                throw error
            }
        })();

        if (existingPromise !== undefined) {
            console.log("promise store not empty");
            let timeNow = new Date()
            let delta = timeNow.getTime() - existingPromise.date.getTime()

            if (delta > this.REQUEST_TIMEOUT) {
                console.log("promise store expired");
                this.promises.delete(cacheKey);
                this.promises.set(cacheKey, {
                    date: new Date(),
                    promise: fetchPromise
                })
                return fetchPromise
            } else {
                console.log("promise store active");
                // utilise existing promise
                return this.promises.get(cacheKey)!.promise;
            }
        } else {
            console.log("promise store empty");
            this.promises.set(cacheKey, {
                date: new Date(),
                promise: fetchPromise
            })
            return fetchPromise
        }
    }

    async fetchAllPrices(): Promise<NativeAssetPrice[]> {
        const assetPrices = await Promise.all(
            Object.entries(this.nativeContracts).map(([chain, contract]) => {
                return this.fetchPrice(chain as EVMNetwork, contract)
            })
        )
        return assetPrices
    }

    clearOldPromises() {
        const timeNow = new Date();
        for (const [item, value] of Object.entries(this.nativeContracts)) {
            const cacheKey = this.getCacheKey(item as EVMNetwork, value)
            let promiseTime = this.promises.get(cacheKey)?.date.getTime() ?? 0
            let delta = timeNow.getTime() - promiseTime
            if (delta > this.CACHE_DURATION) {
                this.promises.delete(cacheKey)
            }
        }
    }

    async fetchNativeAssetPrice(): Promise<NativeAssetPrice[]> {
        this.clearOldPromises()
        if (this.cache === undefined) {
            console.log("No cache")
            const prices = await this.fetchAllPrices()
            this.cache = {
                cachedAt: new Date(),
                assetPrice: prices
            }
            return prices
        } else {
            const timeNow = new Date()
            const delta = timeNow.getTime() - this.cache.cachedAt.getTime()
            if (delta > this.CACHE_DURATION) {
                console.log("Expired cache")
                const prices = await this.fetchAllPrices()
                this.cache = {
                    cachedAt: new Date(),
                    assetPrice: prices
                }
                return prices
            } else {
                console.log("Hit cache")
                return this.cache.assetPrice
            }
        }
    }
}