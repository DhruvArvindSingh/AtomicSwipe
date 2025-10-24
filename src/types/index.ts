export interface ArbitrageOpportunity {
    id: string;
    tokenIn: {
        symbol: string;
        mint: string;
        logo: string;
        decimals: number;
    };
    tokenOut: {
        symbol: string;
        mint: string;
        logo: string;
        decimals: number;
    };
    buyDex: string;
    sellDex: string;
    buyPrice: number;
    sellPrice: number;
    profitUsd: number;
    profitPercent: number;
    amountIn: number;
    estimatedGas: number;
    timestamp: number;
    routes: {
        forward: any;
        backward: any;
    };
}

export interface WalletState {
    publicKey: string | null;
    balance: number;
    connected: boolean;
    walletName?: string;
}

export interface Token {
    symbol: string;
    mint: string;
    decimals: number;
    logo: string;
    coingeckoId?: string;
}
