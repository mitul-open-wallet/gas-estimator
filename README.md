# Gas Calculation Service Documentation

## Overview

This document details the gas calculation service that computes estimated gas costs across different EVM networks and transaction types. The service provides gas estimations that will be used by a gas station service for airdrop distribution.

## Supported Networks

The service supports the following EVM networks:

- Ethereum
- Base
- Optimism
- Arbitrum
- Linea
- Polygon
- Cronos

## Gas Unit Constants

The service uses predefined gas units for different transaction types:

| Transaction Type | Gas Units |
| --- | --- |
| Native Transfer | 21,000 |
| ERC20 Transfer | 65,000 |
| Token Approval | 45,000 |
| Token Swap | 150,000 |
| Contract Deploy | 400,000 |
| NFT Minting | 180,000 |

## Calculation Methodology

### Gas Cost Formula

For each transaction type, the gas cost is calculated using the following formula:

```
Gas Cost = Gas Units × Gas Price × Safety Multiplier

```

Where:

- Gas Units: Predefined constant based on transaction type
- Gas Price: Current network gas price (in wei)
- Safety Multiplier: 1.2 (20% buffer for gas price fluctuations)

### Calculation Steps

1. **Base Gas Calculation**
    
    ```tsx
    const gasLimitByTxType = mapTransactionTypeToGasUnits(type);
    const rawGasPrice = gasLimitByTxType * gasSpeed.fastest;
    
    ```
    
2. **Apply Safety Multiplier**
    
    ```tsx
    const gasInWei = rawGasPrice * 1.2; // 20% safety buffer
    
    ```
    
3. **Convert to Normal Units**
    
    ```tsx
    const gasInNormalUnits = gasInWei * Math.pow(10, -price.tokenDecimals);
    
    ```
    
4. **Calculate USD Cost**
    
    ```tsx
    const gasCostInUSD = gasInNormalUnits * price.usdPrice;
    
    ```
    

## Output Format

The service returns gas estimations in the following format:

```tsx
interface GasItem {
    type: TransactionType;
    amountWei: number;
    amountNormalized: number;
    amountUsd: number;
    asset: {
        name: string;
        symbol: string;
        logo: string;
        decimals: string;
        usdPrice: number;
        usdPriceFormatted: string;
    };
    calculatedAt: Date;
}

```

### Sample Response Structure

```json
{
  "1": [  // Ethereum Chain ID
    {
      "type": "Native Transfer",
      "amountWei": "544183723868400",
      "amountNormalized": 0.0005441837238684,
      "amountUsd": 1.81884898720296,
      "asset": {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": "18",
        "usdPrice": 3342.34360093213
      },
      "calculatedAt": "2025-01-15T15:59:21.450Z"
    },
    // ... other transaction types
  ],
  // ... other chains
}

```

## Gas Price Fetching

1. The service fetches current gas prices for each supported network
2. Native asset prices are fetched for USD conversion
3. For L2 networks using ETH as gas token, the ETH price is reused
4. Gas prices are updated continuously to ensure accuracy

## Important Notes

1. **Safety Buffer**: A 20% safety multiplier is applied to all gas estimates to account for network congestion and price fluctuations
2. **Price Updates**: Gas prices and asset prices are fetched in real-time to ensure accurate estimates
3. **Chain Specifics**: Different chains may have varying gas costs for similar operations. The service accounts for these differences through chain-specific gas price feeds
4. **Decimals Handling**: The service handles different decimal places for various network tokens appropriately

## Integration with Gas Station Service

The gas station service should:

1. Query this service for gas estimates before processing airdrops
2. Use the `amountWei` value for native transactions
3. Consider the `amountUsd` value for budget calculations
4. Monitor the `calculatedAt` timestamp to ensure fresh data

## Error Handling

The service should handle the following error cases:

- Network connectivity issues
- Invalid gas price responses
- Price feed disruptions
- Chain-specific outages

Error responses will include appropriate status codes and error messages to help diagnose issues.
