export enum EVMNetwork {
    ethereum = 'eth',
    base = 'base',
    optimism = 'optimism',
    arbitrum = 'arbitrum',
    linea =  'linea',
    polygon = 'polygon',
    cronos = 'cronos'
}

export enum GasUnits {
    nativeTransfer = 21000,
    erc20Transfer = 65000,
    approve = 45000,
    swap = 150000,
    contractDeploy = 400000,
    nftMint = 180000
  }
  
  export enum TransactionType {
    nativeTransfer = 'NativeTransfer',
    erc20Transfer = 'TokenTransfer', 
    swap = 'TokenSwap',
    contractDeploy =  'ContractDeployment',
    nftMint = 'NFTMinting',
    approve = 'TokenApproval'
  }

  export interface NativeAssetPrice {
    chainId: string | undefined,
    price: Price
    timestamp: Date
  }

  export interface Price {
    tokenName: string
    tokenSymbol: string
    tokenLogo: string
    tokenDecimals: string
    nativePrice?: {
        value: string
        decimals: number,
        name: string
        symbol: string
        address: string
    },
    usdPrice: number
    usdPriceFormatted: string
}

export interface GasSpeedTier {
    standard: number,
    fast: number,
    fastest: number
    lastUpdated: string
}

export interface GasByChain {
    [chainId: string]: GasSpeedTier
}

export interface GasItem {
    type: TransactionType,
    amountWei: number,
    amountNormalized: number,
    amountUsd: number,
    asset: GasAsset,
    calculatedAt: Date
}

export interface GasAsset {
    name: string,
    symbol: string,
    logo: string,
    decimals: string,
    usdPrice: number
    usdPriceFormatted: string
}


export function mapTransactionTypeToGasUnits(txType: TransactionType): GasUnits {
    switch (txType) {
        case TransactionType.approve:
            return GasUnits.approve
        case TransactionType.contractDeploy:
            return GasUnits.contractDeploy
        case TransactionType.nftMint:
            return GasUnits.nftMint
        case TransactionType.swap:
            return GasUnits.swap
        case TransactionType.nativeTransfer:
            return GasUnits.nativeTransfer
        case TransactionType.erc20Transfer:
            return GasUnits.erc20Transfer
    }
}

export function mapEVMNetworkToChainId(network: EVMNetwork): string | undefined {
    switch (network) {
        case EVMNetwork.ethereum:
            return "1"
        case EVMNetwork.linea:
            return "59144"
        case EVMNetwork.optimism:
            return "10"
        case EVMNetwork.polygon:
            return "137"
        case EVMNetwork.base:
            return "8453"
        case EVMNetwork.arbitrum:
            return "42161"
        case EVMNetwork.cronos:
            return "25"
        default:
            return undefined
        
    }
}