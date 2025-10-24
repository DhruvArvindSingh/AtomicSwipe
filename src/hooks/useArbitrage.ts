import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import ArbitrageService from '../services/arbitrage.service';
import { ArbitrageOpportunity } from '../types';
import { CONFIG } from '../constants/config';

export const useArbitrage = (userTokens?: Array<{ mint: string; amount: number; symbol: string }>) => {
    const [opportunities, setOpportunities] = useState<
        ArbitrageOpportunity[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasScanned, setHasScanned] = useState(false);
    const [newOpportunityCount, setNewOpportunityCount] = useState(0);
    const scanningRef = useRef(false);

    // Handle new opportunities as they are found
    const handleOpportunityFound = useCallback(async (opportunity: ArbitrageOpportunity) => {
        setOpportunities(prev => {
            // Check if opportunity already exists (avoid duplicates)
            const exists = prev.some(opp => opp.id === opportunity.id);
            if (exists) return prev;

            // Add new opportunity and sort by profit
            const newOpportunities = [...prev, opportunity].sort(
                (a, b) => b.profitUsd - a.profitUsd
            );

            console.log(`🎯 New arbitrage opportunity added: ${opportunity.tokenIn.symbol} → ${opportunity.tokenOut.symbol} → ${opportunity.tokenIn.symbol}`);

            // Increment new opportunity counter
            setNewOpportunityCount(prev => prev + 1);

            // Notify user about new opportunity
            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            // Show brief alert for high-value opportunities
            if (opportunity.profitUsd >= 10) {
                Alert.alert(
                    '💰 High-Value Opportunity Found!',
                    `${opportunity.tokenIn.symbol} → ${opportunity.tokenOut.symbol} → ${opportunity.tokenIn.symbol}\nProfit: $${opportunity.profitUsd.toFixed(2)}`,
                    [{ text: 'OK' }],
                    { cancelable: true }
                );
            }

            return newOpportunities;
        });
    }, []);

    const scan = useCallback(async (tokens?: Array<{ mint: string; amount: number; symbol: string }>) => {
        if (scanningRef.current) {
            console.log('Scan already in progress');
            return;
        }

        console.log('Starting arbitrage scan...', tokens ? `with ${tokens.length} user tokens` : 'with default tokens');
        scanningRef.current = true;
        setLoading(true);
        setError(null);

        try {
            // Clear existing opportunities for fresh scan
            setOpportunities([]);

            const results = await ArbitrageService.scanOpportunities(tokens, handleOpportunityFound);
            console.log(`Scan completed, final count: ${results.length} opportunities`);

            // Update with final sorted results
            setOpportunities(results);
            setHasScanned(true);
        } catch (err) {
            console.error('Scan failed:', err);
            setError('Failed to scan opportunities');
            setHasScanned(true);
        } finally {
            setLoading(false);
            scanningRef.current = false;
        }
    }, [handleOpportunityFound]);

    // Only scan when userTokens are provided or on initial load
    useEffect(() => {
        if (userTokens && userTokens.length > 0) {
            console.log('User tokens provided, scanning for personalized opportunities');
            scan(userTokens);
        } else if (!hasScanned && !scanningRef.current) {
            // Initial scan with default tokens
            scan();
        }
    }, [userTokens, scan, hasScanned]);

    // Periodic refresh only if we have user tokens
    useEffect(() => {
        if (userTokens && userTokens.length > 0) {
            const interval = setInterval(() => {
                if (!scanningRef.current) {
                    scan(userTokens);
                }
            }, CONFIG.REFRESH_INTERVAL);
            return () => clearInterval(interval);
        }
    }, [userTokens, scan]);

    return {
        opportunities,
        loading,
        error,
        hasScanned,
        newOpportunityCount,
        resetNewOpportunityCount: () => setNewOpportunityCount(0),
        refresh: (tokens?: Array<{ mint: string; amount: number; symbol: string }>) => scan(tokens),
    };
};
