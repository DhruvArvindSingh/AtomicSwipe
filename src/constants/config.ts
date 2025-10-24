export const CONFIG = {
    SOLANA_RPC: process.env.SOLANA_RPC_ENDPOINT ||
        'https://mainnet.helius-rpc.com/?api-key=8263b57a-0e04-4d5d-8177-86200037f57c',
    JUPITER_API: process.env.JUPITER_API_URL ||
        'https://preprod-quote-api.jup.ag',
    MIN_PROFIT_USD: Number(process.env.MIN_PROFIT_USD) || 0.1, // Lower threshold for demo
    MIN_PROFIT_PERCENT: Number(process.env.MIN_PROFIT_PERCENT) || 0.01, // Lower threshold for demo
    REFRESH_INTERVAL: 30000, // 30 seconds
    MAX_SLIPPAGE_BPS: 50, // 0.5%
};
