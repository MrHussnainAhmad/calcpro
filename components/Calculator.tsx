import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CalculatorButton from './CalculatorButton';
import { evaluate } from '../lib/math';
import { useTheme } from '../context/ThemeContext';

export default function Calculator() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [currentValue, setCurrentValue] = useState<string>('0');
    const [isScientific, setIsScientific] = useState(false);
    const [sound, setSound] = useState<Audio.Sound>();
    const [history, setHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    // Load history
    useEffect(() => {
        const loadHistory = async () => {
            const saved = await AsyncStorage.getItem('calc_history');
            if (saved) setHistory(JSON.parse(saved));
        };
        loadHistory();
    }, []);

    const saveHistory = async (newHistory: string[]) => {
        await AsyncStorage.setItem('calc_history', JSON.stringify(newHistory));
    };

    // Load sound
    useEffect(() => {
        async function loadSound() {
            try {
                const { sound } = await Audio.Sound.createAsync(
                    require('../assets/click.mp3')
                );
                setSound(sound);
            } catch (e) {
                console.log("Failed to load sound", e);
            }
        }
        loadSound();
        return () => { sound ? sound.unloadAsync() : undefined; };
    }, []);

    const playSound = async () => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (sound) await sound.replayAsync();
        } catch (error) {
            console.log('Error playing sound', error);
        }
    };

    const handlePress = useCallback((text: string) => {
        if (text !== 'Sci' && text !== 'Formula' && text !== 'Adv' && text !== 'Hist') {
            playSound();
        }

        if (text === 'Formula') {
            // @ts-ignore
            navigation.navigate('Formula');
            return;
        }

        if (text === 'Sci') {
            setIsScientific(!isScientific);
            return;
        }

        if (text === 'Hist') {
            setShowHistory(!showHistory);
            return;
        }

        if (text === 'Adv') {
            // @ts-ignore
            navigation.navigate('AdvancedMenu');
            return;
        }

        if (text === 'C') {
            setCurrentValue('0');
            return;
        }

        if (text === '=') {
            try {
                const expression = currentValue
                    .replace(/x/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/log\(/g, 'log10(')
                    .replace(/ln\(/g, 'log(');

                const result = evaluate(expression);
                let finalVal = '';
                if (typeof result === 'number') {
                    finalVal = parseFloat(result.toPrecision(10)).toString();
                } else {
                    finalVal = result.toString();
                }

                const item = `${expression} = ${finalVal}`;
                setHistory(prev => {
                    const newHistory = [item, ...prev].slice(0, 10);
                    saveHistory(newHistory);
                    return newHistory;
                });

                setCurrentValue(finalVal);
            } catch (e) {
                setCurrentValue('Error');
            }
            return;
        }

        if (text === '+/-') {
            if (currentValue === '0' || currentValue === 'Error') return;
            setCurrentValue(prev => `-(${prev})`);
            return;
        }

        let valToAdd = text;
        const operators = ['+', '-', 'x', '/'];

        if (['sin', 'cos', 'tan', 'sqrt', 'log', 'ln'].includes(text)) {
            valToAdd = text + '(';
        }

        setCurrentValue((prev) => {
            if (prev === '0' || prev === 'Error') {
                if (operators.includes(text)) return '0' + text;
                if (text === '.') return '0.';
                return valToAdd;
            }
            return prev + valToAdd;
        });
    }, [navigation, isScientific, showHistory, currentValue, sound]);

    return (
        <View style={[styles.container, { backgroundColor: theme.dark }]}>
            <SafeAreaView style={[styles.resultContainer, isScientific && { flex: 0.25 }]}>
                {showHistory ? (
                    <View style={styles.historyList}>
                        <Text style={[styles.historyTitle, { color: theme.accent }]}>Recent Calculations</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {history.length === 0 ? (
                                <Text style={[styles.emptyHistory, { color: theme.textSecondary }]}>No history yet</Text>
                            ) : (
                                history.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            const val = item.split(' = ')[1];
                                            setCurrentValue(val || '0');
                                            setShowHistory(false);
                                        }}
                                        style={styles.historyItem}
                                    >
                                        <Text style={[styles.historyText, { color: theme.textPrimary }]}>{item}</Text>
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    </View>
                ) : (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.displayScroll}
                    >
                        <Text style={[
                            styles.resultText,
                            { color: theme.textPrimary },
                            currentValue.length > 10 && { fontSize: 40 }
                        ]}>
                            {currentValue}
                        </Text>
                    </ScrollView>
                )}
            </SafeAreaView>

            <View style={[styles.keypad, isScientific && { flex: 0.75 }, { backgroundColor: theme.dark }]}>
                {!isScientific && (
                    <View style={styles.utilRow}>
                        <TouchableOpacity onPress={() => handlePress('Adv')} style={[styles.utilBtn, { backgroundColor: theme.secondary, borderColor: theme.gray }]}>
                            <Text style={[styles.utilBtnText, { color: theme.accent }]}>Advance Math</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePress('Hist')} style={[styles.utilBtn, { backgroundColor: theme.secondary, borderColor: theme.gray }]}>
                            <Text style={[styles.utilBtnText, { color: theme.accent }]}>History</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {isScientific && (
                    <View style={styles.sciSection}>
                        <View style={styles.row}>
                            <CalculatorButton text="sin" theme="secondary" onPress={handlePress} style={styles.sciBtn} textStyle={styles.sciText} />
                            <CalculatorButton text="cos" theme="secondary" onPress={handlePress} style={styles.sciBtn} textStyle={styles.sciText} />
                            <CalculatorButton text="tan" theme="secondary" onPress={handlePress} style={styles.sciBtn} textStyle={styles.sciText} />
                            <CalculatorButton text="log" theme="secondary" onPress={handlePress} style={styles.sciBtn} textStyle={styles.sciText} />
                        </View>
                        <View style={styles.row}>
                            <CalculatorButton text="(" theme="secondary" onPress={handlePress} style={styles.sciBtn} textStyle={styles.sciText} />
                            <CalculatorButton text=")" theme="secondary" onPress={handlePress} style={styles.sciBtn} textStyle={styles.sciText} />
                            <CalculatorButton text="sqrt" theme="secondary" onPress={handlePress} style={styles.sciBtn} textStyle={styles.sciText} />
                            <CalculatorButton text="^" theme="secondary" onPress={handlePress} style={styles.sciBtn} textStyle={styles.sciText} />
                        </View>
                    </View>
                )}

                <View style={styles.row}>
                    <CalculatorButton text="C" theme="secondary" onPress={handlePress} />
                    <CalculatorButton text="+/-" theme="secondary" onPress={handlePress} />
                    <CalculatorButton text="%" theme="secondary" onPress={handlePress} />
                    <CalculatorButton text="/" theme="accent" onPress={handlePress} />
                </View>
                <View style={styles.row}>
                    <CalculatorButton text="7" onPress={handlePress} />
                    <CalculatorButton text="8" onPress={handlePress} />
                    <CalculatorButton text="9" onPress={handlePress} />
                    <CalculatorButton text="x" theme="accent" onPress={handlePress} />
                </View>
                <View style={styles.row}>
                    <CalculatorButton text="4" onPress={handlePress} />
                    <CalculatorButton text="5" onPress={handlePress} />
                    <CalculatorButton text="6" onPress={handlePress} />
                    <CalculatorButton text="-" theme="accent" onPress={handlePress} />
                </View>
                <View style={styles.row}>
                    <CalculatorButton text="1" onPress={handlePress} />
                    <CalculatorButton text="2" onPress={handlePress} />
                    <CalculatorButton text="3" onPress={handlePress} />
                    <CalculatorButton text="+" theme="accent" onPress={handlePress} />
                </View>
                <View style={styles.row}>
                    <CalculatorButton
                        text="Formula"
                        onPress={handlePress}
                        style={styles.wideBtn}
                    />
                    <CalculatorButton
                        text="Sci"
                        theme={isScientific ? 'accent' : 'secondary'}
                        onPress={handlePress}
                        style={styles.sciToggle}
                    />
                    <CalculatorButton text="0" onPress={handlePress} />
                    <CalculatorButton text="=" theme="accent" onPress={handlePress} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    resultContainer: {
        flex: 0.35,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    displayScroll: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    resultText: {
        fontSize: 70,
        textAlign: 'right',
        fontWeight: '300',
    },
    keypad: {
        flex: 0.65,
        paddingBottom: 30,
        paddingHorizontal: 10,
        justifyContent: 'flex-end',
    },
    utilRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 10,
        marginBottom: 10,
    },
    sciSection: {
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    sciBtn: {
        height: 40,
        margin: 4,
        borderRadius: 20,
        aspectRatio: undefined,
        flex: 1,
    },
    sciText: {
        fontSize: 14,
    },
    utilBtn: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginLeft: 10,
        borderWidth: 1,
    },
    utilBtnText: {
        fontSize: 13,
        fontWeight: '600',
    },
    wideBtn: {
        flex: 1.5,
        aspectRatio: undefined,
        borderRadius: 40,
        marginHorizontal: 5,
    },
    sciToggle: {
        flex: 0.8,
        aspectRatio: undefined,
        borderRadius: 40,
        marginHorizontal: 5,
    },
    historyList: {
        flex: 1,
        width: '100%',
    },
    historyTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    historyItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    historyText: {
        fontSize: 20,
        textAlign: 'right',
    },
    emptyHistory: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    }
});
