import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StatusBar,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { SwipeCard } from '../components/SwipeCard';
import { useWallet } from '../hooks/useWallet';
import { useArbitrage } from '../hooks/useArbitrage';
import { Transaction } from '@solana/web3.js';
import { Platform } from 'react-native';
import JupiterService from '../services/jupiter.service';
import SolanaService from '../services/solana.service';
import WalletService from '../services/wallet.service';

export const HomeScreen: React.FC = () => {
    const { wallet, connect, disconnect, refreshBalance, getTokenBalances } = useWallet();
    const [userTokens, setUserTokens] = useState<Array<{ mint: string; amount: number; symbol: string }>>([]);
    const { opportunities, loading, hasScanned, newOpportunityCount, resetNewOpportunityCount, refresh } = useArbitrage(userTokens);
    const [executing, setExecuting] = useState(false);
    const [fetchingTokens, setFetchingTokens] = useState(false);
    const swiperRef = useRef<any>(null);

    const handleSwipeLeft = async (index: number) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        console.log('Skipped:', opportunities[index]?.id);
        // Reset new opportunity counter when user interacts
        if (newOpportunityCount > 0) {
            resetNewOpportunityCount();
        }
    };

    const handleSwipeRight = async (index: number) => {
        await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
        );

        const opp = opportunities[index];
        if (!opp) return;

        if (!wallet.connected) {
            Alert.alert(
                'Wallet Required',
                'Please connect your wallet to execute trades'
            );
            return;
        }

        // Reset new opportunity counter when user interacts
        if (newOpportunityCount > 0) {
            resetNewOpportunityCount();
        }

        Alert.alert(
            'Execute Arbitrage?',
            `Profit: $${opp.profitUsd.toFixed(2)}\n` +
            `Route: ${opp.tokenIn.symbol} → ${opp.tokenOut.symbol} → ${opp.tokenIn.symbol}\n` +
            `DEXs: ${opp.buyDex} → ${opp.sellDex}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Execute',
                    onPress: () => executeArbitrage(opp),
                },
            ]
        );
    };

    const executeArbitrage = async (opp: any) => {
        setExecuting(true);

        try {
            console.log('Executing arbitrage:', opp);

            // Get swap transaction from Jupiter
            const swapTransaction = await JupiterService.getSwapTransaction(
                opp.routes.forward,
                wallet.publicKey!
            );

            console.log('Got swap transaction from Jupiter');

            // Parse and sign the transaction
            const transaction = Transaction.from(Buffer.from(swapTransaction, 'base64'));

            // Sign with wallet
            const signedTransaction = await WalletService.signTransaction(transaction);

            console.log('Transaction signed, sending to network...');

            // Send transaction
            const signature = await SolanaService.sendTransaction(
                signedTransaction as any,
                WalletService.signTransaction.bind(WalletService)
            );

            console.log('Transaction sent:', signature);

            await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
            );

            if (Platform.OS === 'web') {
                Alert.alert(
                    '🎉 Demo Trade Executed!',
                    `Web mode: Trade simulated successfully!\nProfit: $${opp.profitUsd.toFixed(2)}\nFor real trading, use the mobile app with native wallets.`
                );
            } else {
                Alert.alert(
                    '🎉 Success!',
                    `Arbitrage executed!\nProfit: $${opp.profitUsd.toFixed(2)}\nTx: ${signature.slice(0, 8)}...`
                );
            }

            // Refresh balance after successful trade (only meaningful on mobile)
            if (Platform.OS !== 'web') {
                await refreshBalance();
            }

        } catch (error: any) {
            console.error('Arbitrage execution failed:', error);

            await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error
            );

            Alert.alert(
                'Execution Failed',
                error.message || 'Unknown error occurred'
            );
        } finally {
            setExecuting(false);
        }
    };

    const handleConnect = async () => {
        try {
            await connect();
            await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
            );

            // Fetch user's token balances after connection
            setFetchingTokens(true);
            try {
                const tokens = await getTokenBalances();
                setUserTokens(tokens);
                console.log('Fetched user tokens:', tokens);
            } catch (error) {
                console.error('Failed to fetch token balances:', error);
                // Use demo tokens for web mode
                if (Platform.OS === 'web') {
                    setUserTokens([
                        { mint: 'So11111111111111111111111111111111111111112', amount: 10.5, symbol: 'SOL' },
                        { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', amount: 1000, symbol: 'USDC' },
                    ]);
                }
            } finally {
                setFetchingTokens(false);
            }

            if (Platform.OS === 'web') {
                Alert.alert(
                    'Demo Wallet Connected!',
                    'Web mode: Using demo wallet with sample tokens. Real wallet functionality requires mobile apps.'
                );
            } else {
                Alert.alert('Connected!', 'Wallet connected successfully. Scanning for arbitrage opportunities...');
            }
        } catch (error) {
            console.error('Connection error:', error);
            Alert.alert(
                'Connection Failed',
                error.message || 'Could not connect wallet'
            );
        }
    };

    const handleDisconnect = async () => {
        try {
            await disconnect();
            setUserTokens([]); // Clear user tokens - this will trigger re-scan with default tokens
            Alert.alert('Disconnected', 'Wallet disconnected successfully');
        } catch (error) {
            console.error('Disconnect error:', error);
            Alert.alert('Disconnect Failed', 'Could not disconnect wallet');
        }
    };

    // Show loading screen only when no opportunities exist and we're actively scanning/fetching
    if (opportunities.length === 0 && (loading || fetchingTokens) && !hasScanned) {
        return (
            <LinearGradient
                colors={['#0f0f1e', '#1a1a2e']}
                style={styles.centered}>
                <ActivityIndicator size="large" color="#9d4edd" />
                <Text style={styles.loadingText}>
                    {fetchingTokens ? 'Fetching your tokens...' :
                        wallet.connected ? 'Scanning for arbitrage opportunities...' :
                            'Connect your wallet to start'}
                </Text>
                {!wallet.connected && (
                    <TouchableOpacity style={styles.refreshButton} onPress={handleConnect}>
                        <Text style={styles.refreshButtonText}>🔗 Connect Wallet</Text>
                    </TouchableOpacity>
                )}
            </LinearGradient>
        );
    }

    // Show no opportunities screen only after scanning is complete
    if (hasScanned && opportunities.length === 0) {
        return (
            <LinearGradient
                colors={['#0f0f1e', '#1a1a2e']}
                style={styles.centered}>
                <ActivityIndicator size="large" color="#9d4edd" />
                <Text style={styles.emptyText}>
                    No profitable arbitrage opportunities found for your tokens right now
                </Text>
                <TouchableOpacity style={styles.refreshButton} onPress={() => refresh(userTokens)}>
                    <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
                </TouchableOpacity>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#0f0f1e', '#1a1a2e']}
            style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>AtomicSwipe ⚡</Text>
                <TouchableOpacity
                    style={[
                        styles.walletButton,
                        wallet.connected && styles.walletButtonConnected,
                    ]}
                    onPress={wallet.connected ? handleDisconnect : handleConnect}>
                    <Text style={styles.walletButtonText}>
                        {wallet.connected ? `🟢 ${wallet.walletName || 'Connected'}` : 'Connect Wallet'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Stats Bar */}
            <View style={styles.stats}>
                <Text style={styles.statsText}>
                    {opportunities.length} opportunities •{' '}
                    {wallet.connected
                        ? Platform.OS === 'web'
                            ? `Demo Wallet (${userTokens.length} tokens)`
                            : `${wallet.balance.toFixed(2)} SOL (${userTokens.length} tokens)`
                        : 'Not connected'}
                    {newOpportunityCount > 0 && (
                        <Text style={[styles.statsText, { color: '#00ff88', fontSize: 12, marginLeft: 10 }]}>
                            +{newOpportunityCount} new
                        </Text>
                    )}
                </Text>
                {Platform.OS === 'web' && (
                    <Text style={[styles.statsText, { color: '#ffaa00', fontSize: 12 }]}>
                        Web Demo Mode - Use mobile app for real trading
                    </Text>
                )}
                {opportunities.some(opp => opp.id.startsWith('mock-')) && Platform.OS !== 'web' && (
                    <Text style={[styles.statsText, { color: '#ffaa00', fontSize: 12 }]}>
                        Includes demo opportunities
                    </Text>
                )}
            </View>

            {/* Swiper */}
            <View style={styles.swiperContainer}>
                <Swiper
                    ref={swiperRef}
                    cards={opportunities}
                    renderCard={card => {
                        if (!card) {
                            console.warn('Swiper trying to render undefined card');
                            return null;
                        }
                        if (!card.profitUsd) {
                            console.warn('Swiper trying to render card without profitUsd:', card);
                            return <SwipeCard opportunity={card} />;
                        }
                        return <SwipeCard opportunity={card} />;
                    }}
                    onSwipedLeft={handleSwipeLeft}
                    onSwipedRight={handleSwipeRight}
                    onSwipedAll={() => {
                        Alert.alert('All Done!', 'Refreshing opportunities...');
                        refresh();
                    }}
                    cardIndex={0}
                    backgroundColor="transparent"
                    stackSize={3}
                    stackScale={10}
                    stackSeparation={15}
                    animateCardOpacity
                    disableBottomSwipe
                    disableTopSwipe
                    overlayLabels={{
                        left: {
                            title: 'SKIP',
                            style: {
                                label: {
                                    backgroundColor: '#ff006e',
                                    color: '#fff',
                                    fontSize: 28,
                                    fontWeight: 'bold',
                                    padding: 12,
                                    borderRadius: 12,
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-start',
                                    marginTop: 40,
                                    marginLeft: -40,
                                },
                            },
                        },
                        right: {
                            title: 'EXECUTE',
                            style: {
                                label: {
                                    backgroundColor: '#00ff88',
                                    color: '#000',
                                    fontSize: 28,
                                    fontWeight: 'bold',
                                    padding: 12,
                                    borderRadius: 12,
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                    marginTop: 40,
                                    marginLeft: 40,
                                },
                            },
                        },
                    }}
                />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.skipButton]}
                    onPress={() => swiperRef.current?.swipeLeft()}
                    disabled={executing}>
                    <Text style={styles.actionButtonText}>✕</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.refreshButtonSmall]}
                    onPress={refresh}>
                    <Text style={styles.actionButtonText}>🔄</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        styles.executeButton,
                        !wallet.connected && styles.buttonDisabled,
                    ]}
                    onPress={() => swiperRef.current?.swipeRight()}
                    disabled={executing || !wallet.connected}>
                    <Text style={styles.actionButtonText}>
                        {executing ? '⏳' : '✓'}
                    </Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    walletButton: {
        backgroundColor: '#9d4edd',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 24,
    },
    walletButtonConnected: {
        backgroundColor: '#00ff88',
    },
    walletButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },
    stats: {
        alignItems: 'center',
        marginBottom: 20,
    },
    statsText: {
        color: '#aaa',
        fontSize: 14,
    },
    swiperContainer: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingBottom: 40,
    },
    actionButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    skipButton: {
        backgroundColor: '#ff006e',
    },
    executeButton: {
        backgroundColor: '#00ff88',
    },
    refreshButtonSmall: {
        backgroundColor: '#9d4edd',
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    actionButtonText: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    loadingText: {
        color: '#aaa',
        marginTop: 16,
        fontSize: 16,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 20,
    },
    emptyText: {
        color: '#aaa',
        fontSize: 18,
        textAlign: 'center',
        paddingHorizontal: 40,
        marginBottom: 24,
    },
    refreshButton: {
        backgroundColor: '#9d4edd',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 24,
    },
    refreshButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});
