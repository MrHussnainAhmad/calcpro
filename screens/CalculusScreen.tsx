import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { derivative } from 'mathjs';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

export default function CalculusScreen() {
    const navigation = useNavigation();
    const [expression, setExpression] = useState('');
    const [variable, setVariable] = useState('x');
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        if (!expression) return;
        try {
            const res = derivative(expression, variable).toString();
            setResult(res);
            setError(null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e) {
            setResult(null);
            setError('Invalid expression');
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>{'< Back'}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Calculus (Derivatives)</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.label}>Function to differentiate:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. x^2 + sin(x)"
                        placeholderTextColor={Colors.textSecondary}
                        value={expression}
                        onChangeText={setExpression}
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Respect to variable:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. x"
                        placeholderTextColor={Colors.textSecondary}
                        value={variable}
                        onChangeText={setVariable}
                        autoCapitalize="none"
                    />

                    <TouchableOpacity style={styles.calculateBtn} onPress={handleCalculate}>
                        <Text style={styles.btnText}>Calculate Derivative</Text>
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
        marginRight: 15,
    },
    backText: {
        color: Colors.accent,
        fontSize: 16,
    },
    title: {
        color: Colors.textPrimary,
        fontSize: 20,
        fontWeight: 'bold',
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
        color: Colors.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultCard: {
        backgroundColor: Colors.accent, // Use accent but maybe slightly transparent if we had alpha
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
    },
    resultLabel: {
        color: 'white',
        fontSize: 14,
        marginBottom: 10,
        opacity: 0.8,
    },
    resultText: {
        color: 'white',
        fontSize: 24,
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
});
