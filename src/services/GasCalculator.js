"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GasCalculator = void 0;
const AssetPrice_1 = require("./AssetPrice");
const GasEstimation_1 = require("./GasEstimation");
const models_1 = require("../model/models");
const models_2 = require("../model/models");
const models_3 = require("../model/models");
class GasCalculator {
    constructor() {
        this.assetPrice = new AssetPrice_1.AssetPrice();
        this.gasEstimation = new GasEstimation_1.GasEstimation();
    }
    assetPriceForSimilarAssets(date, price) {
        return [models_1.EVMNetwork.arbitrum, models_1.EVMNetwork.base, models_1.EVMNetwork.optimism, models_1.EVMNetwork.linea].map(item => {
            return {
                chainId: (0, models_3.mapEVMNetworkToChainId)(item),
                price: price,
                timestamp: date
            };
        });
    }
    calculateGasWrtTxType(type, price, gasSpeed, date) {
        const safetyMultiplier = 1.2;
        const gasLimitByTxType = (0, models_2.mapTransactionTypeToGasUnits)(type);
        const rawGasPrice = gasLimitByTxType * gasSpeed.fastest;
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
        };
    }
    compute() {
        return __awaiter(this, void 0, void 0, function* () {
            const gasByChain = yield this.gasEstimation.fetchGasPrice();
            const nativeAssetsPrice = yield this.assetPrice.fetchNativeAssetPrice();
            const ethPrice = nativeAssetsPrice.filter(item => {
                return item.chainId === (0, models_3.mapEVMNetworkToChainId)(models_1.EVMNetwork.ethereum);
            })[0];
            let date = new Date();
            nativeAssetsPrice.push(...this.assetPriceForSimilarAssets(date, ethPrice.price));
            let gasByTransferType = {};
            nativeAssetsPrice.forEach(item => {
                const gasItems = Object.entries(models_1.TransactionType).map(type => {
                    return this.calculateGasWrtTxType(type[1], item.price, gasByChain[item.chainId], item.timestamp);
                });
                gasByTransferType[item.chainId] = gasItems;
            });
            return gasByTransferType;
        });
    }
}
exports.GasCalculator = GasCalculator;
