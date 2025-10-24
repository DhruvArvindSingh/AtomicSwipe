import axios from 'axios';
import { CONFIG } from '../constants/config';

interface JupiterQuote {
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    priceImpactPct: number;
    routePlan: any[];
}

class JupiterService {
    private baseURL = CONFIG.JUPITER_API;

    async getQuote(
        inputMint: string,
        outputMint: string,
        amount: number
    ): Promise<JupiterQuote | null> {
        try {
            console.log(`Fetching quote: ${inputMint} -> ${outputMint}, amount: ${amount}`);
            const response = await axios.get(`${this.baseURL}/quote`, {
                params: {
                    inputMint,
                    outputMint,
                    amount: Math.floor(amount),
                    slippageBps: CONFIG.MAX_SLIPPAGE_BPS,
                    onlyDirectRoutes: false,
                },
            });
            console.log(`Quote received:`, response.data);
            return response.data;
        } catch (error) {
            console.error('Jupiter quote error:', error);
            return null;
        }
    }

    async getSwapTransaction(
        quote: any,
        userPublicKey: string
    ): Promise<string> {
        try {
            const response = await axios.post(`${this.baseURL}/swap`, {
                quoteResponse: quote,
                userPublicKey,
                wrapAndUnwrapSol: true,
                dynamicComputeUnitLimit: true,
                prioritizationFeeLamports: 'auto',
            });
            return response.data.swapTransaction;
        } catch (error) {
            console.error('Jupiter swap error:', error);
            throw error;
        }
    }

    extractDexFromRoute(routePlan: any[]): string {
        if (!routePlan || routePlan.length === 0) return 'Unknown';

        const firstSwap = routePlan[0]?.swapInfo;
        if (!firstSwap) return 'Unknown';

        const label = firstSwap.label?.toLowerCase() || '';

        if (label.includes('raydium')) return 'Raydium';
        if (label.includes('orca')) return 'Orca';
        if (label.includes('meteora')) return 'Meteora';

        return 'Jupiter';
    }
}

export default new JupiterService();
