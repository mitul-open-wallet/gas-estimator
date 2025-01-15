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
exports.GasEstimation = void 0;
const config_1 = require("../config");
const models_1 = require("../model/models");
class GasEstimation {
    constructor() {
        this.config = config_1.appConfig;
    }
    fetchGasPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.config.lifi.baseUrl}gas/prices`;
            console.log(url);
            const response = yield fetch(url, {
                headers: {
                    'accept': 'application/json',
                    'x-lifi-api-key': this.config.lifi.apiKey
                }
            });
            const gasPrices = yield response.json();
            return gasPrices;
        });
    }
    mapChainIdtoEVMNetwork(chainId) {
        switch (chainId) {
            case "1":
                return models_1.EVMNetwork.ethereum;
            case "59144":
                return models_1.EVMNetwork.linea;
            case "10":
                return models_1.EVMNetwork.optimism;
            case "137":
                return models_1.EVMNetwork.polygon;
            case "8453":
                return models_1.EVMNetwork.base;
            case "42161":
                return models_1.EVMNetwork.arbitrum;
            case "25":
                return models_1.EVMNetwork.cronos;
            default:
                return undefined;
        }
    }
}
exports.GasEstimation = GasEstimation;
