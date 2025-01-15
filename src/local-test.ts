import { GasEstimation } from "./services/GasEstimation";
import { AssetPrice } from "./services/AssetPrice";
import { GasCalculator } from "./services/GasCalculator";


// const gasEstimate = new GasEstimation();
// gasEstimate.fetchGasPrice();

// const priceService = new AssetPrice();
// priceService.fetchNativeAssetPrice();

const gasCalculator = new GasCalculator();
console.log(gasCalculator.compute());