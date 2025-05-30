import { it } from "node:test";
import { AssetPrice } from "./AssetPrice";
import { GasEstimation } from "./GasEstimation";
import { EVMNetwork, GasByChain, NativeAssetPrice, TransactionType } from "../model/models";
import { mapTransactionTypeToGasUnits } from "../model/models";
import { GasSpeedTier } from "../model/models";
import { mapEVMNetworkToChainId } from "../model/models";
import { Price } from "../model/models";
import { GasAsset, GasItem } from "../model/models";

export class GasCalculator {
    assetPrice: AssetPrice
    gasEstimation: GasEstimation

    constructor() {
        this.assetPrice = new AssetPrice();
        this.gasEstimation = new GasEstimation();
    }

    private assetPriceForSimilarAssets(date: Date, price: Price): NativeAssetPrice[] {
        return [EVMNetwork.arbitrum, EVMNetwork.base, EVMNetwork.optimism, EVMNetwork.linea].map(item => {
            return {
                chainId: mapEVMNetworkToChainId(item),
                price: price,
                timestamp: date
            }
        })
    }

    private calculateGasWrtTxType(type: TransactionType, price: Price, gasSpeed: GasSpeedTier, date: Date): GasItem {
        const safetyMultiplier = 1.2;
        const gasLimitByTxType = mapTransactionTypeToGasUnits(type);
        const rawGasPrice = gasLimitByTxType * gasSpeed.fastest
        const gasInWei = rawGasPrice * safetyMultiplier;
        const gasInNormalUnits = gasInWei * Math.pow(10, -price.tokenDecimals);
        const gasCostInUSD = gasInNormalUnits * price.usdPrice;

        return {
            type: type,
            amountWei: gasInWei,
            amountNormalized: gasInNormalUnits,
            amountUsd: gasCostInUSD,
            asset: {
                name: price && price.tokenName ? price.tokenName.substring(8) : "",
                symbol: price && price.tokenSymbol ? price.tokenSymbol.substring(1) : "",
                logo: price && price.tokenLogo ? price.tokenLogo : "",
                decimals: price && price.tokenDecimals ? price.tokenDecimals : "",
                usdPrice: price && price.usdPrice ? price.usdPrice : 0,
                usdPriceFormatted: price && price.usdPrice ? price.usdPriceFormatted : ""
            },
            calculatedAt: date
        }
    }

    async fetchGasByChain(): Promise<GasByChain> {
        return await this.gasEstimation.fetchGasPrice()
    }

    async compute(): Promise<Record<string, GasItem[]>> {
        const gasByChain = await this.fetchGasByChain()
        const nativeAssetsPrice = await this.assetPrice.fetchNativeAssetPrice()

        const ethPrice = nativeAssetsPrice.filter(item => {
            return item.chainId === mapEVMNetworkToChainId(EVMNetwork.ethereum)
        })[0]

        let date = new Date()
        nativeAssetsPrice.push(
            ...this.assetPriceForSimilarAssets(date, ethPrice.price)
        )

        let gasByTransferType: Record<string, GasItem[]> = {};

        nativeAssetsPrice.forEach(item => {
            const gasItems = Object.entries(TransactionType).map(type => {
                const chainId = item.chainId!
                let gasSpeedTier: GasSpeedTier
                if (gasByChain[chainId] === undefined) {
                    console.log(`could not find gas speed tier for chain: ${chainId}`)
                    gasSpeedTier = {
                        "standard": 110000000,
                        "fast": 110000000,
                        "fastest": 120000000
                    }
                } else {
                    gasSpeedTier = gasByChain[chainId]
                }

                return this.calculateGasWrtTxType(type[1], item.price, gasSpeedTier, item.timestamp)
            })
            gasByTransferType[item.chainId!] = gasItems
        })
        return gasByTransferType
    }
}