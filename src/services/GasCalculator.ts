import { it } from "node:test";
import { AssetPrice } from "./AssetPrice";
import { GasEstimation } from "./GasEstimation";
import { EVMNetwork, NativeAssetPrice, TransactionType } from "../model/models";
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
                name: price.tokenName.substring(8),
                symbol: price.tokenSymbol.substring(1),
                logo: price.tokenLogo,
                decimals: price.tokenDecimals,
                usdPrice: price.usdPrice,
                usdPriceFormatted: price.usdPriceFormatted
            },
            calculatedAt: date
        }
    }

    async compute(): Promise<Record<string, GasItem[]>> {
        const gasByChain = await this.gasEstimation.fetchGasPrice()
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
                return this.calculateGasWrtTxType(type[1], item.price, gasByChain[item.chainId!], item.timestamp)
            })
            gasByTransferType[item.chainId!] = gasItems
        })
        return gasByTransferType
    }
}