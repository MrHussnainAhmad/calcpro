import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

type FinanceMode = 'Savings' | 'Loan' | 'Investment';

export default function FinanceScreen() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [mode, setMode] = useState<FinanceMode>('Savings');

    // States for various inputs
    const [principal, setPrincipal] = useState('1000');
    const [rate, setRate] = useState('5'); // Annual %
    const [years, setYears] = useState('10');
    const [monthlyContribution, setMonthlyContribution] = useState('100');
    const [result, setResult] = useState<{ value: string; label: string } | null>(null);

    const calculateFinance = useCallback(() => {
        try {
            const P = parseFloat(principal);
            const r = parseFloat(rate) / 100;
            const t = parseFloat(years);
            const PMT = parseFloat(monthlyContribution);

            if (isNaN(P) || isNaN(r) || isNaN(t)) return;

            let finalValue = 0;
            let label = '';

            if (mode === 'Savings') {
                // Future Value of an Ordinary Annuity + Principal
                // FV = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
                const n = 12; // Monthly compounding
                const rateSub = r / n;
                const periods = n * t;

                const principalGrowth = P * Math.pow(1 + rateSub, periods);
                const contributionGrowth = PMT * (Math.pow(1 + rateSub, periods) - 1) / rateSub;

                finalValue = principalGrowth + contributionGrowth;
                label = 'Estimated Future Savings';
            } else if (mode === 'Loan') {
                // Monthly Payment (PMT)
                // PMT = P * [r/n * (1 + r/n)^(nt)] / [(1 + r/n)^(nt) - 1]
                const n = 12;
                const rateSub = r / n;
                const periods = n * t;

                finalValue = P * (rateSub * Math.pow(1 + rateSub, periods)) / (Math.pow(1 + rateSub, periods) - 1);
                label = 'Monthly Loan Payment';
            } else {
                // Compound Interest (Lump Sum)
                finalValue = P * Math.pow(Math.E, r * t); // Continuous compounding for "Investment" high-tier projection
                label = 'Continuous Growth Value';
            }

            setResult({
                value: finalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                label
            });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e) {
            setResult({ value: 'Error', label: 'Invalid Inputs' });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    }, [mode, principal, rate, years, monthlyContribution]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.dark }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={theme.accent} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.textPrimary }]}>Financial Suite</Text>
            </View>

            <View style={[styles.tabContainer, { backgroundColor: theme.secondary }]}>
                {(['Savings', 'Loan', 'Investment'] as FinanceMode[]).map((m) => (
                    <TouchableOpacity
                        key={m}
                        style={[styles.tab, mode === m && { backgroundColor: theme.accent }]}
                        onPress={() => { setMode(m); setResult(null); }}
                    >
                        <Text style={[styles.tabText, { color: theme.textSecondary }, mode === m && { color: 'white' }]}>{m}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={[styles.card, { backgroundColor: theme.secondary }]}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>{mode === 'Loan' ? 'Loan Amount ($)' : 'Initial Balance ($)'}</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.dark, color: theme.textPrimary }]}
                                keyboardType="numeric"
                                value={principal}
                                onChangeText={setPrincipal}
                                placeholder="0.00"
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>Annual Rate (%)</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.dark, color: theme.textPrimary }]}
                                    keyboardType="numeric"
                                    value={rate}
                                    onChangeText={setRate}
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>Duration (Years)</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.dark, color: theme.textPrimary }]}
                                    keyboardType="numeric"
                                    value={years}
                                    onChangeText={setYears}
                                />
                            </View>
                        </View>

                        {mode === 'Savings' && (
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>Monthly Contribution ($)</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.dark, color: theme.textPrimary }]}
                                    keyboardType="numeric"
                                    value={monthlyContribution}
                                    onChangeText={setMonthlyContribution}
                                />
                            </View>
                        )}

                        <TouchableOpacity style={[styles.calcBtn, { backgroundColor: theme.accent }]} onPress={calculateFinance}>
                            <Text style={styles.calcBtnText}>Calculate</Text>
                        </TouchableOpacity>
                    </View>

                    {result && (
                        <View style={[styles.resultCard, { borderColor: theme.accent === '#000000' ? theme.textPrimary : '#34C759', backgroundColor: theme.accent === '#000000' ? 'rgba(0,0,0,0)' : 'rgba(52, 199, 89, 0.1)' }]}>
                            <Text style={[styles.resultLabel, { color: theme.accent === '#000000' ? theme.textPrimary : '#34C759' }]}>{result.label}</Text>
                            <Text style={[styles.resultValue, { color: theme.textPrimary }]}>${result.value}</Text>
                            <Text style={[styles.resultSub, { color: theme.textSecondary }]}>* Estimates based on monthly compounding.</Text>
                        </View>
                    )}

                    <View style={[styles.infoBox, { backgroundColor: 'rgba(255,255,255,0.03)' }]}>
                        <Ionicons name="shield-checkmark-outline" size={20} color={theme.accent} />
                        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                            Projections are for educational purposes. Real-world financial results may vary based on bank fees, tax laws, and market shifts.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flex: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    backButton: { marginRight: 10 },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    tabContainer: {
        flexDirection: 'row',
        margin: 20,
        borderRadius: 12,
        padding: 5,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    tabText: {
        fontWeight: 'bold',
        fontSize: 13,
    },
    content: {
        padding: 20,
    },
    card: {
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    inputGroup: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
    },
    label: {
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    input: {
        fontSize: 20,
        padding: 12,
        borderRadius: 10,
        fontWeight: 'bold',
    },
    calcBtn: {
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    calcBtnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultCard: {
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: 20,
    },
    resultLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 5,
    },
    resultValue: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    resultSub: {
        fontSize: 10,
        marginTop: 10,
    },
    infoBox: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 12,
    },
    infoText: {
        fontSize: 12,
        marginLeft: 10,
        flex: 1,
        lineHeight: 18,
    }
});
