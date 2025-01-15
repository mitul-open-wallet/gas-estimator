"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = exports.GasUnits = exports.EVMNetwork = void 0;
exports.mapTransactionTypeToGasUnits = mapTransactionTypeToGasUnits;
exports.mapEVMNetworkToChainId = mapEVMNetworkToChainId;
var EVMNetwork;
(function (EVMNetwork) {
    EVMNetwork["ethereum"] = "eth";
    EVMNetwork["base"] = "base";
    EVMNetwork["optimism"] = "optimism";
    EVMNetwork["arbitrum"] = "arbitrum";
    EVMNetwork["linea"] = "linea";
    EVMNetwork["polygon"] = "polygon";
    EVMNetwork["cronos"] = "cronos";
})(EVMNetwork || (exports.EVMNetwork = EVMNetwork = {}));
var GasUnits;
(function (GasUnits) {
    GasUnits[GasUnits["nativeTransfer"] = 21000] = "nativeTransfer";
    GasUnits[GasUnits["erc20Transfer"] = 65000] = "erc20Transfer";
    GasUnits[GasUnits["approve"] = 45000] = "approve";
    GasUnits[GasUnits["swap"] = 150000] = "swap";
    GasUnits[GasUnits["contractDeploy"] = 400000] = "contractDeploy";
    GasUnits[GasUnits["nftMint"] = 180000] = "nftMint";
})(GasUnits || (exports.GasUnits = GasUnits = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["nativeTransfer"] = "Native Transfer";
    TransactionType["erc20Transfer"] = "Token Transfer";
    TransactionType["swap"] = "Token Swap";
    TransactionType["contractDeploy"] = "Contract Deployment";
    TransactionType["nftMint"] = "NFT Minting";
    TransactionType["approve"] = "Token Approval";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
function mapTransactionTypeToGasUnits(txType) {
    switch (txType) {
        case TransactionType.approve:
            return GasUnits.approve;
        case TransactionType.contractDeploy:
            return GasUnits.contractDeploy;
        case TransactionType.nftMint:
            return GasUnits.nftMint;
        case TransactionType.swap:
            return GasUnits.swap;
        case TransactionType.nativeTransfer:
            return GasUnits.nativeTransfer;
        case TransactionType.erc20Transfer:
            return GasUnits.erc20Transfer;
    }
}
function mapEVMNetworkToChainId(network) {
    switch (network) {
        case EVMNetwork.ethereum:
            return "1";
        case EVMNetwork.linea:
            return "59144";
        case EVMNetwork.optimism:
            return "10";
        case EVMNetwork.polygon:
            return "137";
        case EVMNetwork.base:
            return "8453";
        case EVMNetwork.arbitrum:
            return "42161";
        case EVMNetwork.cronos:
            return "25";
        default:
            return undefined;
    }
}
