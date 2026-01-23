import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
// @ts-ignore
import nerdamer from 'nerdamer';
import 'nerdamer/Algebra';
import 'nerdamer/Calculus';
import 'nerdamer/Solve';

import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

type SolverMode = 'Derivative' | 'Integral' | 'Solve';

export default function CalculusScreen() {
    const navigation = useNavigation();
    const [mode, setMode] = useState<SolverMode>('Derivative');
    const [expression, setExpression] = useState('');
    const [variable, setVariable] = useState('x');
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        if (!expression) return;
        try {
            let res = '';
            const cleanExp = expression.replace(/ /g, '');

            switch (mode) {
                case 'Derivative':
                    res = nerdamer(`diff(${cleanExp}, ${variable})`).toString();
                    break;
                case 'Integral':
                    res = nerdamer(`integrate(${cleanExp}, ${variable})`).toString();
                    break;
                case 'Solve':
                    // nerdamer.solve returns an array of possible values
                    const sol = (nerdamer as any).solve(cleanExp, variable);
                    res = sol.toString();
                    break;
            }

            setResult(res);
            setError(null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e: any) {
            setResult(null);
            setError(e.message || 'Invalid expression');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    const handleCopy = async () => {
        if (result) {
            await Clipboard.setStringAsync(result);
            Haptics.selectionAsync();
            alert('Copied!');
        }
    };

    const toggleMode = (newMode: SolverMode) => {
        setMode(newMode);
        setResult(null);
        setError(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={Colors.accent} />
                </TouchableOpacity>
                <Text style={styles.title}>Advanced Math Solver</Text>
            </View>

            <View style={styles.tabContainer}>
                {(['Derivative', 'Integral', 'Solve'] as SolverMode[]).map((m) => (
                    <TouchableOpacity
                        key={m}
                        style={[styles.tab, mode === m && styles.activeTab]}
                        onPress={() => toggleMode(m)}
                    >
                        <Text style={[styles.tabText, mode === m && styles.activeTabText]}>{m}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.label}>
                        {mode === 'Solve' ? 'Equation (e.g. x^2 - 4):' : 'Function:'}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder={mode === 'Solve' ? "x^2 - 4" : "x^2 + sin(x)"}
                        placeholderTextColor={Colors.textSecondary}
                        value={expression}
                        onChangeText={setExpression}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <Text style={styles.label}>Variable (usually x):</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="x"
                        placeholderTextColor={Colors.textSecondary}
                        value={variable}
                        onChangeText={setVariable}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <TouchableOpacity style={styles.calculateBtn} onPress={handleCalculate}>
                        <Text style={styles.btnText}>Calculate {mode}</Text>
                    </TouchableOpacity>
                </View>

                {result && (
                    <TouchableOpacity onPress={handleCopy} activeOpacity={0.8}>
                        <View style={styles.resultCard}>
                            <Text style={styles.resultLabel}>Result (Tap to Copy):</Text>
                            <Text style={styles.resultText}>{result}</Text>
                        </View>
                    </TouchableOpacity>
                )}

                {error && (
                    <View style={styles.errorCard}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <View style={styles.guide}>
                    <Text style={styles.guideTitle}>Quick Guide:</Text>
                    <Text style={styles.guideText}>• Derivative: `sin(x) + x^2` → `cos(x) + 2x`</Text>
                    <Text style={styles.guideText}>• Integral: `2*x` → `x^2`</Text>
                    <Text style={styles.guideText}>• Solve: `x^2 - 9` → `[-3, 3]`</Text>
                    <Text style={styles.guideText}>• Exponent: `x^3`, Multiplication: `2*x`</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        color: Colors.textPrimary,
        fontSize: 20,
        fontWeight: 'bold',
    },
    tabContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: Colors.secondary,
        margin: 15,
        borderRadius: 12,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: Colors.accent,
    },
    tabText: {
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    activeTabText: {
        color: 'white',
    },
    content: {
        padding: 20,
    },
    card: {
        backgroundColor: Colors.secondary,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    label: {
        color: Colors.textSecondary,
        marginBottom: 8,
        fontSize: 16,
    },
    input: {
        backgroundColor: Colors.dark,
        color: Colors.textPrimary,
        padding: 15,
        borderRadius: 10,
        fontSize: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.gray,
    },
    calculateBtn: {
        backgroundColor: Colors.accent,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultCard: {
        backgroundColor: '#1E3A5F', // Darker blue for result
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.accent,
    },
    resultLabel: {
        color: 'white',
        fontSize: 12,
        marginBottom: 10,
        opacity: 0.7,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    resultText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorCard: {
        marginTop: 20,
        backgroundColor: '#CF6679',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    errorText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    guide: {
        marginTop: 30,
        padding: 15,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 10,
    },
    guideTitle: {
        color: Colors.accent,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    guideText: {
        color: Colors.textSecondary,
        fontSize: 14,
        marginBottom: 5,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
});
