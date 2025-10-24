import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import {
    transact,
    Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { toUint8Array } from 'js-base64';
import { Platform } from 'react-native';

class WalletService {
    private publicKey: PublicKey | null = null;
    private connected: boolean = false;
    private wallet: Web3MobileWallet | null = null;
    private authToken: string | null = null;

    async connect(): Promise<{ publicKey: string }> {
        try {
            console.log('Attempting to connect wallet...');

            // Check if we're running in web mode
            if (Platform.OS === 'web') {
                throw new Error('Web wallet connection not yet implemented. Please use the mobile app with native wallet apps (Phantom, Solflare, etc.) for full functionality. For now, using demo mode.');
            }

            await transact(async (wallet) => {
                console.log('Wallet found:', wallet.getName());

                // Authorize the wallet
                const authorizationResult = await wallet.authorize({
                    cluster: 'mainnet-beta',
                    identity: {
                        name: 'AtomicSwipe',
                        uri: 'https://atomicswipe.com',
                        icon: 'favicon.ico',
                    },
                });

                console.log('Wallet authorized:', authorizationResult);

                // Store wallet, public key, and auth token
                this.wallet = wallet;
                this.publicKey = new PublicKey(authorizationResult.accounts[0].address);
                this.authToken = authorizationResult.auth_token;
                this.connected = true;

                console.log('Connected to wallet:', this.publicKey.toBase58());

                return { publicKey: this.publicKey.toBase58() };
            });

            if (!this.publicKey) {
                throw new Error('Failed to get public key from wallet');
            }

            return { publicKey: this.publicKey.toBase58() };

        } catch (error) {
            console.error('Wallet connection failed:', error);

            // For web mode, provide a fallback demo wallet
            if (Platform.OS === 'web') {
                console.log('Using demo wallet for web mode');
                this.publicKey = new PublicKey('11111111111111111111111111111112'); // Demo public key
                this.connected = true;
                return { publicKey: this.publicKey.toBase58() };
            }

            this.connected = false;
            this.publicKey = null;
            this.wallet = null;
            throw new Error(`Wallet connection failed: ${error.message}`);
        }
    }

    async disconnect(): Promise<void> {
        try {
            if (this.wallet && this.authToken) {
                await transact(async (wallet) => {
                    await wallet.deauthorize({
                        auth_token: this.authToken!,
                    });
                });
            }
        } catch (error) {
            console.warn('Error during disconnect:', error);
        } finally {
            this.publicKey = null;
            this.connected = false;
            this.wallet = null;
            this.authToken = null;
        }
    }

    async signTransaction(transaction: Transaction | VersionedTransaction): Promise<Transaction | VersionedTransaction> {
        if (!this.connected) {
            throw new Error('Wallet not connected');
        }

        // For web mode, just return the transaction as-is (demo mode)
        if (Platform.OS === 'web') {
            console.log('Web mode: Transaction signing simulated');
            return transaction;
        }

        if (!this.wallet) {
            throw new Error('Wallet not available');
        }

        try {
            const signedTransaction = await transact(async (wallet) => {
                const serializedTransaction = transaction.serialize({
                    requireAllSignatures: false,
                    verifySignatures: false,
                });

                const signResult = await wallet.signTransactions({
                    transactions: [serializedTransaction],
                });

                // Deserialize the signed transaction
                const signedTxData = toUint8Array(signResult.signed_payloads[0]);
                return Transaction.from(signedTxData);
            });

            return signedTransaction;

        } catch (error) {
            console.error('Transaction signing failed:', error);
            throw new Error(`Transaction signing failed: ${error.message}`);
        }
    }

    async signMessage(message: Uint8Array): Promise<Uint8Array> {
        if (!this.connected) {
            throw new Error('Wallet not connected');
        }

        // For web mode, return a dummy signature (demo mode)
        if (Platform.OS === 'web') {
            console.log('Web mode: Message signing simulated');
            return new Uint8Array(64); // 64-byte signature placeholder
        }

        if (!this.wallet) {
            throw new Error('Wallet not available');
        }

        try {
            const signature = await transact(async (wallet) => {
                const signResult = await wallet.signMessages({
                    addresses: [this.publicKey!.toBytes()],
                    payloads: [message],
                });

                return toUint8Array(signResult.signed_payloads[0]);
            });

            return signature;

        } catch (error) {
            console.error('Message signing failed:', error);
            throw new Error(`Message signing failed: ${error.message}`);
        }
    }

    getPublicKey(): string | null {
        return this.publicKey?.toBase58() || null;
    }

    getPublicKeyObject(): PublicKey | null {
        return this.publicKey;
    }

    isConnected(): boolean {
        return this.connected;
    }

    getWalletName(): string | null {
        if (Platform.OS === 'web') {
            return 'Web Demo Wallet';
        }
        return this.wallet?.getName() || null;
    }

    async getTokenBalances(): Promise<Array<{ mint: string; amount: number; symbol: string }>> {
        if (!this.publicKey) {
            return [];
        }

        try {
            // For web mode, return some demo balances
            if (Platform.OS === 'web') {
                return [
                    { mint: 'So11111111111111111111111111111111111111112', amount: 10.5, symbol: 'SOL' },
                    { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', amount: 1000, symbol: 'USDC' },
                ];
            }

            // For mobile, we'll need to implement actual token balance fetching
            // This would require additional Solana web3.js integration
            console.log('Token balance fetching not yet implemented for mobile');
            return [];

        } catch (error) {
            console.error('Error fetching token balances:', error);
            return [];
        }
    }
}

export default new WalletService();
