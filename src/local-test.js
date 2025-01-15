"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GasCalculator_1 = require("./services/GasCalculator");
// const gasEstimate = new GasEstimation();
// gasEstimate.fetchGasPrice();
// const priceService = new AssetPrice();
// priceService.fetchNativeAssetPrice();
const gasCalculator = new GasCalculator_1.GasCalculator();
console.log(gasCalculator.compute());
