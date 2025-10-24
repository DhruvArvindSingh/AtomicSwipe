import { useState, useCallback } from 'react';
import WalletService from '../services/wallet.service';
import SolanaService from '../services/solana.service';
import { WalletState } from '../types';

export const useWallet = () => {
    const [wallet, setWallet] = useState<WalletState>({
        publicKey: null,
        balance: 0,
        connected: false,
        walletName: undefined,
    });

    const connect = useCallback(async () => {
        try {
            const { publicKey } = await WalletService.connect();
            const balance = await SolanaService.getBalance(publicKey);
            const walletName = WalletService.getWalletName();

            setWallet({
                publicKey,
                balance,
                connected: true,
                walletName: walletName || undefined,
            });

            return publicKey;
        } catch (error) {
            console.error('Wallet connection failed:', error);
            throw error;
        }
    }, []);

    const disconnect = useCallback(async () => {
        await WalletService.disconnect();
        setWallet({
            publicKey: null,
            balance: 0,
            connected: false,
            walletName: undefined,
        });
    }, []);

    const refreshBalance = useCallback(async () => {
        if (wallet.publicKey) {
            const balance = await SolanaService.getBalance(wallet.publicKey);
            setWallet(prev => ({ ...prev, balance }));
        }
    }, [wallet.publicKey]);

    const getTokenBalances = useCallback(async () => {
        return await WalletService.getTokenBalances();
    }, []);

    return {
        wallet,
        connect,
        disconnect,
        refreshBalance,
        getTokenBalances,
    };
};
