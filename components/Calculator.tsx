import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import CalculatorButton from './CalculatorButton';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

import { useNavigation } from '@react-navigation/native';

export default function Calculator() {
    const navigation = useNavigation();
    const [currentValue, setCurrentValue] = useState<string>('0');
    const [operator, setOperator] = useState<string | null>(null);
    const [previousValue, setPreviousValue] = useState<string | null>(null);
    const [sound, setSound] = useState<Audio.Sound>();

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

        return () => {
            sound ? sound.unloadAsync() : undefined;
        };
    }, []);

    const playSound = async () => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (sound) {
                await sound.replayAsync();
            }
        } catch (error) {
            console.log('Error playing sound', error);
        }
    };

    // Helper to format display value
    const formatDisplay = (value: string) => {
        if (!value) return '0';
        // Split integer and decimal parts
        const [integer, decimal] = value.split('.');
        const formattedInteger = parseFloat(integer || '0').toLocaleString();

        if (decimal !== undefined) {
            return `${formattedInteger}.${decimal}`;
        }
        return formattedInteger;
    };

    // Refined Logic Handler
    const handlePress = (text: string) => {
        if (text === 'Formula') {
            // @ts-ignore
            navigation.navigate('Formula');
            return;
        }

        playSound();

        if (text === 'C') {
            setCurrentValue('0');
            setPreviousValue(null);
            setOperator(null);
            return;
        }

        if (text === '+/-') {
            setCurrentValue((prev) => String(parseFloat(prev) * -1));
            return;
        }

        if (text === '%') {
            setCurrentValue((prev) => String(parseFloat(prev) * 0.01));
            return;
        }

        if (['+', '-', 'x', '/'].includes(text)) {
            setOperator(text);
            setPreviousValue(currentValue);
            setCurrentValue('0');
            return;
        }

        if (text === '=') {
            if (!operator || !previousValue) return;

            const current = parseFloat(currentValue);
            const previous = parseFloat(previousValue);
            let result = 0;

            switch (operator) {
                case '+': result = previous + current; break;
                case '-': result = previous - current; break;
                case 'x': result = previous * current; break;
                case '/': result = previous / current; break;
            }

            setCurrentValue(String(result));
            setOperator(null);
            setPreviousValue(null);
            return;
        }

        if (text === '.') {
            setCurrentValue((prev) => {
                if (prev.includes('.')) return prev;
                return prev + '.';
            });
            return;
        }

        // Default: Number
        setCurrentValue((prev) => {
            if (prev === '0') return text;
            return prev + text;
        });
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.resultContainer}>
                <Text style={styles.resultText}>
                    {formatDisplay(currentValue)}
                </Text>
            </SafeAreaView>

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
                    style={{ flex: 1.5, aspectRatio: 'auto', borderRadius: 40 }}
                />
                <CalculatorButton text="0" onPress={handlePress} />
                <CalculatorButton text="." onPress={handlePress} />
                <CalculatorButton text="=" theme="accent" onPress={handlePress} />
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
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 20,
    },
    resultText: {
        color: Colors.textPrimary,
        fontSize: 70,
        textAlign: 'right',
    },
    row: {
        flexDirection: 'row',
    },
});
