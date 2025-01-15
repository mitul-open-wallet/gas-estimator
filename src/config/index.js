"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getAppConfig() {
    return {
        moralis: {
            baseUrl: process.env.MORALIS_BASE_URL || "",
            apiKey: process.env.MORALIS_API_KEY || ""
        },
        lifi: {
            baseUrl: process.env.LIFI_BASE_URL || "",
            apiKey: process.env.LIFI_API_KEY || ""
        },
        environment: (process.env.ENVIRONMENT || "development"),
        core: {
            port: process.env.PORT || "3000",
            wethContractAddress: process.env.WETH_CONTRACT_ADDRESS || "",
            wcroContractAddress: process.env.WCRO_CONTRACT_ADDRESS || "",
            wpolContractAddress: process.env.WPOL_CONTRACT_ADDRESS || ""
        }
    };
}
exports.appConfig = getAppConfig();
