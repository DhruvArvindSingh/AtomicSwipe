import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArbitrageOpportunity } from '../types';

const { width } = Dimensions.get('window');

interface SwipeCardProps {
    opportunity: ArbitrageOpportunity;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ opportunity }) => {
    // Safety check for undefined opportunity
    if (!opportunity || !opportunity.profitUsd) {
        console.warn('SwipeCard received invalid opportunity:', opportunity);
        return (
            <LinearGradient
                colors={['#ff4757', '#ff3838', '#ff2828']}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <View style={[styles.card, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={[styles.profitText, { color: '#fff' }]}>⚠️</Text>
                    <Text style={[styles.percentText, { color: '#fff', marginTop: 10 }]}>
                        Invalid Opportunity Data
                    </Text>
                </View>
            </LinearGradient>
        );
    }

    const netProfit = opportunity.profitUsd - opportunity.estimatedGas;

    return (
        <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f3460']}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            {/* Profit Header */}
            <View style={styles.header}>
                <Text style={styles.profitText}>
                    +${opportunity.profitUsd.toFixed(2)}
                </Text>
                <View style={styles.percentBadge}>
                    <Text style={styles.percentText}>
                        +{opportunity.profitPercent.toFixed(2)}%
                    </Text>
                </View>
                {opportunity.id.startsWith('mock-') && (
                    <View style={styles.mockBadge}>
                        <Text style={styles.mockBadgeText}>MOCK CARD</Text>
                    </View>
                )}
            </View>

            {/* Token Flow */}
            <View style={styles.tokenFlow}>
                <TokenIcon
                    symbol={opportunity.tokenIn.symbol}
                    logo={opportunity.tokenIn.logo}
                />

                <View style={styles.arrow}>
                    <Text style={styles.arrowText}>→</Text>
                </View>

                <TokenIcon
                    symbol={opportunity.tokenOut.symbol}
                    logo={opportunity.tokenOut.logo}
                />

                <View style={styles.arrow}>
                    <Text style={styles.arrowText}>→</Text>
                </View>

                <TokenIcon
                    symbol={opportunity.tokenIn.symbol}
                    logo={opportunity.tokenIn.logo}
                />
            </View>

            {/* DEX Route */}
            <View style={styles.dexRoute}>
                <DexBadge
                    name={opportunity.buyDex}
                    label="Buy"
                    color="#00ff88"
                />
                <View style={styles.routeLine} />
                <DexBadge
                    name={opportunity.sellDex}
                    label="Sell"
                    color="#ff006e"
                />
            </View>

            {/* Details Card */}
            <View style={styles.detailsCard}>
                <DetailRow
                    label="Amount In"
                    value={`${opportunity.amountIn.toFixed(4)} ${opportunity.tokenIn.symbol}`}
                />
                <DetailRow
                    label="Est. Gas"
                    value={`~${opportunity.estimatedGas.toFixed(4)} SOL`}
                />
                <View style={styles.divider} />
                <DetailRow
                    label="Net Profit"
                    value={`$${netProfit.toFixed(2)}`}
                    highlight
                />
            </View>

            {/* Swipe Hints */}
            <View style={styles.hints}>
                <View style={styles.hintLeft}>
                    <Text style={styles.hintIcon}>👈</Text>
                    <Text style={styles.hintText}>Skip</Text>
                </View>
                <View style={styles.hintRight}>
                    <Text style={styles.hintText}>Execute</Text>
                    <Text style={styles.hintIcon}>👉</Text>
                </View>
            </View>
        </LinearGradient>
    );
};

const TokenIcon: React.FC<{ symbol: string; logo: string }> = ({
    symbol,
    logo,
}) => (
    <View style={styles.tokenContainer}>
        <Image source={{ uri: logo }} style={styles.tokenLogo} />
        <Text style={styles.tokenSymbol}>{symbol}</Text>
    </View>
);

const DexBadge: React.FC<{
    name: string;
    label: string;
    color: string;
}> = ({ name, label, color }) => (
    <View style={styles.dexBadge}>
        <Text style={styles.dexLabel}>{label}</Text>
        <Text style={[styles.dexName, { color }]}>{name}</Text>
    </View>
);

const DetailRow: React.FC<{
    label: string;
    value: string;
    highlight?: boolean;
}> = ({ label, value, highlight }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text
            style={[
                styles.detailValue,
                highlight && styles.detailHighlight,
            ]}>
            {value}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    card: {
        width: width - 40,
        height: 600,
        borderRadius: 24,
        padding: 24,
        justifyContent: 'space-between',
        shadowColor: '#9d4edd',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
    },
    profitText: {
        fontSize: 52,
        fontWeight: 'bold',
        color: '#00ff88',
        textShadowColor: '#00ff8844',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    },
    percentBadge: {
        backgroundColor: '#00ff8822',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#00ff88',
    },
    percentText: {
        fontSize: 16,
        color: '#00ff88',
        fontWeight: '600',
    },
    tokenFlow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 24,
    },
    tokenContainer: {
        alignItems: 'center',
    },
    tokenLogo: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#ffffff22',
        borderWidth: 2,
        borderColor: '#ffffff44',
    },
    tokenSymbol: {
        color: '#fff',
        fontSize: 12,
        marginTop: 8,
        fontWeight: '700',
        letterSpacing: 1,
    },
    arrow: {
        marginHorizontal: 12,
    },
    arrowText: {
        fontSize: 28,
        color: '#9d4edd',
    },
    dexRoute: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
        paddingHorizontal: 10,
    },
    dexBadge: {
        alignItems: 'center',
    },
    dexLabel: {
        color: '#aaa',
        fontSize: 11,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    dexName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    routeLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#ffffff22',
        marginHorizontal: 10,
    },
    detailsCard: {
        backgroundColor: '#ffffff11',
        borderRadius: 16,
        padding: 18,
        marginVertical: 16,
        borderWidth: 1,
        borderColor: '#ffffff22',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    detailLabel: {
        color: '#aaa',
        fontSize: 14,
    },
    detailValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    detailHighlight: {
        color: '#00ff88',
        fontSize: 18,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#ffffff22',
        marginVertical: 8,
    },
    hints: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    hintLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hintRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hintIcon: {
        fontSize: 24,
    },
    hintText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginHorizontal: 8,
    },
    mockBadge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#ffaa00',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    },
    mockBadgeText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});
