import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import CalculatorButton from './CalculatorButton';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { evaluate } from '../lib/math';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Calculator() {
    const navigation = useNavigation();
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
        if (text !== 'Sci' && text !== 'Formula') {
            playSound();
        }

        if (text === 'Formula') {
            // @ts-ignore
            navigation.navigate('Formula');
            return;
        }

        if (text === 'Calc') {
            // @ts-ignore
            navigation.navigate('Calculus');
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
                // Replace visual operators with mathjs operators
                const expression = currentValue
                    .replace(/x/g, '*')
                    .replace(/÷/g, '/') // Just in case we use division symbol
                    .replace(/log\(/g, 'log10(') // Mathjs 'log' is natural log by default, unless configured. Actually default log is natural. 
                    // Common calc expects log to be base 10. mathjs has log10.
                    // But let's check mathjs doc or assume log10.
                    .replace(/ln\(/g, 'log(');

                // Let's use simpler handling:
                // If user pressed 'sin', we added 'sin('.

                const result = evaluate(expression);
                let finalVal = '';
                // Format: limit decimals if long
                if (typeof result === 'number') {
                    // Check for very small numbers (precision issues)
                    finalVal = parseFloat(result.toPrecision(10)).toString();
                } else {
                    finalVal = result.toString();
                }

                // Add to history
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
            // Toggle sign of the last number? Or wrap whole thing?
            // Simple approach: wrap whole expression in -(...)
            setCurrentValue(prev => `-(${prev})`);
            return;
        }

        // --- Scientific & Operators ---

        let valToAdd = text;
        const operators = ['+', '-', 'x', '/'];

        // Handling scientific functions that open parenthesis
        if (['sin', 'cos', 'tan', 'sqrt', 'log', 'ln'].includes(text)) {
            valToAdd = text + '(';
        }

        // Smart append logic
        setCurrentValue((prev) => {
            if (prev === '0' || prev === 'Error') {
                // If it's an operator, assume it's after 0? No, usually replace 0.
                if (operators.includes(text)) return '0' + text;
                if (text === '.') return '0.';
                return valToAdd;
            }
            return prev + valToAdd;
        });
    }, [navigation, isScientific, showHistory, currentValue, sound]);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.resultContainer}>
                {showHistory ? (
                    <View style={styles.historyList}>
                        <Text style={styles.historyTitle}>Recent Calculations</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {history.length === 0 ? (
                                <Text style={styles.emptyHistory}>No history yet</Text>
                            ) : (
                                history.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            const val = item.split(' = ')[1];
                                            setCurrentValue(val);
                                            setShowHistory(false);
                                        }}
                                        style={styles.historyItem}
                                    >
                                        <Text style={styles.historyText}>{item}</Text>
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    </View>
                ) : (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                    >
                        <Text style={[styles.resultText, currentValue.length > 10 && { fontSize: 40 }]}>
                            {currentValue}
                        </Text>
                    </ScrollView>
                )}
            </SafeAreaView>

            <View style={styles.keypad}>
                {!isScientific && (
                    <View style={[styles.row, { justifyContent: 'flex-end', paddingRight: 15, marginBottom: 0 }]}>
                        <TouchableOpacity onPress={() => handlePress('Adv')} style={styles.utilBtn}>
                            <Text style={styles.utilBtnText}>Advance Math</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePress('Hist')} style={styles.utilBtn}>
                            <Text style={styles.utilBtnText}>History</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {isScientific && (
                    <>
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
                        <View style={styles.row}>
                            <CalculatorButton text="pi" theme="secondary" onPress={handlePress} style={styles.sciBtn} textStyle={styles.sciText} />
                            <CalculatorButton text="e" theme="secondary" onPress={handlePress} style={styles.sciBtn} textStyle={styles.sciText} />
                            <CalculatorButton text="ln" theme="secondary" onPress={handlePress} style={styles.sciBtn} textStyle={styles.sciText} />
                            <CalculatorButton text="!" theme="secondary" onPress={handlePress} style={styles.sciBtn} textStyle={styles.sciText} />
                        </View>
                    </>
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
                        style={{ flex: 2, aspectRatio: 'auto', borderRadius: 40 }}
                    />
                    <CalculatorButton
                        text="Sci"
                        theme={isScientific ? 'accent' : 'secondary'}
                        onPress={handlePress}
                        style={{ flex: 1, aspectRatio: 'auto', borderRadius: 40 }}
                    />
                    <CalculatorButton text="0" onPress={handlePress} />
                    <CalculatorButton text="." onPress={handlePress} />
                    <CalculatorButton text="=" theme="accent" onPress={handlePress} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark,
        justifyContent: 'flex-end',
    },
    resultContainer: {
        flex: 0.3,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 20,
    },
    resultText: {
        color: Colors.textPrimary,
        fontSize: 70,
        textAlign: 'right',
    },
    keypad: {
        flex: 0.7,
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8, // Small generic spacing
    },
    sciBtn: {
        height: 35, // Shrinked by 5px more (was 48)
        margin: 5,
        aspectRatio: undefined, // Override circular aspect
        borderRadius: 21.5,
    },
    sciText: {
        fontSize: 15,
    },
    // History & Utils
    utilBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: Colors.secondary,
        borderRadius: 15,
        marginLeft: 8,
        borderWidth: 1,
        borderColor: Colors.gray,
    },
    utilBtnText: {
        color: Colors.accent,
        fontSize: 12,
        fontWeight: 'bold',
    },
    historyList: {
        flex: 1,
        width: '100%',
        paddingTop: 10,
    },
    historyTitle: {
        color: Colors.accent,
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    historyItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    historyText: {
        color: Colors.textPrimary,
        fontSize: 18,
        textAlign: 'right',
    },
    emptyHistory: {
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 20,
    }
});
