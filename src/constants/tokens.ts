import { Token } from '../types';

export const POPULAR_TOKENS: Token[] = [
    // Major tokens
    {
        symbol: 'SOL',
        mint: 'So11111111111111111111111111111111111111112',
        decimals: 9,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
        coingeckoId: 'solana',
    },
    {
        symbol: 'USDC',
        mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        decimals: 6,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
        coingeckoId: 'usd-coin',
    },
    {
        symbol: 'USDT',
        mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        decimals: 6,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png',
        coingeckoId: 'tether',
    },

    // DeFi tokens
    {
        symbol: 'JUP',
        mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
        decimals: 6,
        logo: 'https://static.jup.ag/jup/icon.png',
        coingeckoId: 'jupiter',
    },
    {
        symbol: 'RAY',
        mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
        decimals: 6,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png',
        coingeckoId: 'raydium',
    },
    {
        symbol: 'ORCA',
        mint: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',
        decimals: 6,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE/logo.png',
        coingeckoId: 'orca',
    },
    {
        symbol: 'MNGO',
        mint: 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac',
        decimals: 6,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac/logo.png',
        coingeckoId: 'mango',
    },

    // Popular meme coins and altcoins
    {
        symbol: 'BONK',
        mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        decimals: 5,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png',
        coingeckoId: 'bonk',
    },
    {
        symbol: 'WIF',
        mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
        decimals: 6,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm/logo.png',
        coingeckoId: 'wif',
    },
    {
        symbol: 'MEW',
        mint: 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScBPi',
        decimals: 5,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScBPi/logo.png',
        coingeckoId: 'mew',
    },
    {
        symbol: 'POPCAT',
        mint: '7GCihgDB8fe6KNjn2wra1qbRGLALGZCMTtCwpCJL5Nu4',
        decimals: 9,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7GCihgDB8fe6KNjn2wra1qbRGLALGZCMTtCwpCJL5Nu4/logo.png',
        coingeckoId: 'popcat',
    },

    // Wrapped tokens
    {
        symbol: 'wBTC',
        mint: '3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh',
        decimals: 8,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh/logo.png',
        coingeckoId: 'wrapped-bitcoin',
    },
    {
        symbol: 'wETH',
        mint: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
        decimals: 8,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs/logo.png',
        coingeckoId: 'weth',
    },
    {
        symbol: 'wBNB',
        mint: '9gP2kCy3wA1ctvYWQk75guqXuHfrEomqydHLtcTCqiLa',
        decimals: 8,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9gP2kCy3wA1ctvYWQk75guqXuHfrEomqydHLtcTCqiLa/logo.png',
        coingeckoId: 'binancecoin',
    },

    // Gaming and NFT tokens
    {
        symbol: 'DUST',
        mint: 'DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ',
        decimals: 9,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ/logo.png',
        coingeckoId: 'dust-protocol',
    },
    {
        symbol: 'GMT',
        mint: '7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx',
        decimals: 3,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx/logo.png',
        coingeckoId: 'stepn',
    },

    // Other stablecoins
    {
        symbol: 'USDT',
        mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        decimals: 6,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png',
        coingeckoId: 'tether',
    },
    {
        symbol: 'UST',
        mint: '9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i',
        decimals: 6,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i/logo.png',
        coingeckoId: 'terrausd',
    },

    // More popular tokens
    {
        symbol: 'PYTH',
        mint: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt',
        decimals: 6,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt/logo.png',
        coingeckoId: 'pyth-network',
    },
    {
        symbol: 'HNT',
        mint: 'hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxRg',
        decimals: 8,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxRg/logo.png',
        coingeckoId: 'helium',
    },
    {
        symbol: 'MOBILE',
        mint: 'mb1eu7TzEc71KxIl27spC7GGJZvztLDHQkdUT58ksj',
        decimals: 6,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mb1eu7TzEc71KxIl27spC7GGJZvztLDHQkdUT58ksj/logo.png',
        coingeckoId: 'helium-mobile',
    },
    {
        symbol: 'IOT',
        mint: 'iotEVVZLEyWo6EhDCJfzMYYcelFf8kUAkn52QOkC6zb',
        decimals: 6,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/iotEVVZLEyWo6EhDCJfzMYYcelFf8kUAkn52QOkC6zb/logo.png',
        coingeckoId: 'helium-iot',
    },
    {
        symbol: 'JTO',
        mint: 'jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL',
        decimals: 9,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL/logo.png',
        coingeckoId: 'jito',
    },
    {
        symbol: 'WEN',
        mint: 'WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk',
        decimals: 5,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk/logo.png',
        coingeckoId: 'wen-4',
    },
    {
        symbol: 'BOME',
        mint: 'ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82',
        decimals: 6,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82/logo.png',
        coingeckoId: 'book-of-meme',
    },
    {
        symbol: 'GIGA',
        mint: '63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5tiJxcqj9',
        decimals: 5,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5tiJxcqj9/logo.png',
        coingeckoId: 'gigachad-2',
    },
    {
        symbol: 'CLOUD',
        mint: 'CLoUDKc4Ane7HeQcPpE3YHnznRxhMimJ4MyaUqyHFzAu',
        decimals: 9,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/CLoUDKc4Ane7HeQcPpE3YHnznRxhMimJ4MyaUqyHFzAu/logo.png',
        coingeckoId: 'cloudtx',
    },
];

// High priority tokens for arbitrage scanning (most liquid pairs)
export const HIGH_PRIORITY_TOKENS: Token[] = [
    POPULAR_TOKENS.find(t => t.symbol === 'SOL')!,
    POPULAR_TOKENS.find(t => t.symbol === 'USDC')!,
    POPULAR_TOKENS.find(t => t.symbol === 'USDT')!,
    POPULAR_TOKENS.find(t => t.symbol === 'JUP')!,
    POPULAR_TOKENS.find(t => t.symbol === 'RAY')!,
    POPULAR_TOKENS.find(t => t.symbol === 'ORCA')!,
    POPULAR_TOKENS.find(t => t.symbol === 'BONK')!,
    POPULAR_TOKENS.find(t => t.symbol === 'WIF')!,
    POPULAR_TOKENS.find(t => t.symbol === 'wBTC')!,
    POPULAR_TOKENS.find(t => t.symbol === 'wETH')!,
];

export const DEX_INFO = {
    Raydium: {
        name: 'Raydium',
        logo: 'https://raydium.io/logo.png',
        color: '#8c5ae0',
    },
    Orca: {
        name: 'Orca',
        logo: 'https://www.orca.so/android-chrome-192x192.png',
        color: '#00d4ff',
    },
    Meteora: {
        name: 'Meteora',
        logo: 'https://meteora.ag/favicon.ico',
        color: '#ff6b6b',
    },
};
