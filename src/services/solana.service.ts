import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { CONFIG } from '../constants/config';

class SolanaService {
    connection: Connection;

    constructor() {
        this.connection = new Connection(CONFIG.SOLANA_RPC, 'confirmed');
    }

    async getBalance(publicKey: string): Promise<number> {
        try {
            const balance = await this.connection.getBalance(
                new PublicKey(publicKey)
            );
            return balance / 1e9;
        } catch (error) {
            console.error('Error fetching balance:', error);
            return 0;
        }
    }

    async sendTransaction(
        transaction: Transaction,
        signTransaction: (tx: Transaction) => Promise<Transaction>
    ): Promise<string> {
        try {
            const signed = await signTransaction(transaction);
            const signature = await this.connection.sendRawTransaction(
                signed.serialize()
            );
            await this.connection.confirmTransaction(signature, 'confirmed');
            return signature;
        } catch (error) {
            console.error('Transaction failed:', error);
            throw error;
        }
    }

    async getTokenPrice(mintAddress: string): Promise<number> {
        // Simplified - in production, use a price oracle
        try {
            // You could integrate with Jupiter price API or CoinGecko
            return 0;
        } catch (error) {
            return 0;
        }
    }
}

export default new SolanaService();

