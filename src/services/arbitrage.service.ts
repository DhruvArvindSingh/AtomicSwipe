import { ArbitrageOpportunity, Token } from '../types';
import JupiterService from './jupiter.service';
import { POPULAR_TOKENS, HIGH_PRIORITY_TOKENS } from '../constants/tokens';
import { CONFIG } from '../constants/config';

class ArbitrageService {
    private isScanning = false;

    async scanOpportunities(
        userTokens?: Array<{ mint: string; amount: number; symbol: string }>,
        onOpportunityFound?: (opportunity: ArbitrageOpportunity) => void
    ): Promise<ArbitrageOpportunity[]> {
        if (this.isScanning) {
            console.log('Scan already in progress');
            return [];
        }

        this.isScanning = true;
        const opportunities: ArbitrageOpportunity[] = [];

        try {
            // If user tokens provided, focus on those; otherwise use high priority tokens
            const tokensToScan = userTokens && userTokens.length > 0
                ? this.mapUserTokensToTokens(userTokens)
                : HIGH_PRIORITY_TOKENS;

            console.log(`Scanning arbitrage opportunities for ${tokensToScan.length} user tokens...`);

            // For each user token, find triangular arbitrage opportunities
            for (const userToken of tokensToScan) {
                const tokenOpportunities = await this.findTriangularArbitrage(userToken, onOpportunityFound);

                // Add opportunities to final results (notification handled by callback)
                opportunities.push(...tokenOpportunities);

                // Rate limiting
                await this.sleep(300);
            }

            console.log(`Scan completed. Total opportunities found: ${opportunities.length}`);

            // Filter out any invalid opportunities
            const validOpportunities = opportunities.filter(opp =>
                opp &&
                typeof opp.profitUsd === 'number' &&
                typeof opp.estimatedGas === 'number'
            );

            console.log(`Valid opportunities: ${validOpportunities.length}`);

            return validOpportunities.sort(
                (a, b) => b.profitUsd - a.profitUsd
            );
        } catch (error) {
            console.error('Scan error:', error);
            return [];
        } finally {
            this.isScanning = false;
        }
    }

    private mapUserTokensToTokens(userTokens: Array<{ mint: string; amount: number; symbol: string }>): Token[] {
        return userTokens.map(userToken => {
            // Find the token in our token list, or create a generic one
            const existingToken = POPULAR_TOKENS.find(t => t.mint === userToken.mint);
            if (existingToken) {
                return existingToken;
            }

            // Create a generic token entry
            return {
                symbol: userToken.symbol,
                mint: userToken.mint,
                decimals: 9, // Assume 9 decimals for unknown tokens
                logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png', // Default SOL logo
                coingeckoId: undefined,
            };
        });
    }

    private async findTriangularArbitrage(
        startToken: Token,
        onOpportunityFound?: (opportunity: ArbitrageOpportunity) => void
    ): Promise<ArbitrageOpportunity[]> {
        const opportunities: ArbitrageOpportunity[] = [];

        try {
            console.log(`Finding triangular arbitrage for ${startToken.symbol}`);

            // Use 1 unit of the start token
            const amountIn = Math.pow(10, startToken.decimals);

            // Find all possible intermediate tokens (exclude the start token)
            const intermediateTokens = HIGH_PRIORITY_TOKENS.filter(t => t.mint !== startToken.mint);

            for (const intermediateToken of intermediateTokens) {
                try {
                    // Step 1: Start Token → Intermediate Token
                    const quote1 = await JupiterService.getQuote(
                        startToken.mint,
                        intermediateToken.mint,
                        amountIn
                    );

                    if (!quote1) continue;

                    // Step 2: Intermediate Token → Back to Start Token
                    const intermediateAmount = parseInt(quote1.outAmount);
                    const quote2 = await JupiterService.getQuote(
                        intermediateToken.mint,
                        startToken.mint,
                        intermediateAmount
                    );

                    if (!quote2) continue;

                    // Calculate profit
                    const finalAmount = parseInt(quote2.outAmount);
                    const profit = finalAmount - amountIn;
                    const profitPercent = (profit / amountIn) * 100;

                    // Estimate USD value
                    const profitUsd = this.estimateUsdValue(profit, startToken);

                    // Only include profitable opportunities
                    if (profitUsd >= CONFIG.MIN_PROFIT_USD && profitPercent >= CONFIG.MIN_PROFIT_PERCENT) {
                        const opportunity: ArbitrageOpportunity = {
                            id: `triangular-${Date.now()}-${startToken.symbol}-${intermediateToken.symbol}`,
                            tokenIn: {
                                symbol: startToken.symbol,
                                mint: startToken.mint,
                                logo: startToken.logo,
                                decimals: startToken.decimals,
                            },
                            tokenOut: {
                                symbol: intermediateToken.symbol,
                                mint: intermediateToken.mint,
                                logo: intermediateToken.logo,
                                decimals: intermediateToken.decimals,
                            },
                            buyDex: JupiterService.extractDexFromRoute(quote1.routePlan),
                            sellDex: JupiterService.extractDexFromRoute(quote2.routePlan),
                            buyPrice: amountIn / parseInt(quote1.outAmount),
                            sellPrice: parseInt(quote1.outAmount) / finalAmount,
                            profitUsd,
                            profitPercent,
                            amountIn: amountIn / Math.pow(10, startToken.decimals),
                            estimatedGas: 0.004, // Higher gas for triangular arbitrage
                            timestamp: Date.now(),
                            routes: {
                                forward: quote1,
                                backward: quote2,
                            },
                        };

                        opportunities.push(opportunity);
                        console.log(`Found opportunity: ${startToken.symbol} → ${intermediateToken.symbol} → ${startToken.symbol}, profit: $${profitUsd.toFixed(2)}`);

                        // Notify immediately if callback provided
                        if (onOpportunityFound) {
                            onOpportunityFound(opportunity);
                        }
                    }

                    // Rate limiting
                    await this.sleep(200);

                } catch (error) {
                    // Continue to next intermediate token
                    continue;
                }
            }

        } catch (error) {
            console.error(`Error finding triangular arbitrage for ${startToken.symbol}:`, error);
        }

        return opportunities;
    }

    private generateTokenPairs(): Array<{
        tokenA: Token;
        tokenB: Token;
    }> {
        const pairs: Array<{ tokenA: Token; tokenB: Token }> = [];

        // Use high priority tokens for primary scanning (most liquid pairs)
        const tokensToScan = HIGH_PRIORITY_TOKENS;

        console.log(`Using ${tokensToScan.length} high-priority tokens for arbitrage scanning`);

        for (let i = 0; i < tokensToScan.length; i++) {
            for (let j = i + 1; j < tokensToScan.length; j++) {
                pairs.push({
                    tokenA: tokensToScan[i],
                    tokenB: tokensToScan[j],
                });
            }
        }

        return pairs;
    }

    private async checkArbitrage(
        tokenA: Token,
        tokenB: Token
    ): Promise<ArbitrageOpportunity | null> {
        try {
            // Use 1 unit of tokenA
            const amountIn = Math.pow(10, tokenA.decimals);

            // Get quote A -> B
            const quoteAB = await JupiterService.getQuote(
                tokenA.mint,
                tokenB.mint,
                amountIn
            );

            if (!quoteAB) return null;

            // Get quote B -> A
            const quoteBA = await JupiterService.getQuote(
                tokenB.mint,
                tokenA.mint,
                parseInt(quoteAB.outAmount)
            );

            if (!quoteBA) return null;

            const finalAmount = parseInt(quoteBA.outAmount);
            const profit = finalAmount - amountIn;
            const profitPercent = (profit / amountIn) * 100;

            // Estimate USD value (simplified - use real price oracle)
            const profitUsd = this.estimateUsdValue(
                profit,
                tokenA
            );

            if (
                profitUsd < CONFIG.MIN_PROFIT_USD ||
                profitPercent < CONFIG.MIN_PROFIT_PERCENT
            ) {
                return null;
            }

            const opportunity = {
                id: `${Date.now()}-${tokenA.symbol}-${tokenB.symbol}`,
                tokenIn: {
                    symbol: tokenA.symbol,
                    mint: tokenA.mint,
                    logo: tokenA.logo,
                    decimals: tokenA.decimals,
                },
                tokenOut: {
                    symbol: tokenB.symbol,
                    mint: tokenB.mint,
                    logo: tokenB.logo,
                    decimals: tokenB.decimals,
                },
                buyDex: JupiterService.extractDexFromRoute(
                    quoteAB.routePlan
                ),
                sellDex: JupiterService.extractDexFromRoute(
                    quoteBA.routePlan
                ),
                buyPrice: amountIn / parseInt(quoteAB.outAmount),
                sellPrice: parseInt(quoteAB.outAmount) / finalAmount,
                profitUsd,
                profitPercent,
                amountIn: amountIn / Math.pow(10, tokenA.decimals),
                estimatedGas: 0.002, // ~0.002 SOL for transaction
                timestamp: Date.now(),
                routes: {
                    forward: quoteAB,
                    backward: quoteBA,
                },
            };

            // Validate the opportunity has all required properties
            if (!opportunity.profitUsd || typeof opportunity.profitUsd !== 'number') {
                console.warn('Invalid opportunity generated:', opportunity);
                return null;
            }

            return opportunity;
        } catch (error) {
            return null;
        }
    }

    private estimateUsdValue(amount: number, token: Token): number {
        // Simplified USD estimation
        // In production, use a real price feed
        const prices: Record<string, number> = {
            SOL: 150,
            USDC: 1,
            USDT: 1,
            JUP: 1.2,
            RAY: 2.5,
        };

        const price = prices[token.symbol] || 0;
        const tokenAmount = amount / Math.pow(10, token.decimals);

        return tokenAmount * price;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private getMockOpportunities(): ArbitrageOpportunity[] {
        const tokens = POPULAR_TOKENS.reduce((acc, token) => {
            acc[token.symbol] = token;
            return acc;
        }, {} as Record<string, Token>);

        const { SOL, USDC, JUP, BONK, WIF, wBTC, wETH } = tokens;

        return [
            {
                id: `mock-${Date.now()}-1`,
                tokenIn: SOL,
                tokenOut: USDC,
                buyDex: 'Raydium',
                sellDex: 'Orca',
                buyPrice: 150.5,
                sellPrice: 151.2,
                profitUsd: 8.5,
                profitPercent: 0.8,
                amountIn: 1,
                estimatedGas: 0.002,
                timestamp: Date.now(),
                routes: {
                    forward: {},
                    backward: {},
                },
            },
            {
                id: `mock-${Date.now()}-2`,
                tokenIn: JUP,
                tokenOut: SOL,
                buyDex: 'Meteora',
                sellDex: 'Raydium',
                buyPrice: 1.15,
                sellPrice: 1.18,
                profitUsd: 6.2,
                profitPercent: 0.6,
                amountIn: 100,
                estimatedGas: 0.0015,
                timestamp: Date.now(),
                routes: {
                    forward: {},
                    backward: {},
                },
            },
            {
                id: `mock-${Date.now()}-3`,
                tokenIn: BONK,
                tokenOut: USDC,
                buyDex: 'Raydium',
                sellDex: 'Meteora',
                buyPrice: 0.000015,
                sellPrice: 0.000016,
                profitUsd: 12.3,
                profitPercent: 1.2,
                amountIn: 1000000,
                estimatedGas: 0.0018,
                timestamp: Date.now(),
                routes: {
                    forward: {},
                    backward: {},
                },
            },
            {
                id: `mock-${Date.now()}-4`,
                tokenIn: WIF,
                tokenOut: wETH,
                buyDex: 'Orca',
                sellDex: 'Raydium',
                buyPrice: 2.85,
                sellPrice: 2.92,
                profitUsd: 15.7,
                profitPercent: 1.4,
                amountIn: 50,
                estimatedGas: 0.0022,
                timestamp: Date.now(),
                routes: {
                    forward: {},
                    backward: {},
                },
            },
            {
                id: `mock-${Date.now()}-5`,
                tokenIn: wBTC,
                tokenOut: SOL,
                buyDex: 'Meteora',
                sellDex: 'Orca',
                buyPrice: 95000,
                sellPrice: 95200,
                profitUsd: 22.1,
                profitPercent: 0.9,
                amountIn: 0.001,
                estimatedGas: 0.0025,
                timestamp: Date.now(),
                routes: {
                    forward: {},
                    backward: {},
                },
            },
        ];
    }
}

export default new ArbitrageService();
