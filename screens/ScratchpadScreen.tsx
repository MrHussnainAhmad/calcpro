import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { evaluate } from '../lib/math';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface LineResult {
    content: string;
    result: string;
    isError: boolean;
}

export default function ScratchpadScreen() {
    const navigation = useNavigation();
    const [text, setText] = useState('');
    const [results, setResults] = useState<LineResult[]>([]);

    useEffect(() => {
        const lines = text.split('\n');
        const newResults: LineResult[] = [];
        const scope = {};

        lines.forEach((line) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) {
                newResults.push({ content: line, result: '', isError: false });
                return;
            }

            try {
                const res = evaluate(trimmedLine, scope);
                let resultStr = '';

                if (typeof res === 'function') {
                    resultStr = 'ƒ defined';
                } else if (res !== undefined) {
                    resultStr = typeof res === 'number' ? parseFloat(res.toPrecision(8)).toString() : res.toString();
                }

                newResults.push({ content: line, result: resultStr, isError: false });
            } catch (e) {
                newResults.push({ content: line, result: 'err', isError: true });
            }
        });

        setResults(newResults);
    }, [text]);

    const clearPad = () => {
        setText('');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={Colors.accent} />
                </TouchableOpacity>
                <Text style={styles.title}>Math Scratchpad</Text>
                <TouchableOpacity onPress={clearPad} style={styles.clearBtn}>
                    <Text style={styles.clearBtnText}>Clear</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                <View style={styles.padArea}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            multiline
                            value={text}
                            onChangeText={setText}
                            placeholder="Start drafting... (e.g. x = 5)"
                            placeholderTextColor={Colors.gray}
                            autoCapitalize="none"
                            autoCorrect={false}
                            spellCheck={false}
                        />
                    </View>
                    <View style={styles.resultContainer}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {results.map((res, i) => (
                                <View key={i} style={styles.resultLine}>
                                    <Text
                                        style={[
                                            styles.resultText,
                                            res.isError && { color: '#FF453A' },
                                            !res.result && { opacity: 0 }
                                        ]}
                                    >
                                        {res.result || '.'}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>

                <View style={styles.tips}>
                    <Text style={styles.tipsText}> Sequential lines share variables: `x = 10` then `x * 2` → `20`</Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark,
    },
    flex: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        flex: 1,
    },
    clearBtn: {
        backgroundColor: 'rgba(255,69,58,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    clearBtnText: {
        color: '#FF453A',
        fontWeight: 'bold',
        fontSize: 12,
    },
    padArea: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 10,
        backgroundColor: '#0A0A0A',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    inputContainer: {
        flex: 0.7,
        padding: 10,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 18,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        textAlignVertical: 'top',
        lineHeight: 25,
    },
    resultContainer: {
        flex: 0.3,
        backgroundColor: 'rgba(255,255,255,0.02)',
        paddingVertical: 10,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255,255,255,0.05)',
    },
    resultLine: {
        height: 25,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    resultText: {
        color: Colors.accent,
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        textAlign: 'right',
        fontWeight: 'bold',
    },
    tips: {
        padding: 15,
        backgroundColor: Colors.secondary,
        margin: 10,
        borderRadius: 10,
    },
    tipsText: {
        color: Colors.textSecondary,
        fontSize: 12,
        fontStyle: 'italic',
    }
});
