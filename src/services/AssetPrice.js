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
exports.AssetPrice = void 0;
const models_1 = require("../model/models");
const index_1 = require("../config/index");
const models_2 = require("../model/models");
class AssetPrice {
    constructor() {
        this.config = index_1.appConfig;
    }
    fetchPrice(chain, contract) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${this.config.moralis.baseUrl}${contract}/price?chain=${chain}`;
            console.log(url);
            const response = yield fetch(url, {
                headers: {
                    accept: 'application/json',
                    'X-API-Key': this.config.moralis.apiKey
                }
            });
            const priceInfo = yield response.json();
            return {
                chainId: (0, models_2.mapEVMNetworkToChainId)(chain),
                price: priceInfo,
                timestamp: new Date()
            };
        });
    }
    fetchNativeAssetPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            let nativeContracts = {
                [models_1.EVMNetwork.ethereum]: this.config.core.wethContractAddress,
                [models_1.EVMNetwork.polygon]: this.config.core.wpolContractAddress,
                [models_1.EVMNetwork.cronos]: this.config.core.wcroContractAddress
            };
            return yield Promise.all(Object.entries(nativeContracts).map(([chain, contract]) => {
                return this.fetchPrice(chain, contract);
            }));
        });
    }
}
exports.AssetPrice = AssetPrice;
